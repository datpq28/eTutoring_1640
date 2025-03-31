const CommentDocument = require("../../models/CommentDocumentModel");
const Document = require("../../models/DocumentModel");
const Tutor = require("../../models/TutorStudent");
const Student = require("../../models/StudentModel");

// Tạo bình luận mới cho tài liệu
const createCommentDocument = async (req, res) => {
    try {
        const { documentId, authorId, authorType, content } = req.body;
        const formattedAuthorType = authorType.charAt(0).toUpperCase() + authorType.slice(1).toLowerCase();

        if (!["Student", "Tutor"].includes(formattedAuthorType)) {
            return res.status(400).json({ error: "Loại tác giả không hợp lệ" });
        }

        const authorModel = formattedAuthorType === "Tutor" ? Tutor : Student;
        const author = await authorModel.findById(authorId);
        if (!author) {
            return res.status(404).json({ error: "Tác giả không tồn tại" });
        }

        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ error: "Tài liệu không tồn tại" });
        }

        const newComment = new CommentDocument({
            documentId,
            authorId,
            authorType: formattedAuthorType,
            content,
        });

        await newComment.save();
        document.comments.push(newComment._id);
        await document.save();

        res.status(201).json({ message: "Bình luận đã được tạo", comment: newComment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy tất cả bình luận của một tài liệu
const getCommentsByDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const comments = await CommentDocument.find({ documentId }).sort({ createdAt: -1 })
            .populate("authorId", "firstname lastname email");
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Chỉnh sửa bình luận
const editCommentDocument = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        const comment = await CommentDocument.findById(commentId);
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
const deleteCommentDocument = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await CommentDocument.findByIdAndDelete(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Bình luận không tồn tại" });
        }

        await Document.findByIdAndUpdate(comment.documentId, { $pull: { comments: commentId } });
        res.status(200).json({ message: "Bình luận đã được xóa" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createCommentDocument,
    getCommentsByDocument,
    editCommentDocument,
    deleteCommentDocument,
};
