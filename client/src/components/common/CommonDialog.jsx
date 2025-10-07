import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  forwardRef,
} from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Autocomplete,
  Chip,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useSocketContext } from "../../context/SocketContext";
import { AuthApi } from "../../services/authService";
import { useAuthContext } from "../../context/AuthContext";
import { UserApi } from "../../services/userService";
import UserAvatar from "./UserAvatar";
import { RoomApi } from "../../services/roomService";

function CommonDialog({ open, onClose, signOut, confirmedUsers }) {
  const [searchUserName, setSearchUserName] = useState("");
  const [debounceInput, setDebounceInput] = useState(null);
  const [isSignOut, setIsSignOut] = useState(false);
  const [serverError, setServerError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [confirmedUsersList, setConfirmedUsersList] = useState([]);
  const [confirmedRoomsId, setConfirmedRoomsId] = useState({});
  const [isUserConfirmed, setIsUserConfirmed] = useState(false);

  const listboxRef = useRef(null);
  const uniqueId = uuidv4();
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  // const db = useDBContext();
  const socket = useSocketContext();
  const queryClient = useQueryClient();

  const userId = localStorage.getItem("userId");

  const {
    data,
    error,
    isError,
    isFetchNextPageError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["search", debounceInput],
    queryFn: ({ pageParam }) =>
      UserApi.SearchUserService(debounceInput, pageParam),
    initialPageParam: 1,
    getNextPageParam(lastPage, allPages) {
      const { hasNextPage } = lastPage;
      return hasNextPage ? allPages.length + 1 : undefined;
    },
    enabled: false,
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const CreateRequestMutation = useMutation({
    mutationFn: RoomApi.CreateNewRequest,
    onError: (error) => {
      console.log("error :", error);
      const { message, status } = error.response.data;
      if (status === "Fail") {
        setServerError(message);
      }
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        handleClose();
      }
    },
  });

  useEffect(() => {
    if (signOut) setIsSignOut(true);
  }, [signOut]);

  useEffect(() => {
    console.log("DATA: ", data);
    if (data) {
      setUserList((prev) => [
        ...prev,
        ...data.pages[data.pages.length - 1].data.filter(
          (user) => user._id !== userId
        ),
      ]);
      setLoading(false);
    }
    if (error) console.log(error);
  }, [data, error]);

  useEffect(() => {
    if (searchUserName?.trim() && searchUserName?.trim().length > 1) {
      queryClient.removeQueries({
        queryKey: ["search", searchUserName?.trim()],
        exact: true,
      });
      setDebounceInput(searchUserName?.trim());
      const timeoutId = setTimeout(() => {
        if (debounceInput) {
          setUserList([]);
          (async () => {
            await refetch();
          })();
          setLoading(false);
        }
      }, 1000);
      return () => clearTimeout(timeoutId);
    } else {
      setLoading(false);
    }
  }, [searchUserName]);

  const signOutMutation = useMutation({
    mutationFn: AuthApi.SignOutService,
    onError: (error) => {
      console.log("error :", error.response.data);
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        // const { _id, userName } = data.data.data;
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
        localStorage.removeItem("userTokenExpiration");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        setAuthUser(false);
        navigate("/sign-in", { replace: true });
        handleClose();
      }
    },
  });

  useEffect(() => {
    if (confirmedUsers && confirmedUsers.length > 0) {
      const userIds = confirmedUsers.map((room) => {
        const user = room.participants.filter(
          (participant) => participant._id !== userId
        )[0];
        return user._id;
      });
      let roomIds = {};
      confirmedUsers.forEach((room) => {
        const user = room.participants.filter(
          (participant) => participant._id !== userId
        )[0];
        roomIds[user._id] = room._id
      });
      setConfirmedRoomsId(roomIds)
      setConfirmedUsersList(userIds);
    }
  }, [confirmedUsers]);

  const handleClose = () => {
    setSearchUserName("");
    setDebounceInput(null);
    setSelectedUser(null);
    setServerError("");
    setUserList([]);
    onClose();
  };

  const handleOnChange = async (value, reason) => {
    if (reason !== "reset" && reason !== "blur") {
      setLoading(true);
      setSearchUserName(value);
      setServerError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSignOut) {
      signOutMutation.mutate();
    } else {
      if (selectedUser && isUserConfirmed) {
        navigate(`/chat/room/${confirmedRoomsId[selectedUser._id]}`, { state: { user: selectedUser } });
        handleClose();
      } else {
        CreateRequestMutation.mutate({
          senderId: userId,
          receiverId: selectedUser._id,
        });
      }
    }
  };

  const handleScroll = async (event) => {
    const listboxNode = event.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >=
        listboxNode.scrollHeight - 1 &&
      hasNextPage
    ) {
      if (!listboxRef.current) return;
      const list = listboxRef.current;
      setLoading(true);

      // Save old scroll position & height
      const oldScrollTop = list.scrollTop;
      const oldScrollHeight = list.scrollHeight;
      await fetchNextPage();

      requestAnimationFrame(() => {
        const newScrollHeight = list.scrollHeight;
        list.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight);
      });
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (confirmedUsersList.includes(user._id)) {
      setIsUserConfirmed(true);
    }
  };

  const handleRemoveSelectedUser = () => {
    setSelectedUser(null);
    setServerError("");
    setSearchUserName(searchUserName);
    setIsUserConfirmed(false);
  };

  const Loader = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 1,
      }}
    >
      <CircularProgress size={20} />
    </Box>
  );

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isSignOut ? "Sign Out" : "Request"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isSignOut
            ? "Are you sure you want to sign out"
            : "Enter the User Name that you want to request"}
        </DialogContentText>

        <form id="subscription-form">
          {!isSignOut && (
            <Box sx={{ width: "100%" }}>
              {!selectedUser ? (
                <Autocomplete
                  freeSolo
                  disableClearable={true}
                  open={!!searchUserName?.trim()}
                  clearOnBlur={false}
                  onInputChange={(event, value, reason) => {
                    handleOnChange(value, reason);
                  }}
                  inputValue={searchUserName}
                  options={userList}
                  getOptionLabel={(option) => option.userName}
                  onChange={(event, value) => handleUserSelect(value)}
                  popupIcon={null}
                  loading={loading}
                  loadingText={<Loader />}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      autoFocus
                      required
                      margin="dense"
                      id="userName"
                      name="userName"
                      placeholder="Search..."
                      type="text"
                      fullWidth
                      // onChange={(event) => {
                      //   handleOnChange(event);
                      // }}
                      // value={searchUserName}
                      variant="standard"
                      // InputProps={{
                      //   ...params.InputProps,
                      //   endAdornment: <>{params.InputProps.endAdornment}</>,
                      // }}
                    />
                  )}
                  ListboxProps={{
                    onScroll: handleScroll,
                    style: {
                      maxHeight: 200,
                      overflow: "auto",
                      "&::WebkitScrollba": {
                        display: "none",
                      },
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    },
                  }}
                  renderOption={(props, option) => (
                    <li
                      {...props}
                      key={option._id}
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "transparent",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "8px",
                          backgroundColor: "#f3f3f3",
                          borderRadius: "12px",
                          // marginBottom: "4px",
                          width: "100%",
                          transition: "background-color 0.2s",
                          "&:hover": {
                            backgroundColor: "#e0f7fa",
                          },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ lineHeight: 1, marginBottom: "4px" }}
                        >
                          {option.userName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1 }}
                        >
                          {option.email}
                        </Typography>
                      </Box>
                    </li>
                  )}
                  ListboxComponent={forwardRef(function ListboxComponent(
                    props,
                    ref
                  ) {
                    return (
                      <ul {...props} ref={ref}>
                        {userList?.length === 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              p: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ lineHeight: 1, marginBottom: "4px" }}
                            >
                              No User Found
                            </Typography>
                          </Box>
                        )}
                        {props.children}
                        {/* {loading && userList.length > 9 && <Loader />} */}
                      </ul>
                    );
                  })}
                />
              ) : (
                <Chip
                  sx={{ padding: "8px", height: "fit-content" }}
                  avatar={
                    <UserAvatar name={selectedUser.userName} size={"30px"} />
                  }
                  label={selectedUser.userName}
                  onDelete={handleRemoveSelectedUser}
                  color="primary"
                />
              )}
            </Box>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" form="subscription-form" onClick={handleSubmit}>
          {isSignOut
            ? "Yes, Continue"
            : isUserConfirmed
            ? "Continue Chat"
            : "Request"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CommonDialog;
