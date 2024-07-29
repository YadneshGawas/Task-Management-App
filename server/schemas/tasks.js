import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new Schema({
  pid: { type: Schema.Types.ObjectId, ref: "Project" },
  title: { type: String, required: true },
  date: { type: Date, default: new Date() },
  desc: { type: String, required: true },
  priority: {
    type: String,
    default: "normal",
    enum: ["high", "medium", "normal", "low"],
  },
  stage: {
    type: String,
    default: "todo",
    enum: ["todo", "in progress", "completed"],
  },
  activities: {
    type: {
      type: String,
      default: "assigned",
      enum: [
        "assigned",
        "started",
        "in progress",
        "bug",
        "commented",
        "completed",
      ],
    },
    activities: String,
    date: { type: Date, default: new Date() },
  },
  by: { type: Schema.Types.ObjectId, ref: "User" },
  subTasks: [
    {
      title: { type: String, required: true },
      date: Date,
      tag: { type: String, required: true },
    },
  ],
  team: [{ type: Schema.Types.ObjectId, ref: "User" }],
  assets: [String],
},
{
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
