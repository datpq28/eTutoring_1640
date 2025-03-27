const express = require('express');
const router = express.Router();
const { 
    createBlog, 
    getBlogs, 
    getBlogById, 
    deleteBlog, 
    likeBlog,
    unlikeBlog, 
    editBlog } = require('../controllers/blog/blogController');

// Tạo bài blog
router.post('/blogs', createBlog);

// Lấy danh sách blog
router.get('/blogs', getBlogs);

// Lấy bài blog theo ID
router.get('/blogs/:blogId', getBlogById);

// Sửa bài blog
router.put('/blogs/:blogId', editBlog);

// Thích bài blog
router.post('/blogs/:blogId/like', likeBlog);

router.post('/blogs/:blogId/unlike', unlikeBlog);

// Xóa bài blog
router.delete('/blogs/:blogId', deleteBlog);

module.exports = router;
