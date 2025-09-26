const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String, // only required for group chats
      trim: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
    ],
    status: {
      //receiver accept request then true
      type: String,
      enum: ['Requested', 'Rejected', 'Confirmed'],
      default: "Requested"
    },
    isGroup: {
      type: Boolean, // false = direct chat, true = group chat
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

roomSchema.index({ participants: 1, updatedAt: -1 });

module.exports = mongoose.model("Rooms", roomSchema);
