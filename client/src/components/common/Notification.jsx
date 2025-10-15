import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, Badge, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import UserAvatar from "./UserAvatar";
import notificationSound from "../../assets/notification.mp3";
import React, { useEffect, useState } from "react";

const Notification = ({
  title,
  message,
  gifUrl,
  onClose,
  showNotification,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(showNotification);
    // const sound = new Audio(notificationSound);
    // sound.play();
  }, [showNotification]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-5 right-5 z-50 bg-white shadow-lg rounded-2xl p-4 cursor-pointer"
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 9999,
            cursor: "pointer",
          }}
        >
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 1.5,
              boxShadow: 5,
              borderRadius: 3,
              width: 300,
              cursor: "pointer",
              "&:hover": { boxShadow: 8 },
            }}
            onClick={onClose}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ marginRight: "4px" }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4A90E2"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"></path>
                </svg>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {"VatChit"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ margin: 0, padding: 0, marginRight: "10px" }}>
                <UserAvatar name={title} size={"40px"} />
              </Box>

              <CardContent
                sx={{ ":last-child": { paddingBottom: 0 }, padding: 0 }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {title}
                </Typography>
                {gifUrl && <img src={gifUrl} width={90} alt="GIF" />}
                {message && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    // noWrap
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "220px",
                    }}
                  >
                    {message}
                  </Typography>
                )}
              </CardContent>
            </Box>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
