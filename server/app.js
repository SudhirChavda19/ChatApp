import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = new createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = 4000;

app.get("/", (req, res) => {
  res.send("namaste World");
});

let users = [];
const userSocketMap = {};

const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("User Connected: ", socket.id);
  console.log("UserID::::::::: ", socket.handshake.query.userId);

  const userId = socket.handshake.query?.userId;
  console.log('userId :', userId);
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  socket.on("create-room", ({ roomId, receiverId, userData }) => {
    socket.join(roomId);
    const receiverUserId = getReceiverSocketId(receiverId)
    socket.to(receiverUserId).emit("request-to-join-room", { roomId, userData });
  });

  socket.on("request-accepted", ({ roomId, receiverId, userData }) => {
  console.log('receiverId :', receiverId);
    socket.join(roomId);
    const receiverUserId = getReceiverSocketId(receiverId)
    console.log('receiverUserId :', receiverUserId);
    socket.to(receiverUserId).emit("request-accepted", { roomId, userData });
  });

  socket.on("message", (data) => {
    console.log(data);
    io.emit("receive-message", data);
  });

  socket.on("new-user", (data) => {
    //Adds the new user to the list of users
    users.push(data);
    console.log(users);
    //Sends the list of users to the client
    io.emit("new-user-response", users);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected: ", socket.id);
    delete userSocketMap[userId];
    // users = users.filter((user) => user.socketID !== socket.id);
    // console.log(users);
    //Sends the list of users to the client
    io.emit("new-user-response", users);
    socket.disconnect();
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
