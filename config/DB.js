require("dotenv").config();
const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose
    .connect(`${process.env.DB_LINK}`)
    .then(() => console.log("DB CONNECTED"));
};

module.exports = connectDb;
