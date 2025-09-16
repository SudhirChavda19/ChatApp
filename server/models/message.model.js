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
      ref: "Room",
      required: true,
    },
  },
  { timestamps: true }
);

messageSchema.index({ roomId: 1, createdAt: -1 });

exports.Message = mongoose.model("Message", messageSchema);
