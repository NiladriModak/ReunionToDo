const express = require("express");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const {
  addTask,
  viewAllTask,
  updateTask,
  deleteTask,
  Dashboard_Info,
} = require("../controllers/taskController");

const router = express.Router();
router.route("/addTask").post(isAuthenticated, addTask);
router.route("/viewTask").get(isAuthenticated, viewAllTask);
router.route("/:taskId/updateTask").put(isAuthenticated, updateTask);
router.route("/:taskId/deleteTask").delete(isAuthenticated, deleteTask);
router.route("/taskStats").get(isAuthenticated, Dashboard_Info);
module.exports = router;
