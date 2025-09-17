const express = require("express");
const { app, server } = require("./socket/socket")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser");
const connectToMongoDB = require("./db/connectMongoDB");

const authRoutes = require("./routes/auth.routes.js");

dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);
// app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("namaste World");
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
