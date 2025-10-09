const { Server } = require("socket.io");
const express = require("express");
const { createServer } = require("http");
const { redisClient } = require("../redis/redisClient");

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

let users = [];
const userSocketMap = new Map();
const watchMap = new Map();

const getReceiverSocketId = (receiverId) => {
  return userSocketMap.get(receiverId);
};

const notifyPresenceChange = (userId, status) => {
  for (const [socketId, watchList] of watchMap.entries()) {
    if (watchList.includes(userId)) {
      io.to(socketId).emit("presence-update", { userId, status });
    }
  }
};

io.on("connection", (socket) => {
  console.log("User Connected: ", socket.id);
  console.log("UserID::::::::: ", socket.handshake.query.userId);

  const userId = socket.handshake.query?.userId;
  if (userId != "undefined") userSocketMap.set(userId, socket.id);

  notifyPresenceChange(userId, true);

  socket.on("is-user-online", (userId, callback) => {
    watchMap.set(socket.id, userId);
    const dataSet = new Set(userId);
    const onlineUsers = userSocketMap.has(userId);
    callback({ status: onlineUsers });
  });

  socket.on("join-room", async (roomId) => {
    socket.join(roomId);
    const clients = io.sockets.adapter.rooms;
    await redisClient.set(`activeRoom:${userId}`, roomId);
    await redisClient.hDel(`unread:${userId}`, roomId);
    console.log("Room Joined :", clients);
  });

  socket.on("typing", (roomId) => {
    socket.to(roomId).emit("display-typing", roomId);
  });

  socket.on("stop-typing", (roomId) => {
    socket.to(roomId).emit("hide-typing", roomId);
  });

  socket.on("new-user", (data) => {
    users.push(data);
    io.emit("new-user-response", users);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected: ", socket.id);
    userSocketMap.delete(userId);
    watchMap.delete(socket.id);
    notifyPresenceChange(userId, false);
    socket.disconnect();
  });
});

module.exports = { app, server, io, getReceiverSocketId };
