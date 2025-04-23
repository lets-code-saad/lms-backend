require("dotenv").config()
const jwt = require("jsonwebtoken")

const authToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1]; // split 'Bearer token' 

    if (!token) {
      return res
        .status(401)
        .json({ message: "Token Expired, please login again!" });
    }

    // decoding the token
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.person = decodeToken;

    next(); // move to next middleware
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = authToken;
