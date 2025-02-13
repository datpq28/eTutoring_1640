const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  description: String,
  studentId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  field: String,
  blog: String,
});

const Tutor = mongoose.model("Tutor", tutorSchema);
module.exports = Tutor;
