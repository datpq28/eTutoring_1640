const Document = require("../../models/DocumentModel");
const Tutor = require("../../models/TutorStudent");
const Comment = require("../../models/CommentModel");

// Tạo tài liệu
const createDocument = async (req, res) => {
    try {
        const { title, description, subject, fileUrl, typeFile, sizeFile, uploadedBy } = req.body;
    
        if (!title || !subject || !fileUrl || !uploadedBy) {
            return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
        }
    
        const tutor = await Tutor.findById(uploadedBy);
        if (!tutor) {
            return res.status(404).json({ error: "Tutor không tồn tại" });
        }
    
        const newDocument = new Document({
            title,
            description,
            subject,
            fileUrl,
            typeFile,
            sizeFile,
            uploadedBy,
        });
    
        await newDocument.save();
    
        res.status(201).json({ message: "Tài liệu đã được tạo", document: newDocument });
    } catch (error) {
        console.error("Lỗi khi tạo tài liệu:", error);
        res.status(500).json({ error: error?.message || "Lỗi máy chủ nội bộ" });
    }
    
};

// Lấy danh sách tài liệu
const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find().sort({ createdAt: -1 }).populate("uploadedBy", "firstname lastname email");
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy tài liệu theo ID
const getDocumentById = async (req, res) => {
    try {
        const { documentId } = req.params;
        const document = await Document.findById(documentId).populate("uploadedBy", "firstname lastname email");

        if (!document) {
            return res.status(404).json({ error: "Tài liệu không tồn tại" });
        }

        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật tài liệu
const editDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const { title, description, subject, fileUrl, typeFile, sizeFile } = req.body;

        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ error: "Tài liệu không tồn tại" });
        }

        document.title = title || document.title;
        document.description = description || document.description;
        document.subject = subject || document.subject;
        document.fileUrl = fileUrl || document.fileUrl;
        document.typeFile = typeFile || document.typeFile;
        document.sizeFile = sizeFile || document.sizeFile;

        await document.save();

        res.status(200).json({ message: "Tài liệu đã được cập nhật", document });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa tài liệu
const deleteDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const document = await Document.findByIdAndDelete(documentId);

        if (!document) {
            return res.status(404).json({ error: "Tài liệu không tồn tại" });
        }

        res.status(200).json({ message: "Tài liệu đã được xóa" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Thêm bình luận vào tài liệu
const addCommentToDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const { authorId, authorType, content } = req.body;

        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ error: "Tài liệu không tồn tại" });
        }

        const newComment = new Comment({
            referenceId: documentId,
            referenceType: "Document",
            authorId,
            authorType,
            content,
        });

        await newComment.save();
        document.comments.push(newComment._id);
        await document.save();

        res.status(201).json({ message: "Bình luận đã được thêm", comment: newComment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createDocument,
    getDocuments,
    getDocumentById,
    editDocument,
    deleteDocument,
    addCommentToDocument,
};
