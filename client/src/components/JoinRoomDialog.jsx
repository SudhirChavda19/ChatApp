import React, { useState, useEffect, useContext } from "react";
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
import { getUserByKey } from "../services/userDao";
import { useDBContext } from "../context/DBContext";
import { useSocketContext } from "../context/SocketContext";

function JoinRoomDialog({ open, onClose }) {
  const [inputUserId, setInputUserId] = useState("");
  // const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const uniqueId = uuidv4();
  const db = useDBContext();
  const socket = useSocketContext();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const handleClose = () => {
    setInputUserId("");
    setErrorText("");
    onClose();
  };

  const handleOnChange = (e) => {
    setInputUserId(e.target.value);
    setErrorText("");
  };
  // Start with created room on monday with refrence of chatgpt
  function createRoom(otherUserId) {
    const roomId = [userId, otherUserId].sort().join("_");
    console.log("roomId :", roomId);
    socket
      .timeout(2000)
      .emit(
        "create-room",
        {
          roomId,
          receiverId: otherUserId,
          userData: { id: userId, name: userName },
        },
        (err, res) => {
          console.log("response:  ", res);
          if(!res.status){
            setErrorText("Invalid User ID or User Not Connected");
          } else {
            handleClose()
          }
        }
      );

  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let formJson = Object.fromEntries(formData.entries());
    const user = await getUserByKey(formJson.userId.trim(), db);
    console.log("user :", user);
    if (user) {
      setErrorText("User Already Exist");
    } else {
      createRoom(formJson.userId.trim());
      console.log("Else---------------");
    }
    console.log("formJson :", formJson);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Join Room</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the User Id that you want to chat
        </DialogContentText>
        <form onSubmit={handleSubmit} id="subscription-form">
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
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" form="subscription-form">
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default JoinRoomDialog;
