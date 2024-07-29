import mongoose from "mongoose";
import { Schema } from "mongoose";

const projectSchema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, default: new Date() },
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
    assets: [String],
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    team: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
{
    timestamps: true,
});
  
const Project = mongoose.model('Project', projectSchema);

export default Project;