const Comment = require("../../models/CommentModel");
const Blog = require("../../models/BlogModel");
const Tutor = require("../../models/TutorStudent");
const Student = require("../../models/StudentModel");

// Tạo bình luận mới
const createComment = async (req, res) => {
    try {
        const { blogId, authorId, authorType, content } = req.body;

        const formattedAuthorType = authorType.charAt(0).toUpperCase() + authorType.slice(1).toLowerCase();
        if (!["Student", "Tutor"].includes(formattedAuthorType)) {
            return res.status(400).json({ error: "Loại tác giả không hợp lệ" });
        }

        const authorModel = formattedAuthorType === "Tutor" ? Tutor : Student;
        const author = await authorModel.findById(authorId);
        if (!author) {
            return res.status(404).json({ error: "Tác giả không tồn tại" });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ error: "Bài blog không tồn tại" });
        }

        const newComment = new Comment({
            blogId,
            authorId,
            authorType: formattedAuthorType,
            content,
        });

        await newComment.save();
        blog.commentIds.push(newComment._id);
        await blog.save();

        res.status(201).json({ message: "Bình luận đã được tạo", comment: newComment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy tất cả bình luận của một bài blog
const getCommentsByBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const comments = await Comment.find({ blogId }).sort({ createdAt: -1 })
            .populate("authorId", "firstname lastname email");

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Chỉnh sửa bình luận
const editComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Bình luận không tồn tại" });
        }

        comment.content = content || comment.content;
        await comment.save();

        res.status(200).json({ message: "Bình luận đã được cập nhật", comment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa bình luận
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findByIdAndDelete(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Bình luận không tồn tại" });
        }

        await Blog.findByIdAndUpdate(comment.blogId, { $pull: { commentIds: commentId } });

        res.status(200).json({ message: "Bình luận đã được xóa" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createComment,
    getCommentsByBlog,
    editComment,
    deleteComment,
};
