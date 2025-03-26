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
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

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

app.use("/api/auth", authRoutes);
app.use("/api/meeting", meetingRoutes);
app.use("/api/messages", messageRoutes);

// 🔥 Quản lý kết nối WebSocket
const onlineUsers = {}; // Lưu danh sách user đang online

io.on("connection", (socket) => {

  // Đăng ký user vào danh sách online
  socket.on("register", ({ userId, role }) => {
    onlineUsers[userId] = { socketId: socket.id, role };
    
  });

  // Xử lý khi user ngắt kết nối
  socket.on("disconnect", () => {
    for (const userId in onlineUsers) {
      if (onlineUsers[userId].socketId === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
  });
});

// Xuất `io` để dùng trong controllers
module.exports = { app, server, io };

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
