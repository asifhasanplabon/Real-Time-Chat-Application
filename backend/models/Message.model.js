import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    text: {
      type: String,
      trim: true,
      maxlength: [2000, "মেসেজ সর্বোচ্চ ২০০০ অক্ষরের হতে পারবে"],
    },

    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },

    fileUrl: {
      type: String,
      default: "",
    },

    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Fast message fetching per room
messageSchema.index({ room: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;