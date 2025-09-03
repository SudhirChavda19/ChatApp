import React, { useContext } from "react";
import { Container, Typography, Stack, CircularProgress } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./components/Chat";
import SignIn from "./components/SignIn";
import ChatBox from "./components/ChatBox";
import NoUserFallback from "./components/NoUserFallBack";
import AllRoutes from "./routes/AllRoutes";

function App() {
  return (
    <React.Fragment>
      {/* <Container maxWidth="lg">
        <Typography variant="h2" component="div" gutterBottom>
          Welcome to Socket.io
        </Typography> */}
        <AllRoutes />
      {/* </Container> */}
    </React.Fragment>
  );
}

export default App;
