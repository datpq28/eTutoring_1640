const nodemailer = require("nodemailer");
const OTP = require("../../models/OtpModel");
const crypto = require("crypto");
const OtpPassword = require("../../models/OtpPasswordModel");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOTP = async (email) => {
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  const otpRecord = new OTP({
    email,
    otp,
    expiry: otpExpires,
  });

  await otpRecord.save();

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

const sendOTPPass = async (email) => {
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  const otpRecord = new OtpPassword({
    email,
    otp,
    expiry: otpExpires,
    used: false,
  });

  await otpRecord.save();

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "OTP for password reset",
    text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP, sendOTPPass };
