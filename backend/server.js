const express = require("express");
const connectDB = require("./configs/database");
const authRoutes = require("./api/auth");
require("dotenv").config();

const app = express();

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
