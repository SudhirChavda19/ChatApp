const { getUserById } = require("../dao/user.dao");
const admin = require("./firebaseAdmin");

const sendNotification = async (body) => {
  try {
    const { senderId, senderName, receiverId, roomId, message, gifUrl } = body;
    const receiver = await getUserById(receiverId);
    console.log('receiver?.fcmToken :', receiver?.fcmToken);
    if (receiver && receiver?.fcmToken) {
      const messagePayload = {
        notification: {
          title: senderName || "New Message",
          body: `${message}`,
        //   gifUrl
        },
        token: receiver.fcmToken,
      };

      // 3️⃣ Send push notification
      await admin.messaging().send(messagePayload);
      console.log("Notification sent to:", receiver.email);
    }
  } catch (error) {
    console.log("Error in send Notification util", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = { sendNotification };
