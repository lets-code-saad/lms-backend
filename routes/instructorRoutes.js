const express = require("express");
const authToken = require("../middlewares/authToken");
const {
  addCourse,
  getCourses,
  getSingleCourse,
  deleteCourse,
} = require("../controllers/coursesController");
const checkRole = require("../middlewares/roleBaseAuth");
const { upload, videoUpload } = require("../middlewares/thumbnailUpload");
const {addLesson, getLessons, deleteLesson} = require("../controllers/lessonsController");
const router = express.Router();

router.post(
  "/addCourse",
  authToken,
  checkRole(["instructor"]),
  upload.single("thumbnail"),
  addCourse
);
router.get("/getCourses", authToken, checkRole(["instructor"]), getCourses);
router.post(
  "/delete-course/:course_id",
  authToken,
  checkRole(["instructor", "admin"]),
  deleteCourse
);
// LESSONS ROUTES

// add lesson
router.post(
  "/addLesson/:course_id",
  authToken,
  checkRole(["instructor"]),
  videoUpload.single("lessonVideoURL"),
  addLesson
);
// get lessons
router.get("/getLessons/:course_id", authToken, checkRole(["instructor"]), getLessons)
// delete lesson
router.delete("/deleteLesson/:lesson_id", authToken, checkRole(["instructor"]), deleteLesson);
module.exports = router;
