import { useEffect, useState, useRef, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  IconButton,
  Button,
  CircularProgress,
  ClickAwayListener,
  Paper,
} from "@mui/material";
import Picker from "emoji-picker-react";
import { motion } from "framer-motion";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MoodIcon from "@mui/icons-material/Mood";
import SendIcon from "@mui/icons-material/Send";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GifBoxOutlinedIcon from "@mui/icons-material/GifBoxOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import PropTypes from "prop-types";
import MessageBox from "./MessageBox";
import { useDBContext } from "../context/DBContext";
import NoUserFallback from "./NoUserFallBack";
import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import notificationSound from "../assets/notification.mp3";
import { getRoomMessages, storeMessages } from "../services/messageDao";
import UserAvatar from "../utils/UserAvatar";
import GIFPicker from "../utils/GIFPicker";

function ChatBox() {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [openGifPicker, setOpenGifPicker] = useState(false);
  const [gifUrl, setgifUrl] = useState(null);
  const [showNewMsgButton, setShowNewMsgButton] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const lastMessageRef = useRef(null);
  const chatRef = useRef(null);
  const initializedRef = useRef();
  const isNearBottomRef = useRef(false);
  const scrollDebounceRef = useRef(null);

  const socket = useSocketContext();
  const db = useDBContext();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const uniqueId = uuidv4();

  useEffect(() => {
    if (!location.state || !location.state?.user) {
      navigate("/chat", { replace: true });
    } else if (location.state.user) {
      setUser(location.state.user);
    }
  }, [id, location.state, navigate]);

  useEffect(() => {
    (async () => {
      const messageForRoom = await getRoomMessages(user.roomId, db);
      console.log('messageForRoom -------------:', messageForRoom);
      if (messageForRoom && messageForRoom.length > 0) {
        setAllMessages(messageForRoom);
        initializedRef.current = true;
      }
    })();
  }, [db, user, id]);

  useEffect(() => {
    socket.emit("join-room", user.roomId);
  }, [user, id, socket]);

  useEffect(() => {
    socket.on("receive-private-message", async (data) => {
      // const sound = new Audio(notificationSound);
      // sound.play();

      setAllMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        data.timestamp = Date.now();
        return [...prev, data];
      });
      await storeMessages(data, db);

      requestAnimationFrame(() => {
        if (isNearBottomRef.current) {
          lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
          setShowNewMsgButton(false);
        } else {
          setShowNewMsgButton(true);
        }
      });
    });
  }, [db, socket]);

  useEffect(() => {
    socket.on("presence-update", ({ userId, status }) => {
      if (user.id === userId) {
        setUser({ ...user, online: status });
      }
    });
  }, [socket, user]);

  useEffect(() => {
    if (initializedRef.current) {
      setTimeout(() => {
        lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        initializedRef.current = false;
      }, 250);
    }
  }, [initializedRef, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((message.trim() || gifUrl) && authUser.userName && user.id) {
      const messageObject = {
        roomid: user.roomId,
        message: message.trim() ? message : "",
        gifurl: gifUrl ? gifUrl : "",
        receiverid: user.id,
        id: uniqueId,
        senderid: authUser.userId,
        timestamp: Date.now(),
      };

      setAllMessages((message) => [...message, messageObject]);
      socket.emit("send-private-message", messageObject);
      await storeMessages(messageObject, db);
      lastMessageRef.current?.scrollIntoView({ behavior: "auto" });
    }
    setMessage("");
    setgifUrl(null);
  };

  const handleScroll = async () => {
    const cr = chatRef.current;
    if (!cr) return;

    if (scrollDebounceRef.current)
      window.clearTimeout(scrollDebounceRef.current);
    const distanceFromTop = cr.scrollTop;
    const distanceFromBottom = cr.scrollHeight - cr.clientHeight - cr.scrollTop;

    // update near bottom flag (used to decide auto-scroll on new message)
    isNearBottomRef.current = distanceFromBottom < 100;

    // if user has scrolled away from bottom, show a small "new messages" indicator later
    if (!isNearBottomRef.current) {
      setShowNewMsgButton(true);
    } else {
      setShowNewMsgButton(false);
    }
    scrollDebounceRef.current = window.setTimeout(() => {
      // load older when scrolled near top
      if (distanceFromTop <= 10 && !isLoadingOlder && hasMore) {
        loadOlderMessages();
      }
    }, 500);
  };

  const loadOlderMessages = async () => {
    const cr = chatRef.current;
    if (!cr) return;
    setIsLoadingOlder(true);

    const prevScrollHeight = cr.scrollHeight;
    const oldest = allMessages[0];
    const beforeTimestamp = oldest ? oldest.timestamp : Date.now();

    try {
      setTimeout(async () => {
        const olderMessages = await getRoomMessages(
          user.roomId,
          db,
          beforeTimestamp
        );
        if (olderMessages && olderMessages.length < 20) {
          setHasMore(false);
        }
        if (!olderMessages || olderMessages?.length === 0) {
          setHasMore(false);
          return;
        }
        setAllMessages((prev) => {
          const existing = new Set(prev.map((m) => m.id));
          const filtered = olderMessages.filter((m) => !existing.has(m.id));
          return [...filtered, ...prev];
        });

        requestAnimationFrame(() => {
          const newScrollHeight = cr.scrollHeight;
          cr.scrollTop = cr.scrollTop + (newScrollHeight - prevScrollHeight);
        });
        setIsLoadingOlder(false);
      }, 1000);
    } catch (error) {
      console.error("error loading older messages", error);
    }
  };

  const jumpToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowNewMsgButton(false);
    isNearBottomRef.current = true;
  };

  const handleEmojiClick = () => {
    setOpenEmojiPicker(openEmojiPicker ? false : true);
    setOpenGifPicker(false);
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevInput) => prevInput + emojiObject.emoji);
  };
  const handleGifClick = () => {
    setOpenEmojiPicker(false);
    setOpenGifPicker(openGifPicker ? false : true);
  };

  const OnGifClick = ({ preview }) => {
    console.log("gifData------ :", preview);
    setgifUrl(preview.url);
  };

  const handleOnCloseGif = () => {
    setgifUrl(null);
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <UserAvatar name={user.name} size={"40px"} />
          <Box>
            <Typography variant="h6" sx={{ ml: 1, lineHeight: 1 }}>
              {user.name}
            </Typography>
            <Typography sx={{ ml: 1, fontSize: "14px", lineHeight: 1 }}>
              {user.online ? "online" : "offline"}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Chat messages (scrollable middle) */}
      <Box
        ref={chatRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onScroll={handleScroll}
      >
        {isLoadingOlder && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 1,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
        {allMessages && allMessages.length > 0 ? (
          allMessages.map((msg, i) => (
            <div
              key={msg.id}
              ref={i === allMessages.length - 1 ? lastMessageRef : null}
            >
              <MessageBox message={msg} />
            </div>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // flex: 1,
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              bgcolor: "#ffffffff",
              marginTop: "14%",
            }}
          >
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{
                scale: [1, 1.1, 0.9, 1], // hover replay effect
                transition: { duration: 0.8 },
              }}
            >
              <WavingHandIcon sx={{ fontSize: 100, color: "primary.main" }} />
            </motion.div>

            <Typography variant="h5" sx={{ mt: 3, fontWeight: "bold" }}>
              {"Say Hii!"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
              {"Send a message to start the conversation"}
            </Typography>
          </Box>
        )}
      </Box>

      {/* down icon to go back to direct bottom of chat*/}

      {/* Input area (fixed at bottom) */}
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            borderTop: "1px solid #ddd",
            p: 1,
          }}
        >
          <Box
            sx={{
              flex: 1,
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f3f3f3",
                borderRadius: "24px",
                // paddingRight: 1,
                alignItems: "flex-start",
              }}
            >
              {gifUrl && (
                <Paper
                  elevation={0}
                  sx={{
                    ml: 3,
                    mt: 1,
                    mb: 1,
                    position: "relative",
                    maxHeight: "fit-content",
                    height: "fit-content",
                    borderRadius: 3,
                  }}
                >
                  <IconButton
                    type="button"
                    aria-label="closeGif"
                    sx={{
                      position: "absolute",
                      right: "1%",
                      top: "1%",
                      padding: "4px",
                    }}
                    onClick={handleOnCloseGif}
                  >
                    <CloseOutlinedIcon fontSize={"small"} color="action" />
                  </IconButton>
                  <img
                    src={gifUrl}
                    alt="GIF"
                    width={160}
                    // maxHeight={200}
                    style={{ borderRadius: "10px", display: "block" }}
                  />
                </Paper>
              )}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-end",
                  backgroundColor: "#f3f3f3",
                  borderRadius: "24px",
                  paddingRight: 1,
                }}
              >
                <InputBase
                  sx={{
                    width: "80%",
                    flexGrow: 2,
                    ml: 1,
                    px: 2,
                    py: 1,
                    "& .MuiInputBase-input": {
                      resize: "none", // prevent manual resize
                      // overflow: "auto", // enable scrollbar when max height hit
                      maxHeight: "120px", // limit height (~5-6 lines)
                      lineHeight: "20px", // controls line spacing
                    },
                  }}
                  placeholder="Type a message..."
                  inputProps={{ "aria-label": "type a message" }}
                  type="text"
                  value={message}
                  multiline
                  maxRows={6}
                  onChange={(e) => setMessage(e.target.value)}
                  onDrop={(e) => e.preventDefault()} // stop URL paste
                  onDragOver={(e) => e.preventDefault()}
                />
                <IconButton
                  type="button"
                  aria-label="gif"
                  onClick={handleGifClick}
                >
                  <GifBoxOutlinedIcon color="primary" />
                </IconButton>
                <IconButton
                  type="button"
                  aria-label="emoji"
                  // sx={{ ml: 2 }}
                  onClick={handleEmojiClick}
                >
                  <MoodIcon color="primary" />
                </IconButton>
              </Box>
            </Box>
            {openGifPicker && (
              <ClickAwayListener onClickAway={handleGifClick}>
                <Box
                  sx={{
                    height: "400px",
                    position: "absolute",
                    bottom: "60px", // show above input
                    right: 0,
                    zIndex: 100,
                    overflowY: "auto",
                    backgroundColor: "white", // customize background
                    borderRadius: "12px",
                    boxShadow: 3,
                  }}
                >
                  <GIFPicker handleOnGifClick={OnGifClick} />
                </Box>
              </ClickAwayListener>
            )}
            {openEmojiPicker && (
              <ClickAwayListener onClickAway={handleEmojiClick}>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "60px", // show above input
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: "white", // customize background
                    borderRadius: "12px",
                    boxShadow: 3,
                  }}
                >
                  <Picker
                    onEmojiClick={onEmojiClick}
                    width={"260px"}
                    height={"360px"}
                    emojiStyle="google"
                  />
                </Box>
              </ClickAwayListener>
            )}
          </Box>

          <IconButton
            type="button"
            aria-label="send"
            disabled={!message.trim() && !gifUrl}
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#f3f3f3",
              borderRadius: "20px",
              ml: 1,
              // marginBottom: "4px",
            }}
          >
            <SendIcon color={message.trim() || gifUrl ? "primary" : "light"} />
          </IconButton>
          {showNewMsgButton && (
            <IconButton
              onClick={jumpToBottom}
              variant="contained"
              sx={{
                position: "absolute",
                right: "50%",
                top: "-46px",
                zIndex: 20,
                borderRadius: "999px",
                backgroundColor: "#f3f3f3",
              }}
            >
              <KeyboardArrowDownIcon color="primary" />
            </IconButton>
          )}
        </Box>
      </form>
    </Box>
  );
}

export default ChatBox;
