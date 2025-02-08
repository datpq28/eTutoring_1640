const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  description: String,
  field: String,
  blogId: String,
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor" },
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
