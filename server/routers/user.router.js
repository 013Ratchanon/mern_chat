const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { protectedRoute } = require("../middlewares/auth.middlewares");

//http://localhost:5000/api/v1/user/register
router.post("/register", userController.register);

//http://localhost:5000/api/v1/user/login
router.post("/login", userController.login);

//http://localhost:5000/api/v1/user/logout
router.post("/logout", userController.logout);
//http://localhost:5000/api/v1/user/update-profile
router.put("/update-profile", protectedRoute, userController.updateProfile);

router.get("/check", protectedRoute, userController.checkAuth);
router.get("/search", protectedRoute, userController.searchUsers);
module.exports = router;
