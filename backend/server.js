const express = require("express");
const connectDB = require("./configs/database");
const authRoutes = require("./api/auth");
const meetingRoutes = require("./api/meeting");
require("dotenv").config();

const app = express();

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/meeting", meetingRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
