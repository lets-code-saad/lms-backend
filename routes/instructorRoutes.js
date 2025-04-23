const express = require("express")
const upload = require("../middlewares/thumbnailUpload")
const authToken = require("../middlewares/authToken")
const { addCourse, getCourses, getSingleCourse } = require("../controllers/coursesController")
const checkRole = require("../middlewares/roleBaseAuth")
const router = express.Router()

router.post("/addCourse", authToken, checkRole(["instructor"]), upload.single("thumbnail"), addCourse);
router.get("/getCourses", authToken, checkRole(["instructor"]), getCourses);



module.exports = router