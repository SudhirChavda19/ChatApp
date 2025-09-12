import React from 'react'
import { Container, Typography } from "@mui/material";
import { Outlet } from 'react-router-dom';

function WelcomePage() {
  return (
      <Container maxWidth="lg">
        <Typography variant="h3" component="div" gutterBottom>
          Welcome to Socket.io
        </Typography>
        <Outlet />
      </Container>
  );
}

export default WelcomePage;