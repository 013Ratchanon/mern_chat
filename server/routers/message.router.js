const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { protectedRoute } = require("../middlewares/auth.middlewares");

router.get("/", protectedRoute, messageController.getMessagesWith);
router.post("/", protectedRoute, messageController.sendMessage);

module.exports = router;
