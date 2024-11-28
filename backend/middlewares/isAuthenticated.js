const User = require("../model/user_model");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
exports.isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ErrorHandler("Unauthorized access. Bearer token is required.", 401)
    );
  }
  const token = authHeader.split(" ")[1];

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    // console.log(req.user);
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return new ErrorHandler("Token has expired. Please log in again.", 401);
    }
    return new ErrorHandler("Invalid token", 401);
  }
};
