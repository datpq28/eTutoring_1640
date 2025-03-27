const express = require("express");
const router = express.Router();
const {
  createMeeting,
  getMeetingsByUser,
  joinMeeting,
  // getAllMeetings,
  getStudentsByTutor,
} = require("../controllers/meeting/meetingController");

router.post("/create", createMeeting);
router.get("/user/:userId/:role", getMeetingsByUser);
router.post("/join/:meetingId", joinMeeting);

// router.get("/all", getAllMeetings);
router.get("/students/:tutorId", getStudentsByTutor);

module.exports = router;
