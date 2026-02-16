const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const protectedRoute = async (req, res, next) => {
  try {
    const token =
      req.cookies?.jwt ||
      (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized-No token provided!" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized-Invalid token!" });
    }
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectedRoute middleware:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error while checking token!" });
  }
};

const authMiddlewares = { protectedRoute };
module.exports = authMiddlewares;
