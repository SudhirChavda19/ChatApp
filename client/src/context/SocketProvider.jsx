import { useState, useEffect } from "react";
import io from "socket.io-client";
import { SocketContext } from "./SocketContext";
import { Box, LinearProgress } from "@mui/material";
import { useAuthContext } from "./AuthContext";

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { authUser } = useAuthContext();
  // const [onlineUsers, setOnlineUsers] = useState([]);

  // const userId = !!localStorage.getItem("userId");
  // console.log('userId :', userId);

  useEffect(() => {
    if (authUser) {
      const newSocket = io("http://localhost:4000", {
        transports: ["websocket"],
        query: {
          userId: authUser?.userId,
        },
      });
      console.log("socket :", newSocket);

      setSocket(newSocket);

      // socket.on() is used to listen to the events. can be used both on client and server side
      // socket.on("getOnlineUsers", (users) => {
      // 	setOnlineUsers(users);
      // });

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
