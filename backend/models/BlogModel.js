const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  uploaderId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "uploaderType" },
  uploaderType: { type: String, required: true, enum: ["Student", "Tutor"] }, 
  commentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
