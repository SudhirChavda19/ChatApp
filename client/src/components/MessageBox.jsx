import React from "react";
import {
  Card,
  Container,
  Avatar,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Fab,
  Fade,
  InputBase,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useAuthContext } from "../context/AuthContext";

function MessageBox({message}) {
  const { authUser } = useAuthContext();
  const { userId } = authUser
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: message.senderid === userId ? "flex-end" : "flex-start",
        mb: 1,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "8px",
          maxWidth: "60%",
          bgcolor: message.senderid === userId ? "primary.main" : "grey.300",
          color: message.senderid === userId ? "white" : "black",
          borderRadius: 3,
          borderTopRightRadius: message.senderid === userId ? 0 : 12,
          borderTopLeftRadius: message.senderid === userId ? 12 : 0,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            display: "block",
            marginBottom: "4px",
            lineHeight: 1,
            fontSize: "17px",
          }}
        >
          {message.message}
        </Typography>

        <Typography
          variant="caption"
          gutterBottom
          align={message.senderid === userId ? "right" : "left"}
          sx={{ display: "block", margin: "0px", lineHeight: 1, fontSize: "9px" }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </Typography>
      </Paper>
    </Box>
  );
}

export default MessageBox;
