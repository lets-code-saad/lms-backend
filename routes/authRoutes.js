const express = require("express");
const {
  signupRoute,
  signinRoute,
  getUserProfile,
} = require("../controllers/authController");
const authToken = require("../middlewares/authToken");

const router = express.Router();

// ROUTES
router.post("/signupRoute", signupRoute);
router.post("/signinRoute", signinRoute);
router.get("/getUserProfile", authToken, getUserProfile);

module.exports = router;
