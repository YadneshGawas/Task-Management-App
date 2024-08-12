/* eslint-disable no-unused-vars */
import Notif from "../schemas/notifications.js";
import User from "../schemas/user.js";
import Project from "./../schemas/projects.js";

export const testingApis = async (req, res) => {
  // Log the request and response details, including cookies from the request
  const { userId } = req.user;
  //const msg = `RES STATUS:${res.statusCode}, REQ COOKIES:${req.cookie}`;
  return res.status(200).json({ message: `Working ${userId}` });
};

export const createProject = async (req, res) => {
  try {
    const { userId } = req.user;
    const { title, lTeam, uTeam, stage, date, due, priority, assets, projId } =
      req.body;

    // let text = "New project has been assigned to you";
    // if (team?.length > 1) {
    //   text = text + ` and ${team?.length - 1} others.`;
    // }

    // text =
    //   text +
    //   ` The Project priority is set a ${priority} priority, so check and act accordingly. The project due date is ${due}. Thank you!!!`;

    const project = await Project.findById(projId);

    if (!project) {
      try {
        const project = await Project.create({
          title,
          due,
          lTeam,
          uTeam,
          priority: priority.toLowerCase(),
          stage: stage.toLowerCase(),
          assets,
          date,
          //creator: userId,
          by: userId,
        });

        // await Notice.create({
        //   team,
        //   text,
        //   Project: Project._id,
        // });

        res.status(200).json({
          status: true,
          userId,
          project,
          message: "Project created successfully.",
        });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
      }
    } else {
      try {
        project.title = title;
        project.date = date;
        project.due = due;
        project.priority = priority;
        project.assets = assets;
        project.stage = stage;
        project.lTeam = lTeam;
        project.uTeam = uTeam;

        await project.save();

        res
          .status(200)
          .json({ status: true, message: "project updated successfully." });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming req.user contains the authenticated user's information
    //const userId = "66af9db7479f7ad5afe7161b"; // Assuming req.user contains the authenticated user's information
    //Change req to post to get id from frontend in body
    //Get doesn't have a body

    // Find projects where the userId is in the leads array
    const projects = await Project.find({ lTeam: { $in: [userId] } })
      .populate("uTeam", "name email role") // Populate uTeam
      .populate("lTeam", "name email role")
      .populate("tasks", "title stage"); // Populate lTeam, adjust fields as necessary

    res.status(200).json({
      projects, // Return the array of projects
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const delProjects = async (req, res) => {
  try {
    const { id } = req.params;

    await Project.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: `Project ${id} deleted successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
