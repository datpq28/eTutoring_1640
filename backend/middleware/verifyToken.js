
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];  // Kiểm tra xem token có trong header không.

  if (!token) {
    return res.status(403).json({ error: "Token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.user = decoded;  // Lưu thông tin người dùng trong request để các route tiếp theo có thể truy cập
    next();
  });
};

module.exports = { verifyToken };
