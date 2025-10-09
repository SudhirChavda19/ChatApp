import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
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
  Badge,
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
import UserAvatar from "./common/UserAvatar";
import GIFPicker from "./common/GIFPicker";
import { MessageApi } from "../services/messageService";
import { UserApi } from "../services/userService";
import SnackBar from "./common/SnackBar";
import { useDispatch, useSelector } from "react-redux";
import { clearUnread } from "../features/room/roomSlice";
import { incrementUnread, updateRoom } from "../features/room/roomSlice";
import TypingIndicator from "./common/TypingIndicator";

function ChatBox() {
  const [user, setUser] = useState({});
  const [stateUserId, setStateUserId] = useState(null);
  // const [room, setRoom] = useState({});
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [openGifPicker, setOpenGifPicker] = useState(false);
  const [gifUrl, setgifUrl] = useState(null);
  const [showNewMsgButton, setShowNewMsgButton] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [online, setOnline] = useState(false);
  const [messageServerError, setMessageServerError] = useState(null);
  const [previousScrollHeight, setPreviousScrollHeight] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [unSeenMessageCount, setUnSeenMessageCount] = useState(0);
  const [userTyping, setUserTyping] = useState(false);

  // const [lastMessageRef, setLastMessageRef] = useState(null);
  const lastMessageRef = useRef(null);

  const chatRef = useRef(null);
  const isNearBottomRef = useRef(false);
  const scrollDebounceRef = useRef(null);

  const showNewMsgButtonRef = useRef(showNewMsgButton);
  const userTypingRef = useRef(userTyping);
  const typingTimeoutRef = useRef(null);

  const socket = useSocketContext();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const userId = localStorage.getItem("userId");

  const {
    isPending,
    isError,
    data: userData,
    error: userError,
  } = useQuery({
    queryKey: ["user", stateUserId],
    queryFn: () => UserApi.GetUser(stateUserId),
    enabled: !!stateUserId,
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log("userdata :", userData);
    if (userData && userData.data.data) {
      setUser(userData.data.data);
    }
    if (userError) console.log("Error while getting User Data");
  }, [userData, userError]);

  const {
    data: messageData,
    error: messageError,
    isError: isMessageError,
    refetch: messageRefetch,
    isFetchNextPageError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["roomMessages", id],
    queryFn: ({ pageParam }) => MessageApi.GetRoomMessages(id, pageParam),
    initialPageParam: 1,
    getNextPageParam(lastPage, allPages) {
      const { hasNextPage } = lastPage;
      return hasNextPage ? allPages.length + 1 : undefined;
    },
    enabled: false,
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const CreateRequestMutation = useMutation({
    mutationFn: MessageApi.SendMessage,
    onError: (error) => {
      console.log("error :", error);
      const { message, status } = error.response.data;
      if (status === "Fail" && message) {
        setMessageServerError(message);
      }
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        // setAllMessages((message) => [...message, data]);
        // lastMessageRef.current?.scrollIntoView({ behavior: "auto" });
      }
    },
  });

  useEffect(() => {
    if (!location.state || !location.state?.user) {
      navigate("/chat", { replace: true });
    } else {
      if (location.state.user) {
        setStateUserId(location.state.user._id);
      }
      queryClient.resetQueries({
        queryKey: ["roomMessages", id],
        exact: true,
      });
      messageRefetch();
    }
  }, [location.state, id]);

  useEffect(() => {
    if (id) {
      dispatch(clearUnread(id));
      socket.emit("join-room", id);
    }
  }, [id, socket]);

  useEffect(() => {
    socket.on("updated-room", ({ updatedRoom, unreadCounts }) => {
      if (updatedRoom._id !== id) {
        dispatch(incrementUnread({ roomId: updatedRoom._id }));
      }
      dispatch(updateRoom(updatedRoom));
    });
  }, [socket, id]);

  useEffect(() => {
    if (
      messageData &&
      messageData.pageParams.length > 0 &&
      messageData.pages[messageData.pageParams.length - 1].data
    ) {
      console.log("messageData page 1 -------:", messageData);
      const messages =
        messageData.pages[messageData.pageParams.length - 1].data;

      if (messageData.pageParams.length === 1) {
        setAllMessages((prev) => {
          const existing = new Set(prev.map((m) => m._id));
          const filtered = messages.filter((m) => !existing.has(m._id));
          return [...filtered, ...prev];
        });
        setInitialized(true);
        if (!hasNextPage) {
          setHasMore(false);
        }
      } else if (messageData.pageParams.length > 1) {
        const cr = chatRef.current;
        if (!cr) return;

        if (!hasNextPage) {
          setHasMore(false);
        }
        if (!messages || messages?.length === 0) {
          setHasMore(false);
          return;
        }

        setAllMessages((prev) => {
          const existing = new Set(prev.map((m) => m._id));
          const filtered = messages.filter((m) => !existing.has(m._id));
          return [...filtered, ...prev];
        });
        requestAnimationFrame(() => {
          const newScrollHeight = cr.scrollHeight;
          cr.scrollTop =
            cr.scrollTop + (newScrollHeight - previousScrollHeight);
        });
        setIsLoadingOlder(false);
      }
    }
    if (messageError) {
      console.log("messageError :", messageError);
    }
  }, [messageData, messageError]);

  useEffect(() => {
    showNewMsgButtonRef.current = showNewMsgButton;
  }, [showNewMsgButton]);

  useEffect(() => {
    socket.on("send-receive-message", async (data) => {
      console.log("message ::", data);
      // const sound = new Audio(notificationSound);
      // sound.play();
      if (id === data.roomId) {
        setAllMessages((prev) => {
          if (prev.some((m) => m._id === data._id)) return prev;
          return [...prev, data];
        });

        if (userId !== data.senderId && userTypingRef.current)
          setUserTyping(false);

        if (showNewMsgButtonRef.current && userId !== data.senderId) {
          setUnSeenMessageCount((prev) => prev + 1);
        } else {
          setTimeout(() => {
            if (lastMessageRef.current) {
              lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }, 50);
        }
      }
    });
  }, [socket]);

  useEffect(() => {
    if (stateUserId) {
      socket.timeout(2000).emit("is-user-online", stateUserId, (err, res) => {
        if (res) {
          setOnline(res.status);
        }
      });
    }
  }, [stateUserId]);

  useEffect(() => {
    socket.on("presence-update", ({ userId, status }) => {
      if (stateUserId === userId) {
        setOnline(status);
      }
    });
  }, [socket, stateUserId]);

  useEffect(() => {
    socket.on("display-typing", (roomId) => {
      if (id === roomId && !userTypingRef.current) {
        if (!showNewMsgButtonRef.current && lastMessageRef.current) {
          setUserTyping(true);
          setTimeout(() => {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
          }, 50);
        }
      }
    });

    socket.on("hide-typing", (roomId) => {
      if (id === roomId && userTypingRef.current) {
        setUserTyping(false);
      }
    });
  }, [socket]);

  useEffect(() => {
    userTypingRef.current = userTyping;
  }, [userTyping]);

  useEffect(() => {
    if (initialized && lastMessageRef.current) {
      setTimeout(() => {
        lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        setInitialized(false);
      }, 250);
    }
  }, [initialized, lastMessageRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.length > 2000) {
      setOpenSnackBar(true);
      return;
    }

    if ((message.trim() || gifUrl) && authUser && stateUserId) {
      CreateRequestMutation.mutate({
        receiverId: stateUserId,
        senderId: userId,
        roomId: id,
        message: message ? message : undefined,
        gifUrl: gifUrl ? gifUrl : undefined,
      });
    }
    setMessage("");
    setgifUrl(null);
  };

  const handleTypeMessage = (e) => {
    setMessage(e.target.value);
    if (!socket) return;

    socket.emit("typing", id);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", id);
    }, 800);
  };

  const handleSnackBar = (snackBarStatus) => {
    if (!snackBarStatus) {
      setOpenSnackBar(false);
    }
  };

  const handleScroll = async () => {
    const cr = chatRef.current;
    if (!cr) return;

    if (scrollDebounceRef.current)
      window.clearTimeout(scrollDebounceRef.current);
    const distanceFromTop = cr.scrollTop;
    const distanceFromBottom = cr.scrollHeight - cr.clientHeight - cr.scrollTop;

    isNearBottomRef.current = distanceFromBottom < 100;

    if (!isNearBottomRef.current) {
      setShowNewMsgButton(true);
    } else {
      setShowNewMsgButton(false);
      setUnSeenMessageCount(0);
    }
    scrollDebounceRef.current = window.setTimeout(() => {
      if (distanceFromTop <= 10 && !isLoadingOlder && hasNextPage && hasMore) {
        loadOlderMessages();
      }
    }, 500);
  };

  const loadOlderMessages = async () => {
    const cr = chatRef.current;
    if (!cr) return;
    setIsLoadingOlder(true);

    try {
      const prevScrollHeight = cr.scrollHeight;
      setPreviousScrollHeight(prevScrollHeight);
      setTimeout(async () => {
        await fetchNextPage();
      }, 600);
    } catch (error) {
      console.error("error loading older messages", error);
    }
  };

  const jumpToBottom = () => {
    lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    setShowNewMsgButton(false);
    setUnSeenMessageCount(0);
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
    setgifUrl(preview.url);
  };

  const handleOnCloseGif = () => {
    setgifUrl(null);
  };

  return (
    <Box
      key={id}
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
          <UserAvatar name={user.userName} size={"40px"} />
          <Box>
            <Typography variant="h6" sx={{ ml: 1, lineHeight: 1 }}>
              {user.userName}
            </Typography>
            <Typography sx={{ ml: 1, fontSize: "14px", lineHeight: 1 }}>
              {online ? "online" : "offline"}
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
        {userTyping || (allMessages && allMessages.length > 0) ? (
          <>
            {allMessages.map((msg, i) => (
              <div
                key={msg._id}
                ref={i === allMessages.length - 1 ? lastMessageRef : null}
              >
                <MessageBox message={msg} />
              </div>
            ))}
            {userTyping && <TypingIndicator />}
          </>
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
                      lineHeight: "24px", // controls line spacing
                    },
                  }}
                  placeholder="Type a message..."
                  inputProps={{ "aria-label": "type a message" }}
                  type="text"
                  value={message}
                  multiline
                  maxRows={6}
                  onChange={handleTypeMessage}
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
                    width={"342px"}
                    height={"400px"}
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
          <SnackBar
            setHorizontal={"center"}
            setVertical={"top"}
            setOpen={openSnackBar}
            setMessage={
              <>
                <Typography padding={"0px 0px"} variant="h6" component="div">
                  Your message is too long
                </Typography>
                <Typography>Please split over multiple messages.</Typography>
              </>
            }
            setSeverity={"success"}
            handleSnackBar={handleSnackBar}
          />
          {showNewMsgButton && (
            <IconButton
              onClick={jumpToBottom}
              disableRipple
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
              {unSeenMessageCount > 0 ? (
                <Badge
                  color="primary"
                  badgeContent={unSeenMessageCount}
                  max={9}
                >
                  <KeyboardArrowDownIcon color="primary" />
                </Badge>
              ) : (
                <KeyboardArrowDownIcon color="primary" />
              )}
            </IconButton>
          )}
        </Box>
      </form>
    </Box>
  );
}

export default ChatBox;
