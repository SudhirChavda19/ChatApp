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


function ListUser({ userData, handleAcceptRequest }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  const handleOpenUserChat = () => {
    console.log("handleOpenUserChat :", user.id);
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
        margin: "8px 0px"
      }}
    >
      <ListItemAvatar>
        <Avatar
          alt={`Avatar n°${user.name}`}
          src={`/static/images/avatar/${user.name}.jpg`}
        />
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
        <ListItemAvatar>
          <Avatar
            alt={`Avatar n°${user.name}`}
            src={`/static/images/avatar/${user.name}.jpg`}
          />
        </ListItemAvatar>
        <ListItemText
          id={`checkbox-list-secondary-label-${user.id}`}
          primary={`${user.name}`}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default ListUser;
