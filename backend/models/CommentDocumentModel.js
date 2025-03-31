const mongoose = require("mongoose");

const commentDocumentSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true }, // ID tài liệu
  authorId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "authorType" }, // Người bình luận
  authorType: { type: String, required: true, enum: ["Student", "Tutor"] }, // Loại người dùng (Student hoặc Tutor)
  content: { type: String, required: true }, // Nội dung bình luận
  createdAt: { type: Date, default: Date.now },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "CommentDocument" }] // Bình luận trả lời
});

const CommentDocument = mongoose.model("CommentDocument", commentDocumentSchema);
module.exports = CommentDocument;
