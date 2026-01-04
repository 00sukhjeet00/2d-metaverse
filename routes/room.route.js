const express = require("express");
const router = express.Router();
const roomController = require("../controller/room.controller");
const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../middleware/upload.middleware");

router.get("/", roomController.getAllRooms);
router.get("/:id", roomController.getRoomById);
router.post(
  "/",
  authMiddleware,
  upload.single("backgroundImage"),
  roomController.createRoom
);
router.put(
  "/:id",
  authMiddleware,
  upload.single("backgroundImage"),
  roomController.updateRoom
);
router.delete("/:id", authMiddleware, roomController.deleteRoom);

module.exports = router;
