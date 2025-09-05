import React, { useState, useEffect, useContext } from "react";
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
  ClickAwayListener,
  Tooltip,
  Tabs,
  Tab,
  LinearProgress,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
} from "@mui/material";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import ChatIcon from "@mui/icons-material/Chat";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import PersonIcon from "@mui/icons-material/Person";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  createUser,
  getConfiremedUsers,
  getRequestedUsers,
  updateRequestStatus,
} from "../utils/userDao";
import { useDBContext } from "../context/DBContext";
import JoinRoomDialog from "./JoinRoomDialog";
import { useSocketContext } from "../context/SocketContext";
import ListUser from "./ListUser";

function SideBar({ getAvailableUsers }) {
  const [requestedUsers, setRequestedUsers] = useState([]);
  const [confiremedUsers, setConfiremedUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [tabValue, setTabvalue] = useState(0);
  // const [loading, setLoading] = useState(true);

  const socket = useSocketContext();
  const db = useDBContext();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    (async () => {
      try {
        const [requestedUsersData, confiremedUsersData] = await Promise.all([
          getRequestedUsers(db),
          getConfiremedUsers(db),
        ]);
        console.log("requestedUsers :", requestedUsersData);
        console.log("confiremedUsers :", confiremedUsersData);
        if (requestedUsersData.length > 0)
          setRequestedUsers(requestedUsersData);
        if (confiremedUsersData.length > 0)
          setConfiremedUsers(confiremedUsersData);
        getAvailableUsers(confiremedUsers?.length || 0);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        // setLoading(false);
      }
    })();
  }, [db]);

  useEffect(() => {
    socket.on("request-to-join-room", async ({ roomId, userData }) => {
      console.log("request-to-join-room:", { roomId, userData });
      const userObject = {
        id: userData.id,
        name: userData.name,
        roomId,
        requested: true,
        createdAt: new Date(),
      };
      setRequestedUsers((users) => [...users, userObject]);
      await createUser(userObject, db);
    });
  }, []);

  useEffect(() => {
    socket.on("request-accepted", ({ roomId, userData }) => {
      console.log("receive-user-data-after-room-joined", { roomId, userData });
      const userObject = {
        id: userData.id,
        name: userData.name,
        roomId,
        requested: false,
        createdAt: new Date(),
      };
      setConfiremedUsers((users) => [...users, userObject]);
      const updatedUser = [...confiremedUsers, userObject];
      getAvailableUsers(updatedUser.length);
      createUser(userObject, db);
    });
  }, []);

  // console.log("User: ", users);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClickClose = () => {
    setOpenDialog(false);
  };

  const handleCopyUserId = async () => {
    await navigator.clipboard.writeText(userId);
  };

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
  };

  const handleTabChange = (event, newValue) => {
    console.log("requestedUsers", requestedUsers);
    setTabvalue(newValue);
  };

  const handleAcceptRequest = async ({ roomId, id, name }) => {
    const sendUserData = { id: userId, name: userName };
    socket.emit("request-accepted", {
      roomId,
      receiverId: id,
      userData: sendUserData,
    });
    const userObject = {
      id,
      name,
      roomId,
      requested: false,
      createdAt: new Date(),
    };
    updateRequestStatus(id, userObject, db);
    setRequestedUsers((users) => users.filter((user) => user.id != id));
    setConfiremedUsers((users) => [...users, userObject]);
    const updatedUser = [...confiremedUsers, userObject];
    await getAvailableUsers(updatedUser.length);
  };

  // const handleRejectRequest = () => {
  // }

  const style = {
    py: 0,
    width: "100%",
    maxWidth: 360,
    border: "0px 1px 0px 0px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
  };

  const NoDataComponent = () => (
    <Box sx={{ display: "flex", flexDirection: "column", marginTop: "30px" }}>
      <PersonOutlineIcon
        sx={{
          color: "rgb(129 180 230)",
          margin: "0px auto",
          fontSize: "80px",
        }}
      />
      <Typography variant="h5" align="center" sx={{ color: "text.secondary" }}>
        {tabValue === 0 ? "No Users Found" : "No Request Found"}
      </Typography>
    </Box>
  );

  // if (loading)
  //   return (
  //     <Box sx={{ width: "100%" }}>
  //       <LinearProgress color="primary" />
  //     </Box>
  //   );

  return (
    <Box
      sx={{
        width: "20vw",
        height: "100%",
        position: "relative",
        // border: "1px solid",
        // borderColor: "divider",
      }}
    >
      <List sx={style}>
        <ListItem>
          <ListItemIcon sx={{ margin: "6px 0px" }}>
            <WorkspacesIcon fontSize="large" color="primary" />
          </ListItemIcon>
          <ListItemText
            sx={{ my: 0 }}
            primary="Chatapp"
            primaryTypographyProps={{
              fontSize: 24,
              fontWeight: "bolder",
              letterSpacing: 0,
            }}
          />
          <Tooltip title="Add User" placement="top">
            <IconButton sx={{ minWidth: "24px" }} onClick={handleClickOpen}>
              <PersonAddAltIcon color="primary" />
            </IconButton>
            <JoinRoomDialog open={openDialog} onClose={handleClickClose} />
          </Tooltip>
        </ListItem>
        <Divider component="li" />
        <ListItem sx={{ padding: "0px", width: "100%" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="icon position tabs example"
            centered={true}
            sx={{ width: "100%", button: { padding: "0px 34px" } }}
          >
            <Tab
              icon={<ChatIcon color="primary" />}
              iconPosition="start"
              label="Chats"
            />
            <Tab icon={<PersonIcon />} iconPosition="start" label="Requests" />
          </Tabs>
        </ListItem>
        {tabValue === 0 ? (
          confiremedUsers && confiremedUsers.length > 0 ? (
            <ListItem>
              <List
                dense
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                  padding: "0px"
                }}
              >
                {confiremedUsers?.map((user) => {

                   return <ListUser key={user.id} userData={user} />;

                })}
              </List>
            </ListItem>
          ) : (
            <NoDataComponent />
          )
        ) : requestedUsers && requestedUsers.length > 0 ? (
          <ListItem>
            <List
              dense
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
              }}
            >
              {requestedUsers?.map((user) => {
                return (
                  <ListUser
                    key={user.id}
                    userData={user}
                    handleAcceptRequest={handleAcceptRequest}
                  />
                );
              })}
            </List>
          </ListItem>
        ) : (
          <NoDataComponent />
        )}
      </List>
      <List
        sx={{
          position: "absolute",
          bottom: 0,
          padding: 0,
          width: "100%",
          maxWidth: 360,
        }}
      >
        <Divider component="li" />
        <ListItem sx={{ padding: "8px 16px 4px 16px" }}>
          <ListItemButton sx={{ padding: 0 }}>
            <ListItemIcon sx={{ minWidth: "34px" }}>
              <SettingsIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
        <Divider variant="middle" component="li" />

        <ClickAwayListener onClickAway={handleTooltipClose}>
          <ListItem sx={{ padding: "4px 16px 8px 16px" }}>
            <ListItemText sx={{ flex: "none" }} primary="Copy your USER ID" />
            <Tooltip
              onClose={handleTooltipClose}
              open={openTooltip}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title="Copied"
              slotProps={{
                popper: {
                  disablePortal: true,
                },
              }}
            >
              <IconButton
                onClick={() => {
                  handleCopyUserId();
                  handleTooltipOpen();
                }}
              >
                <ContentCopyIcon color="primary" fontSize="small" />
              </IconButton>
            </Tooltip>
          </ListItem>
        </ClickAwayListener>
      </List>
    </Box>
  );
}

export default SideBar;
