import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const NotFound = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  const handleNavigation = () => {
    if(authUser) {
        navigate("/chat")
    } else {
        navigate("/sign-in")
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        bgcolor: "background.default",
        color: "text.primary",
        p: 3,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontWeight: "bold",
          color: "primary.main",
          fontSize: { xs: "6rem", md: "10rem" },
        }}
      >
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Oops! Page not found
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        The page you are looking for doesn’t exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleNavigation}
      >
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFound;
