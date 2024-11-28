const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const user_model = require("../model/user_model");
const task_model = require("../model/task_model");
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // console.log(username, email, password);

    if (!username || !email || !password) {
      return next(new ErrorHandler("Please enter all the details", 401));
    }
    const user = await user_model.findOne({ email });
    if (user) {
      return next(new ErrorHandler("Email is already registered", 401));
    }
    const hashed_password = await bcrypt.hash(password, 10);
    await user_model.create({
      username,
      email,
      password: hashed_password,
    });
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (err) {
    return new ErrorHandler("Internal server error", 400);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please enter all the details", 401));
    }
    let user = await user_model.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("Please sign in", 401));
    }
    const match_password = await bcrypt.compare(password, user.password);
    if (!match_password) {
      return next(new ErrorHandler("Invalid credentials", 401));
    }

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // console.log(user.tasks);
    const populateTasks = await Promise.all(
      user?.tasks?.map(async (taskId) => {
        const task = await task_model.findById(taskId);
        if (task?.author?.equals(user._id)) return task;
        return null;
      })
    );

    if (populateTasks) user.task = populateTasks;
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      tasks: user.tasks,
    };

    //generate token
    const options = {
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    return res
      .status(200)
      .cookie("token", token, options)
      .json({
        message: `Welcome ${user.username}`,
        success: true,
        user,
        token,
      });
  } catch (err) {
    res.status(404).json({
      message: err.message,
      success: false,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error,
    });
  }
};
