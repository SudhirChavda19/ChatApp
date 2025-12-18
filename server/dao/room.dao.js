const Room = require("../models/room.model");
const mongoose = require("mongoose");

const createRoomDao = async ({ senderId, receiverId }, res) => {
  try {
    const newRoom = new Room({
      participants: [senderId, receiverId],
      status: "Requested",
      isGroup: false,
      createdBy: senderId,
    });
    if (newRoom) await newRoom.save();
    return newRoom;
  } catch (error) {
    console.error("Error in createRoomDao :", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const getRoomsByUserId = async (userId, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    return await Room.find({
      participants: userId,
      $or: [
        { createdBy: userObjectId }, // if user created the room, always include
        {
          createdBy: { $ne: userId }, // if not creator
          status: { $ne: "Rejected" }, // only include if not rejected
        },
      ],
    })
      .populate("participants")
      .sort({ updatedAt: -1 });
  } catch (error) {
    console.error("Error in getRoomsByUserId Dao :", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const updateRoomStatusDao = async (roomId, status, res) => {
  try {
    return await Room.findByIdAndUpdate(
      roomId,
      { status: status ? "Confirmed" : "Rejected" },
      {
        new: true,
      }
    );
  } catch (error) {
    console.error("Error in updateRoomStatusDao Dao :", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const deleteRoomById = async (roomId, res) => {
  try {
    return await Room.findByIdAndDelete({ _id: roomId });
  } catch (error) {
    console.error("Error in deleteRoomById Dao :", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const updateRoomOnSendMessage = async (roomId, res) => {
  try {
    return await Room.findByIdAndUpdate(
      roomId,
      { updatedAt: Date.now() },
      {
        new: true,
      }
    );
  } catch (error) {
    console.error("Error in updateRoomOnSendMessage Dao :", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createRoomDao,
  getRoomsByUserId,
  updateRoomStatusDao,
  deleteRoomById,
  updateRoomOnSendMessage,
};
