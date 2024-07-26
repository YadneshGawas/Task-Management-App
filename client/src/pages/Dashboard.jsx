/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from "react";
import { useSelector } from "react-redux"; // Import useSelector for Redux
import { PRIOTITYSTYELS, TASK_TYPE } from "../assets/index";
import clsx from "clsx";
/*icons*/
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { FaNewspaper } from "react-icons/fa";
import { LuClipboardEdit } from "react-icons/lu";
import { FaArrowsToDot } from "react-icons/fa6";
import { projects } from "../assets/data";
import { tasks } from "../assets/data";
import { GrCatalog } from "react-icons/gr";
import { getInitials } from "./../assets/index";

const TaskTb = ({ user, tsk }) => {
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
      <tr className="text-black text-left">
        {user.isAdmin ? (
          <th className="py-2 px-5">Project Title</th>
        ) : (
          <th className="py-2 px-5">Task Title</th>
        )}
        <th className="py-2 px-5">Priority</th>
        {user.isAdmin && <th className="py-2 px-5">Team</th>}
        <th className="py-2 px-5">Created At</th>
      </tr>
    </thead>
  );

  //Format date function
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const TbRow = ({ task }) => (
    <tr className="border-b border-gray-300 text-gray-600">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />
          <p className="text-base text-black">{task.title}</p>
        </div>
      </td>

      <td className="py-2">
        <div className="flex items-center justify-start gap-2">
          <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
            {icons["high"]}
          </span>
          <span className="capitalize">HIGH</span>
        </div>
      </td>

      {user.isAdmin && (
        <td className="py-2 pl-4">
          <div className="flex items-center justify-start">
            <p>TeamA</p>
          </div>
        </td>
      )}

      <td className="py-2 pl-7">
        <div className="flex items-center justify-start">
          <p>{formatDate(task.createdAt)}</p>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full md:w-2/3 bg-white px-2 md:px-4 pt-4 pb-4 shadow-blue-100 shadow-xl rounded">
        <table className="w-full">
          <TbHeader />
          <tbody>
            {tsk.map((task, index) => (
              <TbRow key={index} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const UserTb = ({ user, tsk, mems }) => {
  // Table header part
  const TableHeader = () => (
    <thead className="border-b border-gray-300 ">
      <tr className="text-black  text-left">
        <th className="py-2">{user.isAdmin ? "Full Name" : "Team Members"}</th>
        <th className="py-2">Status</th>
        <th className="py-2">Created At</th>
      </tr>
    </thead>
  );

  // Table row part
  const TbRow = ({ func }) => (
    <tr className="border-b border-gray-200  text-gray-600">
      <td className="py-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700">
            <span className="text-center">NA</span>
          </div>

          <div>
            <p>{func.name}</p>
            <span className="text-xs text-black">{func.title}</span>
          </div>
        </div>
      </td>

      <td className="py-2">Active</td>
      <td className="py-2">10-Jul-24</td>
    </tr>
  );

  return (
    <div className="w-full md:w-1/3 bg-white h-fit px-2 md:px-6 py-4 shadow-xl shadow-blue-100 rounded">
      <table className="w-full mb-5">
        <TableHeader />
        <tbody>
          {mems.map((mem, index) => (
            <TbRow key={index} func={mem} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth); // Fetch user from Redux state

  //Dashboard Admin Logic
  const getComp = (projects) => {
    const comp = projects.filter((pro) => pro.stage === "completed");
    //console.log("Completed",comp.length);
    return comp.length;
  };

  const inProg = (projects) => {
    const comp = projects.filter((pro) => pro.stage === "in progress");
    //console.log("In Progress",comp.length);
    return comp.length;
  };

  const toDo = (projects) => {
    const comp = projects.filter((pro) => pro.stage === "todo");
    //console.log("To Do",comp.length);
    return comp.length;
  };

  //Dashboard User Logic
  const usrid = user._id;

  const usrTsk = tasks.filter((task) => {
    const taskMatch = task.team.some((team) => team._id === usrid);
    return taskMatch;
  });

  console.log(usrTsk);

  // const mems = usrTsk.flatMap((task) =>
  //   task.team.map((member) => member.name)
  // );

  const mems = usrTsk.flatMap(task => task.team);
  console.log(typeof(mems));

  const getTComp = usrTsk.filter((tsk) => tsk.stage === "completed");
  const getTTodo = usrTsk.filter((tsk) => tsk.stage === "todo");
  const getTinProg = usrTsk.filter((tsk) => tsk.stage === "in progress");

  const stats = [
    {
      _id: "1",
      label: user.isAdmin ? "TOTAL PROJECTS" : "TOTAL TASK",
      total: user.isAdmin ? projects.length : usrTsk.length,
      icon: <FaNewspaper />,
      bg: "bg-gradient-to-br from-blue-500 to-green-300",
      lstm: 67,
    },
    {
      _id: "2",
      label: user.isAdmin ? "COMPLETED PROJECTS" : "COMPLTED TASK",
      total: user.isAdmin ? getComp(projects) : getTComp.length,
      icon: <MdAdminPanelSettings />,
      bg: "bg-gradient-to-br from-blue-500 to-green-300",
      lstm: 53,
    },
    {
      _id: "3",
      label: "IN PROGRESS ",
      total: user.isAdmin ? inProg(projects) : getTinProg.length,
      icon: <LuClipboardEdit />,
      bg: "bg-gradient-to-br from-blue-500 to-green-300",
      lstm: 41,
    },
    {
      _id: "4",
      label: "TODOS",
      total: user.isAdmin ? toDo(projects) : getTTodo.length,
      icon: <FaArrowsToDot />,
      bg: "bg-gradient-to-br from-blue-500 to-green-300",
      lstm: 47,
    },
  ];

  const Card = ({ label, count, bg, icon, lst }) => {
    return (
      <div
        className={clsx(
          "w-full h-32 bg-gradient-to-br from-blue-100 to-green-100 p-5 hover:shadow-lg rounded-md flex items-center justify-between"
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
        <TaskTb user={user} tsk={usrTsk} />{" "}
        {/* Pass user as a prop to TaskTb */}
        <UserTb user={user} tsk={usrTsk}  mems={mems} />
      </div>
    </div>
  );
};

export default Dashboard;
