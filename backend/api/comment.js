const express = require('express');
const router = express.Router();
const { 
    createComment, 
    getCommentsByBlog, 
    editComment, 
    deleteComment 
} = require('../controllers/comment/commentController'); // Xóa replyToComment khỏi import

// Tạo bình luận cho một bài blog
router.post('/comments', createComment);

// Lấy tất cả bình luận của một bài blog
router.get('/comments/:blogId', getCommentsByBlog);

// Chỉnh sửa bình luận
router.put('/comments/:commentId', editComment);

// Xóa bình luận
router.delete('/comments/:commentId', deleteComment);

module.exports = router;
