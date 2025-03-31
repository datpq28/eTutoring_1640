const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload"); 
const {
    createDocument,
    getDocuments,
    getDocumentById,
    editDocument,
    deleteDocument,
    downloadDocument,
} = require('../controllers/document/documentController');

// Tạo tài liệu
router.post("/documents", upload.single("file"), createDocument);

// Lấy danh sách tài liệu
router.get('/documents', getDocuments);

// Lấy tài liệu theo ID
router.get('/documents/:documentId', getDocumentById);

// Cập nhật tài liệu
router.put("/documents/:documentId", upload.single("file"), editDocument);

// Xóa tài liệu
router.delete('/documents/:documentId', deleteDocument);

router.get("/download/:documentId", downloadDocument);


module.exports = router;
