import { useEffect, useState, useRef, useContext } from "react";
import { Outlet } from "react-router-dom";
import { Card, Container, Typography, Box, Fade, Divider } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SendIcon from "@mui/icons-material/Send";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import PropTypes from "prop-types";
import SideBar from "./SideBar";
import ChatBox from "./ChatBox";
import { getConfiremedUsers, getUsers } from "../services/userDao";
import { useDBContext } from "../context/DBContext";
import NoUserFallback from "./NoUserFallBack";
import { useSocketContext } from "../context/SocketContext";

function Chat({ children }) {
  // const [socketId, setSocketId] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [confiremedUsers, setConfiremedUsers] = useState(0);

  const db = useDBContext();
  const socket = useSocketContext();
  const lastMessageRef = useRef(null);

  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  const getAvailableUsers = (userData) => {
    console.log("userData LENGTH:", userData);
    if (userData) setConfiremedUsers(userData);
    console.log("confiremedUsers LENGTH:", confiremedUsers);
  };

  // useEffect(() => {
  //   (async () => {
  //     const usersData = await getUsers(userId, db);
  //     console.log("usersData :", usersData);
  //     setAllUsers(usersData);
  //   })();
  // }, []);

  // useEffect(() => {
  //   socket.on("receive-message", (data) => {
  //     // console.log("Received Message :", data);
  //     setAllMessages((messages) => [...messages, data]);
  //   });
  // }, []);

  return (
    <>
      
        <Card sx={{ height: "86vh", display: "flex", flexDirection: "row" }}>
          <SideBar getAvailableUsers={getAvailableUsers} />
          <Divider orientation="vertical" flexItem />
          <Outlet isUsersAvailable={confiremedUsers ? true : false}/>
        </Card>
    </>
  );
}

export default Chat;
