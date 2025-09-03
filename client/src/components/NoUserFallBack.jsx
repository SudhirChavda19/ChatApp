import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { motion } from "framer-motion"; // for animation
import JoinRoomDialog from "./JoinRoomDialog";

const NoUserFallback = ({ userName, isUsersAvailable }) => {
console.log('userName :', userName);
console.log('isUsersAvailable ===========:', isUsersAvailable);
  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClickClose = () => {
    setOpenDialog(false);
  };

  const Icon = isUsersAvailable ? ChatBubbleIcon : ChatBubbleOutlineIcon ;
  return (
    <Box
      sx={{
        height: "84vh",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        bgcolor: "#f9fafb",
      }}
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{
          scale: [1, 1.1, 0.9, 1], // hover replay effect
          transition: { duration: 0.8 },
        }}
      >
        <Icon sx={{ fontSize: 100, color: "primary.main" }} />
      </motion.div>

      <Typography variant="h5" sx={{ mt: 3, fontWeight: "bold" }}>
        {isUsersAvailable ? `Welcome 👋 ${userName} ❄` : "No conversations yet"}
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
        {isUsersAvailable
          ? "Select a chat to start messaging"
          : "Looks like you don’t have any users to chat with. Start a new conversation and connect with your team!"}
      </Typography>

      {!isUsersAvailable && (
        <div>
          <Button
            variant="contained"
            sx={{ mt: 3, borderRadius: "20px", px: 4 }}
            onClick={handleClickOpen}
          >
            Start a Chat
          </Button>
          <JoinRoomDialog open={openDialog} onClose={handleClickClose} />
        </div>
      )}
    </Box>
  );
};

export default NoUserFallback;
