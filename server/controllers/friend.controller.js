const FriendModel = require("../models/Friend");
const UserModel = require("../models/User");

exports.getMyFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const list = await FriendModel.find({ user: userId })
      .populate("friend", "fullname email profilePicture createdAt")
      .sort({ createdAt: -1 })
      .lean();
    const friends = list.map((item) => ({
      ...item.friend,
      _id: item.friend._id,
      id: item.friend._id.toString(),
    }));
    res.status(200).json(friends);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to get friends list!",
    });
  }
};

exports.addFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.body;
    if (!friendId) {
      return res.status(400).json({ message: "friendId is required!" });
    }
    if (userId.toString() === friendId) {
      return res.status(400).json({ message: "Cannot add yourself!" });
    }
    const other = await UserModel.findById(friendId).select("_id");
    if (!other) {
      return res.status(404).json({ message: "User not found!" });
    }
    const existing = await FriendModel.findOne({
      user: userId,
      friend: friendId,
    });
    if (existing) {
      return res.status(200).json({ message: "Already friends!", friend: other });
    }
    await FriendModel.create([
      { user: userId, friend: friendId },
      { user: friendId, friend: userId },
    ]);
    const newFriend = await UserModel.findById(friendId)
      .select("fullname email profilePicture _id createdAt")
      .lean();
    res.status(201).json({ message: "Friend added!", friend: newFriend });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to add friend!",
    });
  }
};

exports.checkFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userId: otherId } = req.params;
    const exists = await FriendModel.findOne({
      user: userId,
      friend: otherId,
    });
    res.status(200).json({ areFriends: !!exists });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to check friendship!",
    });
  }
};
