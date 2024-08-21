/* eslint-disable react/prop-types */

/* eslint-disable no-undef */

/* eslint-disable no-unused-vars */

import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector for Redux
import { getInitials, PRIORITYSTYLES, TASK_TYPE } from "../assets/index";
/*icons*/
import { FaTasks } from "react-icons/fa";
import { LiaTasksSolid } from "react-icons/lia";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdTaskAlt,
} from "react-icons/md";
import { TbProgress } from "react-icons/tb";
import { allusers } from "../assets/data";
import { useGetProjectQuery } from "../redux/slice/api/projApi";
import {
  useGetTaskQuery,
  useGetUserTaskQuery,
} from "../redux/slice/api/taskApi";
import { useGetTeamListQuery } from "../redux/slice/api/userApi";
import { animate, motion } from "framer-motion";
import { Circle } from "rc-progress";
import Progress from "react-circle-progress-bar";
import BasicLineChart from "../other/LineChart";
import Guage from "../other/Guage";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Piechart from './../other/Piechart';
import BasicBars from "../other/BasicBars";


const TaskTb = ({ user, proj, handleSort, sortConfig }) => {
  // Icons references
  const icons = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  // Sorting function
  const sortTasks = (tasks, sortConfig) => {
    let sortedTasks = [...tasks];
    const { key, direction, stage } = sortConfig;

    sortedTasks.sort((a, b) => {
      if (key === "priority") {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        return (
          (priorityOrder[a[key]] - priorityOrder[b[key]]) *
          (direction === "asc" ? 1 : -1)
        );
      }

      if (key === "due") {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return (dateA - dateB) * (direction === "asc" ? 1 : -1);
      }

      // if (key === "stage") {
      //   const stageOrder = { todo: 1, "in progress": 2, completed: 3 };
      //   return (
      //     (stageOrder[a[key]] - stageOrder[b[key]]) *
      //     (direction === "asc" ? 1 : -1)
      //   );
      // }

      if (stage === "todo") {
        const stageOrder = { todo: 1, "in progress": 3, completed: 5 };
        return (
          (stageOrder[a.stage] - stageOrder[b.stage]) * 1
          //(direction === "asc" ? 1 : -1)
        );
      }

      if (stage === "in progress") {
        const stageOrder = { todo: 2, "in progress": 1, completed: 3 };
        return (
          (stageOrder[a.stage] - stageOrder[b.stage]) * 1
          //(direction === "asc" ? 1 : -1)
        );
      }

      if (stage === "completed") {
        const stageOrder = { todo: 3, "in progress": 2, completed: 1 };
        return (
          (stageOrder[a.stage] - stageOrder[b.stage]) * 1
          //(direction === "asc" ? 1 : -1)
        );
      }

      return 0;
    });

    return sortedTasks;
  };

  const sortedTasks = sortTasks(proj, sortConfig);

  // Table header
  const TbHeader = () => (
    <thead className="bg-white sticky top-0">
      <tr className="text-black text-left text-lg">
        <th className="py-2 pl-2" onClick={() => handleSort("title")}>
          {user.isAdmin ? "Project Title" : "Task Title"}
        </th>
        <th className="py-2 pl-2" onClick={() => handleSort("priority")}>
          Priority
        </th>
        <th className="py-2" onClick={() => handleSort("due")}>
          Due On
        </th>
        {/* {!user.isAdmin && (
          <th
            className="py-2 hidden md:block"
            onClick={() => handleSort("due")}
          >
            Created On
          </th>
        )} */}
      </tr>
    </thead>
  );

  // Format date function
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  // Table row
  const TbRow = ({ task }) => (
    <tr className="w-full transition-shadow duration-300 hover:shadow-lg text-gray-600 hover:border hover:border-gray-100 m-2 pt-4">
      <td className="py-2">
        <div className="flex items-center gap-2 p-2">
          <div
            className={clsx("w-4 h-4 rounded-full", {
              "bg-blue-300": task?.stage === "todo",
              "bg-yellow-400": task?.stage === "in progress",
              "bg-green-600": task?.stage === "completed",
            })}
          />
          <p className="text-base text-black">{task?.title}</p>
        </div>
      </td>

      <td className="py-2">
        <div className="flex items-center justify-start gap-2">
          <span
            className={clsx("text-lg", {
              "text-red-600": task?.priority === "high",
              "text-yellow-600": task?.priority === "medium",
              "text-green-600": task?.priority === "low",
            })}
          >
            {icons[task?.priority]}
          </span>
          <span className="capitalize">{task?.priority}</span>
        </div>
      </td>

      <td className="py-2">
        <div className="flex items-center justify-start text-base text-gray-600">
          {formatDate(task?.due)}
        </div>
      </td>

      {/* {!user.isAdmin && (
        <td className="py-2 hidden md:block">
          <div className="flex items-center justify-start text-base text-gray-600 pt-2">
            {formatDate(task?.createdAt)}
          </div>
        </td>
      )} */}
    </tr>
  );

  return (
    <div className="bg-white px-2 pt-2 pb-4 transition-shadow duration-300 hover:shadow-lg hover:shadow-cyan-100 rounded">
      <div className="w-full max-h-96 overflow-y-auto">
        <table className="w-full">
          <TbHeader />
          <tbody>
            {sortedTasks.map((task, index) => (
              <TbRow key={index} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserTb = ({ user }) => {
  const { data: users } = useGetTeamListQuery();
  const { data } = useGetTaskQuery();

  const tasks = data?.tasks;

  const colors = [
    {
      percent: 25,
      strokeColor: "#0058e9",
    },
    {
      percent: 50,
      strokeColor: "#37b400",
    },
    {
      percent: 75,
      strokeColor: "#ffc000",
    },
    {
      percent: 100,
      strokeColor: "#f31700",
    },
  ];

  useEffect(() => {
    console.log("All tasks =>", tasks);
  }, [tasks]);

  // Table header part
  const TableHeader = () => (
    <thead className="">
      <tr className="">
        <th className="text-black text-left text-lg pb-2">Users</th>
      </tr>
    </thead>
  );

  // Table row part
  const TbRow = ({ user }) => {
    const usr = user?.users;
    console.log(user);
    return (
      <tr className="transition-shadow duration-300 hover:shadow-lg text-gray-600 hover:border hover:border-gray-100 m-2 rounded-t-lg">
        <td className="w-full py-2 p-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 min-w-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700">
              <span className="text-center">{getInitials(usr.name)}</span>
            </div>
            <div className="flex flex-col items-start">
              <p>{usr.name}</p>
              <p className="text-sm">Total Tasks:{user.total}</p>
            </div>
            <span className="text-xs text-black">{usr.title}</span>
          </div>
        </td>
        <td className="py-2 p-2 text-sm">
          <div className="flex items-start flex-col">
            <p className="text-red-500">High:{user.highlen}</p>
            <p className="text-yellow-600">Medium:{user.medlen}</p>
            <p className="text-green-600">Low:{user.lowlen}</p>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white h-full px-4 p-10 md:px-6 py-4 transition-shadow duration-300 hover:shadow-lg hover:shadow-cyan-100 rounded ">
      <table className="w-full mb-5">
        <TableHeader />
        <div className="w-full max-h-80 overflow-y-auto">
          {tasks && (
            <tbody>
              {users?.map((users, index) => {
                const user = users._id;
                const filteredTasks = tasks?.filter((task) =>
                  task.uTeam.some((member) => member._id === user)
                );
                const total = filteredTasks?.length;
                const low = filteredTasks.filter(
                  (task) => task.priority === "low"
                );
                const med = filteredTasks.filter(
                  (task) => task.priority === "medium"
                );
                const high = filteredTasks.filter(
                  (task) => task.priority === "high"
                );

                const lowlen = low.length;
                const medlen = med.length;
                const highlen = high.length;

                const userObject = {
                  users,
                  lowlen,
                  medlen,
                  highlen,
                  total,
                };
                return <TbRow key={index} user={userObject} />;
              })}
            </tbody>
          )}
        </div>
      </table>
      {/* <div className="w-full h-full p-10">
      <Circle percent={10} strokeWidth={5} trailWidth={5}/>
      </div> */}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const adminStatus = user.isAdmin;
  const { data: usersdata } = useGetTeamListQuery();
  const { data: project, refetch: projRefetch } = useGetProjectQuery();
  const { data: task, refetch: taskRefetch } = useGetUserTaskQuery();
  const [sortConfig, setSortConfig] = useState({
    key: "due",
    direction: "asc",
    stage: "todo",
  });

  let object = [];

  if (adminStatus) {
    if (project && project.projects) {
      object = project.projects.map((project) => ({
        id: project._id,
        lTeam: project.lTeam,
        title: project.title,
        date: project.date,
        due: project.due,
        priority: project.priority,
        stage: project.stage,
        assets: project.assets,
        uTeam: project.uTeam,
        creator: project.creator,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      }));
    }
  } else {
    if (task && task.tasks) {
      object = task.tasks.map((task) => ({
        id: task._id,
        title: task.title,
        date: task.date,
        due: task.due,
        priority: task.priority,
        stage: task.stage,
        assets: task.assets,
        uTeam: task.uTeam,
        by: task.by,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        projectTitle: task.projectTitle,
        projectDue: task.projectDue,
        projectPriority: task.projectPriority,
      }));
    }
  }

  useEffect(() => {
    projRefetch();
    taskRefetch();
  }, [projRefetch, taskRefetch]);

  const getComp = (object) => {
    const comp = object.filter((obj) => obj.stage === "completed");
    return comp.length;
  };
  const inProg = (object) => {
    const comp = object.filter((obj) => obj.stage === "in progress");
    return comp.length;
  };
  const toDo = (object) => {
    const comp = object.filter((obj) => obj.stage === "todo");
    return comp.length;
  };

  let mems;

  if (user.isAdmin) {
    mems = allusers;
  } else {
    mems = object.flatMap((task) => task.team);
  }

  // Handle sort
  const handleSort = (key, st) => {
    setSortConfig((prevSortConfig) => {
      const direction =
        prevSortConfig.key === key && prevSortConfig.direction === "asc"
          ? "desc"
          : "asc";
      const stage = st;
      return { key, direction, stage };
    });
  };

  const stats = [
    {
      _id: "1",
      label: user.isAdmin ? "TOTAL PROJECTS" : "TOTAL TASK",
      total: object?.length,
      icon: <FaTasks />,
      bg: "bg-gradient-to-br from-blue-500 to-green-300",
      sort: "title",
    },
    {
      _id: "2",
      label: "TODOS",
      total: toDo(object),
      icon: <LiaTasksSolid />,
      bg: "bg-gradient-to-br from-blue-500 to-green-300",
      sort: "todo",
    },
    {
      _id: "3",
      label: "IN PROGRESS ",
      total: inProg(object),
      icon: <TbProgress />,
      bg: "bg-gradient-to-br from-blue-500 to-green-300",
      sort: "in progress",
    },
    {
      _id: "4",
      label: user.isAdmin ? "COMPLETED PROJECTS" : "COMPLETED TASK",
      total: getComp(object),
      icon: <MdTaskAlt />,
      bg: "bg-gradient-to-br from-blue-500 to-green-300",
      sort: "completed",
    },
  ];

  const Card = ({ label, count, bg, icon, handleSort, sort }) => {
    return (
      <div
        className={clsx(
          "w-full h-32 bg-gradient-to-br from-blue-100 to-green-100 p-5 transition-shadow duration-300 hover:shadow-lg rounded-lg flex items-center justify-between"
        )}
        onClick={() => handleSort("stage", sort)}
      >
        <div className="h-full flex flex-1 flex-col justify-between">
          <p className="text-base text-gray-600">{label}</p>
          <span className="text-2xl font-semibold">{count}</span>
        </div>

        <div
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center text-white",
            bg
          )}
        >
          {icon}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full py-4">
      <motion.div
        initial={{ opacity: 0 }} // Initial opacity when the page loads
        animate={{ opacity: 1 }} // Fade in to full opacity
        transition={{
          ease: "linear",
          duration: 2, // Duration of the fade-in
          staggerChildren: 0.2, // Delay between each child's animation
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {stats.map(({ icon, bg, label, total, sort }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }} // Cards start off invisible and slightly lower
              animate={{ opacity: 1 }} // Fade in and move to original position
              transition={{
                duration: 1, // Duration of the individual card animation
                delay: index * 0.2, // Stagger animation based on index
              }}
            >
              <Card
                icon={icon}
                bg={bg}
                label={label}
                count={total}
                sort={sort}
                handleSort={handleSort}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8">
        <div className={`flex-1 h-full w-full`}>
          {/* ${!user.isAdmin ? "w-full" : "w-2/3"} md:w-full lg:w-1/2 xl:w-1/3 */}
          <TaskTb
            user={user}
            proj={object}
            handleSort={handleSort}
            sortConfig={sortConfig}
          />
        </div>
        {user.isAdmin && (
          <div className="w-full md:w-1/3">
            <UserTb user={user} />
          </div>
        )}
      </div>
      <div className="flex md:flex-row space-x-3 flex-col gap-y-3 justify-center">
        <div className="bg-white w-2/5 h-full py-2 flex items-start transition-shadow duration-300 hover:shadow-lg hover:shadow-cyan-100 rounded ">
          {/* <Circle percent={10} strokeWidth={5} trailWidth={5} />
          <Guage />
          <Progress progress={10} subtitle="Progress" strokeWidth={15} /> */}
          {/* <CircularProgressbar
            value={60}
            text={`completed`}
            styles={buildStyles({
              textSize: "10px",
              pathColor: "rgba(77, 168, 255, 0.85)",
            })}
          /> */}
          <Piechart total={object?.length} comp={getComp(object)} />
        </div>
        <div className="bg-white h-max w-2/3 md:px-6 py-4 transition-shadow duration-300 hover:shadow-lg hover:shadow-cyan-100 rounded ">
          <BasicBars />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
