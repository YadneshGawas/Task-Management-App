import mongoose from "mongoose";
import { Schema } from "mongoose";

const projectSchema = new Schema(
    {
      lTeam: [{ type: Schema.Types.ObjectId, ref: "User", required: true }], // Array of user IDs who are leads
      title: { type: String, required: true },
      date: { type: Date, default: new Date() },
      due: { type: Date, required: true },
      priority: {
        type: String,
        default: "normal",
        enum: ["high", "medium", "low"],
      },
      stage: {
        type: String,
        default: "todo",
        enum: ["todo", "in progress", "completed"],
      },
      assets: [String],
      uTeam: [{ type: Schema.Types.ObjectId, ref: "User" }],
      creator: { type: Schema.Types.ObjectId, ref: "User", required: true }
    },
    {
      timestamps: true,
    }
  );

  projectSchema.pre('save', function(next) {
    if (this.isNew) {
      const creatorId = this.creator; // Assuming _creator is set to the ID of the user creating the project
      if (creatorId && !this.lTeam.includes(creatorId)) {
        this.lTeam.push(creatorId);
      }
    }
    next();
  });

  // Method to remove a lead by user ID
projectSchema.methods.removeLead = async function(userId) {
  this.leads.pull(userId);
  await this.save();
};
  
  
const Project = mongoose.model('Project', projectSchema);

export default Project;