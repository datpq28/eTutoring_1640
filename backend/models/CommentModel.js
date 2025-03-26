const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true }, // ID của bài blog
  authorId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "authorType" }, // Người bình luận
  authorType: { type: String, required: true, enum: ["Student", "Tutor"] }, // Loại người dùng (Student hoặc Tutor)
  content: { type: String, required: true }, // Nội dung bình luận
  createdAt: { type: Date, default: Date.now },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }] // Bình luận trả lời
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
