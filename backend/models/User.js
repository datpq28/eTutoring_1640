const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: {type: String, required: true},
    role: { 
        type: String, 
        enum: ["student", "tutor"],
        default: "student"
    },
    otp: { type: String },
    otpExpires: { type: Date }
});

module.exports = mongoose.model("User", UserSchema);