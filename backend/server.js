const express = require("express");
const http = require("http"); // Thêm http để tạo server
const connectDB = require("./configs/database");
const authRoutes = require("./api/auth");
const meetingRoutes = require("./api/meeting");
const messageRoutes = require("./api/messages");
const blogRoutes = require("./api/blog");
const commentRoutes = require("./api/comment");
const documentRoutes = require("./api/document");
const commentDocumentRoutes = require("./api/commentdocument");

const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app); // Tạo server HTTP


app.use(express.urlencoded({ extended: true }));
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

  //meessege meeting
  socket.on("send_message", ({ meetingId, sender, text }) => {
    console.log(`📨 Message received in ${meetingId} from ${sender}: ${text}`); // ✅ Debug
  
    io.to(meetingId).emit("receive_message", { sender, text });
  
    console.log(`📤 Server sent message to meeting ${meetingId}`); // ✅ Debug
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Phục vụ file tĩnh trong thư mục uploads
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/meeting", meetingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/commentdocument", commentDocumentRoutes);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
