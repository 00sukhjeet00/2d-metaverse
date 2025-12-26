const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: "avatar1" },
  position: {
    x: { type: Number, default: 400 },
    y: { type: Number, default: 300 },
  },
  currentRoom: { type: String, default: "main" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
