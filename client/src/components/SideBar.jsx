import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
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
} from "../services/userDao";
import { useDBContext } from "../context/DBContext";
import CommonDialog from "./common/CommonDialog";
import { useSocketContext } from "../context/SocketContext";
import ListUser from "./ListUser";
import SnackBar from "./common/SnackBar";
import { RoomApi } from "../services/roomService";

function SideBar({ getAvailableUsers }) {
  const [userList, setUserList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSignOutDialog, setOpenSignOutDialog] = useState(false);
  const [tabValue, setTabvalue] = useState(0);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  // const [loading, setLoading] = useState(true);

  const socket = useSocketContext();
  const db = useDBContext();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => RoomApi.GetRooms(userId),
  });

  useEffect(() => {
    if (data) {
      console.log("data :", data);
      if (data.status === 200 && data.data.data.rooms && data.data.data.rooms.length > 0) {
        // const userDetail = data.data.data.rooms.filter((room) => {
        //   room.participants.includes()
        // })
        const userDetail = data.data.data.rooms.map((room) => {
          return room.participants.filter((user) => user._id !== userId)[0]
        })
        console.log('userDetail :', userDetail);
        setUserList(userDetail)
      }
    }
    if(error){
      console.log("error :", error);

    }
  }, [data, error]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       let [requestedUsersData, confiremedUsersData] = await Promise.all([
  //         getRequestedUsers(db),
  //         getConfiremedUsers(db),
  //       ]);
  //       console.log("requestedUsers :", requestedUsersData);
  //       console.log("confiremedUsers :", confiremedUsersData);
  //       if (requestedUsersData.length > 0)
  //         setRequestedUsers(requestedUsersData);

  //       const confiremedUsersId = confiremedUsersData.map((user) => user.id);
  //       if (confiremedUsersId.length > 0) {
  //         socket
  //           .timeout(2000)
  //           .emit("online-user", confiremedUsersId, (error, res) => {
  //             console.log("response: =========", res);
  //             if (res.length > 0) {
  //               setConfiremedUsers(
  //                 confiremedUsersData.map((user) => {
  //                   if (res.includes(user.id)) {
  //                     return { ...user, online: true };
  //                   } else {
  //                     return { ...user, online: false };
  //                   }
  //                 })
  //               );
  //             } else {
  //               setConfiremedUsers(confiremedUsersData);
  //             }
  //           });
  //       }
  //       getAvailableUsers(confiremedUsers?.length || 0);
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     }
  //   })();
  // }, [db]);

  useEffect(() => {
    socket.on("request-to-join-room", ({ user }) => {
      setUserList((users) => [...users, user]);
    });
  }, [socket]);

  // useEffect(() => {
  //   socket.on("request-accepted", ({ roomId, userData }, callback) => {
  //     const userObject = {
  //       id: userData.id,
  //       name: userData.name,
  //       roomId,
  //       requested: false,
  //       createdAt: Date.now(),
  //     };
  //     setConfiremedUsers((users) => [...users, userObject]);
  //     const updatedUser = [...confiremedUsers, userObject];
  //     getAvailableUsers(updatedUser.length);
  //     createUser(userObject, db);
  //     callback({ status: true });
  //   });
  // }, []);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  const handleClickClose = () => {
    setOpenDialog(false);
  };

  const handleClickOpenSignOut = () => {
    setOpenSignOutDialog(true);
  };
  const handleClickCloseSignOut = () => {
    setOpenSignOutDialog(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const handleAcceptReject = async (isAccepted, { roomId, id, name }) => {
    const sendUserData = { id: userId, name: userName };
    if (isAccepted) {
      socket.timeout(2000).emit(
        "request-accepted",
        {
          roomId,
          receiverId: id,
          userData: sendUserData,
        },
        (err, res) => {
          if (res && !res?.status) {
            setOpenSnackBar(true);
          } else {
            onRequestAcceptReject(roomId, id, name);
          }
        }
      );
    } else {
      socket.timeout(2000).emit(
        "request-accepted",
        {
          roomId,
          receiverId: id,
          userData: sendUserData,
        },
        (err, res) => {
          if (res && !res?.status) {
            setOpenSnackBar(true);
          } else {
            onRequestAcceptReject(roomId, id, name);
          }
        }
      );
    }
  };

  const onRequestAcceptReject = async (roomId, id, name) => {
    const userObject = {
      id,
      name,
      roomId,
      requested: false,
      createdAt: Date.now(),
    };
    updateRequestStatus(id, userObject, db);
  };

  const handleSnackBar = (snackBarStatus) => {
    if (!snackBarStatus) {
      setOpenSnackBar(false);
    }
  };

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
            primary="VatChit"
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
            <CommonDialog open={openDialog} onClose={handleClickClose} />
          </Tooltip>
        </ListItem>
        <Divider component="li" />
        <ListItem sx={{ padding: "10px", width: "100%", margin: "0px auto" }}>
          {/* <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="icon position tabs example"
            centered={true}
            sx={{
              width: "100%",
              minHeight: "fit-content",
              button: { padding: "12px 34px" },
            }}
          >
            <Tab
              icon={<ChatIcon color="primary" />}
              iconPosition="start"
              label="Chats"
              sx={{ minHeight: 40 }}
            />
            <Tab
              icon={<PersonIcon />}
              iconPosition="start"
              label="Requests"
              sx={{ minHeight: 40 }}
            />
          </Tabs> */}
          <ListItemIcon sx={{ margin: 0, minWidth: 0, alignItems: "flex-end" }}>
            <ChatIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            sx={{ ml: 1 }}
            primary="Chats"
            primaryTypographyProps={{
              fontSize: 18,
              letterSpacing: 0,
            }}
          />
        </ListItem>
        <Divider variant="middle" component="li" />
        {/* {tabValue === 0 ? ( */}
        {userList && userList.length > 0 ? (
          <ListItem>
            <List
              dense
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: 350,
                padding: 0,
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {userList?.map((user) => {
                return (
                  <ListUser
                    key={user._id}
                    userData={user}
                    handleAcceptReject={handleAcceptReject}
                  />
                );
              })}
              <SnackBar
                setHorizontal={"center"}
                setVertical={"top"}
                setOpen={openSnackBar}
                setMessage={"User Not Connected"}
                setSeverity={"error"}
                handleSnackBar={handleSnackBar}
              />
            </List>
          </ListItem>
        ) : (
          <NoDataComponent />
        )}
        {/* ) : requestedUsers && requestedUsers.length > 0 ? (
          <ListItem>
            <List
              dense
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: 350,
                padding: 0,
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {requestedUsers?.map((user) => {
                return (
                  <ListUser
                    key={user.id}
                    userData={user}
                    handleAcceptReject={handleAcceptReject}
                  />
                );
              })}
              <SnackBar
                setHorizontal={"center"}
                setVertical={"top"}
                setOpen={openSnackBar}
                setMessage={"User Not Connected"}
                setSeverity={"error"}
                handleSnackBar={handleSnackBar}
              />
            </List>
          </ListItem>
        ) : (
          <NoDataComponent />
        )} */}
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
        <Box
          sx={{
            padding: "6px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            minWidth: "100%",
            borderRadius: "12px",
          }}
        >
          <ListItem sx={{ padding: 0, borderRadius: "12px" }}>
            <ListItemButton sx={{ padding: "6px 10px", borderRadius: "12px" }}>
              <ListItemIcon sx={{ minWidth: "34px" }}>
                <AccountBoxIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
        </Box>
        <Divider variant="middle" component="li" />

        {/* <ClickAwayListener onClickAway={handleTooltipClose}> */}
        <Box
          sx={{
            padding: "6px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            minWidth: "100%",
            borderRadius: "12px",
          }}
        >
          <ListItem sx={{ borderRadius: "12px", padding: 0 }}>
            <ListItemButton
              sx={{ padding: "6px 10px", borderRadius: "12px" }}
              onClick={handleClickOpenSignOut}
            >
              <ListItemIcon sx={{ minWidth: "34px" }}>
                <LogoutIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItemButton>
            <CommonDialog
              open={openSignOutDialog}
              onClose={handleClickCloseSignOut}
              signOut={true}
            />
          </ListItem>
        </Box>
        {/* </ClickAwayListener> */}
      </List>
    </Box>
  );
}

export default SideBar;
