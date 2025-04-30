const express = require("express");
const authToken = require("../middlewares/authToken");
const {
  addCourse,
  getCourses,
  getSingleCourse,
  deleteCourse,
  addLesson,
} = require("../controllers/coursesController");
const checkRole = require("../middlewares/roleBaseAuth");
const { upload, videoUpload } = require("../middlewares/thumbnailUpload");
const router = express.Router();

router.post(
  "/addCourse",
  authToken,
  checkRole(["instructor"]),
  upload.single("thumbnail"),
  addCourse
);
// add lesson
router.post(
  "/addLesson/:course_id",
  authToken,
  checkRole(["instructor"]),
  videoUpload.single("lessonVideoURL"),
  addLesson
);
router.get("/getCourses", authToken, checkRole(["instructor"]), getCourses);
router.post(
  "/delete-course/:course_id",
  authToken,
  checkRole(["instructor", "admin"]),
  deleteCourse
);

module.exports = router;
