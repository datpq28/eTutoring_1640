const express = require("express");
const { getNotificationsByTutor, 
    getNotificationsByStudent,
    markNotificationAsRead
} = require("../controllers/notification/notificationController");

const router = express.Router();

router.get("/tutor/:tutorId", getNotificationsByTutor);
router.get("/student/:studentId", getNotificationsByStudent);
router.put("/:notificationId/read", markNotificationAsRead);

module.exports = router;
