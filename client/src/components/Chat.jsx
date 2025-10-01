import { useEffect, useState, useRef, useContext } from "react";
import { Outlet } from "react-router-dom";
import { Card, Container, Typography, Box, Fade, Divider } from "@mui/material";
import SideBar from "./SideBar";

function Chat({ children }) {
  const [hasUsers, setHasUsers] = useState(false);

  const getAvailableUsers = (isConfirmedUserAvailable) => {
    if (isConfirmedUserAvailable) setHasUsers(true);
  };

  return (
    <>
      <Card sx={{ height: "86vh", display: "flex", flexDirection: "row" }}>
        <SideBar getAvailableUsers={getAvailableUsers}/>
        <Divider orientation="vertical" flexItem />
        <Outlet context={{hasUsers}}/>
      </Card>
    </>
  );
}

export default Chat;
