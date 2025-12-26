const express = require("express");
const router = express.Router();
const roomController = require("../controller/room.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", roomController.getAllRooms);
router.post("/", authMiddleware, roomController.createRoom);
router.put("/:id", authMiddleware, roomController.updateRoom);
router.delete("/:id", authMiddleware, roomController.deleteRoom);

module.exports = router;
