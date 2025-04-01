const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Tiêu đề tài liệu
  description: String, // Mô tả tài liệu
  subject: { type: String, required: true }, // Chủ đề tài liệu
  dataFile: { type: Buffer, required: true }, // Data
  typeFile: { type: String, required: true }, // Loại file (PDF, DOCX, PPTX, v.v.)
  sizeFile: { type: Number, required: true }, // Kích thước file (bytes)
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tutor",
    required: true,
  }, // Người tải lên (Tutor)
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "CommentDocument" }], // Danh sách bình luận
  createdAt: { type: Date, default: Date.now }, // Ngày tải lên
});

const Document = mongoose.model("Document", documentSchema);
module.exports = Document;
