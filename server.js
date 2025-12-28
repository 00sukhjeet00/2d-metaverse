const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./utils/db");
const { ws } = require("./utils/ws");
const userRoutes = require("./routes/user.route");
const roomRoutes = require("./routes/room.route");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust this to your client URL for better security
    methods: ["GET", "POST"],
  },
});

connectDB();
ws(io);

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api/rooms", roomRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
