const signup = require("../models/signup");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendResetMail = require("../utils/mailer");

const forgotPass = async (req, res) => {
  const { email } = req.body;
  const existingUser = await signup.findOne({ email });
  if (!existingUser) {
    return res
      .status(404)
      .json({ message: "Account Did Not Exists, Please signup first!" });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  existingUser.resetPasswordOTP = otp;
  existingUser.resetPasswordOTPExpires = Date.now() + 300000; // 5 minutes expiry time

  await existingUser.save();

  try {
    await sendResetMail({
      to: email,
      subject: "Password Reset Request",
      otp,
    });
    res
      .status(200)
      .json({ message: "OTP Sent To Your Email Successfully!" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassWithOTP = async (req, res) => {
try {
    const { otp, password } = req.body;
    const validUser = await signup.findOne({
      // checking in the db
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() }, // date must be greater(gt) than 5 mins
    });

    if (!validUser) {
      return res.status(401).json({ message: "Invalid Or Expired OTP!" });
    }

    const hashedPassword = await bcrypt.hash(password, 6);

    validUser.password = hashedPassword;
    validUser.resetPasswordOTP = undefined;
    validUser.resetPasswordOTPExpires = undefined;
    // saving to db
    await validUser.save();
    // displaying success message
    res.status(200).json({ message: "Password Changed Successfully!" });
} catch (error) {
  return res.status(500).json({message:"Internal Server Error"})
}
};

const signupRoute = async (req, res) => {
  const { username, email, password, role } = req.body;
  // check if all the fields are entered
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All Fields Are Required" });
  }
  // Check if email is already registered
  const existingUser = await signup.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email is already in use" });
  }
  // Check if username is already taken
  const usernameExists = await signup.findOne({ username });
  if (usernameExists) {
    return res.status(409).json({ message: "Username is already taken" });
  }
  // hashing the password
  const hashedPassword = await bcrypt.hash(password, 6);

  // creating newUser
  const newUser = new signup({
    email,
    username,
    password: hashedPassword,
    role,
  });

  // saving the user in DB
  await newUser.save();

  // leaving a response message:
  res.json({ message: "Signed Up Successfully!", newUser });
};

const signinRoute = async (req, res) => {
  try {
    const { username, password } = req.body;
    // check if all the fields are entered
    if (!username || !password) {
      return res.status(400).json({ message: "All Fields Are Required" });
    }
    // Check if user exists
    const existingUser = await signup.findOne({ username });
    if (!existingUser) {
      return res
        .status(403)
        .json({ message: "Username or password is incorrect" });
    }
    // checking if the password is correct
    const passwordMatches = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!passwordMatches) {
      return res
        .status(403)
        .json({ message: "Username or password is incorrect" });
    }

    // generating the token
    const token = jwt.sign(
      { personId: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5h" }
    );

    // returning a response message if the user successfull signin
    res
      .status(200)
      .json({ message: "Loggedin Successfully", existingUser, token });
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userInDB = await signup
      .findById(req?.person?.personId)
      .select("-password");
    if (!userInDB) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Loggedin Successfully", userInDB });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  signupRoute,
  signinRoute,
  getUserProfile,
  forgotPass,
  resetPassWithOTP,
};
