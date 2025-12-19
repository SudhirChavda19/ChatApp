import { useState, useEffect } from "react";
import io from "socket.io-client";
import { SocketContext } from "./SocketContext";
import { Box, LinearProgress } from "@mui/material";
import { useAuthContext } from "./AuthContext";

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { authUser } = useAuthContext();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (authUser && userId) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        autoConnect: false,
        transports: ["websocket"],
        withCredentials: true,
        query: {
          userId: userId,
        },
      });

      setSocket(newSocket);

    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  if (authUser) {
    if (!socket)
      return (
        <Box sx={{ width: "100%" }}>
          <LinearProgress color="primary" />
        </Box>
      );
  }

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
