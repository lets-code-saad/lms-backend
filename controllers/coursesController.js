const coursesModel = require("../models/coursesModel");
const signup = require("../models/signup");

const addCourse = async (req, res) => {
  try {
    const { courseTitle, courseDescription, coursePrice } = req.body;
    if (!courseTitle || !courseDescription || !coursePrice) {
      return res.status(400).json({ message: "All Fields Are Required" });
    }
    const isUserExist = await signup.findById(req.person.personId);
    if (!isUserExist) {
      return res.status(403).json({ message: "User Not Found" });
    }

    const thumbnail = req.file.buffer.toString("base64");

    const newCourse = new coursesModel({
      courseTitle,
      courseDescription,
      coursePrice,
      thumbnail,
      user: req.person.personId,
    });

    // saving the course to teh DB
    await newCourse.save();

    // pushing the newCourse id to the existingUser array
    isUserExist.courses.push(newCourse._id);
    await isUserExist.save();

    // Displayig success messsage
    res.json({ message: "Course Added Successfully!", newCourse });
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
};
const getCourses = async (req, res) => {
  try {
    const isUserExist = await signup
      .findById(req.person.personId)
      .populate("courses");
    if (!isUserExist) {
      return res.status(403).json({ message: "User Not Found" });
    }


    const coursesWithStudentCount = isUserExist.courses.map((course) => {
      const enrolledStudentCount = course.enrolledStudents.length;
      return {
        ...course.toObject(),
        enrolledStudentCount,
      };
    });

    // Displayig success messsage
    res
      .status(200)
      .json({ message: "Your Courses", yourCourses: coursesWithStudentCount });
    7;
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
};
const getSingleCourse = async (req, res) => {
  const { course_id } = req.params;
  try {
    const isCourseExist = await coursesModel.findById(course_id);
    if (!isCourseExist) {
      return res.status(403).json({ message: "Course Not Found" });
    }

    // Displayig success messsage
    return res.status(200).json(isCourseExist);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getAllCourses = async (req, res) => {
  try {
    
    // it will find all the courses
    const allCourses = await coursesModel.find().populate("user")
    // displaying success message
    res.status(200).json({ message: "All Courses", allCourses: allCourses });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const enrollCourse = async (req, res) => {
  const { course_id } = req?.params;
  const userId = req?.person?.personId;
  const isUserExist = await signup.findById(userId);
  const courseToEnroll = await coursesModel.findById(course_id);
  if (!isUserExist) {
    return res.status(404).json({
      message: "Please Create An Account, to enroll!",
    });
  }
  if (!courseToEnroll) {
    return res.status(404).json({ message: "Sorry Course Not Found" });
  }
  // checking if the user is already enrolled
  // .some() Checks only in array if any course in the array matches the ID
  const alreadyEnrolled = isUserExist.enrolledCourses.some(
    (courseId) => courseId.toString() === course_id
  );
  if (alreadyEnrolled) {
    return res.status(403).json({ message: "You are already enrolled!" });
  }

  // pushing into the enrolledCourses array in the user
  isUserExist.enrolledCourses.push(courseToEnroll._id);

  // saving that user to the enrolledStudents array
  courseToEnroll.enrolledStudents.push(isUserExist._id)

// saving both
  await isUserExist.save();
  await courseToEnroll.save()

  // populating the array
  await isUserExist.populate("enrolledCourses");

  // displaying response message
  res.status(201).json({
    message: "Enrolled Successfully!",
    enrolledCourses: isUserExist.enrolledCourses,
    // telling that the user is enrolled as a boolean
  });
};

const unEnrollCourse = async (req, res) => {
  const { course_id } = req.params;
  const userId = req.person.personId;
  if (!course_id || !userId) {
    return res
      .status(400)
      .json({ message: "Course Or User Not Found", isEnrolled: false });
  }
  const isUserExist = await signup.findById(userId);
  // checking if the index is -1 (not exist)
  const courseIndex = isUserExist.enrolledCourses.indexOf(course_id);
  if (courseIndex === -1) {
    return res.status(400).json({
      message: "You Are Not Enrolled In This Course",
      isEnrolled: false,
    });
  }

  // removing the course from array, unEnrolling...
  // splice(startIndex, howManyNumbersToDeleteFromStartIndex)
  isUserExist.enrolledCourses.splice(courseIndex, 1);
  // saving the user in db
  await isUserExist.save();

  // displaying successs message
  res
    .status(200)
    .json({ message: "Un Enrolled Successfully!", isEnrolled: false });
};

const deleteCourse = async (req, res) => {
  // const thumbnailBase64 =
};

module.exports = {
  addCourse,
  getCourses,
  getSingleCourse,
  getAllCourses,
  deleteCourse,
  enrollCourse,
  unEnrollCourse,
};
