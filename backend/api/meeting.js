const express = require("express");
const router = express.Router();
const {
  createMeeting,
  getMeetingsByUser,
  joinMeeting,
  leaveMeeting,
  getCommentsForMeeting, // ✅ Kiểm tra lại import
  addCommentToMeeting,
} = require("../controllers/meeting/meetingController");

router.post("/create", createMeeting);
router.get("/user/:userId/:role", getMeetingsByUser);
router.post("/join/:meetingId", joinMeeting);
router.post("/leave/:meetingId", leaveMeeting);
router.get("/comments/:meetingId", getCommentsForMeeting); // ✅ Đảm bảo route này hoạt động đúng
router.post("/comment", addCommentToMeeting);

module.exports = router;
