const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    dayOfWeek: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
});

const Meeting = mongoose.model("Meeting", MeetingSchema);
module.exports = Meeting;
