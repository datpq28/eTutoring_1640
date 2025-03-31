const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tokens: [{ token: { type: String } }],
  role: { type: String, enum: ["student", "admin", "tutor"], default: "student" },
  description: String,
  field: String,
  blogIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor" },
  isLocked: { type: Boolean, default: false }
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
