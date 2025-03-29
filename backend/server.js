const express = require("express");
const http = require("http"); // Thêm http để tạo server
const connectDB = require("./configs/database");
const authRoutes = require("./api/auth");
const meetingRoutes = require("./api/meeting");
const messageRoutes = require("./api/messages");
const blogRoutes = require("./api/blog");
const commentRoutes = require("./api/comment");
const documentRoutes = require("./api/document");

const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app); // Tạo server HTTP

app.use(express.json());

connectDB();

const cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Hỗ trợ gửi cookie
  },
});

const meetings = {}; // Lưu danh sách người tham gia mỗi cuộc họp

io.on("connection", (socket) => {
  console.log("User connected:>>>>>>>>>>>>", socket.id);

  socket.on("join_meeting", ({ meetingId, peerId }) => {
    socket.join(meetingId);
    socket.to(meetingId).emit("user_connected", { peerId });
  });

  socket.on("start_call", ({ meetingId }) => {
    console.log("Start Call Triggered for Meeting:", meetingId); // ✅ Debug
    io.emit("meeting_started", { meetingId }); // Gửi sự kiện đến tất cả student
  });

  socket.on("leave_meeting", (meetingId) => {
    socket.leave(meetingId);
  });

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
app.use("/api/blog", blogRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/document", documentRoutes);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
