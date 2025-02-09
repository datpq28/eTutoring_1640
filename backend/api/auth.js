const express = require("express");
const {
  registerVerifyOTP,
  registerSendOTP,
  loginUser,
} = require("../controllers/authController");

const {
  viewListUser,
  lockUser,
  unLockUser,
  removeTutorFromStudent,
  assignTutorToStudent
} = require("../controllers/admin/admin");

const router = express.Router();

router.post("/registerSendOTP", registerSendOTP);
router.post("/registerVerifyOTP", registerVerifyOTP);
router.post("/loginUser", loginUser);

router.get("/viewListUser", viewListUser);
router.put("/lockUser", lockUser);
router.put("/unLockUser", unLockUser);
router.post("/removeTutorFromStudent", removeTutorFromStudent);
router.post('/assignTutorToStudent', assignTutorToStudent);

module.exports = router;
