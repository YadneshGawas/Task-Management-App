/* eslint-disable react/prop-types */

/* eslint-disable no-undef */

/* eslint-disable no-unused-vars */

import React, { useEffect } from "react";

import { useSelector } from "react-redux"; // Import useSelector for Redux

import clsx from "clsx";
import { getInitials, PRIORITYSTYLES, TASK_TYPE } from "../assets/index";
/*icons*/
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import { LuClipboardEdit } from "react-icons/lu";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { allusers } from "../assets/data";
import { useGetProjectQuery } from "../redux/slice/api/projApi";
import { useGetUserTaskQuery } from "../redux/slice/api/taskApi";
import { useGetTeamListQuery } from "../redux/slice/api/userApi";

const TaskTb = ({ user, proj }) => {
  // Receive user as a prop
  //Icons references
  const icons = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  //Tbale header part
  const TbHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left text-lg">
        {user.isAdmin ? (
          <th className="py-2">Project Title</th>
        ) : (
          <th className="py-2">Task Title</th>
        )}
        <th className="py-2">Priority</th>
        <th className="py-2">Created At</th>
        {!user.isAdmin && <th className="py-2 hidden md:block">Due Date</th>}
      </tr>
    </thead>
  );

  //Format date function
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const TbRow = ({ task }) => (
    <tr className="w-full transition-shadow duration-300 hover:shadow-lg text-gray-600 hover:border hover:border-gray-100 m-2 pt-4">
      <td className="py-2">
        <div className="flex items-center gap-2 p-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task?.stage])}
          />
          <p className="text-base text-black">{task?.title}</p>
        </div>
      </td>

      <td className="py-2">
        <div className="flex items-center justify-start gap-2">
          <span className={clsx("text-lg", PRIORITYSTYLES[task?.priority])}>
            {icons[task?.priority]}
          </span>
          <span className="capitalize">{task?.priority}</span>
        </div>
      </td>

      <td className="py-2">
        <div className="flex items-center justify-start text-base text-gray-600 pt-2">
          {formatDate(task?.createdAt)}
        </div>
      </td>

      {!user.isAdmin && (
        <td className="py-2 hidden md:block">
          <div className="flex items-center justify-start text-base text-gray-600 pt-2">
            {formatDate(task?.due)}
          </div>
        </td>
      )}

      {/* <td className="py-2 hidden md:block">
        <div className="flex items-center justify-start">
          <p>{formatDate(task?.createdAt)}</p>
        </div>
      </td> */}
    </tr>
  );

  return (
    <>
      <div className="w-full flex bg-white px-2 md:px-4 pt-2 pb-4 transition-shadow duration-300 hover:shadow-lg hover:shadow-cyan-100 rounded">
        <table className="w-full">
          <TbHeader />
          <tbody>
            {proj?.map((task, index) => (
              <TbRow key={index} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const UserTb = ({ user }) => {
  const { data } = useGetTeamListQuery();

  // Table header part
  const TableHeader = () => (
    <thead className="border-b border-gray-300 ">
      <tr className="border-b border-gray-300 ">
        <th className="text-black text-left text-lg pb-2">Users</th>
      </tr>
    </thead>
  );

  // Table row part
  const TbRow = ({ user }) => (
    <tr className="w-full transition-shadow duration-300 hover:shadow-lg text-gray-600 hover:border hover:border-gray-100 m-2 rounded-t-lg">
      <td className="py-2 p-4 m-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700">
            <span className="text-center">{getInitials(user.name)}</span>
          </div>

          <div>
            <p>{user.name}</p>
            <span className="text-xs text-black">{user.title}</span>
          </div>
        </div>
      </td>
      <td className="py-2">{user.role}</td>
    </tr>
  );

  return (
    <div className="w-full bg-white h-fit px-4 md:px-6 py-4 transition-shadow duration-300 hover:shadow-lg hover:shadow-cyan-100 rounded ">
      <table className="w-full mb-5">
        <TableHeader />
        <div className="w-full max-h-svh overflow-y-auto">
          <tbody>
            {data?.map((users, index) => (
              <TbRow key={index} user={users} />
            ))}
          </tbody>
        </div>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const adminStatus = user.isAdmin;

  const { data: usersdata } = useGetTeamListQuery();
  const { data: project, refetch: projRefetch } = useGetProjectQuery();
  const { data: task, refetch: taskRefetch } = useGetUserTaskQuery();

  let object = [];

  if (adminStatus) {
    console.log("Project Data=>", project);
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
    console.log("Task Data =>", task);
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

  const stats = [
    {
      _id: "1",
      label: user.isAdmin ? "TOTAL PROJECTS" : "TOTAL TASK",
      total: object?.length,
      icon: <FaNewspaper />,
      bg: "bg-gradient-to-br from-blue-500 to-green-300",
      lstm: 67,
    },
    {
      _id: "2",
      label: user.isAdmin ? "COMPLETED PROJECTS" : "COMPLETED TASK",
      total: getComp(object),
      icon: <MdAdminPanelSettings />,
      bg: "bg-gradient-to-br from-blue-500 to-green-300",
      lstm: 53,
    },
    {
      _id: "3",
      label: "IN PROGRESS ",
      total: inProg(object),
      icon: <LuClipboardEdit />,
      bg: "bg-gradient-to-br from-blue-500 to-green-300",
      lstm: 41,
    },
    {
      _id: "4",
      label: "TODOS",
      total: toDo(object),
      icon: <FaArrowsToDot />,
      bg: "bg-gradient-to-br from-blue-500 to-green-300",
      lstm: 47,
    },
  ];

  const Card = ({ label, count, bg, icon, lst }) => {
    return (
      <div
        className={clsx(
          "w-full h-32 bg-gradient-to-br from-blue-100 to-green-100 p-5 transition-shadow duration-300 hover:shadow-lg rounded-lg flex items-center justify-between"
        )}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {stats.map(({ icon, bg, label, total, lstm }, index) => (
          <Card
            key={index}
            icon={icon}
            bg={bg}
            label={label}
            count={total}
            lst={lstm}
          />
        ))}
      </div>

      <div className="w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8">
        <div className={`flex-1 ${!user.isAdmin ? "w-full" : "w-2/3"}`}>
          <TaskTb user={user} proj={object} />
        </div>
        {user.isAdmin && (
          <div className="w-full md:w-1/3">
            <UserTb user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
