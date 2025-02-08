const bcrypt = require("bcryptjs");
const Student = require("../models/StudentModel");
const Tutor = require("../models/TutorStudent");
const OTP = require("../models/OtpModel");
const { sendOTP } = require("../controllers/otpService/otpService");
const jwt = require("jsonwebtoken");

const registerSendOTP = async (req, res) => {
  const { email, password, role, description, filed, blogId } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  if (role === "student") {
    const tutor = await Tutor.findOne().exec();

    if (!tutor) {
      return res.status(400).json({ error: "No tutors available" });
    }

    const student = new Student({
      email,
      password: hashedPassword,
      description,
      filed,
      blogId,
      tutorId: tutor._id,
    });

    await student.save();

    tutor.studentId.push(student._id);
    await tutor.save();

    await sendOTP(email);

    res
      .status(201)
      .json({ message: "Student registered successfully, OTP sent to email." });
  } else if (role === "tutor") {
    const tutor = new Tutor({
      email,
      password: hashedPassword,
      description,
      filed,
      blog: blogId,
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
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  let user = await Student.findOne({ email }).exec();
  if (!user) {
    user = await Tutor.findOne({ email }).exec();
  }

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign(
    { userId: user._id, role: user instanceof Student ? "student" : "tutor" },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    message: "Login successful",
    token,
  });
};

module.exports = { registerSendOTP, registerVerifyOTP, loginUser };
