import { useEffect, useState, useRef, useContext } from "react";
import { Outlet } from "react-router-dom";
import { Card, Container, Typography, Box, Fade, Divider } from "@mui/material";
import SideBar from "./SideBar";

function Chat({ children }) {

  return (
    <>
      <Card sx={{ height: "86vh", display: "flex", flexDirection: "row" }}>
        <SideBar/>
        <Divider orientation="vertical" flexItem />
        <Outlet/>
      </Card>
    </>
  );
}

export default Chat;
