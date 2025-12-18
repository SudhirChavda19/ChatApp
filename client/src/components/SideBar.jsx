import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Divider,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useDBContext } from "../context/DBContext";
import CommonDialog from "./common/CommonDialog";
import { useSocketContext } from "../context/SocketContext";
import ListUser from "./ListUser";
import SnackBar from "./common/SnackBar";
import { RoomApi } from "../services/roomService";
import Profile from "./Profile";
import { useDispatch, useSelector } from "react-redux";
import { loadRooms } from "../features/room/roomThunk";
import { updateUnreadCount, updateRoom } from "../features/room/roomSlice";

function SideBar() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openSignOutDialog, setOpenSignOutDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [tabValue, setTabvalue] = useState(0);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  // const [loading, setLoading] = useState(true);

  const socket = useSocketContext();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const userId = localStorage.getItem("userId");

  const dispatch = useDispatch();
  const { rooms, unreadCounts, error, loading } = useSelector(
    (state) => state.rooms
  );

  useEffect(() => {
    getRoomData(userId);
  }, [dispatch, userId]);

  const getRoomData = async (userId) => {
    await dispatch(loadRooms(userId));
  };

  // const { isPending, isError, data, error, refetch } = useQuery({
  //   queryKey: ["users", userId],
  //   queryFn: () => RoomApi.GetRooms(userId),
  //   staleTime: 0,
  //   cacheTime: 0,
  //   refetchOnMount: false,
  //   refetchOnWindowFocus: false,
  // });

  // useEffect(() => {
  //   if (data) {
  //     console.log("data :", data);
  //     if (data.status === 200 && data.data.data.rooms && data.data.data.rooms.length > 0) {
  //       const rooms = data.data.data.rooms.map((room) => {
  //         return room;
  //       });
  //       setRoomList(rooms);
  //       let isConfirmedUserAvailable;
  //       rooms.forEach((room) => {
  //         isConfirmedUserAvailable = room.status === "Confirmed";
  //         if (isConfirmedUserAvailable) return;
  //       });
  //       getAvailableUsers(isConfirmedUserAvailable);
  //     } else {
  //       setRoomList([]);
  //     }
  //     if(data.status === 200 && data.data.data.unreadCounts){
  //       setUnreadCounts(data.data.data.unreadCounts);
  //     }
  //   } else {
  //     setRoomList([]);
  //   }
  //   if (error) {
  //     console.log("error :", error);
  //   }
  // }, [data, error]);

  const RequestUpdate = useMutation({
    mutationFn: RoomApi.RequestStatusUpdate,
    onError: (error) => {
      console.error("error :", error);
      // const { message, status } = error.response.data;
      // if (status === "Fail") {
      //   setServerError(message);
      // }
    },
    onSuccess: async (data) => {
      if (data.status === 201) {
        queryClient.removeQueries({
          queryKey: ["users", userId],
          exact: true,
        });
        await getRoomData(userId);
      }
    },
  });

  const Removeroom = useMutation({
    mutationFn: RoomApi.RemoveRoom,
    onError: (error) => {
      console.error("error :", error);
      // const { message, status } = error.response.data;
      // if (status === "Fail") {
      //   setServerError(message);
      // }
    },
    onSuccess: async (data) => {
      if (data.status === 201) {
        queryClient.removeQueries({
          queryKey: ["users", userId],
          exact: true,
        });
        await getRoomData(userId);
      }
    },
  });

  useEffect(() => {
    socket.on("updated-room", ({ senderId, updatedRoom, unreadCounts }) => {
      if (userId !== senderId) {
        dispatch(updateUnreadCount({ roomId: updatedRoom._id, unreadCounts }));
      }
      dispatch(updateRoom(updatedRoom));
    });
  }, [socket]);

  useEffect(() => {
    socket.on("request-to-join-room", () => {
      queryClient.removeQueries({
        queryKey: ["users", userId],
        exact: true,
      });
      (async () => {
        await getRoomData(userId);
      })();
    });
  }, [socket]);

  useEffect(() => {
    socket.on("request-accept-reject", () => {
      queryClient.removeQueries({
        queryKey: ["users", userId],
        exact: true,
      });
      (async () => {
        await getRoomData(userId);
      })();
    });
  }, [socket]);

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

  const handleClickOpenProfile = () => {
    setOpenProfileDialog(true);
  };
  const handleClickCloseProfile = () => {
    setOpenProfileDialog(false);
  };

  // const handleTabChange = (event, newValue) => {
  //   setTabvalue(newValue);
  // };

  const handleAcceptReject = async (isAccepted, roomId, senderId) => {
    RequestUpdate.mutate({ isAccepted, roomId, senderId });
  };

  const handleRemoveRoom = async (id) => {
    Removeroom.mutate(id);
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
        width: "16vw",
        height: "100%",
        position: "relative",
      }}
    >
      <List sx={style}>
        <ListItem>
          <ListItemIcon sx={{ margin: "6px 0px", minWidth: "40px" }}>
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A90E2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"></path>
            </svg>
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
            {openDialog && (
              <CommonDialog open={openDialog} onClose={handleClickClose} />
            )}
          </Tooltip>
        </ListItem>
        <Divider component="li" />
        <ListItem
          sx={{ padding: "8px 16px", width: "100%", margin: "0px auto" }}
        >
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
        {rooms && rooms.length > 0 ? (
          <ListItem>
            <List
              dense
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                position: "relative",
                overflowY: "auto",
                maxHeight: 350, 
                padding: 0,
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {rooms?.map((room) => {
                return (
                  <ListUser
                    key={room._id}
                    roomData={room}
                    handleAcceptReject={handleAcceptReject}
                    handleRemoveRoom={handleRemoveRoom}
                    unreadCounts={unreadCounts[room._id]}
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
          backgroundColor: "white",
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
            <ListItemButton
              sx={{ padding: "6px 10px", borderRadius: "12px" }}
              onClick={handleClickOpenProfile}
            >
              <ListItemIcon sx={{ minWidth: "34px" }}>
                <AccountBoxIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
            {openProfileDialog && (
              <Profile
                open={openProfileDialog}
                onClose={handleClickCloseProfile}
                signOut={true}
              />
            )}
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
            {openSignOutDialog && (
              <CommonDialog
                open={openSignOutDialog}
                onClose={handleClickCloseSignOut}
                signOut={true}
              />
            )}
          </ListItem>
        </Box>
        {/* </ClickAwayListener> */}
      </List>
    </Box>
  );
}

export default SideBar;
