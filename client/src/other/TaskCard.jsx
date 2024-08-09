/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import clsx from "clsx";
import React, { useState } from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { BGS, TASK_TYPE, formatDate, BGSTYLES, PRIORITYSTYLES } from "../assets/index";
import TaskDialog from "../other/task/TaskDialog";
import UserInfo from "../other/UserInfo";
import { useSelector } from "react-redux";
import { getInitials } from './../assets/index';

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);

  const [open,setOpen] = useState(false);

  const [selected,setSelected] = useState(null);

  const getTasks = () => {
    const isTasksPage = location.pathname.includes("/task");
    if (isTasksPage && user.isAdmin) {
      return task?.subTasks?.length;
    } else if (user.isAdmin) {
      return task?.tasks?.length;
    } else {
      return task?.subTasks?.length;
    }
  };

  const getCompleted = () => {
    const isTasksPage = location.pathname.includes("/task");
    if (isTasksPage && user.isAdmin) {
      const completedSubtasksCount = task?.subTasks?.filter(subtask => subtask.stage === 'completed').length || 0;
      console.log(completedSubtasksCount);
      return completedSubtasksCount;
    } else if (user.isAdmin) {
      return task?.tasks?.length;
    } else {
      return task?.subTasks?.length;
    }
  };

  return (
    <>
      <div>
        <div className="w-full h-fit bg-white shadow-md rounded-xl">
          <div className={clsx("w-full py-2 rounded-t-xl",BGSTYLES[task?.priority])}></div>
          <div className="pt-1 px-4 pb-4">
            <div className="w-full flex justify-between">
              <div
                className={clsx(
                  "flex flex-1 gap-1 items-center text-sm font-medium",
                  PRIORITYSTYLES[task?.priority]
                )}
              >
                <span className="text-lg">{ICONS[task?.priority]}</span>
                <span className="uppercase">{task?.priority} Priority</span>
              </div>

              <TaskDialog task={task} />
            </div>

            <>
              <div className="flex items-center gap-2">
                <div
                  className={clsx(
                    "w-4 h-4 rounded-full",
                    TASK_TYPE[task.stage]
                  )}
                />
                <h4 className="line-clamp-1 text-black">{task?.title}</h4>
              </div>
              <span className="text-sm text-gray-600">
                {formatDate(new Date(task?.date))}
              </span>
            </>

            <div className="w-full border-t border-gray-200 my-2" />
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="flex gap-1 items-center text-sm text-gray-600">
                  <BiMessageAltDetail />
                  <span>{task?.activities?.length}</span>
                </div>
                <div className="flex gap-1 items-center text-sm text-gray-600 ">
                  <MdAttachFile />
                  <span>{task?.assets?.length}</span>
                </div>
                <div className="flex gap-1 items-center text-sm text-gray-600 ">
                  <FaList />
                  <span>{getCompleted()}/{getTasks()}</span>
                </div>
              </div>

              <div className="flex flex-row-reverse">
                {task?.uTeam?.map((m, index) => (
                  <div
                    key={index}
                    className={clsx(
                      "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                      BGS[index % BGS?.length]
                    )}
                  >
                  
                  {/* <UserInfo open={open} setOpen={open} userData={m} /> */}
                  </div>
                ))}
              </div>
            </div>

            {/* sub tasks */}
            {/* {task?.subTasks?.length > 0 ? (
              <div className="py-2 border-t border-gray-200">
                <h5 className="text-base line-clamp-1 text-black">
                  {task?.subTasks[0].title}
                </h5>

                <div className="p-4 space-x-8">
                  <span className="text-sm text-gray-600">
                    {formatDate(new Date(task?.subTasks[0]?.date))}
                  </span>
                  <span className="bg-blue-600/10 px-3 py-1 rounded-full text-blue-700 font-medium">
                    {task?.subTasks[0].tag}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="py-4 border-t border-gray-200">
                  <span className="text-gray-500">
                    {user.isAdmin ? "NO TASKS" : "NO SUBTASKS"}
                  </span>
                </div>
              </>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
