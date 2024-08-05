/* eslint-disable no-unused-vars */
import Notif from '../schemas/notifications.js';
import User from '../schemas/user.js';
import Project from './../schemas/projects.js';

export const testingApis = async (req, res) => {
  // Log the request and response details, including cookies from the request
  const { title} = req.body;
  //const msg = `RES STATUS:${res.statusCode}, REQ COOKIES:${req.cookie}`;
  return res
    .status(200)
    .json({ message: `Working ${title}` });
};

export const createProject = async (req, res) => {
  try {
    const { userId } = req.user;
    const { title, lTeam, uTeam, stage, date, due, priority, assets } = req.body;

    // let text = "New project has been assigned to you";
    // if (team?.length > 1) {
    //   text = text + ` and ${team?.length - 1} others.`;
    // }

    // text =
    //   text +
    //   ` The Project priority is set a ${priority} priority, so check and act accordingly. The project due date is ${due}. Thank you!!!`;

    const project = await Project.create({
      title,
      due,
      lTeam,
      uTeam,
      priority: priority.toLowerCase(),
      stage: stage.toLowerCase(),
      assets,
      date,
      creator: userId,
    });

    // await Notice.create({
    //   team,
    //   text,
    //   Project: Project._id,
    // });

    res
      .status(200)
      .json({ status: true,userId, project, message: "Project created successfully.", project: Project });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };

  export const getProjects = async (req, res) => {
    try {
      //const { userId } = req.user; // Assuming req.user contains the authenticated user's information
      const userId = "66af9db7479f7ad5afe7161b"; // Assuming req.user contains the authenticated user's information
  
      // Find projects where the userId is in the leads array
      const projects = await Project.find({ lTeam: { $in: [userId] } })
        // .populate({
        //   path: "team",
        //   select: "name title role email",
        // })
  
      res.status(200).json({
        projects, // Return the array of projects
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  
  export const dashboardStatistics = async (req, res) => {
    try {
      const { userId, isAdmin } = req.user;
      
      const allProjects = isAdmin
      ? await Project.find({
        isTrashed: false,
      })
      .populate({
        path: "team",
        select: "name role title email",
          })
          .sort({ _id: -1 })
      : await Project.find({
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

    //   group Project by stage and calculate counts
    const groupProjects = allProjects.reduce((result, Project) => {
      const stage = Project.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    // Group Project by priority
    const groupData = Object.entries(
      allProjects.reduce((result, Project) => {
        const { priority } = Project;

        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    // calculate total Project
    const totalProjects = allProjects?.length;
    const last10Project = allProjects?.slice(0, 10);

    const summary = {
      totalProjects,
      last10Project,
      users: isAdmin ? users : [],
      projects: groupProjects,
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

export const getProject = async (req, res) => {
  try {
    const { stage, isTrashed } = req.query;

    let query = { isTrashed: isTrashed ? true : false };

    if (stage) {
      query.stage = stage;
    }

    let queryResult = Project.find(query)
      .populate({
        path: "team",
        select: "name title email",
      })
      .sort({ _id: -1 });

    const Projects = await queryResult;

    res.status(200).json({
      status: true,
      Projects,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, team, stage, priority, assets } = req.body;

    const Project = await Project.findById(id);

    Project.title = title;
    Project.date = date;
    Project.priority = priority;
    Project.assets = assets;
    Project.stage = stage;
    Project.team = team;

    await Project.save();

    res
      .status(200)
      .json({ status: true, message: "Project duplicated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const trashProject = async (req, res) => {
  try {
    const { id } = req.params;

    const Project = await Project.findById(id);

    Project.isTrashed = true;

    await Project.save();

    res.status(200).json({
      status: true,
      message: `Project trashed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

