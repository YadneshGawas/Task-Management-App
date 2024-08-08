/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useDeleteSubtaskMutation } from "../../redux/slice/api/taskApi";
import ConfirmatioDialog from "../Dialogs";
import AddSubTask from "./AddSubTask";
import { useParams } from "react-router-dom";

const SubTaskDialog = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [delTask] = useDeleteSubtaskMutation();

  const { taskId } = useParams();

  const deleteClicks = () => {
    setOpenDialog(true);
  };

  const deleteHandler = async () => {
    try {
      setOpenDialog(false);
      const res = await delTask({
        id: task._id,
        taskId: taskId,
      }).unwrap();
      toast.success(res?.message);
      window.location.reload();
      // console.log(task._id)
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // console.log("TASK ID HERE=>", task._id);

  const items = [
    {
      label: "Edit",
      icon: <MdOutlineEdit className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => setOpenEdit(true),
    },
  ];

  return (
    <>
      <div>
        <Menu as="div" className=" relative inline-block text-left">
          <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 mb-2 text-sm font-medium text-gray-600 ">
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
            <Menu.Items className="absolute p-4 right-0 mt-2 mb-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
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

      {openEdit && (
        <AddSubTask open={openEdit} setOpen={setOpenEdit} taskData={task} />
      )}

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default SubTaskDialog;
