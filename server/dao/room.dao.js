const Room = require("../models/room.model");
const { populate } = require("../models/user.model");

const createRoomDao = async ({ senderId, receiverId }) => {
  try {
    const newRoom = new Room({
      participants: [senderId, receiverId],
      isUserConfirmed: false,
      isGroup: false,
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
console.log('userId ----------------:', userId);
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

module.exports = {
  createRoomDao,
  getRoomsByUserId,
};
