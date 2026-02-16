const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
require("dotenv").config();
const secret = process.env.SECRET_KEY;
const node_mode = process.env.node_mode;
const cloudinary = require("../configs/cloudinary");

exports.register = async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res.status(400).send({
      message: "Please Provide All Required!",
    });
  }
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).send({
      message: "This Email is already existed!",
    });
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await UserModel.create({
      fullname,
      email,
      password: hashedPassword,
    });
    //Auto login after registration
    jwt.sign(
      { email, id: user._id },
      secret,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "Internal Server Error: Authentication failed!" });
        }
        res.cookie("jwt", token, {
          maxAge: 24 * 60 * 60 * 1000, //MS
          httpOnly: true, //XSS Attacks
          sameSite: "strict", //CSRF attacks
          secure: node_mode !== "development",
        });
        res.status(201).send({
          message: "User registered and logged in successfully!",
          id: user._id,
          email,
          accessToken: token,
        });
      },
    );
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while registering a new user!",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({
      message: "Please Provide Email and Password!",
    });
  }
  try {
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) {
      return res.status(404).send({ message: "User not found!" });
    }
    const isPasswordMatched = bcrypt.compareSync(password, userDoc.password);
    if (!isPasswordMatched) {
      return res.status(401).send({ message: "Invalid Credentails" });
    }
    //Login Successfully
    jwt.sign(
      { email, id: userDoc._id },
      secret,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "Internal Server Error: Authentication failed!" });
        }
        res.cookie("jwt", token, {
          maxAge: 24 * 60 * 60 * 1000, //MS
          httpOnly: true,
          sameSite: "strict", //CSRF attacks
          secure: node_mode !== "development",
        });
        //token generation
        res.send({
          message: "User logged in Successfully!",
          id: userDoc._id,
          email,
          accessToken: token,
        });
      },
    );
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some errors occurred while logging in user!",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.send({ message: " logged out successfully!" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Some errors occurred while logging out user!",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullname, profilePicture } = req.body;
    const userId = req.user._id;

    if (!fullname && !profilePicture) {
      return res.status(200).json({
        message: "Nothing to update!",
      });
    }

    // Update both fullname and profilePicture with Cloudinary upload
    if (fullname && profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      if (!uploadResponse) {
        return res
          .status(500)
          .json({ message: "Error while uploading profile picture!" });
      }
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { fullname: fullname, profilePicture: uploadResponse.secure_url },
        { new: true },
      );
      if (!updatedUser) {
        return res
          .status(500)
          .json({ message: "Error while update user profile!" });
      }
      return res.status(200).json({
        message: "User Profile Updated Successfully!",
        user: updatedUser,
      });
    }

    // Update only profilePicture
    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      if (!uploadResponse) {
        return res
          .status(500)
          .json({ message: "Error while uploading profile picture!" });
      }
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { profilePicture: uploadResponse.secure_url },
        { new: true },
      );
      if (!updatedUser) {
        return res
          .status(500)
          .json({ message: "Error while update user profile!" });
      }
      return res.status(200).json({
        message: "User Profile Updated Successfully!",
        user: updatedUser,
      });
    }

    // Update only fullname
    if (fullname) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { fullname: fullname },
        { new: true },
      );
      if (!updatedUser) {
        return res
          .status(500)
          .json({ message: "Error while update user profile!" });
      }
      return res.status(200).json({
        message: "User Profile Updated Successfully!",
        user: updatedUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "Some errors occurred while updating user profile!",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({
      message: "Some errors occurred while checking user authentication!",
    });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const me = req.user._id;
    const q = (req.query.q || "").trim();
    if (!q) {
      return res.status(200).json([]);
    }
    const users = await UserModel.find({
      _id: { $ne: me },
      $or: [
        { email: new RegExp(q, "i") },
        { fullname: new RegExp(q, "i") },
      ],
    })
      .select("fullname email profilePicture _id createdAt")
      .limit(20)
      .lean();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Search failed!",
    });
  }
};
