const MessageModel = require("../models/Message");
const UserModel = require("../models/User");
const cloudinary = require("../configs/cloudinary");
const { getReceiverSocketId, io } = require("../lib/socket");

const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const fillerdUsers = await UserModel.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(fillerdUsers);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error While getting users info",
    });
  }
};

const getMessage = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChat } = req.params;
    const messages = await MessageModel.find({
      $or: [
        {
          sender: myId,
          recipientId: userToChat,
        },
        {
          sender: userToChat,
          recipientId: myId,
        },
      ],
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error While getting messages",
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { id: recipientId } = req.params;
    if (!recipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }
    const senderId = req.user._id;
    const { text, file } = req.body;
    let fileUrl = "";
    if (file) {
      const uploadResponse = await cloudinary.uploader.upload(file);
      fileUrl = uploadResponse.secure_url;
    }
    const newMessage = await new MessageModel({
      senderId,
      recipientId,
      text,
      file: fileUrl,
    });
    await newMessage.save();
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error while sending message",
    });
  }
};
const messageController = {
  getUsersForSidebar,
  getMessage,
  sendMessage,
};

module.exports = messageController;
