const bcrypt = require("bcryptjs");
const Student = require("../models/StudentModel");
const Tutor = require("../models/TutorStudent");
const OTP = require("../models/OtpModel");
const OtpPassword = require("../models/OtpPasswordModel");
const {
  sendOTP,
  sendOTPPass,
} = require("../controllers/otpService/otpService");
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

  // Xác định vai trò của người dùng
  const role = user instanceof Student ? "student" : "tutor";

  // Tạo JWT token để trả về cho người dùng
  const token = jwt.sign(
    { userId: user._id, role: role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Token hết hạn sau 1 giờ
  );

  // Trả về thông tin cần thiết bao gồm cả userId
  res.status(200).json({
    message: "Login successful",
    token,
    role,
    userId: user._id, // ✅ Thêm userId vào response
  });
};

module.exports = loginUser;

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

const forgotPasswordSendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    let user =
      (await Student.findOne({ email }).exec()) ||
      (await Tutor.findOne({ email }).exec());
    if (!user) return res.status(400).json({ error: "User not found" });
    await OtpPassword.deleteMany({ email });
    await sendOTPPass(email);
    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OtpPassword.findOne({ email }).exec();

    if (
      !otpRecord ||
      otpRecord.used ||
      otpRecord.otp !== otp ||
      new Date() > otpRecord.expiry
    ) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    otpRecord.used = true;
    await otpRecord.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "OTP verification failed" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find the OTP record by email
    const otpRecord = await OtpPassword.findOne({ email }).exec();

    // Check if the OTP record exists, is used, and is valid (not expired)
    if (!otpRecord || !otpRecord.used || new Date() > otpRecord.expiry) {
      return res.status(400).json({ error: "OTP not verified or expired" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password for the user (Student or Tutor)
    let user =
      (await Student.findOneAndUpdate(
        { email },
        { password: hashedPassword }
      )) ||
      (await Tutor.findOneAndUpdate({ email }, { password: hashedPassword }));

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Return success response
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ error: "Password update failed" });
  }
};

module.exports = {
  registerSendOTP,
  registerVerifyOTP,
  loginUser,
  approveAdmin,
  forgotPasswordSendOTP,
  verifyOtp,
  updatePassword,
};
