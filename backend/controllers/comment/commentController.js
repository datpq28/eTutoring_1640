const Comment = require("../../models/CommentModel");
const Blog = require("../../models/BlogModel");
const Tutor = require("../../models/TutorStudent");
const Student = require("../../models/StudentModel");

// Tạo bình luận mới
const createComment = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { blogId, authorId, authorType, content } = req.body;

        const formattedAuthorType = authorType.charAt(0).toUpperCase() + authorType.slice(1).toLowerCase();
        console.log("Formatted authorType:", formattedAuthorType);

        if (!["Student", "Tutor"].includes(formattedAuthorType)) {
            console.error("Loại tác giả không hợp lệ:", authorType);
            return res.status(400).json({ error: "Loại tác giả không hợp lệ" });
        }

        const authorModel = formattedAuthorType === "Tutor" ? Tutor : Student;
        const author = await authorModel.findById(authorId);
        console.log("Author found:", author);

        if (!author) {
            console.error("Tác giả không tồn tại:", authorId);
            return res.status(404).json({ error: "Tác giả không tồn tại" });
        }

        const blog = await Blog.findById(blogId);
        console.log("Blog found:", blog);

        if (!blog) {
            console.error("Bài blog không tồn tại:", blogId);
            return res.status(404).json({ error: "Bài blog không tồn tại" });
        }

        const newComment = new Comment({
            blogId,
            authorId,
            authorType: formattedAuthorType,
            content,
        });

        await newComment.save();
        console.log("New comment saved:", newComment);

        blog.commentIds.push(newComment._id);
        await blog.save();
        console.log("Comment added to blog:", blogId);

        res.status(201).json({ message: "Bình luận đã được tạo", comment: newComment });
    } catch (error) {
        console.error("Lỗi khi tạo bình luận:", error);
        res.status(500).json({ error: error.message });
    }
};

// Lấy tất cả bình luận của một bài blog
const getCommentsByBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        console.log("Fetching comments for blog:", blogId);

        const comments = await Comment.find({ blogId }).sort({ createdAt: -1 })
            .populate("authorId", "firstname lastname email");

        console.log("Comments found:", comments.length);
        res.status(200).json(comments);
    } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
        res.status(500).json({ error: error.message });
    }
};

// Chỉnh sửa bình luận
const editComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        console.log("Editing comment:", commentId, "New content:", content);

        const comment = await Comment.findById(commentId);
        if (!comment) {
            console.error("Bình luận không tồn tại:", commentId);
            return res.status(404).json({ error: "Bình luận không tồn tại" });
        }

        comment.content = content || comment.content;
        await comment.save();
        console.log("Comment updated:", comment);

        res.status(200).json({ message: "Bình luận đã được cập nhật", comment });
    } catch (error) {
        console.error("Lỗi khi chỉnh sửa bình luận:", error);
        res.status(500).json({ error: error.message });
    }
};

// Xóa bình luận
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        console.log("Deleting comment:", commentId);

        const comment = await Comment.findByIdAndDelete(commentId);
        if (!comment) {
            console.error("Bình luận không tồn tại:", commentId);
            return res.status(404).json({ error: "Bình luận không tồn tại" });
        }

        await Blog.findByIdAndUpdate(comment.blogId, { $pull: { commentIds: commentId } });
        console.log("Comment removed from blog:", comment.blogId);

        res.status(200).json({ message: "Bình luận đã được xóa" });
    } catch (error) {
        console.error("Lỗi khi xóa bình luận:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createComment,
    getCommentsByBlog,
    editComment,
    deleteComment,
};
