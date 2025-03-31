const multer = require("multer");
const path = require("path");

// Cấu hình lưu file trên server (hoặc có thể upload lên cloud như AWS S3)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Lưu file vào thư mục uploads/
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file để tránh trùng
    }
});

// Chỉ chấp nhận một số loại file
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png",
        "image/jpeg",
        "image/jpg"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF, DOCX, PNG, JPG, and JPEG files are allowed!"), false);
    }
};

// Middleware xử lý upload file
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn file 10MB
    fileFilter: fileFilter
});

module.exports = upload;
