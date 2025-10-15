const Message = require("../models/message.model");
const mongoose = require("mongoose");

const createMessageDao = async ({ message, gifUrl, roomId, senderId }) => {
  try {
    const roomObjectId = new mongoose.Types.ObjectId(roomId);
    const newMessage = new Message({
      message,
      gifUrl,
      roomId: roomObjectId,
      senderId,
      timestamp: Date.now(),
    });
    if (newMessage) await newMessage.save();
    return newMessage;
  } catch (error) {
    console.log("Error in createMessageDao :", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const getMessagesByRoom = async (roomId, limit, page) => {
  try {
    const skip = (page - 1) * limit;
    const messages = await Message.find({ roomId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const count = await Message.countDocuments({ roomId });
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;

    return { messages: messages.reverse(), totalPages, hasNextPage };
  } catch (error) {
    console.log("Error in getMessagesByRoom dao:", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createMessageDao,
  getMessagesByRoom,
};
