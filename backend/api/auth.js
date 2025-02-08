const express = require("express");
const {
  registerVerifyOTP,
  registerSendOTP,
  login,
} = require("../controllers/authController");

const router = express.Router();

router.post("/registerSendOtp", registerSendOTP);
router.post("/registerVerifyOTP", registerVerifyOTP);
router.post("/login", login);
module.exports = router;
