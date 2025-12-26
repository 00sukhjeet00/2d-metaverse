const User = require("../model/user.model");

exports.ws = (io) => {
  const activePlayers = new Map();

  io.on("connection", (socket) => {
    console.log("New player connected: ", socket.id);
    socket.on("join", async (data) => {
      const { userId, room } = data;
      const user = await User.findById(userId);
      if (!user) return;
      socket.join(room);
      socket.userId = userId;
      socket.currentRoom = room;

      activePlayers.set(socket.id, {
        userId,
        room,
        avatar: user.avatar,
        position: user.position,
      });

      const playersInRoom = Array.from(activePlayers.values()).filter(
        (player) => player.room === room
      );
      socket.emit("currentPlayer", playersInRoom);
    });

    socket.on("move", async (data) => {
      const player = activePlayers.get(socket.id);
      if (!player) return;
      await User.findByIdAndUpdate(socket.userId, { position: data.position });

      socket.to(player.room).emit("playerMoved", {
        id: socket.userId,
        position: data.position,
      });
    });

    socket.on("chatMessage", (data) => {
      const player = activePlayers.get(socket.id);
      if (!player) return;

      io.to(player.room).emit("chatMessage", {
        id: socket.userId,
        message: data.message,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      console.log("Player disconnected: ", socket.id);
      activePlayers.delete(socket.id);
      socket.leave(socket.currentRoom);
    });
  });
};
