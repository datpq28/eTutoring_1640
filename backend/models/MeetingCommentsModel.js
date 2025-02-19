const mongoose = require("mongoose");

const MeetingCommentsSchema = new mongoose.Schema({
    commenterId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "commenterType" },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    meetingId: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" },
    commenterType: { type: String, enum: ["student", "tutor"], required: true } 
});

const MeetingComments = mongoose.model("MeetingComments", MeetingCommentsSchema);
module.exports = MeetingComments;
