const express = require("express");
const connectDB = require("./configs/database");
const authRoutes = require("./api/auth");
const meetingRoutes = require("./api/meeting");
const messageRoutes = require("./api/messages");
require("dotenv").config();

const app = express();

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
