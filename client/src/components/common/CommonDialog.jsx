import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { getUserByKey } from "../../services/userDao";
import { useDBContext } from "../../context/DBContext";
import { useSocketContext } from "../../context/SocketContext";
import { AuthApi } from "../../services/authService";
import { useAuthContext } from "../../context/AuthContext";

function CommonDialog({ open, onClose, signOut }) {
  const [inputUserId, setInputUserId] = useState("");
  const [isSignOut, setIsSignOut] = useState(false);
  // const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const uniqueId = uuidv4();
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  const db = useDBContext();
  const socket = useSocketContext();
  const queryClient = useQueryClient();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    if (signOut) setIsSignOut(true);
  }, [signOut]);

  const handleClose = () => {
    setInputUserId("");
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

  const handleOnChange = (e) => {
    setInputUserId(e.target.value);
    setErrorText("");
  };
  // Start with created room on monday with refrence of chatgpt
  function createRoom(otherUserId) {
    const roomId = [userId, otherUserId].sort().join("_");
    console.log("roomId :", roomId);
    socket.timeout(2000).emit(
      "create-room",
      {
        roomId,
        receiverId: otherUserId,
        userData: { id: userId, name: userName },
      },
      (err, res) => {
        console.log("response:  ", res);
        if (!res.status) {
          setErrorText("Invalid User ID or User Not Connected");
        } else {
          handleClose();
        }
      }
    );
  }

  const handleSubmit = async (event) => {
    console.log("isSignOut -----------:", isSignOut);
    event.preventDefault();
    if (isSignOut) {
      signOutMutation.mutate();
    } else {
      const formData = new FormData(event.currentTarget);
      let formJson = Object.fromEntries(formData.entries());
      const user = await getUserByKey(formJson.userId.trim(), db);
      if (user) {
        setErrorText("User Already Exist");
      } else {
        createRoom(formJson.userId.trim());
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isSignOut ? "Sign Out" : "Join Room"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isSignOut
            ? "Are you sure you want to sign out"
            : "Enter the User Id that you want to chat"}
        </DialogContentText>

        <form onSubmit={handleSubmit} id="subscription-form">
          {!isSignOut && (
            <TextField
              autoFocus
              required
              value={inputUserId}
              onChange={handleOnChange}
              margin="dense"
              id="userId"
              name="userId"
              label="User Id"
              type="text"
              fullWidth
              variant="standard"
              error={!!errorText}
              helperText={errorText}
            />
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" form="subscription-form">
          {isSignOut ? "Yes, Continue" : "Join"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CommonDialog;
