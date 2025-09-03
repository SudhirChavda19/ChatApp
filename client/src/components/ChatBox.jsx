import { useEffect, useState, useRef, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Avatar,
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  IconButton,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SendIcon from "@mui/icons-material/Send";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import PropTypes from "prop-types";
import MessageBox from "./MessageBox";
import { getUsers } from "../utils/userDao";
import { useDBContext } from "../context/DBContext";
import NoUserFallback from "./NoUserFallBack";
import { useSocketContext } from "../context/SocketContext";

function ChatBox() {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  const lastMessageRef = useRef(null);
  const socket = useSocketContext();
  const db = useDBContext();
  const { id } = useParams();
  const location = useLocation();

  const userName = localStorage.getItem("userName");

  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && userName) {
      console.log("---------------------------------");

      // setAllMessages([...allMessages, {
      //   text: message,
      //   name: userName,
      //   id: `${socket.id}${Math.random()}`,
      //   socketID: socket.id,
      //   timestamp: new Date()
      // }]);
      socket.emit("message", {
        text: message,
        name: userName,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
        timestamp: new Date(),
      });
    }
    // console.log("allMessages :", allMessages);
    setMessage("");
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
          <Avatar alt="Lemy Sharp" src="/static/images/avatar/1.jpg" />
          <Typography variant="h6" sx={{ ml: 1 }}>
            {user.name}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Chat messages (scrollable middle) */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {/* {allMessages.map((msg) => (
              <MessageBox key={msg.id} message={msg} />
            ))} */}
        <div ref={lastMessageRef}></div>
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
