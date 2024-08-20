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
  MdTaskAlt
} from "react-icons/md";
import { TbProgress } from "react-icons/tb";
import { allusers } from "../assets/data";
import { useGetProjectQuery } from "../redux/slice/api/projApi";
import { useGetUserTaskQuery } from "../redux/slice/api/taskApi";
import { useGetTeamListQuery } from "../redux/slice/api/userApi";

const TaskTb = ({ user, proj }) => {
  // Icons references
  const icons = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: 'due',
    direction: 'desc',
  });

  // Sorting function
  const sortTasks = (tasks, sortConfig) => {
    let sortedTasks = [...tasks];
    const { key, direction } = sortConfig;

    sortedTasks.sort((a, b) => {
      if (key === 'priority') {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        return (priorityOrder[a[key]] - priorityOrder[b[key]]) * (direction === 'asc' ? 1 : -1);
      }

      if (key === 'due' || key === 'createdAt') {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return (dateA - dateB) * (direction === 'asc' ? 1 : -1);
      }

      if (key === 'stage') {
        const stageOrder = { todo: 1, 'in progress': 2, completed: 3 };
        return (stageOrder[a[key]] - stageOrder[b[key]]) * (direction === 'asc' ? 1 : -1);
      }

      return 0;
    });

    return sortedTasks;
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prevSortConfig) => {
      const direction = prevSortConfig.key === key && prevSortConfig.direction === 'asc'
        ? 'desc'
        : 'asc';
      return { key, direction };
    });
  };

  const sortedTasks = sortTasks(proj, sortConfig);

  // Table header
  const TbHeader = () => (
    <thead className="bg-white sticky top-0">
      <tr className="text-black text-left text-lg">
        <th className="py-2" onClick={() => handleSort(user.isAdmin ? 'title' : 'title')}>
          {user.isAdmin ? 'Project Title' : 'Task Title'}
        </th>
        <th className="py-2" onClick={() => handleSort('priority')}>
          Priority
        </th>
        <th className="py-2" onClick={() => handleSort('createdAt')}>
          Due On
        </th>
        {!user.isAdmin && (
          <th className="py-2 hidden md:block" onClick={() => handleSort('due')}>
            Due Date
          </th>
        )}
      </tr>
    </thead>
  );

  // Format date function
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  // Table row
  const TbRow = ({ task }) => (
    <tr className="w-full transition-shadow duration-300 hover:shadow-lg text-gray-600 hover:border hover:border-gray-100 m-2 pt-4">
      <td className="py-2">
        <div className="flex items-center gap-2 p-2">
          <div
            className={clsx('w-4 h-4 rounded-full', {
              'bg-red-600': task?.stage === 'todo',
              'bg-yellow-600': task?.stage === 'in progress',
              'bg-green-600': task?.stage === 'completed',
            })}
          />
          <p className="text-base text-black">{task?.title}</p>
        </div>
      </td>

      <td className="py-2">
        <div className="flex items-center justify-start gap-2">
          <span className={clsx('text-lg', {
            'text-red-600': task?.priority === 'high',
            'text-yellow-600': task?.priority === 'medium',
            'text-green-600': task?.priority === 'low',
          })}>
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

      {!user.isAdmin && (
        <td className="py-2 hidden md:block">
          <div className="flex items-center justify-start text-base text-gray-600 pt-2">
            {formatDate(task?.due)}
          </div>
        </td>
      )}
    </tr>
  );

  return (
    <div className="bg-white px-2 md:px-4 pt-2 pb-4 transition-shadow duration-300 hover:shadow-lg hover:shadow-cyan-100 rounded">
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
  const { data } = useGetTeamListQuery();

  // Table header part
  const TableHeader = () => (
    <thead className="">
      <tr className="">
        <th className="text-black text-left text-lg pb-2">Users</th>
      </tr>
    </thead>
  );

  // Table row part
  const TbRow = ({ user }) => (
    <tr className="transition-shadow duration-300 hover:shadow-lg text-gray-600 hover:border hover:border-gray-100 m-2 rounded-t-lg">
      <td className="w-full py-2 p-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700">
            <span className="text-center">{getInitials(user.name)}</span>
          </div>
          <p>{user.name}</p>
          <span className="text-xs text-black">{user.title}</span>
        </div>
      </td>
      <td className="py-2 p-2">{user.role}</td>
    </tr>
  );

  return (
    <div className="bg-white h-fit px-4 md:px-6 py-4 transition-shadow duration-300 hover:shadow-lg hover:shadow-cyan-100 rounded ">
      <table className="w-full mb-5">
        <TableHeader />
        <div className="w-full max-h-80 overflow-y-auto">
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
      icon: <FaTasks />,
      bg: "bg-gradient-to-br from-blue-500 to-green-300",
      lstm: 67,
    },
    {
      _id: "4",
      label: "TODOS",
      total: toDo(object),
      icon: <LiaTasksSolid />,
      bg: "bg-gradient-to-br from-blue-500 to-green-300",
      lstm: 47,
    },
    {
      _id: "3",
      label: "IN PROGRESS ",
      total: inProg(object),
      icon: <TbProgress  />,
      bg: "bg-gradient-to-br from-blue-500 to-green-300",
      lstm: 41,
    },
    {
      _id: "2",
      label: user.isAdmin ? "COMPLETED PROJECTS" : "COMPLETED TASK",
      total: getComp(object),
      icon: <MdTaskAlt  />,
      bg: "bg-gradient-to-br from-blue-500 to-green-300",
      lstm: 53,
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
        <div className={`flex-1 h-full ${!user.isAdmin ? "w-full" : "w-2/3"}`}>
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
