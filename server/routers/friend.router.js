const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friend.controller");
const { protectedRoute } = require("../middlewares/auth.middlewares");

router.get("/", protectedRoute, friendController.getMyFriends);
router.post("/", protectedRoute, friendController.addFriend);
router.get("/check/:userId", protectedRoute, friendController.checkFriends);

module.exports = router;
