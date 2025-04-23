const express = require("express");
const getToDashboard = require("../controllers/roleController");
const checkRole = require("../middlewares/roleBaseAuth");
const authToken = require("../middlewares/authToken");
const router = express.Router();

router.get(
  "/getToDashboard",
  authToken,
  checkRole(["admin", "instructor"]),
  getToDashboard
);

module.exports = router
