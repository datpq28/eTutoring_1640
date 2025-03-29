const express = require("express");
const {
  registerVerifyOTP,
  registerSendOTP,
  loginUser,
  forgotPasswordSendOTP,
  resetPassword
} = require("../controllers/authController");

const {
  viewListUser,
  lockUser,
  unLockUser,
  removeTutorFromStudent,
  assignTutorToStudent,
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
router.post("/resetPassword", resetPassword);

router.post("/viewListUser", viewListUser);
router.put("/lockUser", lockUser);
router.put("/unLockUser", unLockUser);
router.post("/removeTutorFromStudent", removeTutorFromStudent);
router.post("/assignTutorToStudent", assignTutorToStudent);

router.get("/approveAdmin", verifyToken, approveAdmin);
router.post("/sendAdminApprovalRequest", sendAdminApprovalRequest);

module.exports = router;
