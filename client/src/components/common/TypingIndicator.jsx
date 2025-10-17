import React from "react";
import { Box, Paper, Stack, useTheme } from "@mui/material";

function TypingIndicator() {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mb: 1,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: "16px 8px",
            maxWidth: "60%",
            bgcolor: "white",
            color: "black",
            borderRadius: 3,
            borderTopRightRadius: 12,
            borderTopLeftRadius: 0,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            sx={{
              borderRadius: "12px",
              width: "fit-content",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {[0, 1, 2].map((dot) => (
                <Box
                  key={dot}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.primary.main,
                    animation: `typingDot 1.4s infinite ease-in-out`,
                    animationDelay: `${dot * 0.2}s`,
                  }}
                />
              ))}
            </Box>

            <style>
              {`
          @keyframes typingDot {
            0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}
            </style>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}

export default TypingIndicator;
