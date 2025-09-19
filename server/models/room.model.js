const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String, // only required for group chats
    trim: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  isConfirmed: { //receiver accept request then true
    type: Boolean,
  },
  isGroup: {
    type: Boolean,
    default: false, // false = direct chat, true = group chat
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true });

roomSchema.index({ participants: 1, updatedAt: -1 });

exports.Room = mongoose.model("Rooms", roomSchema);
