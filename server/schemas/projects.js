import mongoose from "mongoose";
import { Schema } from "mongoose";

const projectSchema = new Schema(
    {
      leads: [{ type: Schema.Types.ObjectId, ref: "User", required: true }], // Array of user IDs who are leads
      title: { type: String, required: true },
      date: { type: Date, default: new Date() },
      due: { type: Date, required: true },
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
      team: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    {
      timestamps: true,
    }
  );
  
  
const Project = mongoose.model('Project', projectSchema);

export default Project;