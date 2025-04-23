require("dotenv").config();
const mongoose = require("mongoose");

const connectToDB = async () => {
  await mongoose
    .connect(
      `mongodb+srv://saaadabbaaas:${process.env.DB_PASSWORD}@projects.mpcnnrd.mongodb.net/`
    )
    .then(() => console.log("DB CONNECTED"));
};

module.exports = connectToDB;
