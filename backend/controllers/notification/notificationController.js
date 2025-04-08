const Meeting = require("../../models/MeetingModel");
const Tutor = require("../../models/TutorStudent");
const Student = require("../../models/StudentModel");

const Notification = require("../../models/NotificationModel");

const getNotificationsByTutor = async (req, res) => {
    try {
        const { tutorId } = req.params;

        if (!tutorId) {
            return res.status(400).json({ error: "Tutor ID is required" });
        }

        const notifications = await Notification.find({ tutorId }).sort({ time: -1 });
        const unreadCount = await Notification.countDocuments({ tutorId, isRead: false });

        res.status(200).json({ notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getNotificationsByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId) {
            return res.status(400).json({ error: "Student ID is required" });
        }

        const notifications = await Notification.find({ studentIds: studentId }).sort({ time: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        if (!notificationId) {
            return res.status(400).json({ error: "Notification ID is required" });
        }

        await Notification.findByIdAndUpdate(notificationId, { isRead: true });

        res.status(200).json({ message: "Notification has been marked as read" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
     getNotificationsByTutor, 
     getNotificationsByStudent,
     markNotificationAsRead
};