const express = require("express");
const {
  signupRoute,
  signinRoute,
  getUserProfile,
  forgotPass,
  resetPassWithOTP,
} = require("../controllers/authController");
const authToken = require("../middlewares/authToken");

const router = express.Router();

// ROUTES
router.post("/signupRoute", signupRoute);
router.post("/signinRoute", signinRoute);
router.post("/forgot-password", forgotPass);
router.post("/reset-password", resetPassWithOTP);
router.get("/getUserProfile", authToken, getUserProfile);

module.exports = router;
