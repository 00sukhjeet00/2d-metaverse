const User = require("../model/user.model");

const activePlayers = new Map();

exports.activePlayers = activePlayers;

exports.ws = (io) => {
  io.on("connection", (socket) => {
    console.log("New player connected: ", socket.id);
    socket.on("join", async (data) => {
      const { userId, room } = data;
      console.log(`User ${userId} attempting to join room ${room}`);

      const user = await User.findById(userId);
      if (!user) {
        console.log(`User ${userId} not found in database`);
        return;
      }

      socket.join(room);
      socket.userId = userId;
      socket.currentRoom = room;

      const playerData = {
        id: socket.id, // Use socket.id instead of userId to allow multi-tabs
        userId,
        room,
        username: user.username,
        avatar: user.avatar,
        position: {
          x: (user.position?.x || 400) + (Math.random() - 0.5) * 60,
          y: (user.position?.y || 300) + (Math.random() - 0.5) * 60,
        },
      };

      activePlayers.set(socket.id, playerData);
      console.log(`Player ${socket.id} (User: ${userId}) joined room ${room}`);

      // Broadcast to others in the room
      socket.to(room).emit("playerJoined", playerData);

      // Send current players to the new joiner (excluding themselves)
      const playersInRoom = Array.from(activePlayers.values()).filter(
        (player) => player.room === room && player.id !== socket.id
      );

      console.log(
        `Sending ${playersInRoom.length} existing players to new joiner`
      );
      socket.emit("currentPlayer", playersInRoom);
    });

    socket.on("move", async (data) => {
      const player = activePlayers.get(socket.id);
      if (!player) return;

      player.position = data.position; // Update memory
      await User.findByIdAndUpdate(socket.userId, { position: data.position });

      socket.to(player.room).emit("playerMoved", {
        id: socket.id, // Use socket.id to match the 'playerJoined' id
        position: data.position,
      });
    });

    socket.on("chatMessage", (data) => {
      const player = activePlayers.get(socket.id);
      if (!player) return;

      console.log(
        `Chat message from ${player.username} in ${player.room}: ${data.message}`
      );
      io.to(player.room).emit("chatMessage", {
        id: socket.id,
        username: player.username,
        message: data.message,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      const player = activePlayers.get(socket.id);
      if (player) {
        console.log(
          `Player ${socket.id} (User: ${player.userId}) disconnected`
        );
        socket.to(player.room).emit("playerLeft", socket.id);
        activePlayers.delete(socket.id);
      }
    });
  });
};
