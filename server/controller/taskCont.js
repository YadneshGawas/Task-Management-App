/* eslint-disable no-unused-vars */
import Notif from "../schemas/notifications.js";
import User from "../schemas/user.js";
import Task from "./../schemas/tasks.js";

export const createTask = async (req, res) => {
  try {
    const userId = "66af9db7479f7ad5afe7161b";
    //const { userId } = req.user;

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
      assets
    } = req.body;

    // let text = "New task has been assigned to you";
    // if (team?.length > 1) {
    //   text = text + ` and ${team?.length - 1} others.`;
    // }

    // text =
    //   text +
    //   ` The task priority is set a ${priority} priority, so check and act accordingly. The task date is ${new Date(
    //     date
    //   ).toDateString()}. Thank you!!!`;

    // const activity = {
    //   type: "assigned",
    //   activity: text,
    //   by: userId,
    // };

    // await Notif.create({
    //   team,
    //   text,
    //   task: task._id,
    // });

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
          assets
        });
        res
          .status(200)
          .json({ status: true, task, message: "Task created successfully." });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
      }
    } else {
      try {
        (task.id = taskId),
          (task.date = date),
          (task.due = due),
          (task.stage = stage),
          (task.title = title),
          (task.priority = priority),
          (task.uTeam = uTeam),
          (task.desc = desc ? desc : " "),
          (task.projectId = projectId),
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
    const userId = "66af9db7479f7ad5afe7161b";

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

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: `Task ${id} deleted successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const postTaskActivity = async (req, res) => {
  try {
    // const { id } = req.params;
    // const { userId } = req.user;
    const userId = "66af9db7479f7ad5afe7161b";
    const { id, type, activity } = req.body;

    const task = await Task.findById(id);

    const data = {
      type,
      activity,
      by: userId,
    };

    task.activities.push(data);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully.", data: data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const dashboardStatistics = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    const allTasks = isAdmin
      ? await Task.find({
          isTrashed: false,
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("name title role isAdmin createdAt")
      .limit(10)
      .sort({ _id: -1 });

    //   group task by stage and calculate counts
    const groupTaskks = allTasks.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    // Group tasks by priority
    const groupData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task;

        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    // calculate total tasks
    const totalTasks = allTasks?.length;
    const last10Task = allTasks?.slice(0, 10);

    const summary = {
      totalTasks,
      last10Task,
      users: isAdmin ? users : [],
      tasks: groupTaskks,
      graphData: groupData,
    };

    res.status(200).json({
      status: true,
      message: "Successfully",
      ...summary,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { stage, isTrashed } = req.query;

    let query = { isTrashed: isTrashed ? true : false };

    if (stage) {
      query.stage = stage;
    }

    let queryResult = Task.find(query)
      .populate({
        path: "team",
        select: "name title email",
      })
      .sort({ _id: -1 });

    const tasks = await queryResult;

    res.status(200).json({
      status: true,
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    //const { userId } = req.body; // Assuming req.user contains the authenticated user's information
    //const userId = "66af9db7479f7ad5afe7161b"; // Assuming req.user contains the authenticated user's information
    const projId = "66b2ff5599de302fb3720f75";
    // Find projects where the userId is in the leads array
    const tasks = await Task.find({ projectId: projId });
    // .populate({
    //   path: "team",
    //   select: "name title role email",
    // })

    res.status(200).json({
      tasks, // Return the array of projects
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// export const updateSubTask = async (req, res) => {
//   try {
//     const { id } = req.body;

//     const subtask = await Task.find({ subTasks: {$in: [id]}});

//     res
//       .status(200)
//       .json({ status: true, message: `SubTask ${id} added successfully.`, task:subtask });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ status: false, message: error.message });
//   }
// };

export const createSubTask = async (req, res) => {
  try {
    const { title, desc, stage, taskId, subId } = req.body;

    const task = await Task.findById(taskId);

    const subtask = task.subTasks.find((sub) => sub._id.toString() === subId);

    if (!subtask) {
      try {
        const newSubTask = {
          title,
          desc,
          stage,
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
        subtask.title = title;
        subtask.desc = desc;
        subtask.stage = stage;

        await task.save();

        return res
          .status(200)
          .json({ message: "Subtask updated successfully", subtask: subtask });
      } catch (error) {
        return res.status(400).json({ message: "Failed to update task" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteSubtask = async (req, res) => {
  try {
    const { id } = req.body;
    const { taskId } = req.body;

    const task = await Task.findById(taskId);
    task?.subTasks?.pull({ _id: id });
    await task.save();
    res.json(task);
  } catch (error) {
    console.log(error);
  }
};

// export const updateTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, date, team, stage, priority, assets } = req.body;

//     const task = await Task.findById(id);

//     task.title = title;
//     task.date = date;
//     task.priority = priority.toLowerCase();
//     task.assets = assets;
//     task.stage = stage.toLowerCase();
//     task.team = team;

//     await task.save();

//     res
//       .status(200)
//       .json({ status: true, message: "Task duplicated successfully." });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ status: false, message: error.message });
//   }
// };
