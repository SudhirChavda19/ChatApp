const { createRoomDao, getRoomsByUserId } = require("../dao/room.dao");
const { getUserById } = require("../dao/user.dao");
const Room = require("../models/room.model");
const { getReceiverSocketId, io } = require("../socket/socket");

const createRoom = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const user = await getUserById(receiverId);
    console.log("user :", user);
    if (!user) {
      return res.status(404).json({
        status: "Fail",
        message: "Requested User Not Found",
      });
    }

    const newRoom = await createRoomDao({ senderId, receiverId });

    if (newRoom) {
      const receiverUserId = getReceiverSocketId(receiverId);
      if (receiverUserId) {
        io.to(receiverUserId).emit("request-to-join-room", { user });
      }
      return res.status(201).json({
        status: "Success",
        message: "Requested User successfully",
        data: { roomId: newRoom._id },
      });
    } else {
      return res.status(400).json({
        status: "Fail",
        message: "Failed to Request User",
      });
    }
  } catch (error) {
    console.log("Error in create Room controller", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const GetRoomByUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('id :', id);

    const rooms = await getRoomsByUserId(id);
    console.log("rooms----- :", rooms);
    if (!rooms) {
      return res.status(404).json({
        status: "Fail",
        message: "No Requests Found",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Fetched Room SuccessFully",
      data: { rooms },
    });
  } catch (error) {
    console.log("Error in create Room controller", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createRoom,
  GetRoomByUser,
};
