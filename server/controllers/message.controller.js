const { getUserById } = require("../dao/user.dao");
const { createMessageDao, getMessagesByRoom } = require("../dao/message.dao");
const { getReceiverSocketId, io } = require("../socket/socket");
const { updateRoomOnSendMessage } = require("../dao/room.dao");
const { redisClient } = require("../redis/redisClient");

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, roomId, message, gifUrl } = req.body;

    const newMessage = await createMessageDao({
      message,
      gifUrl,
      roomId,
      senderId,
    });

    if (newMessage) {
      io.to(roomId).emit("send-receive-message", newMessage);
      const updatedRoom = await updateRoomOnSendMessage(roomId);

      const activeRoom = await redisClient.get(`activeRoom:${receiverId}`);
      if (activeRoom && activeRoom !== roomId) {
        await redisClient.hIncrBy(`unread:${receiverId}`, roomId, 1);
      }
      if (updatedRoom) {
        const receiverUserId = getReceiverSocketId(receiverId);
        const senderUserId = getReceiverSocketId(senderId);
        io.to(senderUserId)
          .to(receiverUserId)
          .emit("updated-room", {
            updatedRoom,
            unreadCounts: await redisClient.hGetAll(`unread:${receiverId}`),
          });
      }
      return res.status(201).json({
        status: "Success",
        newMessage,
      });
    } else {
      return res.status(400).json({
        status: "Fail",
        message: "Failed to Send Message",
      });
    }
  } catch (error) {
    console.log("Error in send message controller", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const GetRoomMessages = async (req, res) => {
  try {
    const { id } = req.params;
    let { limit, page } = req.query;
    page = Number(page) || 1;
    limit = Number(limit) || 20;

    const { messages, totalPages, hasNextPage } = await getMessagesByRoom(
      id,
      limit,
      page
    );
    // if (!rooms) {
    //   return res.status(404).json({
    //     status: "Fail",
    //     message: "No Requests Found",
    //   });
    // }

    return res.status(200).json({
      status: "Success",
      message: "Messages Fetched SuccessFully",
      data: messages,
      totalPages,
      hasNextPage,
    });
  } catch (error) {
    console.log("Error in GetRoomMessages controller", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  sendMessage,
  GetRoomMessages,
};
