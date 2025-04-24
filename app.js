const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const rolesRoutes = require("./routes/rolesRoutes");
const instructorRoutes = require("./routes/instructorRoutes")
const userRoutes = require("./routes/userRoutes");
const connectDb = require("./config/db")

// creating app
const app = express();

// calling the db
connectDb();

// for allowing the region to accept the server
app.use(
  cors({
    origin: [
      "https://mern-lms-frontend-rust.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5000",
    ],
  })
);


// for parsing data to json
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Server is running like a butter"));
app.use("/auth", authRoutes);
app.use("/admin", rolesRoutes);
app.use("/user", userRoutes);
app.use("/instructor", instructorRoutes);


// const port = 5000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

module.exports = app