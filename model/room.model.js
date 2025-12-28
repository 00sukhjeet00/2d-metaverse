const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  background: { type: String, default: "#2c3e50" },
  objects: [
    {
      type: { type: String },
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },
  ],
  maxPlayers: { type: Number, default: 50, min: 2, max: 100 },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isPrivate: { type: Boolean, default: false },
  passcode: { type: String, trim: true },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
