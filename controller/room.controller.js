const Room = require("../model/room.model");
const asyncHandler = require("../middleware/asyncHandler");
const { activePlayers } = require("../utils/ws");
const { getBaseUrl } = require("../utils/constant");

exports.getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find().select("-passcode");

  const roomsWithCounts = rooms.map((room) => {
    // Filter active players by room ID
    const playersInRoom = Array.from(activePlayers.values()).filter(
      (p) => p.room === room._id.toString()
    );

    return {
      ...room.toObject(),
      activePlayers: playersInRoom,
      baseUrl: getBaseUrl(req),
    };
  });

  res.json(roomsWithCounts);
});

exports.createRoom = asyncHandler(async (req, res) => {
  const { name, width, height } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Room name is required");
  }

  const existingRoom = await Room.findOne({ name });
  if (existingRoom) {
    res.status(400);
    throw new Error("Room with this name already exists");
  }

  // Check if user has already created 5 rooms
  const userRoomsCount = await Room.countDocuments({
    createdBy: req.user.userId,
  });
  if (userRoomsCount >= 5) {
    res.status(400);
    throw new Error("You have reached the maximum limit of 5 rooms.");
  }

  const { isPrivate, passcode } = req.body;
  if (isPrivate === "true" && !passcode) {
    res.status(400);
    throw new Error("Passcode is required for private rooms");
  }

  let backgroundImage = req.body.backgroundImage;
  if (req.file) {
    // Construct local URL
    backgroundImage = `/public/uploads/${req.file.filename}`;
  }

  let collisionArray = [];
  let collision = req.body.collision;

  // If collision comes as string (multipart), try parse it
  if (typeof collision === "string") {
    try {
      collision = JSON.parse(collision);
    } catch (e) {
      // ignore or handle error
    }
  }

  // Convert 1D collision array to 2D if provided
  if (collision && Array.isArray(collision) && width && height) {
    const w = parseInt(width);
    const h = parseInt(height);

    if (collision.length !== w * h) {
      // Warning: length mismatch
    }

    for (let i = 0; i < h; i++) {
      const row = collision.slice(i * w, (i + 1) * w);
      collisionArray.push(row);
    }
  }

  // Handle isPrivate boolean conversion from string if coming from multipart
  const isPrivateBool = isPrivate === "true" || isPrivate === true;

  const room = new Room({
    ...req.body,
    isPrivate: isPrivateBool,
    backgroundImage,
    createdBy: req.user.userId,
    collisionArray: collisionArray.length > 0 ? collisionArray : undefined,
  });

  await room.save();
  const roomObj = room.toObject();
  delete roomObj.passcode;
  res.json({ ...roomObj, baseUrl: getBaseUrl(req) });
});

exports.getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).select("-passcode");

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  res.json({ ...room.toObject(), baseUrl: getBaseUrl(req) });
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

  // Handle updates
  let updateData = { ...req.body };

  if (req.file) {
    updateData.backgroundImage = `/public/uploads/${req.file.filename}`;
  }

  // Handle collision string parsing (multipart)
  if (typeof updateData.collision === "string") {
    try {
      updateData.collision = JSON.parse(updateData.collision);
    } catch (e) {
      // ignore
    }
  }

  // Handle 1D -> 2D collision conversion if provided
  // Note: we need width/height. If not provided in update, use existing room dimensions?
  // Use provided width/height or fallback to room's existing
  const width = updateData.width || room.width;
  const height = updateData.height || room.height;

  if (updateData.collision && Array.isArray(updateData.collision)) {
    let collisionArray = [];
    const w = parseInt(width);
    const h = parseInt(height);

    if (updateData.collision.length !== w * h) {
      // mismatch warning
    }

    for (let i = 0; i < h; i++) {
      const row = updateData.collision.slice(i * w, (i + 1) * w);
      collisionArray.push(row);
    }
    updateData.collisionArray = collisionArray;
  }

  const updatedRoom = await Room.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });
  res.json({ ...updatedRoom.toObject(), baseUrl: getBaseUrl(req) });
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
