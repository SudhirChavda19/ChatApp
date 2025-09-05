import React, { useContext } from "react";
import { Container, Typography, Stack, CircularProgress } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AllRoutes from "./routes/AllRoutes";

function App() {
  return (
    <React.Fragment>
        <AllRoutes />
    </React.Fragment>
  );
}

export default App;
