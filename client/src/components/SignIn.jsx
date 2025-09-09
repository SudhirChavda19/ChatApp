import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, TextField, Typography, Card } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import { createUser } from "../services/userDao";
import { useDBContext } from "../context/DBContext";
import { useAuthContext } from "../context/AuthContext";


function SignIn() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const { setAuthUser } = useAuthContext();

  const db = useDBContext();
  // const socket = useSocketContext();
  const uniqueId = uuidv4();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userName", userName);
    localStorage.setItem("userId", uniqueId);
    setAuthUser({userId: uniqueId, userName});
    const userData = {
      id: uniqueId,
      name: userName,
      createdAt: Date.now()
    }
    createUser(userData, db);
    navigate("/chat", { replace: true });
  };

  return (
    <Card sx={{ height: "84vh", display: "flex", flexDirection: "column" }}>
      <form onSubmit={handleSubmit} style={{margin: "auto auto"}}>
        <Typography variant="h5" component="div" gutterBottom>
                  Enter User Name to Start Chat
        </Typography>
        
        {/* <label htmlFor="username">Username</label>
      <input
      type="text"
      minLength={6}
      name="username"
      id="username"
      className="username__input"
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
      />
      <button className="home__cta">SIGN IN</button> */}

        <TextField
          type="text"
          minLength={6}
          maxLength={12}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          name="username"
          id="username"
          label="User Name"
          variant="outlined"
          required
        ></TextField>
        <div style={{marginTop: "8.4px"}}>   
        <Button type="submit" variant="contained">
          Start Chat
        </Button>
        </div>
      </form>
    </Card>
  );
}

export default SignIn;
