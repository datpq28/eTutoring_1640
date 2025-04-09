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
const notificationRoutes = require("./api/notification");

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
    allowedHeaders: ["Content-Type", "Authorization", "x-user-role"],
  })
);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const meetings = {};
const userSocketMap = new Map();

io.on("connection", (socket) => {
  console.log("User connected:>>>>>>>>>>>>", socket.id);

  socket.on("send_notification", ({ userId, notification }) => {
    const targetSocketId = userSocketMap.get(userId);
    if (targetSocketId) {
      io.to(targetSocketId).emit("receive_notification", notification);
      console.log(`📩 Notification sent to user ${userId}:`, notification);
    } else {
      console.log(`❌ User ${userId} is not connected.`);
    }
  });

  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);
    io.emit("receiveMessage", message);
  });

  socket.on("start_call", ({ meetingId }) => {
    console.log("Start Call Triggered for Meeting:", meetingId);
    io.emit("meeting_started", { meetingId });
  });

  socket.on("register_user", ({ userId }) => {
    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  });

  socket.on("join_room", ({ meetingId }) => {
    socket.join(meetingId);
    if (!meetings[meetingId]) {
      meetings[meetingId] = [];
    }
    if (!meetings[meetingId].includes(socket.id)) {
      meetings[meetingId].push(socket.id);
    }
    console.log(
      `User ${socket.id} joined room ${meetingId}. Users in room:`,
      meetings[meetingId]
    );
    socket.to(meetingId).emit("user_joined", { userId: socket.id });

    io.to(meetingId).emit("room_participants", {
      participants: meetings[meetingId].filter((id) => id !== socket.id),
    });
  });

  socket.on("offer", ({ userId, offer }) => {
    socket.to(userId).emit("offer", { userId: socket.id, offer });
    console.log(`📤 Sent offer from ${socket.id} to ${userId}`);
  });

  socket.on("answer", ({ userId, answer }) => {
    socket.to(userId).emit("answer", { userId: socket.id, answer });
    console.log(`📤 Sent answer from ${socket.id} to ${userId}`);
  });

  socket.on("ice_candidate", ({ userId, candidate }) => {
    socket.to(userId).emit("ice_candidate", { userId: socket.id, candidate });
    console.log(`📤 Sent ICE candidate from ${socket.id} to ${userId}`);
  });

  socket.on("send_message", ({ meetingId, sender, text }) => {
    console.log(`📨 Message in ${meetingId} from ${sender}: ${text}`);
    io.to(meetingId).emit("receive_message", { sender, text });
  });

  socket.on("leave_room", ({ meetingId }) => {
    socket.leave(meetingId);
    if (meetings[meetingId]) {
      meetings[meetingId] = meetings[meetingId].filter(
        (id) => id !== socket.id
      );
      socket.to(meetingId).emit("user_left", { userId: socket.id });
      console.log(
        `User ${socket.id} left room ${meetingId}. Remaining users:`,
        meetings[meetingId]
      );
      if (meetings[meetingId].length === 0) {
        delete meetings[meetingId];
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const roomId in meetings) {
      meetings[roomId] = meetings[roomId].filter((id) => id !== socket.id);
      io.to(roomId).emit("user_left", { userId: socket.id });
      if (meetings[roomId].length === 0) {
        delete meetings[roomId];
      }
    }
    userSocketMap.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
      }
    });
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/meeting", meetingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/document", documentRoutes);

app.use("/api/commentdocument", commentDocumentRoutes);

app.use("/api/notification", notificationRoutes);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
