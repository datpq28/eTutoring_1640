const express = require("express");
const {
  registerVerifyOTP,
  registerSendOTP,
  loginUser,
  forgotPasswordSendOTP,
  verifyOtp,
  updatePassword,
  deleteUser,
  logoutUser
} = require("../controllers/authController");

const {
  viewListUser,
  lockUser,
  unLockUser,
  removeTutorFromStudent,
  assignTutorToStudent,
  fetchAllMeetings,
  updateMeetingStatus,
  assignTutorToStudentAll,
  viewListStudentByTutor
} = require("../controllers/admin/admin");

const { approveAdmin } = require("../controllers/authController");
const {
  sendAdminApprovalRequest,
} = require("../controllers/mailService/mailService");
const { verifyToken } = require("../middleware/verifyToken");

const router = express.Router();

router.post("/registerSendOTP", registerSendOTP);
router.post("/registerVerifyOTP", registerVerifyOTP);
router.post("/loginUser", loginUser);
router.post("/forgotPasswordSendOTP", forgotPasswordSendOTP);
router.post("/verifyOtp", verifyOtp);
router.post("/updatePassword", updatePassword);
router.post("/deleteUser", deleteUser);
router.post("/logoutUser", logoutUser);

router.post("/viewListUser", viewListUser);
router.put("/lockUser", lockUser);
router.put("/unLockUser", unLockUser);
router.post("/removeTutorFromStudent", removeTutorFromStudent);
router.post("/assignTutorToStudent", assignTutorToStudent);
router.post("/assignTutorToStudentAll", assignTutorToStudentAll);
router.get("/approveAdmin", verifyToken, approveAdmin);
router.post("/sendAdminApprovalRequest", sendAdminApprovalRequest);
router.get("/viewListStudentByTutor/:tutorId", viewListStudentByTutor);

router.get("/meetings/all", fetchAllMeetings); // Lấy danh sách cuộc họp chờ duyệt
router.put("/meetings/:meetingId/status", updateMeetingStatus); // Cập nhật trạng thái cuộc họp

module.exports = router;
