const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema(
  {
    courseTitle: { type: String, require: true },
    courseDescription: { type: String, require: true },
    coursePrice: { type: String, require: true },
    courseDuration: { type: String },
    enrolledStudents:[{type:mongoose.Schema.Types.ObjectId, ref:"Registrations"}],
    thumbnail: { type: String, require: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registrations",
      require: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Courses", coursesSchema);
