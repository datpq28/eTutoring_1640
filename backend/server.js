const express = require("express");
const http = require("http"); // Import module http
const connectDB = require("./configs/database");
const authRoutes = require("./api/auth");
const meetingRoutes = require("./api/meeting");
const messageRoutes = require("./api/messages");

const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app); // 🔥 Tạo HTTP server

app.use(express.json());
connectDB();

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Người dùng kết nối:", socket.id);

  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ Người dùng đã ngắt kết nối:", socket.id);
  });
});

const usersInRoom = {};

io.on("connection", (socket) => {
  console.log("🟢 Người dùng kết nối:", socket.id);

  socket.on("join-room", ({ roomId, peerId }) => {
    socket.join(roomId);
    if (!usersInRoom[roomId]) usersInRoom[roomId] = [];
    
    usersInRoom[roomId].push(peerId);
    io.to(roomId).emit("user-joined", { users: usersInRoom[roomId] });
  });

  socket.on("leave-room", ({ roomId, peerId }) => {
    socket.leave(roomId);
    if (usersInRoom[roomId]) {
      usersInRoom[roomId] = usersInRoom[roomId].filter((id) => id !== peerId);
    }
    
    io.to(roomId).emit("user-left", { users: usersInRoom[roomId] });
  });

  socket.on("disconnect", () => {
    console.log("❌ Người dùng đã ngắt kết nối:", socket.id);
    for (const roomId in usersInRoom) {
      usersInRoom[roomId] = usersInRoom[roomId].filter((id) => id !== socket.id);
      io.to(roomId).emit("user-left", { users: usersInRoom[roomId] });
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/meeting", meetingRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
