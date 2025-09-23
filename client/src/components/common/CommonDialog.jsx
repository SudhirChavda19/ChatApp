import React, { useState, useEffect, useContext, useRef, forwardRef } from "react";
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
import { getUserByKey } from "../../services/userDao";
import { useDBContext } from "../../context/DBContext";
import { useSocketContext } from "../../context/SocketContext";
import { AuthApi } from "../../services/authService";
import { useAuthContext } from "../../context/AuthContext";
import { UserApi } from "../../services/userService";

function CommonDialog({ open, onClose, signOut }) {
  const [searchUserName, setSearchUserName] = useState("");
  const [debounceInput, setDebounceInput] = useState(null);
  const [isSignOut, setIsSignOut] = useState(false);
  const [listError, setListError] = useState("");
  const [errorText, setErrorText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);

  const listboxRef = useRef(null);
  const uniqueId = uuidv4();
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  // const db = useDBContext();
  const socket = useSocketContext();
  const queryClient = useQueryClient();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const {
    data,
    error,
    isError,
    isFetchNextPageError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["search", debounceInput],
    queryFn: ({ pageParam }) =>
      UserApi.SearchUserService(debounceInput, pageParam),
    initialPageParam: 1,
    getNextPageParam(lastPage, allPages) {
      const { hasNextPage } = lastPage;
      return hasNextPage ? allPages.length + 1 : undefined;
    },
    enabled: !!debounceInput,
  });

  useEffect(() => {
    if (signOut) setIsSignOut(true);
  }, [signOut]);

  useEffect(() => {
    console.log("DATA: ", data);
    if (data) {
      setUserList((prev) => [
        ...prev,
        ...data.pages[data.pages.length - 1].data,
      ]);
      setLoading(false);
    }
    if (error) console.log(error);
  }, [data, error]);

  useEffect(() => {
    if (searchUserName?.trim() && searchUserName?.trim().length > 1) {
      const timeoutId = setTimeout(() => {
        setDebounceInput(searchUserName?.trim());
      }, 1000);
      return () => clearTimeout(timeoutId);
    } else {
      setLoading(false);
      setListError("No User Found");
    }
  }, [searchUserName]);

  const handleClose = () => {
    setSearchUserName("");
    setErrorText("");
    onClose();
  };

  const signOutMutation = useMutation({
    mutationFn: AuthApi.SignOutService,
    onError: (error) => {
      console.log("error :", error.response.data);
    },
    onSuccess: (data) => {
      console.log("data :", data);
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

  const handleOnChange = async (e, newValue, reason) => {
    if(reason !== "reset" && reason !== "blur") {
      const value = e.target.value;
      setLoading(true);
      setSearchUserName(value);
      setUserList([]);
      setErrorText("");
    }
  };

  // function requestUser(otherUserId) {
  //   const roomId = [userId, otherUserId].sort().join("_");
  //   console.log("roomId :", roomId);

  //   socket.timeout(2000).emit(
  //     "create-room",
  //     {
  //       roomId,
  //       receiverId: otherUserId,
  //       userData: { id: userId, name: userName },
  //     },
  //     (err, res) => {
  //       console.log("response:  ", res);
  //       if (!res.status) {
  //         setErrorText("Invalid User ID or User Not Connected");
  //       } else {
  //         handleClose();
  //       }
  //     }
  //   );
  // }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSignOut) {
      signOutMutation.mutate();
    }
    // else {
    // }
  };

  // const loadUsers = async (pageNumber) => {
  //   setLoading(true);
  //   const newUsers = await fetchUsers(pageNumber);
  //   setUsers((prev) => [...prev, ...newUsers]);
  //   setLoading(false);
  // };

  const handleScroll = async (event) => {
    const listboxNode = event.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >=
        listboxNode.scrollHeight - 1 &&
      hasNextPage
    ) {
      console.log("Scroll==========================");
      setLoading(true);
      await fetchNextPage();
    }
  };

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
            // <TextField
            //   autoFocus
            //   required
            //   value={searchUserName}
            //   onChange={handleOnChange}
            //   margin="dense"
            //   id="userName"
            //   name="userName"
            //   // label="User Name"
            //   placeholder="Search user name"
            //   type="text"
            //   fullWidth
            //   variant="standard"
            //   error={!!errorText}
            //   helperText={errorText}
            // />

            <Box sx={{ width: 300 }}>
              {!selectedUser ? (
                <Autocomplete
                  open={searchUserName?.trim()}
                  options={userList}
                  getOptionLabel={(option) => option.userName}
                  onChange={(event, value) => setSelectedUser(value)}
                  inputValue={searchUserName}
                  onInputChange={handleOnChange}
                  disableClearable
                  popupIcon={null}
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
                      variant="standard"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
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
                    ref: listboxRef,
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
                        {props.children}
                        {loading && userList.length > 9 && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              p: 1,
                            }}
                          >
                            <CircularProgress size={20} />
                          </Box>
                        )}
                      </ul>
                    );
                  })}
                />
              ) : (
                <Chip
                  label={selectedUser.name}
                  onDelete={() => setSelectedUser(null)}
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
          {isSignOut ? "Yes, Continue" : "Request"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CommonDialog;
