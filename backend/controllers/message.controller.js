import Message from "../models/Message.model.js";
import Room from "../models/Room.model.js";

export const getMessagesByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "রুম পাওয়া যায়নি" });
    }

    const isMember = room.members.some(
      (m) => m.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "এই রুমে আপনার অ্যাক্সেস নেই" });
    }

    const messages = await Message.find({ room: roomId, isDeleted: false })
      .populate("sender", "name avatar isOnline")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ room: roomId, isDeleted: false });

    res.status(200).json({
      success: true,
      messages: messages.reverse(),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { roomId, text, messageType = "text", fileUrl } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "রুম পাওয়া যায়নি" });
    }

    const isMember = room.members.some(
      (m) => m.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "এই রুমে আপনার অ্যাক্সেস নেই" });
    }

    const message = await Message.create({
      sender: req.user._id,
      room: roomId,
      text,
      messageType,
      fileUrl,
    });

    await Room.findByIdAndUpdate(roomId, { lastMessage: message._id });

    const populated = await message.populate("sender", "name avatar isOnline");

    res.status(201).json({ success: true, message: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: "মেসেজ পাওয়া যায়নি" });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "শুধু নিজের মেসেজ মুছতে পারবেন" });
    }

    message.isDeleted = true;
    await message.save();

    res.status(200).json({ success: true, message: "মেসেজ মুছে গেছে" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};