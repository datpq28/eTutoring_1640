const express = require("express");
const router = express.Router();
const {
  createMeeting,
  getMeetingsByUser,
  joinMeeting,
  getMeetingsByTutor,
  getStudentsByTutor,
  getMeetingsByStudent
} = require("../controllers/meeting/meetingController");

router.post("/create", createMeeting); 
router.get("/user/:userId/:role", getMeetingsByUser);
router.post("/join/:meetingId", joinMeeting);

router.get("/meetings/:tutorId", getMeetingsByTutor);
router.get("/meetings/student/:studentId", getMeetingsByStudent);
router.get("/students/:tutorId", getStudentsByTutor);

module.exports = router;
