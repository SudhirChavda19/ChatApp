import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import CloudOffIcon from "@mui/icons-material/CloudOff";

function OfflinePage() {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        bgcolor: "#ffffffff",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          bgcolor: "white",
          color: "text.secondary",
          margin: "auto",
        }}
      >
        <CloudOffIcon sx={{ fontSize: 240, color: "grey.500", mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 1 }}>
          You’re offline
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Check your internet connection and try again.
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{
            textTransform: "none",
            px: 3,
            py: 1,
            bgcolor: "#1a73e8",
            "&:hover": {
              bgcolor: "#1765cc",
            },
          }}
        >
          Retry
        </Button>
      </Box>
    </Box>
  );
}

export default OfflinePage;
