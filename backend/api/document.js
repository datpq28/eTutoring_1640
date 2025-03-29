const express = require('express');
const router = express.Router();
const {
    createDocument,
    getDocuments,
    getDocumentById,
    editDocument,
    deleteDocument,
    addCommentToDocument
} = require('../controllers/document/documentController');

// Tạo tài liệu
router.post('/documents', createDocument);

// Lấy danh sách tài liệu
router.get('/documents', getDocuments);

// Lấy tài liệu theo ID
router.get('/documents/:documentId', getDocumentById);

// Cập nhật tài liệu
router.put('/documents/:documentId', editDocument);

// Xóa tài liệu
router.delete('/documents/:documentId', deleteDocument);

// Thêm bình luận vào tài liệu
router.post('/documents/:documentId/comments', addCommentToDocument);

module.exports = router;
