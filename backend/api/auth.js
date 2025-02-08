const express = require("express");
const {
  registerVerifyOTP,
  registerSendOTP,
  loginUser,
} = require("../controllers/authController");

const router = express.Router();

router.post("/registerSendOTP", registerSendOTP);
router.post("/registerVerifyOTP", registerVerifyOTP);
router.post("/loginUser", loginUser);
module.exports = router;
