const MessageModel = require("../models/Message");

exports.getMessagesWith = async (req, res) => {
  try {
    const me = req.user._id;
    const otherId = req.query.with;
    if (!otherId) {
      return res.status(400).json({ message: "Query 'with' (userId) is required!" });
    }
    const messages = await MessageModel.find({
      $or: [
        { sender: me, recipient: otherId },
        { sender: otherId, recipient: me },
      ],
    })
      .populate("sender", "fullname profilePicture")
      .populate("recipient", "fullname profilePicture")
      .sort({ createdAt: 1 })
      .lean();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to get messages!",
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { recipient, text, file } = req.body;
    if (!recipient) {
      return res.status(400).json({ message: "recipient (userId) is required!" });
    }
    if (!text && !file) {
      return res.status(400).json({ message: "text or file is required!" });
    }
    const doc = await MessageModel.create({
      sender: senderId,
      recipient,
      text: text || "",
      file: file || "",
    });
    const populated = await MessageModel.findById(doc._id)
      .populate("sender", "fullname profilePicture")
      .populate("recipient", "fullname profilePicture")
      .lean();
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to send message!",
    });
  }
};
