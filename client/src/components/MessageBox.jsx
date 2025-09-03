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
import SendIcon from "@mui/icons-material/Send";

function MessageBox({message}) {
  const userName = localStorage.getItem("userName");
  return (
    <Box
    //   key={key}
      sx={{
        display: "flex",
        justifyContent: message.name === userName ? "flex-end" : "flex-start",
        mb: 1,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "8px",
          maxWidth: "60%",
          bgcolor: message.name === userName ? "primary.main" : "grey.300",
          color: message.name === userName ? "white" : "black",
          borderRadius: 3,
          borderTopRightRadius: message.name === userName ? 0 : 12,
          borderTopLeftRadius: message.name === userName ? 12 : 0,
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
          {message.text}
        </Typography>

        <Typography
          variant="caption"
          gutterBottom
          align={message.name === userName ? "right" : "left"}
          sx={{ display: "block", margin: "0px", lineHeight: 1 }}
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
