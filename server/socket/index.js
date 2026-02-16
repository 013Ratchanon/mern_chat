const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const MessageModel = require("../models/Message");
const UserModel = require("../models/User");

function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded.id || null;
  } catch {
    return null;
  }
}

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.BASE_URL || "*", credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    const userId = getUserIdFromToken(token);
    if (!userId) {
      return next(new Error("Authentication required"));
    }
    socket.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    const room = `user_${socket.userId}`;
    socket.join(room);

    socket.on("send_message", async (payload, callback) => {
      const { recipientId, text, file } = payload || {};
      if (!recipientId || (!text && !file)) {
        return callback?.({ error: "recipientId and text or file required" });
      }
      try {
        const doc = await MessageModel.create({
          sender: socket.userId,
          recipient: recipientId,
          text: text || "",
          file: file || "",
        });
        const message = await MessageModel.findById(doc._id)
          .populate("sender", "fullname profilePicture")
          .populate("recipient", "fullname profilePicture")
          .lean();
        const recipientRoom = `user_${recipientId}`;
        io.to(recipientRoom).emit("new_message", message);
        socket.emit("new_message", message);
        callback?.({ ok: true, message });
      } catch (err) {
        callback?.({ error: err.message || "Send failed" });
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
}

module.exports = { initSocket };
