const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const FriendSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    friend: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

FriendSchema.index({ user: 1, friend: 1 }, { unique: true });

const FriendModel = model("Friend", FriendSchema);
module.exports = FriendModel;
