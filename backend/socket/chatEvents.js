import Message from "../models/Message.model.js";
import Room from "../models/Room.model.js";
import User from "../models/User.model.js";

export const registerChatEvents = (io, socket) => {
  socket.on("join_room", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("join_rooms", async ({ userId }) => {
    try {
      const rooms = await Room.find({ members: userId }).select("_id");
      rooms.forEach((room) => socket.join(room._id.toString()));
      console.log(`👤 ${userId} joined ${rooms.length} rooms`);
    } catch (error) {
      console.error("join_rooms error:", error.message);
    }
  });

  socket.on("send_message", async ({ roomId, senderId, text, messageType = "text", fileUrl }) => {
    try {
      const message = await Message.create({
        sender: senderId,
        room: roomId,
        text,
        messageType,
        fileUrl,
      });

      await Room.findByIdAndUpdate(roomId, { lastMessage: message._id });

      const populated = await message.populate("sender", "name avatar isOnline");
      io.to(roomId).emit("receive_message", populated);
    } catch (error) {
      socket.emit("error", { message: "মেসেজ পাঠানো যায়নি" });
    }
  });

  socket.on("user_online", async ({ userId }) => {
    try {
      socket.data.userId = userId;
      await User.findByIdAndUpdate(userId, { isOnline: true });
      socket.broadcast.emit("presence_update", { userId, isOnline: true });
    } catch (error) {
      console.error("user_online error:", error.message);
    }
  });

  socket.on("typing_start", ({ roomId, userId, userName }) => {
    socket.to(roomId).emit("user_typing", { userId, userName });
  });

  socket.on("typing_stop", ({ roomId, userId }) => {
    socket.to(roomId).emit("user_stopped_typing", { userId });
  });

  socket.on("mark_read", async ({ messageId, userId }) => {
    try {
      await Message.findByIdAndUpdate(messageId, {
        $addToSet: { readBy: { user: userId } },
      });
      socket.broadcast.emit("message_read", { messageId, userId });
    } catch (error) {
      console.error("mark_read error:", error.message);
    }
  });

  socket.on("disconnect", async () => {
    const userId = socket.data.userId;
    if (!userId) return;

    try {
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: Date.now(),
      });
      socket.broadcast.emit("presence_update", { userId, isOnline: false });
    } catch (error) {
      console.error("disconnect error:", error.message);
    }
  });
};