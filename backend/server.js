const express = require("express");
const http = require("http"); // Thêm http để tạo server
const connectDB = require("./configs/database");
const authRoutes = require("./api/auth");
const meetingRoutes = require("./api/meeting");
const messageRoutes = require("./api/messages");
const blogRoutes = require("./api/blog");
const commentRoutes = require("./api/comment");
const documentRoutes = require("./api/document");
const notificationRoutes = require("./api/notification");

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
const userSocketMap = new Map();

io.on("connection", (socket) => {
  console.log("User connected:>>>>>>>>>>>>", socket.id);

  socket.on("register_user", ({ userId }) => {
    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  });

  // Gửi thông báo đến user cụ thể
  socket.on("send_notification", ({ userId, notification }) => {
    const targetSocketId = userSocketMap.get(userId); // Lấy socket ID của user
    if (targetSocketId) {
      io.to(targetSocketId).emit("receive_notification", notification); // Gửi thông báo đến user
      console.log(`📩 Notification sent to user ${userId}:`, notification);
    } else {
      console.log(`❌ User ${userId} is not connected.`);
    }
  });
  

  socket.on("start_call", ({ meetingId }) => {
    console.log("Start Call Triggered for Meeting:", meetingId); // ✅ Debug
    io.emit("meeting_started", { meetingId }); // Gửi sự kiện đến tất cả student
  });

  // Nhận tin nhắn từ client
  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);
    io.emit("receiveMessage", message); // Gửi lại tất cả client
  });

  //Meeting events
  socket.on("join_room", ({ meetingId }) => {
    console.log(`🔗 User ${socket.id} joined room: ${meetingId}`);
    socket.join(meetingId);
    socket.to(meetingId).emit("user_joined", { userId: socket.id });
  });

  socket.on("offer", ({ userId, offer }) => {
    socket.to(userId).emit("offer", { userId: socket.id, offer });
  });

  socket.on("answer", ({ userId, answer }) => {
    socket.to(userId).emit("answer", { userId: socket.id, answer });
  });

  socket.on("ice_candidate", ({ userId, candidate }) => {
    socket.to(userId).emit("ice_candidate", { userId: socket.id, candidate });
  });

  socket.on("send_message", ({ meetingId, text }) => {
    const sender = socket.id; // Use socket.id as the sender
    console.log(`📩 Message received in meeting ${meetingId} from ${sender}: ${text}`);
    io.to(meetingId).emit("receive_message", { sender, text }); // Broadcast to the room
  });

  socket.on("leave_room", ({ meetingId }) => {
    socket.to(meetingId).emit("user_left", { userId: socket.id });
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
app.use("/api/notification", notificationRoutes);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
