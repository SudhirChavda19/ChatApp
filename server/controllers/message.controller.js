const { getUserById } = require("../dao/user.dao");
const { createMessageDao, getMessagesByRoom } = require("../dao/message.dao");
const { getReceiverSocketId, io } = require("../socket/socket");
const { updateRoomOnSendMessage } = require("../dao/room.dao");
const { redisClient } = require("../redis/redisClient");
const { sendNotification } = require("../utils/sendNotification");

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, roomId, message, gifUrl } = req.body;
    const receiverUserId = getReceiverSocketId(receiverId);
    const senderUserId = getReceiverSocketId(senderId);

    const newMessage = await createMessageDao({
      message,
      gifUrl,
      roomId,
      senderId,
    }, res);

    if (newMessage) {
      io.to(roomId).emit("send-receive-message", newMessage);
      const updatedRoom = await updateRoomOnSendMessage(roomId, res);

      const activeRoom = await redisClient.get(`activeRoom:${receiverId}`);
      if (activeRoom && activeRoom !== roomId) {
        await sendNotification(req.body);
        await redisClient.hIncrBy(`unread:${receiverId}`, roomId, 1);
      }
      if (activeRoom && activeRoom === roomId && !receiverUserId) {
        await sendNotification(req.body);
      }
      if (updatedRoom) {
        io.to(senderUserId)
          .to(receiverUserId)
          .emit("updated-room", {
            senderId,
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
      page,
      res
    );

    return res.status(200).json({
      status: "Success",
      message: "Messages Fetched SuccessFully",
      data: { roomId: id, messages, totalPages, page, hasNextPage },
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
