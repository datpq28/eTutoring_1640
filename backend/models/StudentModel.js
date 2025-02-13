const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  description: String,
  field: String,
  blogIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor" },
  isLocked: { type: Boolean, default: false }
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
