const express = require("express");
const http = require("http"); // Thêm http để tạo server
const connectDB = require("./configs/database");
const authRoutes = require("./api/auth");
const meetingRoutes = require("./api/meeting");
const messageRoutes = require("./api/messages");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app); // Tạo server HTTP

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
  console.log("User connected:", socket.id);

  // Nhận tin nhắn từ client
  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);
    io.emit("receiveMessage", message); // Gửi lại tất cả client
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/meeting", meetingRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
