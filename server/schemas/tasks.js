import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    projId: { type: String }, //afterwards refrence to Project both down fields
    projectId: { type: String },
    title: { type: String, required: true },
    date: { type: Date, default: new Date() },
    due: { type: Date, default: new Date() },
    desc: { type: String, default: 'Add description here' },
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
    activities: [
      {
        type: {
          type: String,
          default: "assigned",
          enum: [
            "assigned",
            "started",
            "in progress",
            "working",
            "bug",
            "completed",
            "commented",
          ],
        },
        activity: String,
        date: { type: Date, default: new Date() },
        by: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    by: { type: Schema.Types.ObjectId, ref: "User" },
    subTasks: [
      {
        title: { type: String, required: true },
        desc: { type: String, required: true },
        stage: {
          type: String,
          default: "todo",
          enum: ["todo", "in progress", "completed"],
        },
      },
    ],
    uTeam: [{ type: Schema.Types.ObjectId, ref: "User" }],
    assets: [String],
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
