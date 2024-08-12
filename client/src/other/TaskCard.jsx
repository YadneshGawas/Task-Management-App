/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import clsx from "clsx";
import React from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import {
  BGS,
  BGSTYLES,
  PRIORITYSTYLES,
  TASK_TYPE,
  formatDate,
} from "../assets/index";
import TaskDialog from "../other/task/TaskDialog";
import { useGetUsersQuery } from "../redux/slice/api/userApi";
import CardUsers from "./CardUsers";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);

  let uTeam = [];
  if (task && task.uTeam) {
    uTeam = task?.uTeam?.map((user) => ({
      name: user.name,
      email: user.email,
      role: user.role,
    }));
  }

  let tasks = [];
  if (task && task.tasks) {
    tasks = task?.tasks?.map((obj) => ({
      title: obj.title,
      stage: obj.stage,
    }));
  }
  console.log("From task card=>", tasks);

  const isTasksPage = location.pathname.includes("/task");

  const getTasks = () => {
    if (isTasksPage && user.isAdmin) {
      return task?.subTasks?.length;
    } else if (user.isAdmin) {
      return task?.tasks?.length;
    } else {
      console.log("Tasks from TaskCard=>", task);
      return task?.subTasks?.length;
    }
  };

  const getCompleted = () => {
    if (isTasksPage && user.isAdmin) {
      const completedSubtasksCount =
        task?.subTasks?.filter((subtask) => subtask.stage === "completed")
          .length || 0;
      return completedSubtasksCount;
    } else if (user.isAdmin) {
      const completedSubtasksCount =
        task?.tasks?.filter((subtask) => subtask.stage === "completed")
          .length || 0;
      return completedSubtasksCount;
    } else {
      const completedSubtasksCount =
        task?.subTasks?.filter((subtask) => subtask.stage === "completed")
          .length || 0;
      return completedSubtasksCount;
    }
  };

  return (
    <>
      <div>
        <div className="w-full h-fit bg-white shadow-md rounded-xl">
          <div
            className={clsx(
              "w-full py-2 rounded-t-xl",
              BGSTYLES[task?.priority]
            )}
          ></div>
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
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">
                  {task?.projectTitle}
                </span>
                <span className="text-sm text-gray-600">
                  Created On: {formatDate(new Date(task?.date))}
                </span>
                <span className="text-sm text-gray-600">
                  Due On: {formatDate(new Date(task?.due))}
                </span>
              </div>
            </>

            <div className="w-full border-t border-gray-200 my-2" />
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {/* <div className="flex gap-1 items-center text-sm text-gray-600" title="Activities">
                  <BiMessageAltDetail />
                  <span>{task?.activities?.length}</span>
                </div> */}
                {isTasksPage && 
                <div className="flex gap-1 items-center text-sm text-gray-600 " title="Assets">
                  <MdAttachFile />
                  <span>{task?.assets?.length}</span>
                </div>
                }
                <div className="flex gap-1 items-center text-sm text-gray-600 " title="Pending / Completed">
                  <FaList />
                  <span>
                    {getCompleted()}/{getTasks()}
                  </span>
                </div>
              </div>

              <div className="flex flex-row-reverse">
                {task?.uTeam?.map((m, index) => {
                  return (
                    <div
                      key={index}
                      className={clsx(
                        "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                        BGS[index % BGS?.length]
                      )}
                    >
                      <CardUsers user={m} />
                    </div>
                  );
                })}
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
