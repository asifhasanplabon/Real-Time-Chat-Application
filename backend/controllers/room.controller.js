import Room from "../models/Room.model.js";

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ members: req.user._id })
      .populate("members", "name avatar isOnline lastSeen")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { name, memberIds, roomType = "private" } = req.body;

    if (roomType === "private") {
      const existingRoom = await Room.findOne({
        roomType: "private",
        members: { $all: [req.user._id, memberIds[0]] },
      });

      if (existingRoom) {
        const populatedExisting = await existingRoom.populate("members", "name avatar isOnline lastSeen");
        return res.status(200).json({ success: true, room: populatedExisting });
      }
    }

    const allMembers = [...new Set([req.user._id.toString(), ...memberIds])];

    const room = await Room.create({
      name: roomType === "group" ? name : undefined,
      roomType,
      members: allMembers,
      createdBy: req.user._id,
    });

    const populated = await room.populate("members", "name avatar isOnline");

    res.status(201).json({ success: true, room: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId)
      .populate("members", "name avatar isOnline lastSeen")
      .populate("lastMessage");

    if (!room) {
      return res.status(404).json({ message: "রুম পাওয়া যায়নি" });
    }

    const isMember = room.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "এই রুমে আপনার অ্যাক্সেস নেই" });
    }

    res.status(200).json({ success: true, room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ message: "রুম পাওয়া যায়নি" });
    }

    if (room.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "শুধু গ্রুপ অ্যাডমিন মেম্বার যোগ করতে পারবেন" });
    }

    if (room.members.includes(userId)) {
      return res.status(400).json({ message: "এই ইউজার আগে থেকেই মেম্বার" });
    }

    room.members.push(userId);
    await room.save();

    const updated = await room.populate("members", "name avatar isOnline");
    res.status(200).json({ success: true, room: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};