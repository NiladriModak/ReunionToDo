const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const user_model = require("../model/user_model");
const task_model = require("../model/task_model");
const mongoose = require("mongoose");
//add
exports.addTask = async (req, res, next) => {
  try {
    const { title, startTime, endTime, priority } = req.body;
    const authorId = req.user._id;

    // console.log(title, startTime, endTime, priority);
    if (!title || !startTime || !endTime || !priority) {
      return next(new ErrorHandler("Please enter all details", 400));
    }
    const task = await task_model.create({
      title,
      startTime,
      endTime,
      priority,
      author: authorId,
    });
    const user = await user_model.findById(authorId);
    if (user) {
      user.tasks = user.tasks || [];
      user.tasks.push(task._id);
      await user.save();
    } else {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Populate the author's info and respond
    await task.populate({ path: "author", select: "-password" });
    res.status(200).json({
      task,
      success: true,
    });
  } catch (error) {
    // console.log(error.message);
    return next(new ErrorHandler("Internal server error", 404));
  }
};
//view task
exports.viewAllTask = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return next(new ErrorHandler("No user found", 400));
    }
    const authorId = mongoose.Types.ObjectId.isValid(userId) && userId;
    if (!authorId) {
      return next(new ErrorHandler("Invalid user ID", 400));
    }
    const tasks = await task_model.find({ author: authorId });

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error(error.message);
    return next(new ErrorHandler("Internal server error", 500));
  }
};

//update task
exports.updateTask = async (req, res, next) => {
  try {
    const { title, startTime, endTime, priority, status } = req.body;
    // console.log(status);
    const taskId = req.params.taskId;

    if (!title && !startTime && !endTime && !priority && !status) {
      return new ErrorHandler("Please enter details to update", 404);
    }
    const task = await task_model.findById(taskId);
    if (!task) {
      return new ErrorHandler("Task is not defined", 404);
    }

    const newTask = await task_model.findByIdAndUpdate(taskId, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      newTask,
      success: true,
    });
  } catch (error) {
    // console.log(error.message);
    return next(new ErrorHandler("Internal server error", 404));
  }
};

//delete task
exports.deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await task_model.findById(taskId);
    if (!task) {
      next(new ErrorHandler("Task does not exists", 404));
    }
    const user = await user_model.findById(task.author);
    if (!user) {
      next(new ErrorHandler("Author not found", 404));
    }
    user.tasks = user.tasks.filter((ele) => ele.toString() !== taskId);
    user.save();
    await task_model.deleteOne(task._id);
    // task_model.save();
    res.status(200).json({
      message: "Task deleted successfully",
      success: true,
    });
  } catch (error) {
    // console.log(error.message);
    next(new ErrorHandler("Internal server error", 404));
  }
};

exports.Dashboard_Info = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new ErrorHandler("No user found", 400));
    }
    const authorId = mongoose.Types.ObjectId.isValid(userId) && userId;
    if (!authorId) {
      return next(new ErrorHandler("Invalid user ID", 400));
    }
    const task = await task_model.find({ author: authorId });
    const totalTask = task.length;

    let completed = 0,
      pending = 0;
    let totalDuration = 0;
    let totalTimeLapsed = 0;
    let estimatedTimeLeft = 0;

    const priorityStats = new Map();

    const formatDuration = (ms) => {
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    };

    task?.forEach((ele) => {
      const priority = ele.priority;

      if (!priorityStats.has(priority)) {
        priorityStats.set(priority, {
          pendingTasks: 0,
          totalTimeLapsed: 0,
          estimatedTimeLeft: 0,
        });
      }

      const priorityData = priorityStats.get(priority);

      if (ele.status === true) {
        completed++;

        const startTime = new Date(ele.startTime);
        const endTime = new Date(ele.endTime);
        const duration = endTime - startTime;
        totalDuration += duration;
      } else {
        pending++;

        const startTime = new Date(ele.startTime);
        const endTime = new Date(ele.endTime);
        const now = new Date();

        const timeLapsed = now - startTime;
        const timeLeft = endTime - now;

        priorityData.pendingTasks++;

        priorityData.totalTimeLapsed += Math.max(timeLapsed, 0);
        priorityData.estimatedTimeLeft += Math.max(timeLeft, 0);
        totalTimeLapsed += Math.max(timeLapsed, 0);
        estimatedTimeLeft += Math.max(timeLeft, 0);
      }
    });

    const percentagePending = totalTask > 0 ? (pending / totalTask) * 100 : 0;
    const percentageComplete =
      totalTask > 0 ? (completed / totalTask) * 100 : 0;
    const averageTimePerCompletedTask =
      completed > 0 ? totalDuration / completed : 0;

    const formattedPriorityStats = Array.from(priorityStats.entries()).map(
      ([priority, stats]) => ({
        priority,
        pendingTasks: stats.pendingTasks,
        totalTimeLapsed: formatDuration(stats.totalTimeLapsed),
        estimatedTimeLeft: formatDuration(stats.estimatedTimeLeft),
      })
    );

    res.status(200).json({
      totalTask,
      completed,
      pending,
      percentagePending: percentagePending.toFixed(2),
      totalTimeLapsed: formatDuration(totalTimeLapsed),
      estimatedTimeLeft: formatDuration(estimatedTimeLeft),
      percentageComplete: percentageComplete.toFixed(2),
      averageTimePerCompletedTask: formatDuration(averageTimePerCompletedTask),
      priorityStats: formattedPriorityStats,
    });
  } catch (error) {
    console.error("Error in Dashboard_Info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
