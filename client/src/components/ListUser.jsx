import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
  Box,
  Typography,
  Tooltip,
  Skeleton,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useSocketContext } from "../context/SocketContext";
import UserAvatar from "../utils/UserAvatar";

function ListUser({ userData, handleAcceptRequest }) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const socket = useSocketContext();

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  useEffect(() => {
    socket.on("presence-update", ({ userId, status }) => {
      if (user.id === userId) {
        setUser({ ...user, online: status });
      }
    });
  }, [socket, user]);

  const handleOpenUserChat = () => {
    // console.log("handleOpenUserChat :", user);
    navigate(`/chat/user/${user.id}`, { state: { user } });
  };

  const handleAccept = () => {
    handleAcceptRequest(user);
  };

  //   if (!user)
  //     return (

  //       <ListItem>
  //         <p>465645656546565</p>
  //         <Skeleton />
  //       </ListItem>
  //     );

  return user.requested ? (
    <ListItem
      sx={{
        backgroundColor: "#f3f3f3",
        borderRadius: "12px",
        padding: "8px",
        margin: "8px 0px",
      }}
    >
      <ListItemAvatar sx={{minWidth: "40px", height: "30px"}}>
        <UserAvatar name={user.name} size={"30px"}/>
      </ListItemAvatar>
      <ListItemText
        id={`checkbox-list-secondary-label-${user.id}`}
        primary={`${user.name}`}
      />
      <Tooltip title="Accept" placement="top">
        <IconButton sx={{ minWidth: "24px" }} onClick={handleAccept}>
          <CheckIcon color="primary" />
        </IconButton>
      </Tooltip>
      {/* <IconButton
                      sx={{ minWidth: "24px" }}
                      onClick={handleRejectRequest}
                    >
                      <ClearIcon color="primary" />
                    </IconButton> */}
      {/* </ListItemButton> */}
    </ListItem>
  ) : (
    <ListItem
      sx={{
        backgroundColor: "#f3f3f3",
        borderRadius: "12px",
        padding: 0,
        margin: 0,
      }}
    >
      <ListItemButton
        sx={{
          padding: "8px",
          backgroundColor: "#f3f3f3",
          borderRadius: "12px",
        }}
        onClick={handleOpenUserChat}
      >
        <ListItemAvatar sx={{position: "relative", minWidth: "40px", height: "30px"}}>
         <UserAvatar name={user.name} size={"30px"}/>
         <FiberManualRecordIcon
            sx={{ position: "absolute", width: "0.8rem", left: 17, top: 18}}
            color={user.online ? "success" : "warning"}
            fontSize="6px"
          />
        </ListItemAvatar>
        <ListItemText
          id={`checkbox-list-secondary-label-${user.id}`}
          primary={`${user.name}`}
        />
        {/* <ListItemIcon sx={{ justifyContent: "flex-end" }}>
          
        </ListItemIcon> */}
      </ListItemButton>
    </ListItem>
  );
}

export default ListUser;
