const mongoose = require("mongoose")

const signupUser = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Courses" }],
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Courses" }],
    resetPasswordToken: String,
    resetPasswordTokenExpires: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registrations", signupUser)