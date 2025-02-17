const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
    name: {type: string, require: true},
    type: {type: string},
    description: {type: string},
    startTime: {type: Date},
    endTime: {type: Date},
    studentId: {type: mongoose.Schema.Types.ObjectId, ref: "Student"},
    tutorId: {type: mongoose.Schema.Types.ObjectId, ref: "Tutor"},
    commentId: {type: mongoose.Schema.Types.ObjectId, ref: "MeetingComments"}
})

const Meeting = mongoose.Model("Meeting", MeetingSchema);
module.exports = Meeting;