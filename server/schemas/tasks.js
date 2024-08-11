import mongoose from "mongoose";
import { Schema } from "mongoose";
import Project from "./projects.js";

const taskSchema = new Schema(
  {
    //projectId: { type: String }, //afterwards refrence to Project both down fields
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true },
    date: { type: Date, default: new Date() },
    due: { type: Date, default: new Date() },
    desc: { type: String, default: "Add description here" },
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
        desc: { type: String, default: "Enter description here" },
        stage: {
          type: String,
          default: "todo",
          enum: ["todo", "in progress", "completed"],
        },
        assets: [String],
      },
    ],
    uTeam: [{ type: Schema.Types.ObjectId, ref: "User" }],
    assets: [String],
    projectTitle: { type: String },
    projectDue: { type: Date },
    projectPriority: { type: String },
  },
  {
    timestamps: true,
  }
);

taskSchema.pre('save', async function (next) {
  try {
    if (this.isModified('projectId')) {
      const project = await Project.findById(this.projectId);
      if (project) {
        this.projectTitle = project.title;
        this.projectDue = project.due;
        this.projectPriority = project.priority;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

taskSchema.post('save', async function(doc, next) {
  try {
    const project = await Project.findById(doc.projectId);
    if (project) {
      project.tasks.push(doc._id);
      await project.save();
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
