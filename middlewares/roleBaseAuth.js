const jwt = require("jsonwebtoken");

const checkRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req?.person?.role)) {
        return res.status(403).json({ message: "Permission Denied" });
      }
      next();
    } catch (error) {
      return res.json({ message: "Internal Server Error" });
    }
  };
};

module.exports = checkRole
