const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      minlength: 1,
      trim: true,
    },
    gifUrl: {
      type: String,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rooms",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    timestamp: {
      type: Number,
      required: true
    }
  }
);

messageSchema.index({ roomId: 1, timestamps: -1 });

module.exports = mongoose.model("Messages", messageSchema);
