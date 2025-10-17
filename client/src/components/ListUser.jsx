import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
  IconButton,
  Box,
  Typography,
  Tooltip,
  Badge,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useSocketContext } from "../context/SocketContext";
import UserAvatar from "./common/UserAvatar";

function ListUser({
  roomData,
  handleAcceptReject,
  handleRemoveRoom,
  unreadCounts,
}) {
  const [user, setUser] = useState({});
  const [room, setRoom] = useState({});
  const [selectedUser, setSelectedUser] = useState(false);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [online, setOnline] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [roomParamId, setRoomParamId] = useState(null);
  const navigate = useNavigate();
  const socket = useSocketContext();
  const { id } = useParams();
  useEffect(() => {
      setRoomParamId(id);
    }, [id])

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (roomData) {
      setRoom(roomData);
      setUser(roomData.participants.filter((user) => user._id !== userId)[0]);
    }
  }, [roomData]);

  useEffect(() => {
    if (!unreadCounts || unreadCounts === 0) {
      setUnreadCount(0);
    } else {
      setUnreadCount(unreadCounts);
    }
  }, [unreadCounts]);

  useEffect(() => {
    if (room && id) {
      setSelectedUser(room._id === id ? true : false);
    }
  }, [room, id]);

  useEffect(() => {
    if (user?._id) {
      socket.timeout(2000).emit("is-user-online", user._id, (err, res) => {
        if (res) {
          setOnline(res.status);
        }
      });
    }
  }, [user, socket]);

  useEffect(() => {
    socket.on("presence-update", ({ userId, status }) => {
      if (user._id === userId) {
        setOnline(status);
      }
    });
  }, [socket, user]);

  const handleOpenUserChat = () => {
    navigate(`/chat/room/${room._id}`, { state: { user } });
    setSelectedUser(room._id === id ? true : false);
  };

  const onAcceptReject = (isAccepted) => {
    handleAcceptReject(isAccepted, room._id, room.createdBy);
  };

  const handleDeleteRoom = (roomId) => {
    handleRemoveRoom(roomId);
  };

  if (room.status === "Requested" || room.status === "Rejected")
    return (
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
            <UserAvatar name={user.userName} size={"30px"} />
          </ListItemAvatar>
          <ListItemText
            id={`checkbox-list-secondary-label-${user._id}`}
            primary={`${user.userName}`}
            sx={{
              span: { lineHeight: 0 },
              margin: "0px",
              alignItems: "flex-end",
            }}
          />
          {room.createdBy === userId ? (
            <Box
              sx={{ padding: 0, margin: 0 }}
              onMouseEnter={() =>
                room.status === "Rejected" ? setShowDeleteIcon(true) : null
              }
              onMouseLeave={() =>
                room.status === "Rejected" ? setShowDeleteIcon(false) : null
              }
            >
              {showDeleteIcon ? (
                <Tooltip title="Remove Request" placement="top">
                  <IconButton
                    sx={{ minWidth: "24px", padding: 0, marginRight: "12px" }}
                    onClick={() => handleDeleteRoom(room._id)}
                  >
                    <DeleteOutlineRoundedIcon color="primary" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color:
                      room.status === "Rejected" ? "#77b6fdff" : "#757575ff",
                  }}
                >
                  {room.status}
                </Typography>
              )}
            </Box>
          ) : (
            <Box sx={{ padding: 0, margin: 0 }}>
              <Tooltip title="Accept" placement="top">
                <IconButton
                  sx={{ minWidth: "24px", padding: 0 }}
                  onClick={() => onAcceptReject(true)}
                >
                  <CheckIcon color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject" placement="top">
                <IconButton
                  sx={{ minWidth: "24px", padding: 0, marginLeft: "6px" }}
                  onClick={() => onAcceptReject(false)}
                >
                  <ClearIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </ListItem>
    );
  if (room.status === "Confirmed")
    return (
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
            <UserAvatar name={user.userName} size={"30px"} />
            <FiberManualRecordIcon
              sx={{ position: "absolute", width: "0.8rem", left: 17, top: 18 }}
              color={online ? "success" : "warning"}
              fontSize="6px"
            />
          </ListItemAvatar>
          <ListItemText
            id={`checkbox-list-secondary-label-${user._id}`}
            primary={`${user.userName}`}
          />
          {unreadCount > 0 && (
            <Box sx={{ padding: 0, margin: "auto 10px" }}>
              <Badge
                color="primary"
                badgeContent={unreadCount}
                max={99}
                fontSize={"1px"}
              ></Badge>
            </Box>
          )}
        </ListItemButton>
      </ListItem>
    );
}

export default ListUser;
