const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createDocument,
  getDocuments,
  getDocumentById,
  editDocument,
  deleteDocument,
  downloadDocument,
} = require("../controllers/document/documentController");

// Tạo tài liệu
router.post("/upload", upload.single("file"), createDocument);

// Lấy danh sách tài liệu
router.get("/documents", getDocuments);

// Lấy tài liệu theo ID
router.get("/:documentId/", getDocumentById);

// Cập nhật tài liệu
router.put("/:documentId/edit", upload.single("file"), editDocument);

// Xóa tài liệu
router.delete("/:documentId/delete", deleteDocument);

//Tải tài liệu
router.get("/:documentId/download", downloadDocument);

module.exports = router;
