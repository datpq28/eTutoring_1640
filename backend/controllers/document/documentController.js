const Document = require("../../models/DocumentModel");
const Tutor = require("../../models/TutorStudent");
const upload = require("../../middleware/upload");
const path = require("path"); // Import path
const fs = require("fs"); // Import fs để xử lý xóa file cũ

const createDocument = async (req, res) => {
  try {
    const { buffer, size, mimetype } = req.file;
    const { title, description, subject, uploadedBy } = req.body;
    const newDocument = new Document({
      title,
      description,
      subject,
      dataFile: buffer,
      typeFile: mimetype,
      sizeFile: size,
      uploadedBy,
    });
    await newDocument.save();
    res.status(200).json({ message: "tài liệu đã được tải lên" });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Lỗi máy chủ nội bộ" });
  }
};

// Lấy danh sách tài liệu
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "firstname lastname email");
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy tài liệu theo ID
const getDocumentById = async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await Document.findById(documentId).populate(
      "uploadedBy",
      "firstname lastname email"
    );

    if (!document) {
      return res.status(404).json({ error: "Tài liệu không tồn tại" });
    }

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { title, description, subject } = req.body;

    // Tìm tài liệu theo ID
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: "Tài liệu không tồn tại" });
    }

    // Cập nhật thông tin tài liệu
    document.title = title || document.title;
    document.description = description || document.description;
    document.subject = subject || document.subject;

    // Nếu có file mới, cập nhật lại dữ liệu file
    if (req.file) {
      const { buffer, size, mimetype } = req.file; // Nếu người dùng muốn thay đổi file

      document.dataFile = buffer; // Cập nhật file mới
      document.sizeFile = size; // Cập nhật kích thước file
      document.typeFile = mimetype; // Cập nhật loại file
    }

    // Lưu tài liệu đã chỉnh sửa
    await document.save();
    res.status(200).json({ message: "Tài liệu đã được cập nhật" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ error: "Tài liệu không tồn tại" });
    }

    // Thiết lập headers để trình duyệt hiểu đây là file tải xuống
    res.set({
      "Content-Type": document.typeFile,
      "Content-Disposition": `attachment; filename="${document.title}"`,
      "Content-Length": document.sizeFile,
    });

    res.send(document.dataFile); // Gửi dữ liệu file về client
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).send("Internal Server Error");
  }
};

// const createDocument = async (req, res) => {
//   try {
//     const { title, description, subject, uploadedBy } = req.body;

//     if (!title || !subject || !uploadedBy || !req.file) {
//       return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
//     }

//     const tutor = await Tutor.findById(uploadedBy);
//     if (!tutor) {
//       return res.status(404).json({ error: "Tutor không tồn tại" });
//     }

//     const dataFile = req.file.buffer;
//     const typeFile = req.file.mimetype;
//     const sizeFile = req.file.size;

//     const newDocument = new Document({
//       title,
//       description,
//       subject,
//       dataFile,
//       typeFile,
//       sizeFile,
//       uploadedBy,
//     });

//     await newDocument.save();
//     res
//       .status(201)
//       .json({ message: "Tài liệu đã được tải lên", document: newDocument });
//   } catch (error) {
//     res.status(500).json({ error: error?.message || "Lỗi máy chủ nội bộ" });
//   }
// };

// const editDocument = async (req, res) => {
//   try {
//     const { documentId } = req.params;
//     const { title, description, subject } = req.body;

//     const document = await Document.findById(documentId);
//     if (!document) {
//       return res.status(404).json({ error: "Tài liệu không tồn tại" });
//     }

//     // Cập nhật thông tin cơ bản
//     document.title = title || document.title;
//     document.description = description || document.description;
//     document.subject = subject || document.subject;

//     // Nếu có file mới được upload
//     if (req.file) {
//       // Xóa file cũ (nếu có)
//       if (document.fileUrl) {
//         const oldFilePath = path.join(
//           __dirname,
//           "../../uploads",
//           document.fileUrl
//         );
//         fs.unlink(oldFilePath, (err) => {
//           if (err) console.error("Không thể xóa file cũ:", err);
//         });
//       }

//       // Cập nhật file mới
//       document.fileUrl = `/uploads/${req.file.filename}`;
//       document.typeFile = req.file.mimetype;
//       document.sizeFile = req.file.size;
//     }

//     await document.save();
//     res.status(200).json({ message: "Tài liệu đã được cập nhật", document });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

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

// const downloadDocument = async (req, res) => {
//   try {
//     const { documentId } = req.params;
//     const document = await Document.findById(documentId);

//     if (!document) {
//       return res.status(404).json({ error: "Tài liệu không tồn tại" });
//     }

//     // Cập nhật đường dẫn file tuyệt đối
//     const filePath = path.join(
//       __dirname,
//       "../../uploads",
//       path.basename(document.fileUrl)
//     );

//     // Kiểm tra nếu file tồn tại
//     if (!fs.existsSync(filePath)) {
//       console.error("File không tồn tại:", filePath);
//       return res.status(404).json({ error: "File không tồn tại" });
//     }

//     res.download(filePath, document.title || "document"); // Tải file về với tên tài liệu
//   } catch (error) {
//     console.error("Lỗi khi tải xuống:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

module.exports = {
  createDocument,
  getDocuments,
  getDocumentById,
  editDocument,
  deleteDocument,
  downloadDocument,
};
