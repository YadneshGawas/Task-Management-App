/* eslint-disable no-unused-vars */
import Project from "../schemas/projects.js";
import Task from "./../schemas/tasks.js";

export const createTask = async (req, res) => {
  try {
    const { userId } = req.user;

    const {
      title,
      due,
      stage,
      date,
      priority,
      uTeam,
      desc,
      projectId,
      taskId,
      assets,
    } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      try {
        const task = await Task.create({
          title,
          due,
          stage,
          date,
          priority,
          uTeam,
          desc,
          taskId,
          projectId,
          assets,
          by: userId,
        });

        const project = await Project.findById(projectId);
        if (project) {
          project.tasks.push(task._id);
          await project.save();
        } 
        res
          .status(200)
          .json({ status: true, task, message: "Task created successfully." });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
      }
    }
     else {
      try {
        (task.id = taskId),
          (task.date = date),
          (task.due = due),
          (task.stage = stage),
          (task.title = title),
          (task.priority = priority),
          (task.uTeam = uTeam),
          (task.desc = desc ? desc : " "),
          (task.projectId = projectId ? projectId : task.projectId),
          (task.assets = assets),
          await task.save();

        res
          .status(200)
          .json({ status: true, message: "Task updated successfully" });
      } catch (error) {
        console.log(error);
        res
          .status(400)
          .json({ status: false, message: "Failed to update task" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({ status: false, message: "Failed Creation" });
  }
};

export const updateDesc = async (req, res) => {
  try {
    const { desc, taskId } = req.body;

    const task = await Task.findById(taskId);

    (task.id = taskId), 
    (task.desc = desc ? desc : " "), 
    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Description Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: "Failed to update task" });
  }
};

export const delTasks = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    const projectId = task.projectId;
    //temporary comment
    const project = await Project.findById(projectId);
    project?.tasks?.pull({ _id: id});
    await project.save();

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: `Task ${id} deleted successfully`,
      project: project,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const postTaskActivity = async (req, res) => {
  try {
    // const { id } = req.params;
    const { userId } = req.user;
    // const userId = "66af9db7479f7ad5afe7161b";
    const { id, type, activity } = req.body;

    const task = await Task.findById(id);

    const data = {
      type,
      activity,
      by: userId,
    };

    task.activities.push(data);

    await task.save();

    res.status(200).json({
      status: true,
      message: "Activity posted successfully.",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getAdminTask = async (req, res) => {
  try {
    const { userId } = req.user;
    //const userId = "66af9db7479f7ad5afe7161b";
    //If i want to pass task to another admin the setup lTeam attribute in tasks schema
    //and change by: userId to ({ lTeam: { $in: [userId] } })
    const tasks = await Task.find().populate('uTeam', 'name email role');

    res.status(200).json({
      tasks, // Return the array of projects
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const { userId } = req.user;
    //const userId = "66b9895f6e7bf0ea463cf32e";
    const tasks = await Task.find({ uTeam:{ $in: [userId]} }).populate('uTeam', 'name email role');

    res.status(200).json({
      tasks, // Return the array of projects
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTaskDetails = async (req, res) => {
  try {
    const { id } = req.params;
    //const userId = "66b9895f6e7bf0ea463cf32e";
    const tasks = await Task.findById(id).populate('uTeam','name email role');

    res.status(200).json({
      tasks, // Return the array of projects
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


export const createSubTask = async (req, res) => {
  try {
    const { title, desc, stage, taskId, subId, assets } = req.body;

    const task = await Task.findById(taskId);

    const subtask = task.subTasks.find((sub) => sub._id.toString() === subId);

    if (!subtask) {
      try {
        const newSubTask = {
          title,
          desc,
          stage,
          assets,
        };

        task.subTasks.push(newSubTask);
        await task.save();

        return res.status(200).json({
          status: true,
          message: `SubTask ${taskId} added successfully.`,
          subtask: subtask,
        });
      } catch (error) {
        console.log(error);
        return res
          .status(404)
          .json({ status: false, message: "Failed to create task" });
      }
    } else {
      try {
        const test = {
          title: title,
          desc: desc,
          stage: stage,
        };
        subtask.title = title;
        subtask.desc = desc;
        subtask.stage = stage;
        subtask.assets = assets;

        await task.save();

        return res
          .status(200)
          .json({ message: "Subtask updated successfully", subtask: test });
      } catch (error) {
        return res.status(400).json({ message: "Failed to update task" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateSubDesc = async (req, res) => {
  try {
    const { desc, taskId, subId } = req.body;

    const task = await Task.findById(taskId);

    const subtask = task.subTasks.find((sub) => sub._id.toString() === subId);

    const test = {
      desc: desc,
    };

    subtask.desc = desc;
    await task.save();
    return res.status(200).json({
      message: "Subtask description updated successfully",
      subtask: test,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Failed to update subtask description" });
  }
};

export const deleteSubtask = async (req, res) => {
  try {
    const { id, taskId } = req.body;

    const task = await Task.findById(taskId);
    task?.subTasks?.pull({ _id: id });
    await task.save();
    res.json(task);
  } catch (error) {
    console.log(error);
  }
};
