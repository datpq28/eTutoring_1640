const bcrypt = require("bcryptjs");
const Student = require("../models/StudentModel");
const Tutor = require("../models/TutorStudent");
const OTP = require("../models/OtpModel");
const { sendOTP } = require("../controllers/otpService/otpService");
const jwt = require("jsonwebtoken");
const {
  sendAdminApprovalRequest,
} = require("../controllers/mailService/mailService");

const registerSendOTP = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    role,
    description,
    filed,
    blogId,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  if (role === "student") {
    const tutor = await Tutor.findOne().exec();

    if (!tutor) {
      return res.status(400).json({ error: "No tutors available" });
    }

    const student = new Student({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
      description,
      filed,
      blogId,
      tutorId: tutor._id,
      isLocked: true,
    });

    await student.save();

    tutor.studentId.push(student._id);
    await tutor.save();

    await sendOTP(email);

    setTimeout(async () => {
      try {
        const otpRecord = await OTP.findOne({ email }).exec();
        if (otpRecord && !otpRecord.verified) {
          console.log(`Deleting unverified user ${email}...`);

          if (role === "student") {
            const student = await Student.findOne({ email });
            if (student) {
              await Student.findByIdAndDelete(student._id);
              await Tutor.findByIdAndUpdate(student.tutorId, {
                $pull: { studentId: student._id },
              });
            }
          } else if (role === "tutor") {
            const tutor = await Tutor.findOne({ email });
            if (tutor) {
              await Tutor.findByIdAndDelete(tutor._id);
            }
          }

          await OTP.deleteMany({ email });
          console.log(`User ${email} deleted successfully.`);
        }
      } catch (error) {
        console.error(`Error deleting unverified user ${email}:`, error);
      }
    }, 5 * 60 * 1000);

    res
      .status(201)
      .json({ message: "Student registered successfully, OTP sent to email." });
  } else if (role === "tutor") {
    const tutor = new Tutor({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
      description,
      filed,
      blog: blogId,
      isLocked: true,
    });

    await tutor.save();

    await sendOTP(email);
    res
      .status(201)
      .json({ message: "Tutor registered successfully, OTP sent to email." });
  } else {
    res.status(400).json({ error: "Invalid role" });
  }
};

const registerVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email }).exec();

    if (!otpRecord) {
      return res.status(400).json({ error: "OTP not found" });
    }

    if (otpRecord.verified) {
      return res.status(400).json({ error: "OTP already verified" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (new Date() > otpRecord.expiry) {
      return res.status(400).json({ error: "OTP expired" });
    }

    otpRecord.verified = true;
    await otpRecord.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ error: "OTP verification failed" });
  }
};

let adminApproved = false;

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra nếu là admin và chưa được phê duyệt
  if (email === "admin" && password === "admin") {
    if (!adminApproved) {
      await sendAdminApprovalRequest();
      return res.status(403).json({
        error: "Admin login requires approval. Please check your email.",
      });
    }
  }

  // Tìm user là Student hoặc Tutor
  let user = await Student.findOne({ email }).exec();
  if (!user) {
    user = await Tutor.findOne({ email }).exec();
  }

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  if (user.isLocked) {
    return res.status(403).json({
      error: "Account is locked. Please message the training department.",
    });
  }

  // Kiểm tra mật khẩu
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  // Tạo JWT token để trả về cho người dùng
  const token = jwt.sign(
    { userId: user._id, role: user instanceof Student ? "student" : "tutor" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Token hết hạn sau 1 giờ
  );
  const role = user instanceof Student ? "student" : "tutor";

  res.status(200).json({
    message: "Login successful",
    token,
    role,
  });
};

const approveAdmin = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Token is required for approval." });
  }

  try {
    // Giải mã token để xác nhận tính hợp lệ
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Nếu token hợp lệ, phê duyệt admin
    if (decoded.email === "nguyenkhaccao1@gmail.com") {
      adminApproved = true;
      return res.status(200).json({ message: "Admin approved successfully!" });
    } else {
      return res.status(400).json({ error: "Invalid token" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to verify token" });
  }
};

module.exports = {
  registerSendOTP,
  registerVerifyOTP,
  loginUser,
  approveAdmin,
};
