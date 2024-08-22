/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { FaRegCopyright } from "react-icons/fa6";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { AiFillThunderbolt } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { setOpenSidebar } from "../redux/slice/authS";

const Sidebar = () => {

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const location = useLocation();

  const path = location.pathname.split("/")[1];

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }) => {
    return (
      <Link
        to={el.link}
        onClick={closeSidebar}
        className={clsx(
          "w-full lg:w-4/5 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]",
          path === el.link.split("/")[0] ? "bg-blue-400 text-white" : ""
        )}
      >
        {el.icon}
        <span className='hover:text-[#2564ed]'>{el.label}</span>
      </Link>
    );
  };

  const linkData = [
    {
      label: "Dashboard",
      link: "dashboard",
      icon: <MdDashboard />,
    },
    user.isAdmin
      ? {
          label: "Projects",
          link: "projects",
          icon: <FaTasks />,
        }
      : {
          label: "Tasks",
          link: "tasks",
          icon: <MdTaskAlt />,
        },
  ];

  if (user.isAdmin) {
    linkData.push({
      label: "Team",
      link: "team",
      icon: <FaUsers />,
    });
  }

  return (
    <div className='w-full h-full flex flex-col gap-6 pl-3'>
      <h1 className='flex gap-1 pt-6 items-center'>
        <p className='bg-gradient-to-br from-blue-400 to-green-300 p-2 rounded-full'>
          <AiFillThunderbolt className='text-white text-2xl font-black' />
        </p>
        <span className='text-2xl font-bold text-black'>Task Manager</span>
      </h1>

      <div className='flex-1 flex flex-col gap-y-5 pt-2 pb-5'>
        {linkData.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>

      <div>
        <div className=" flex items-center text-gray-500">
        <FaRegCopyright/>
        <span className="text-gray-500 font-thin px-1">
          Made by Yadnesh Gawas
        </span>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
