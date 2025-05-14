const coursesModel = require("../models/coursesModel");
const lessonModel = require("../models/lessonModel");
const signup = require("../models/signup");

// add
const addLesson = async (req, res) => {
  try {
    const { lessonTitle, lessonDescription } = req.body;
    if (!lessonTitle || !lessonDescription) {
      return res.status(400).json({ message: "All Fields Are Required!" });
    }
    const { course_id } = req.params;
    const userId = req.person.personId;
    const lessonOfCourse = await coursesModel
      .findById(course_id)
      .populate("lessons");
    const isUserExist = await signup.findById(userId);
    if (!lessonOfCourse || !isUserExist) {
      return res.status(404).json({ message: "User Or Course Not Found" });
    }
    const lessonVideoURL = req.file?.path; // because stored in diskStorage
    if (!lessonVideoURL) {
      return res.status(400).json({ message: "All Fields Are Required!" });
    }
    const filePath = `/Videos/${req?.file?.filename}`;

    const newLesson = lessonModel({
      lessonTitle,
      lessonDescription,
      lessonVideoURL: filePath,
      course: course_id,
      user: userId,
    });
    await newLesson.save();
    lessonOfCourse?.lessons?.push(newLesson._id); // pushing it into the lessons array

    await lessonOfCourse.save();
    res.status(201).json({ message: "Lesson Added Successfully!", newLesson });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error?.message });
  }
};
// all lessons
const getLessons = async (req, res) => {
 try {
   // Checking if the user is valid
   const { course_id } = req?.params;
   const isUserExist = await signup.findById(req?.person?.personId);
   if (!isUserExist) {
     return res.status(404).json({ message: "User Not Found ! Please Signup" });
   }
   const lessonsOfCourse = await coursesModel
     .findById(course_id)
     .populate("lessons");
   if (!lessonsOfCourse) {
     return res.status(404).json({ message: "Course Not Found, Add Again!" });
   }
   res
     .status(200)
     .json({ message: "Your Lessons", allLessons: lessonsOfCourse?.lessons });
 } catch (error) {
    return res.status(500).json("Internal Server Error")
 }
    
};
// modify lesson
const editLesson = async (req, res) => {
    const { lessonTitle, lessonDescription } = req.body;
    if (!lessonTitle || !lessonDescription) {
      return res.status(400).json({ message: "All Fields Are Required!" });
    }
    const isUserExist = await signup.findById(req?.person?.personId)
    if (!isUserExist) {
        return res.status(404).json({ message: "User Not Found ! Please Signup" });
    }
    
}
      
// delete lesson
const deleteLesson = async (req, res) => {
try {
  const { lesson_id } = req.params;
  const isUserExist = await signup.findById(req?.person?.personId);
  if (!isUserExist) {
    return res.status(404).json({ message: "User Not Found ! Please Signup" });
  }
  const isLessonExist = await lessonModel.findById(lesson_id);
  if (!isLessonExist) {
    return res
      .status(404)
      .json({ message: "Lesson Not Found ! Please Add First" });
  }
  await coursesModel.findByIdAndUpdate(isLessonExist.course, {
    // pull method deletes all values/instances from array that match a specific condition
    $pull : {lessons: lesson_id}
  })

  await isLessonExist.deleteOne();
  
  res.status(200).json({ message: "Lesson Deleted Successfully!" });
} catch (error) {
  return res.status(500).json({message:error?.message})
}
};


module.exports = { addLesson, getLessons, editLesson, deleteLesson };
