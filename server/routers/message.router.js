const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { protectedRoute } = require("../middlewares/auth.middlewares");

router.get("/users", protectedRoute, messageController.getUsersForSidebar);

router.get("/:id", protectedRoute, messageController.getMessage);

router.post("/send/:id", protectedRoute, messageController.sendMessage);

module.exports = router;
