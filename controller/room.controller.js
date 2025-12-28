const Room = require("../model/room.model");
const asyncHandler = require("../middleware/asyncHandler");
const { activePlayers } = require("../utils/ws");

exports.getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find();

  const roomsWithCounts = rooms.map((room) => {
    // Filter active players by room ID
    const playersInRoom = Array.from(activePlayers.values()).filter(
      (p) => p.room === room._id.toString()
    );

    return {
      ...room.toObject(),
      activePlayers: playersInRoom,
    };
  });

  res.json(roomsWithCounts);
});

exports.createRoom = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Room name is required");
  }

  const existingRoom = await Room.findOne({ name });
  if (existingRoom) {
    res.status(400);
    throw new Error("Room with this name already exists");
  }

  const room = new Room({ ...req.body, createdBy: req.user.userId });
  await room.save();
  res.json(room);
});

exports.updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  if (room.createdBy.toString() !== req.user.userId) {
    res.status(403);
    throw new Error("User not authorized to update this room");
  }

  const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json(updatedRoom);
});

exports.deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  if (room.createdBy.toString() !== req.user.userId) {
    res.status(403);
    throw new Error("User not authorized to delete this room");
  }

  await room.deleteOne();
  res.json({ message: "Room removed" });
});
