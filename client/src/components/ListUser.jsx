import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import ClearIcon from "@mui/icons-material/Clear";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useSocketContext } from "../context/SocketContext";
import UserAvatar from "../utils/UserAvatar";

function ListUser({ userData, handleAcceptReject }) {
  const [user, setUser] = useState({});
  const [selectedUser, setSelectedUser] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const socket = useSocketContext();

  useEffect(() => {
    setUser(userData);
    setSelectedUser(user.id === id ? true : false);
  }, [userData, id, user]);

  useEffect(() => {
    socket.on("presence-update", ({ userId, status }) => {
      if (user.id === userId) {
        setUser({ ...user, online: status });
      }
    });
  }, [socket, user]);

  const handleOpenUserChat = () => {
    console.log("handleOpenUserChat :", user);
    navigate(`/chat/user/${user.id}`, { state: { user } });
    setSelectedUser(user.id === id ? true : false);
  };

  const onAcceptReject = (isAccepted) => {
    handleAcceptReject(isAccepted, user);
  };

  //   if (!user)
  //     return (

  //       <ListItem>
  //         <Skeleton />
  //       </ListItem>
  //     );

  return user.requested ? (
    <ListItem
      sx={{
        backgroundColor: "#f3f3f3", //#b1e0ff
        borderRadius: "12px",
        padding: 0,
        margin: "8px 0px",
      }}
    >
      <Box
        sx={{
          padding: "8px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          minWidth: "100%",
          borderRadius: "12px",
        }}
      >
        <ListItemAvatar sx={{ minWidth: "40px", height: "30px" }}>
          <UserAvatar name={user.name} size={"30px"} />
        </ListItemAvatar>
        <ListItemText
          id={`checkbox-list-secondary-label-${user.id}`}
          primary={`${user.name}`}
        />
        <Tooltip title="Accept" placement="top">
          <IconButton
            sx={{ minWidth: "24px" }}
            onClick={() => onAcceptReject(true)}
          >
            <CheckIcon color="primary" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reject" placement="top">
          <IconButton
            sx={{ minWidth: "24px" }}
            onClick={() => onAcceptReject(false)}
          >
            <ClearIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Box>
    </ListItem>
  ) : (
    <ListItem
      sx={{
        backgroundColor: "#b1e0ff",
        borderRadius: "12px",
        padding: 0,
        margin: "8px 0px",
      }}
    >
      <ListItemButton
        sx={{
          padding: "8px",
          backgroundColor: selectedUser ? "#b1e0ff" : "#f3f3f3",
          borderRadius: "12px",
        }}
        onClick={handleOpenUserChat}
      >
        <ListItemAvatar
          sx={{ position: "relative", minWidth: "40px", height: "30px" }}
        >
          <UserAvatar name={user.name} size={"30px"} />
          <FiberManualRecordIcon
            sx={{ position: "absolute", width: "0.8rem", left: 17, top: 18 }}
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
