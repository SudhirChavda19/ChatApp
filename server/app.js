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
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  socket.on("create-room", ({ roomId, receiverId, userData }, callback) => {
    const receiverUserId = getReceiverSocketId(receiverId);
    socket
      .timeout(2000)
      .to(receiverUserId)
      .emit("request-to-join-room", { roomId, userData }, (err, res) => {
        console.log("Receiver acknowledged:", res);
        if (err) {
          callback({ status: false });
        }
        if (res.length > 0 && res[0].status) {
          callback({ status: true });
        } else {
          callback({ status: false });
        }
      });
  });

  socket.on(
    "request-accepted",
    ({ roomId, receiverId, userData }, callback) => {
      const receiverUserId = getReceiverSocketId(receiverId);
      socket
        .timeout(2000)
        .to(receiverUserId)
        .emit("request-accepted", { roomId, userData }, (err, res) => {
          console.log("Receiver acknowledged: ===========> ", res);
          if (err) {
            callback({ status: false });
          }
          if (res.length > 0 && res[0].status) {
            console.log("userData.id true:", userData.id);
            callback({ status: true });
          } else {
            console.log("userData.id false:", userData.id);
            callback({ status: false });
          }
        });
    }
  );

  socket.on("online-user-status", (data) => {
    
    socket.to().emit("get-online-users", Object.keys(userSocketMap));
  })


  socket.on("join-room", (roomId) => {
    console.log("roomId :", roomId);
    socket.join(roomId);
    const clients = io.sockets.adapter.rooms;
    console.log("clients :", clients);
  });

  socket.on("send-private-message", (data) => {
    console.log("private-message", data);
    // socket.join(data.roomId);
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
    delete userSocketMap[userId];
    // users = users.filter((user) => user.socketID !== socket.id);
    // console.log(users);
    //Sends the list of users to the client
    // io.emit("new-user-response", users);
    socket.disconnect();
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
