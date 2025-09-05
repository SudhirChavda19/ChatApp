import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import { createUser, getUsers } from "../utils/userDao";
import { useDBContext } from "../context/DBContext";
import { useSocketContext } from "../context/SocketContext";

function JoinRoomDialog({open, onClose}) {
  const [room, setRoom] = useState(null);
  const uniqueId = uuidv4();
  const db = useDBContext();
  const socket = useSocketContext();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  
  const handleClose = () => {
    onClose();
  };
  // Start with created room on monday with refrence of chatgpt
  function createRoom (otherUserId) {
    const roomId = [userId, otherUserId].sort().join("_");
    console.log('roomId :', roomId);
    setRoom(roomId);
    socket.emit("create-room", {roomId, receiverId: otherUserId, userData: { id: userId, name: userName} });
  }

  // function AddUser () {
  //   const userData = {
  //     // id: uniqueId,
  //     name: userName,
  //     createdAt: new Date()
  //   }
  //   createUser(userData, db);
  // }

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let formJson = Object.fromEntries(formData.entries());
    // formJson.id = uniqueId;
    // formJson.createdAt = new Date();
    createRoom(formJson.userId);
    console.log('formJson :', formJson);
    handleClose();
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
            margin="dense"
            id="userId"
            name="userId"
            label="User Id"
            type="text"
            fullWidth
            variant="standard"
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
