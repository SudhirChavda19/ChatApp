import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom"
import { Box, Typography, Button } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { motion } from "framer-motion";
import CommonDialog from "./common/CommonDialog";
import { useAuthContext } from "../context/AuthContext";
import { getConfiremedUsers } from "../services/userDao";
import { useDBContext } from "../context/DBContext";


const NoUserFallback = () => {

  const [openDialog, setOpenDialog] = useState(false);
  const { hasUsers } = useOutletContext();

  const userName = localStorage.getItem("userName");

  // useEffect(() => {
  //   (async () => {
  //     const confiremedUserData = await getConfiremedUsers(db);
  //     if (confiremedUserData.length > 0) setConfiremedUsers(confiremedUserData);
  //   })()
  // }, [isUsersAvailable])

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClickClose = () => {
    setOpenDialog(false);
  };

  const Icon = hasUsers ? ChatBubbleIcon : ChatBubbleOutlineIcon ;
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
        {hasUsers ? `Hiii 👋 ${userName} ❄` : "No conversations yet"}
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
        {hasUsers
          ? "Select a chat to start messaging"
          : "Looks like you don’t have any users to chat with. Start a new conversation and connect with your team!"}
      </Typography>

      {!(hasUsers) && (
        <div>
          <Button
            variant="contained"
            sx={{ mt: 3, borderRadius: "20px", px: 4 }}
            onClick={handleClickOpen}
          >
            Start a Chat
          </Button>
          <CommonDialog open={openDialog} onClose={handleClickClose} />
        </div>
      )}
    </Box>
  );
};

export default NoUserFallback;
