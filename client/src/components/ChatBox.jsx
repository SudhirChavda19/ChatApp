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
  CircularProgress,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SendIcon from "@mui/icons-material/Send";
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

function ChatBox() {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);

  const lastMessageRef = useRef(null);
  const chatRef = useRef(null);
  const socket = useSocketContext();
  const db = useDBContext();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  useEffect(() => {
    console.log("location :", location);
    if (!location.state || !location.state?.user) {
      navigate("/chat", { replace: true });
    } else if (location.state.user) {
      setUser(location.state.user);
    }
  }, [id]);

  useEffect(() => {
    (async () => {
      const messageForRoom = await getRoomMessages(user.roomId, db);
      if (messageForRoom && messageForRoom.length > 0)
        setAllMessages(messageForRoom);
    })();
  }, [allMessages, db, user]);

  useEffect(() => {
    socket.emit("join-room", user.roomId);
  }, [user]);

  useEffect(() => {
    socket.on("receive-private-message", (data) => {
      // const sound = new Audio(notificationSound);
      // console.log('sound =====:', sound);
      // sound.play();
      data.timestamp = Date.now();
      setAllMessages((messages) => [...messages, data]);
      storeMessages(data, db);
    });
  }, []);

  useEffect(() => {
    if (!initialized && lastMessageRef.current) {
      setTimeout(() => {
        lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        setInitialized(true);
      }, 100);
    }
  }, [initialized, allMessages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && authUser.userName && user.id) {
      const messageObject = {
        roomid: user.roomId,
        message,
        receiverid: user.id,
        id: uuidv4(),
        senderid: authUser.userId,
        timestamp: Date.now(),
      };

      setAllMessages((message) => [...message, messageObject]);
      socket.emit("send-private-message", messageObject);
      storeMessages(messageObject, db);
    }
    setMessage("");
  };

  const handleScroll = async () => {
    if (chatRef.current && chatRef.current.scrollTop === 0) {
      console.log("scroll ------------");
      setIsLoadingOlder(true);

      // Load older messages
      const oldest = allMessages[0];
      setTimeout(async () => {
        const olderMessages = await getRoomMessages(
          user.roomId,
          db,
          oldest.timestamp
        );
        console.log("olderMessages :", olderMessages);
        if (olderMessages && olderMessages.length > 0) {
          setAllMessages((prev) => [...olderMessages, ...prev]);
        }
        setIsLoadingOlder(false);
      }, 1000);
    }
  };

  return (
    <Box
      sx={{
        height: "84vh",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Avatar alt={user.name} src="/static/images/avatar/1.jpg" />
          <Typography variant="h6" sx={{ ml: 1 }}>
            {user.name}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Chat messages (scrollable middle) */}
      <Box
        ref={chatRef}
        sx={{ flex: 1, overflowY: "auto", p: 2 }}
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
        {allMessages.map((msg, i) => (
          <MessageBox
            message={msg}
            key={msg.id}
            ref={i === allMessages.length - 1 ? lastMessageRef : null}
          />
        ))}
      </Box>

      {/* down icon to go back to direct bottom of chat*/}

      {/* Input area (fixed at bottom) */}
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid #ddd",
            p: 1,
          }}
        >
          <InputBase
            sx={{ flex: 1, ml: 1 }}
            placeholder="Type a message..."
            inputProps={{ "aria-label": "type a message" }}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <IconButton
            type="button"
            aria-label="send"
            disabled={!message.trim()}
            onClick={handleSubmit}
          >
            <SendIcon color={message.trim() ? "primary" : "light"} />
          </IconButton>
        </Box>
      </form>
    </Box>
  );
}

export default ChatBox;
