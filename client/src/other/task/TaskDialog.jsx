/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useDelProjMutation,
  useGetProjectQuery,
} from "../../redux/slice/api/projApi";
import {
  useDelTaskMutation,
  useGetTaskQuery,
} from "../../redux/slice/api/taskApi";
import ConfirmatioDialog from "../Dialogs";
import AddProject from "./AddProject";
import AddTask from "./AddTask";

const TaskDialog = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const [delTask] = useDelTaskMutation();
  const [delProj] = useDelProjMutation();
  const { refetch: refetchProjects } = useGetProjectQuery();
  const { refetch: refetchTasks } = useGetTaskQuery();

  const deleteClicks = () => {
    setOpenDialog(true);
  };

  const location = useLocation();
  const isTasksPage = location.pathname.includes("/tasks");

  const deleteHandler = async () => {
    if (isTasksPage) {
      try {
        setOpenDialog(false);
        const res = await delTask({
          id: task.id,
        }).unwrap();
        toast.success(res?.message);
        refetchTasks();
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    } else {
      try {
        const res = await delProj({
          id: task.id,
        }).unwrap();
        toast.success(res?.message);
        refetchProjects();
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const projectId = task.id;
  const taskId = task.id;

  const items = [
    {
      label: "Open",
      icon: <AiTwotoneFolderOpen className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => {
        if (user.isAdmin && isTasksPage) {
          navigate(`/tasks/${taskId}`);
        } else if (user.isAdmin) {
          navigate(`/projects/${projectId}/tasks`);
        } else {
          navigate(`/tasks/${taskId}`);
        }
      },
    },
    {
      label: "Edit",
      icon: <MdOutlineEdit className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => setOpenEdit(true),
    },
  ];

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600 ">
            <BsThreeDots />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute p-4 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1 space-y-2">
                {items.map((el) => (
                  <Menu.Item key={el.label}>
                    {({ active }) => (
                      <button
                        onClick={el?.onClick}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {el.icon}
                        {el.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
              {user.isAdmin && (
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => deleteClicks()}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-red-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <RiDeleteBin6Line
                          className="mr-2 h-5 w-5 text-red-400"
                          aria-hidden="true"
                        />
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {openEdit &&
        (isTasksPage ? (
          <AddTask open={openEdit} setOpen={setOpenEdit} taskData={task} />
        ) : (
          <AddProject open={openEdit} setOpen={setOpenEdit} taskData={task} />
        ))}

      {openDialog && (
        <ConfirmatioDialog
          open={openDialog}
          setOpen={setOpenDialog}
          onClick={deleteHandler}
        />
      )}
    </>
  );
};

export default TaskDialog;
