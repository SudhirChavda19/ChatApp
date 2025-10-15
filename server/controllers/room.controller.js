const { createRoomDao, getRoomsByUserId, updateRoomStatusDao, deleteRoomById } = require("../dao/room.dao");
const { getUserById } = require("../dao/user.dao");
const Room = require("../models/room.model");
const { redisClient } = require("../redis/redisClient");
const { getReceiverSocketId, io } = require("../socket/socket");

const createRoom = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const user = await getUserById(receiverId);
    if (!user) {
      return res.status(404).json({
        status: "Fail",
        message: "Requested User Not Found",
      });
    }

    const newRoom = await createRoomDao({ senderId, receiverId });

    if (newRoom) {
      const receiverUserId = getReceiverSocketId(receiverId);
      const senderUserId = getReceiverSocketId(senderId);
      if (receiverUserId) {
        io.to(receiverUserId).emit("request-to-join-room", { newRoom });
      }
      if (senderUserId) {
        io.to(senderUserId).emit("request-to-join-room", { newRoom });
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

    const rooms = await getRoomsByUserId(id);

    const unreadData = await redisClient.hGetAll(`unread:${id}`);
    console.log('unreadData :', unreadData);
    // convert all values to numbers
    const unreadCounts = Object.fromEntries(
      Object.entries(unreadData).map(([roomId, count]) => [roomId, Number(count)])
    );

    return res.status(200).json({
      status: "Success",
      message: "Fetched Room SuccessFully",
      data: {rooms, unreadCounts},
    });
  } catch (error) {
    console.log("Error in create Room controller", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, senderId } = req.body;

    const room = await updateRoomStatusDao(id, status);
    if (!room) {
      return res.status(400).json({
        status: "Fail",
        message: "Issue while update room status",
      });
    } else {
        const receiverUserId = getReceiverSocketId(senderId);
        if(receiverUserId) io.to(receiverUserId).emit("request-accept-reject", { room });
        
        return res.status(201).json({
            status: "Success",
            message: "Room Status updated successfully",
            data: room,
        });
    }
  } catch (error) {
    console.log("Error in updateRoomStatus controller", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const removeRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await deleteRoomById(id);
     if (!room) {
      console.log("error", "Data Not Found");
      return res.status(404).json({
        status: "Fail",
        message: "Data Not Found",
      });
    }
    return res.status(201).json({
      status: "Success",
      message: "Room Deleted Successfully",
    });
  } catch (error) {
    console.log("Error in removeRoom controller", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createRoom,
  GetRoomByUser,
  updateRoomStatus,
  removeRoom
};
