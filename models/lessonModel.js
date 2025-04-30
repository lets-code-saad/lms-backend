const mongoose = require("mongoose");

const lessonsSchema = new mongoose.Schema(
  {
    lessonTitle: { type: String, require: true },
    lessonDescription: { type: String, require: true },
    lessonVideoURL: { type: String, require: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registrations",
      require: true,
    },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lessons", lessonsSchema);
