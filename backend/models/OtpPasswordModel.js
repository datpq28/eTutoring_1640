const mongoose = require("mongoose");

const OtpPasswordSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  expiry: { type: Date, required: true },
  used: { type: Boolean, default: false }
});

const OtpPassword = mongoose.model("OtpPassword", OtpPasswordSchema);
module.exports = OtpPassword;
