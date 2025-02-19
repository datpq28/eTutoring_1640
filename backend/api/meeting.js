const express = require("express");

// Import controller functions
const {
  createMeeting,
  getMeetingsByUser,
  joinMeeting,
  getCommentsForMeeting,
  addCommentToMeeting,
} = require("../controllers/meeting/meetingController");

const router = express.Router();

router.post("/createMeeting", createMeeting);

router.get("/user/:userId/:role", getMeetingsByUser);

router.post("/join/:meetingId", joinMeeting);

router.get("/comments/:meetingId", getCommentsForMeeting);

router.post("/comment", addCommentToMeeting);

module.exports = router;
