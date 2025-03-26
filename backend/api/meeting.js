const express = require("express");
const router = express.Router();
const {
  createMeeting,
  getMeetingsByUser,
  joinMeeting,
  leaveMeeting,
  getCommentsForMeeting,
  addCommentToMeeting,
} = require("../controllers/meeting/meetingController");

router.post("/create", createMeeting); // Chỉ Tutor tạo cuộc họp
router.get("/user/:userId/:role", getMeetingsByUser); // Lấy danh sách cuộc họp theo role
router.post("/join/:meetingId", joinMeeting); // Chỉ Student có thể tham gia
router.post("/leave/:meetingId", leaveMeeting);
router.get("/comments/:meetingId", getCommentsForMeeting);
router.post("/comment", addCommentToMeeting);

module.exports = router;
