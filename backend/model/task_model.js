const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: Date, default: Date.now() },
  endTime: { type: Date, required: true },
  priority: { type: Number, default: 1 },
  status: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
module.exports = mongoose.model("Task", taskSchema);
