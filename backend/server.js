const express = require("express");
const connectDB = require("./configs/database");
const authRoutes = require("./api/auth");
const meetingRoutes = require("./api/meeting"); // ✅ Kiểm tra lại đường dẫn import
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

app.use(express.json());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/meeting", meetingRoutes); // ✅ Kiểm tra đường dẫn API

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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server chạy trên cổng ${PORT}`));

module.exports = { io };
