const { default: mongoose } = require("mongoose");

const MeetingCommentsSchema = new mongoose.Schema({
    commenterId: {type: mongoose.Schema.Types.ObjectId, required: true},
    content: String,
    createAt: { type: Date, default: Date.now },
    meetingId: {type: mongoose.Schema.Types.ObjectId, ref: "Meeting"}
})

const MeetingComments = mongoose.Model("MeetingComments", MeetingCommentsSchema);
module.exports = MeetingComments;