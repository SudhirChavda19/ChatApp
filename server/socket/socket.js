const { Server } = require("socket.io");
const express = require("express");
const { createServer } = require("http");

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
    console.log("status :", status);
    if (watchList.includes(userId)) {
      console.log("userId :", userId);
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

  // socket.on("create-room", ({ roomId, receiverId, userData }, callback) => {
  //   const receiverUserId = getReceiverSocketId(receiverId);
  //   socket
  //     .timeout(2000)
  //     .to(receiverUserId)
  //     .emit("request-to-join-room", { roomId, userData });
  // });

  // socket.on(
  //   "request-accepted",
  //   ({ roomId, receiverId, userData }, callback) => {
  //     const receiverUserId = getReceiverSocketId(receiverId);
  //     socket
  //       .timeout(2000)
  //       .to(receiverUserId)
  //       .emit("request-accepted", { roomId, userData }, (err, res) => {
  //         console.log("Receiver acknowledged: ===========> ", res);
  //         if (err) {
  //           callback({ status: false });
  //         }
  //         if (res.length > 0 && res[0].status) {
  //           callback({ status: true });
  //         } else {
  //           callback({ status: false });
  //         }
  //       });
  //   }
  // );

  socket.on("online-user", (confiremedUsersId, callback) => {
    watchMap.set(socket.id, confiremedUsersId);
    const dataSet = new Set(confiremedUsersId);
    const onlineUsers = Array.from(dataSet)
      .filter((user) => userSocketMap.has(user))
      .map((user) => user);
    console.log("onlineUsers :", onlineUsers);
    callback(onlineUsers);
  });

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    const clients = io.sockets.adapter.rooms;
    console.log('Room Joined :', clients);
  });

  socket.on("send-private-message", (data) => {
    socket.to(data.roomid).emit("receive-private-message", data);
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
    userSocketMap.delete(userId);
    watchMap.delete(socket.id);
    notifyPresenceChange(userId, false);
    socket.disconnect();
  });
});

module.exports = { app, server, io, getReceiverSocketId };
