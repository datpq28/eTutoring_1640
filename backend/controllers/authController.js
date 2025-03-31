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
    await Student.findByIdAndUpdate(student._id, { role });

    console.log("Student saved with role:", role);

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

let adminApprovalTokens = {};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const deviceId = req.headers["user-agent"];

  let user = await Student.findOne({ email }).exec() || await Tutor.findOne({ email }).exec();

  if (!user) {
      return res.status(400).json({ error: "User not found" });
  }

  if (user.isLocked) {
      return res.status(403).json({ error: "Account is locked. Please contact support." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
  }

  const role = user instanceof Student ? "student" : "tutor";

  // ✅ Admin Login Verification
  // if (email === "nguyenkhaccao1@gmail.com") {
  //     // Generate a unique token for this login attempt
  //     const adminToken = jwt.sign(
  //         { email: email, loginTime: Date.now() },
  //         process.env.JWT_SECRET,
  //         { expiresIn: "10m" } // Token expires in 10 minutes (adjust as needed)
  //     );

  //     // Store the token (you might want to use a more persistent storage in production)
  //     adminApprovalTokens[email] = adminToken;

  //     // Send the approval email
  //     await sendAdminApprovalRequest(email, adminToken);

  //     return res.status(200).json({
  //         message: "Admin login pending approval. Check your email.",
  //         pendingApproval: true,
  //     });
  // }

  // ✅ Normal User Login Flow (Student or Tutor)
  if (user.tokens.some(t => t.deviceId !== deviceId)) {
      user.tokens = user.tokens.filter(t => t.deviceId === deviceId);
  }

  const token = jwt.sign({ userId: user._id, role: role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  user.tokens.push({ token, deviceId });
  await user.save();

  res.status(200).json({
      message: "Login successful",
      token,
      role,
      userId: user._id,
  });
};



const logoutUser = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await Student.findOne({ _id: decoded.userId, "tokens.token": token }) ||
               await Tutor.findOne({ _id: decoded.userId, "tokens.token": token });

    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    user.tokens = user.tokens.filter(t => t.token !== token);
    await user.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const logoutAllSessions = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res
      .status(200)
      .json({ message: "Logged out from all devices successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to logout from all devices" });
  }
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Received Token:", token); // Kiểm tra token có nhận hay không

    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Kiểm tra nội dung token

    let user =
      (await Student.findOne({ _id: decoded.userId, "tokens.token": token })) ||
      (await Tutor.findOne({ _id: decoded.userId, "tokens.token": token }));

    if (!user) {
      return res.status(401).json({ error: "User not found or token invalid" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Please authenticate" });
  }
};



const approveAdmin = async (req, res) => {
  const { token } = req.query;

  if (!token) {
      return res.status(400).json({ error: "Token is required for approval." });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { email, loginTime } = decoded;

      // ✅ Verify the token and check if it matches the stored token
      if (adminApprovalTokens[email] === token) {
          delete adminApprovalTokens[email]; // Remove the token after successful approval

          // ✅ Generate a final login token for the admin
          const finalToken = jwt.sign(
              { userId: "admin", role: "admin" }, // You might want to store admin ID somewhere
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
          );

          return res.status(200).json({
              message: "Admin approved successfully!",
              token: finalToken, // Send the final token
              role: "admin",
          });
      } else {
          return res.status(400).json({ error: "Invalid or expired token" });
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

const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Tìm người dùng theo email
    let user = await Student.findOne({ email }).exec();
    let role = "student";

    if (!user) {
      user = await Tutor.findOne({ email }).exec();
      role = "tutor";
    }

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Nếu là Student, cũng cần xóa họ khỏi danh sách của Tutor
    if (role === "student") {
      await Tutor.findByIdAndUpdate(user.tutorId, {
        $pull: { studentId: user._id },
      });
      await Student.findByIdAndDelete(user._id);
    } else {
      await Tutor.findByIdAndDelete(user._id);
    }

    // Xóa bất kỳ OTP nào liên quan đến người dùng
    await OTP.deleteMany({ email });
    await OtpPassword.deleteMany({ email });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
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
  deleteUser,
  logoutUser,
};
