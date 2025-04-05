const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tokens: [{ token: { type: String } }],
  role: { type: String, enum: ["tutor", "admin"], default: "tutor" },
  description: String,
  studentId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  field: String,
  blogIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  isLocked: { type: Boolean, default: false },
});

const Tutor = mongoose.model("Tutor", tutorSchema);
module.exports = Tutor;
