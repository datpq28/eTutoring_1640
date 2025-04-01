const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

// Bộ lọc kiểm tra loại file
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Cho phép upload
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, Word, and PowerPoint files are allowed."
      ),
      false
    );
  }
};

// Middleware upload file
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
