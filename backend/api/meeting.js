const express = require("express");
const router = express.Router();
const {
  createMeeting,
  getMeetingsByUser,
  joinMeeting,
  getMeetingsByTutor,
  getStudentsByTutor,
  getMeetingsByStudent,
  fetchTutors,
  fetchAllMeetings,
  editMeeting,
  deleteMeeting,
} = require("../controllers/meeting/meetingController");

router.post("/create", createMeeting);
router.get("/user/:userId/:role", getMeetingsByUser);
router.post("/join/:meetingId", joinMeeting);

router.get("/meetings/:tutorId", getMeetingsByTutor);
router.get("/meetings/student/:studentId", getMeetingsByStudent);
router.get("/students/:tutorId", getStudentsByTutor);

router.get("/tutors", fetchTutors);
router.get("/all", fetchAllMeetings);
router.put("/edit/:meetingId", editMeeting);
router.delete("/delete/:meetingId", deleteMeeting);

module.exports = router;
