const express = require("express");
const { getSingleCourse, getAllCourses, enrollCourse, unEnrollCourse } = require("../controllers/coursesController");
const authToken = require("../middlewares/authToken");
const router = express.Router()

router.get("/getSingleCourse/:course_id", getSingleCourse);
router.get("/getAllCourses", getAllCourses);
router.post("/enrollCourse/:course_id", authToken, enrollCourse);
router.post("/unEnrollCourse/:course_id", authToken, unEnrollCourse);


module.exports = router