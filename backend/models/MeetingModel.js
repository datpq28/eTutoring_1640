const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["group", "private"], required: true },
    description: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor" },
    meetingLink: { type: String },
    joinedUsers: [{ type: mongoose.Schema.Types.ObjectId, refPath: "participantType" }],
    participantType: { type: String, enum: ["Student", "Tutor"] },
});

const Meeting = mongoose.model("Meeting", MeetingSchema);
module.exports = Meeting;
