const Room = require("../models/room.model");

const createRoomDao = async ({ senderId, receiverId }) => {
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
    console.log("Error in createRoomDao :", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const getRoomsByUserId = async (userId) => {
  console.log("userId ----------------:", userId);
  try {
    return await Room.find({ participants: userId }).populate("participants");
  } catch (error) {
    console.log("Error in getRoomsByUserId Dao :", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const updateRoomStatusDao = async (roomId, status) => {
  console.log("status ----------------:", roomId, status);
  try {
    return await Room.findByIdAndUpdate(
      roomId,
      { status: status ? "Confirmed" : "Rejected" },
      {
        new: true,
      }
    );
  } catch (error) {
    console.log("Error in updateRoomStatusDao Dao :", error);
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
};
