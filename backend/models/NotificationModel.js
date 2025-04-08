const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    meetingId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true
    },
    tutorId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true
    },
    studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student"}
    ],
    text: { type: String, required: true
    },
    time: { type: Date, default: Date.now
    },
    isRead: { type: Boolean, default: false
    }
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
