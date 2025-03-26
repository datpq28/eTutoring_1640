const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // Thêm nội dung bài viết
  uploaderId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "uploaderType" },
  uploaderType: { type: String, required: true, enum: ["Student", "Tutor"] }, 
  tags: [{ type: String }], // Danh sách tag
  likes: { type: Number, default: 0 }, // Số lượt thích
  imageUrl: { type: String, default: "" }, // Ảnh bài viết
  commentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
