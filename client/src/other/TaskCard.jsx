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
import { useNavigate } from "react-router-dom";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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

  console.log("From task card=>", task);

  const isTasksPage = location.pathname.includes("/task");

  const handleNavigateonClick = () => {
    const taskId = task.id;
    if (isTasksPage) {
      navigate(`/tasks/${taskId}`);
    } else {
      navigate(`/projects/${taskId}/tasks`);
    }
  };

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
    <div>
      <div
        className="w-full h-fit bg-white rounded-xl transition-shadow duration-300 hover:shadow-xl"
        onClick={handleNavigateonClick}
      >
        <div
          className={clsx("w-full py-2 rounded-t-xl", BGSTYLES[task?.priority])}
        ></div>
        <div className="pt-1 px-4 pb-4">
          <div className="w-full flex justify-between pt-1">
            <div
              className={clsx(
                "flex flex-1 gap-1 items-center text-sm font-medium",
                PRIORITYSTYLES[task?.priority]
              )}
            >
              <span className="text-lg">{ICONS[task?.priority]}</span>
              <span className="uppercase">{task?.priority} Priority</span>
            </div>

            <div
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              {!isTasksPage && <TaskDialog task={task} />}
            </div>
          </div>

          <>
            <div className="flex items-center gap-2">
              <div
                className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
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
              {/* {isTasksPage && (
                <div
                  className="flex gap-1 items-center text-sm text-gray-600 "
                  title="Assets"
                >
                  <MdAttachFile />
                  <span>{task?.assets?.length}</span>
                </div>
              )} */}
              <div
                className="flex gap-1 items-center text-sm text-gray-600 "
                title="Pending / Completed"
              >
                <FaList />
                <span>
                  {getTasks() > 0
                    ? `${Math.round((getCompleted() / getTasks()) * 100)}%`
                    : "0%"}
                </span>
              </div>
            </div>

            <div className="flex flex-row-reverse">
              {task?.uTeam?.slice(0, 10).map((m, index) => {
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
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
