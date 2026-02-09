const mongooose = require("mongoose");
const { Schema, model } = mongooose;
const UserSchema = new Schema(
  {
    fullname: { type: String, required: true, min: 4 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 4 },
  },
  { timestamps: true },
);

const UserModel = model("User", UserSchema);
module.exports = UserModel;
