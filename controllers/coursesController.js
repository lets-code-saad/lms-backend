const coursesModel = require("../models/coursesModel");
const lessonModel = require("../models/lessonModel");
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
const addLesson = async (req, res) => {
  try {
    const { lessonTitle, lessonDescription } = req.body;
    if (!lessonTitle || !lessonDescription) {
      return res.status(400).json({ message: "All Fields Are Required!" });
    }
    const { course_id } = req.params;
    const userId = req.person.personId;
    const lessonOfCourse = await coursesModel.findById(course_id).populate("lessons");
    const isUserExist = await signup.findById(userId);
    if (!lessonOfCourse || !isUserExist) {
      return res.status(404).json({ message: "User Or Course Not Found" });
    }
    const lessonVideoURL = req.file?.path; // because stored in diskStorage

    const newLesson = lessonModel({
      lessonTitle,
      lessonDescription,
      lessonVideoURL,
      course: course_id,
      user:userId
    });
await newLesson.save()
    lessonOfCourse?.lessons?.push(newLesson._id); // pushing it into the lessons array

    await lessonOfCourse.save();
    res.status(201).json({ message: "Lesson Added Successfully!", newLesson });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
const getCourses = async (req, res) => {
  try {
    const isUserExist = await signup.findById(req.person.personId).populate({
      path: "courses",
      populate: {
        path: "enrolledStudents", // this will populate users inside each course
      },
    });
    if (!isUserExist) {
      return res.status(404).json({ message: "User Not Found" });
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
    const allCourses = await coursesModel.find().populate("user");
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
  const alreadyEnrolled = courseToEnroll?.enrolledStudents?.some(
    (studentId) => studentId.toString() === userId.toString()
  );
  if (alreadyEnrolled) {
    return res.status(403).json({ message: "You are already enrolled!" });
  }

  // pushing into the enrolledCourses array in the user
  isUserExist.enrolledCourses.push(courseToEnroll._id);

  // saving that user to the enrolledStudents array
  courseToEnroll.enrolledStudents.push(isUserExist._id);

  // saving both
  await isUserExist.save();
  await courseToEnroll.save();

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
  const isUserExist = await signup.findById(userId);
  const courseToUnenroll = await coursesModel.findById(course_id);

  if (!isUserExist || !courseToUnenroll) {
    return res
      .status(400)
      .json({ message: "Course Or User Not Found", isEnrolled: false });
  }
  const alreadyEnrolled = courseToUnenroll?.enrolledStudents?.some(
    (studentId) => studentId.toString() === userId.toString()
  );
  if (!alreadyEnrolled) {
    return res
      .status(400)
      .json({ message: "You Are Already Enrolled!", isEnrolled: false });
  }

  // removing the courseId from the enrolledStudents array
  courseToUnenroll.enrolledStudents = courseToUnenroll.enrolledStudents.filter(
    (courseId) => courseId.toString() !== userId.toString()
  );

  // removing the course from array, unEnrolling...
  // splice(startIndex, howManyNumbersToDeleteFromStartIndex)
  isUserExist.enrolledCourses = isUserExist.enrolledCourses.filter(
    (courseId) => courseId.toString() !== course_id.toString()
  );
  // saving
  await courseToUnenroll.save();
  // saving the user in db
  await isUserExist.save();

  // displaying successs message
  res
    .status(200)
    .json({ message: "Un Enrolled Successfully!", isEnrolled: false });
};

const deleteCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const userId = req.person.personId;
    const existingUser = await signup.findById(userId);
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User Not Found, Please Signup!" });
    }
    const courseToDelete = await coursesModel.findById(course_id);
    if (!courseToDelete) {
      return res.status(400).json({ message: "Course Not Found" });
    }

    // deleting the course
    await coursesModel.findByIdAndDelete(course_id);

    // removing the reference id from db
    existingUser.courses = existingUser.courses.filter(
      (courseId) => courseId.toString() !== course_id
    );

    // saving into db
    await existingUser.save();

    // displaying success message
    res.status(200).json({ message: "Course Deleted Successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addCourse,
  getCourses,
  getSingleCourse,
  getAllCourses,
  deleteCourse,
  enrollCourse,
  unEnrollCourse,
  addLesson,
};
