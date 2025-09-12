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

function MessageBox({ message, handleScroll }) {
  const { authUser } = useAuthContext();
  const { userId } = authUser;
  return (
    <Box
      onScroll={handleScroll}
      sx={{
        display: "flex",
        justifyContent: message.senderid === userId ? "flex-end" : "flex-start",
        mb: 1,
      }}
    >
      {message.message && message.gifurl ? (
        <Box
          sx={{
            padding: 0,
            margin: 0,
            flexDirection: "column",
            maxWidth: "60%",
            display: "flex",
            alignItems: message.senderid === userId ? "flex-end" : "flex-start",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "2px",
              width: "fit-content",
              bgcolor: message.senderid === userId ? "primary.main" : "white",
              color: message.senderid === userId ? "white" : "black",
              borderRadius: 3,
              borderBottomLeftRadius: message.senderid === userId ? 12 : 0,
              borderBottomRightRadius: message.senderid === userId ? 0 : 12,
            }}
          >
            {message.gifurl && (
              <img
                src={message.gifurl}
                alt="GIF"
                style={{
                  borderTopRightRadius: 12,
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: message.senderid === userId ? 12 : 0,
                  borderBottomRightRadius: message.senderid === userId ? 0 : 12,
                  display: "block",
                }}
              />
            )}
          </Paper>
          <Paper
            elevation={3}
            sx={{
              marginTop: "2px",
              padding: "8px",
              width: "fit-content",
              bgcolor: message.senderid === userId ? "primary.main" : "white",
              color: message.senderid === userId ? "white" : "black",
              borderRadius: 3,
              borderTopRightRadius: message.senderid === userId ? 0 : 12,
              borderTopLeftRadius: message.senderid === userId ? 12 : 0,
            }}
          >
            {message.message && (
              <Box
                sx={{
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  justifyContent:
                    message.senderid === userId ? "flex-start" : "flex-end",
                }}
              >
                <Typography
                  margin={0}
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: "block",
                    lineHeight: 1,
                    fontSize: "15px",
                  }}
                >
                  {message.message}
                </Typography>
              </Box>
            )}

            <Typography
              variant="caption"
              gutterBottom
              margin={0}
              align={message.senderid === userId ? "right" : "left"}
              sx={{
                display: "block",
                lineHeight: 1,
                marginTop: "4px",
                fontSize: "9px",
              }}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </Typography>
          </Paper>
        </Box>
      ) : (
        <Paper
          elevation={3}
          sx={{
            padding: message.gifurl ? "2px" : "8px",
            maxWidth: "60%",
            bgcolor: message.senderid === userId ? "primary.main" : "white",
            color: message.senderid === userId ? "white" : "black",
            borderRadius: 3,
            borderTopRightRadius: message.senderid === userId ? 0 : 12,
            borderTopLeftRadius: message.senderid === userId ? 12 : 0,
          }}
        >
          {message.gifurl && (
            <img
              src={message.gifurl}
              alt="GIF"
              style={{
                borderTopRightRadius: message.senderid === userId ? 0 : 12,
                borderTopLeftRadius: message.senderid === userId ? 12 : 0,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                display: "block",
              }}
            />
          )}
          {message.message && (
            <Box
              sx={{
                padding: 0,
                margin: 0,
                display: "flex",
                justifyContent:
                  message.senderid === userId ? "flex-start" : "flex-end",
              }}
            >
              <Typography
                variant="h6"
                margin={0}
                gutterBottom
                sx={{
                  display: "block",
                  lineHeight: 1,
                  fontSize: "15px",
                }}
              >
                {message.message}
              </Typography>
            </Box>
          )}

          <Typography
            variant="caption"
            margin={0}
            gutterBottom
            align={message.senderid === userId ? "right" : "left"}
            sx={{
              display: "block",
              marginTop: "4px",
              marginBottom: message.gifurl ? "4px" : "none",
              marginLeft: message.senderid === userId ? "none" : (message.gifurl ? "8px" : "none"),
              marginRight: message.senderid === userId ? (message.gifurl ? "8px" : "none") : "none",
              lineHeight: 1,
              fontSize: "9px",
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default MessageBox;
