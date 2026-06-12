import User from "../models/User.model.js";

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 1) {
      return res.status(200).json({ success: true, users: [] });
    }

    const regex = new RegExp(q.trim(), "i");

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [{ name: regex }, { email: regex }],
    })
      .select("name email avatar isOnline lastSeen")
      .limit(10);

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
