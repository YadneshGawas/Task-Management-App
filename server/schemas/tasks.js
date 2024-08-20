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
          default: "created",
          enum: [
            "title",
            "created",
            "description",
            "stage",
            "due",
            "priority",
            "asset",
            "updated",
            "assetdel"
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
        by: {type: Schema.Types.ObjectId, ref:"User"}
      },
    ],
    uTeam: [{ type: Schema.Types.ObjectId, ref: "User" }],
    assets: [
      {
        desc: {type:String, default:""},
        link: {type:String, default:""},
        by: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    projectTitle: { type: String },
    projectDue: { type: Date },
    projectPriority: { type: String },
  },
  {
    timestamps: true,
  }
);

taskSchema.pre("save", async function (next) {
  try {
    // Check if the document is new or modified
    if (this.isModified()) {
      const project = await Project.findById(this.projectId);
      if (project) {
        this.projectTitle = project.title;
        this.projectDue = project.due;
        this.projectPriority = project.priority;
      }

      // Detect changes and log activities
      const original = await this.constructor.findById(this._id).lean();
      if (original) {
        if (this.isModified("title")) {
          this.activities.push({
            type: "title",
            activity: `Title changed from "${original.title}" to "${this.title}"`,
            by: this.by,
          });
        }
        if (this.isModified("desc")) {
          this.activities.push({
            type: "description",
            activity: `Description changed to ${this.desc}`,
            by: this.by,
          });
        }
        if (this.isModified("stage")) {
          this.activities.push({
            type: "stage",
            activity: `Stage changed from "${original.stage}" to "${this.stage}"`,
            by: this.by,
          });
        }
        if (this.isModified("due")) {
          this.activities.push({
            type: "due",
            activity: `Stage changed from "${original.due}" to "${this.due}"`,
            by: this.by,
          });
        }
        if (this.isModified("priority")) {
          this.activities.push({
            type: "priority",
            activity: `Priority changed from "${original.priority}" to "${this.priority}"`,
            by: this.by,
          });
        }
        if (this.isModified("assets")) {
          const newAssets = this.assets;
          const oldAssets = original.assets || [];

          // Check if an asset was added
          if (newAssets.length > oldAssets.length) {
            const recentAsset = newAssets[newAssets.length - 1];
            await this.populate({
              path: `assets.${newAssets.length - 1}.by`,
              select: 'name'
            });

            const userName = recentAsset.by.name;
            const info = recentAsset.desc;

            this.activities.push({
              type: "asset",
              activity: `Recently added asset by ${userName}:${info} <a href="${recentAsset.link}" target="_blank" rel="noopener noreferrer"><img src="${recentAsset.link} style={{ maxWidth: '20%', height: 'auto', borderRadius: '8px' }}"/></a>`,
              by: this.by,
            });
          }

          // Check if an asset was removed
          if (newAssets.length < oldAssets.length) {
            const removedAsset = oldAssets.find(asset => !newAssets.some(newAsset => newAsset.link === asset.link));

            if (removedAsset) {
              await this.populate({
                path: `assets.by`,
                select: 'name'
              });

              const info = removedAsset.desc;

              this.activities.push({
                type: "assetdel",
                activity: `Asset deleted:${info}`,
              });
            }
          }
        }
        if (this.isModified("subTasks")) {
          const newSubTasks = this.subTasks;
          const oldSubTasks = original.subTasks || [];
          let userName = ""
          
          if(newSubTasks.length > 0){
            await this.populate({
              path: `subTasks.${newSubTasks.length - 1}.by`,
              select: 'name'
            })
            const recentSubTask = newSubTasks[newSubTasks.length - 1];
            userName = recentSubTask.by.name;
          }
          

          // Subtask added
          if (newSubTasks.length > oldSubTasks.length) {
            const recentSubTask = newSubTasks[newSubTasks.length - 1];
            
            this.activities.push({
              type: "created",
              activity: `${recentSubTask.title} added by ${userName}`,
              by: this.by,
            });
          }

          // Subtask removed
          if (newSubTasks.length < oldSubTasks.length) {
            const removedSubTask = oldSubTasks.find(subTask => !newSubTasks.some(newSubTask => newSubTask.title === subTask.title));
            if (removedSubTask) {
              this.activities.push({
                type: "assetdel",
                activity: `${removedSubTask.title} removed by ${userName}`,
              });
            }
          }

          // Subtask modifications
          newSubTasks.forEach((newSubTask, index) => {
            const originalSubTask = oldSubTasks[index];
            if (originalSubTask) {
              if (newSubTask.title !== originalSubTask.title) {
                this.activities.push({
                  type: "title",
                  activity: `Subtask title changed from ${originalSubTask.title} to ${newSubTask.title}`,
                  by: this.by,
                });
              }
              if (newSubTask.stage !== originalSubTask.stage) {
                this.activities.push({
                  type: "stage",
                  activity: `Subtask stage changed from ${originalSubTask.stage} to ${newSubTask.stage}`,
                  by: this.by,
                });
              }

              // Monitor changes in subtask assets
              if (newSubTask.assets.length > originalSubTask.assets.length) {
                const recentSubTaskAsset = newSubTask.assets[newSubTask.assets.length - 1];
                this.activities.push({
                  type: "asset",
                  activity: `Asset added to subtask ${newSubTask.title}: <a href="${recentSubTaskAsset}" target="_blank" rel="noopener noreferrer"><img src="${recentSubTaskAsset} style={{ maxWidth: '20%', height: 'auto', borderRadius: '8px' }}"/></a>`,
                  by: this.by,
                });
              }

              if (newSubTask.assets.length < originalSubTask.assets.length) {
                const removedSubTaskAsset = originalSubTask.assets.find(asset => !newSubTask.assets.includes(asset));
                if (removedSubTaskAsset) {
                  this.activities.push({
                    type: "assetdel",
                    activity: `Asset removed from subtask ${newSubTask.title} by ${userName}`,
                  });
                }
              }
            }
          });
        }
        
      } else {
        this.activities.push({
          type: "created",
          activity: "Task created",
          by: this.by,
        });
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// taskSchema.post('save', async function(doc, next) {
//   try {
//     const project = await Project.findById(doc.projectId);
//     if (project) {
//       project.tasks.push(doc._id);
//       await project.save();
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

const Task = mongoose.model("Task", taskSchema);

export default Task;
