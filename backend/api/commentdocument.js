const express = require('express');
const router = express.Router();
const { 
    createCommentDocument, 
    getCommentsByDocument, 
    editCommentDocument, 
    deleteCommentDocument 
} = require('../controllers/commentdocument/commentdocumentController');

// Tạo bình luận cho một tài liệu
router.post('/document', createCommentDocument);

// Lấy tất cả bình luận của một tài liệu
router.get('/document/:documentId', getCommentsByDocument);

// Chỉnh sửa bình luận của tài liệu
router.put('/document/:commentId', editCommentDocument);

// Xóa bình luận của tài liệu
router.delete('/document/:commentId', deleteCommentDocument);

module.exports = router;