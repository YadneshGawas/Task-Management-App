/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CiCalendarDate } from "react-icons/ci";
import { FaFilePdf, FaFileWord, FaTasks, FaThumbsUp } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import {
  MdDelete,
  MdDescription,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlinePriorityHigh,
  MdOutlineUpdate,
  MdTaskAlt,
  MdTitle,
  MdWebAsset,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { SiStagetimer } from "react-icons/si";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ButtonIconOnly from "../other/ButtonIconOnly";
import ConfirmatioDialog from "../other/Dialogs";
import MediaUpload from "../other/MediaUpload";
import AddSubTask from "../other/task/AddSubTask";
import SubTaskDialog from "../other/task/SubTaskDialog";
import TextEditor from "../other/TextEditor";
import Title from "../other/Title";
import {
  useDelMediaMutation,
  useDelTaskMutation,
  useGetTaskDetailsQuery,
  useUpdateDescMutation,
} from "../redux/slice/api/taskApi";
import { useGetUsersQuery } from "../redux/slice/api/userApi";
import { TASK_TYPE, getInitials } from "./../assets/index";
import Button from "./../other/Button";
import Tabs from "./../other/Tabs";
import AddTask from "./../other/task/AddTask";

const TASK_TYPE_SUB = {
  todo: "bg-blue-500",
  "in progress": "bg-yellow-500",
  completed: "bg-green-500",
};

const STAGE_TYPE = {
  todo: "text-white",
  "in progress": "text-white",
  completed: "text-white",
};

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-300",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const PRIORITYSTYLES = {
  high: "text-red-700",
  medium: "text-yellow-700",
  low: "text-blue-700",
};

const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Timeline", icon: <RxActivityLog /> },
  // { title: "Chat", icon: <IoChatbox /> },
];

const TASKTYPEICON = {
  title: (
    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
      <MdTitle />,
    </div>
  ),
  created: (
    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
      <FaThumbsUp size={20} />
    </div>
  ),
  description: (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
      <MdDescription size={14} />
    </div>
  ),
  stage: (
    <div className="text-red-600">
      <SiStagetimer size={24} />
    </div>
  ),
  due: (
    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
      <CiCalendarDate size={24} />
    </div>
  ),
  priority: (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
      <MdOutlinePriorityHigh size={16} />
    </div>
  ),
  asset: (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
      <MdWebAsset size={16} />
    </div>
  ),
  updated: (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
      <MdOutlineUpdate size={16} />
    </div>
  ),
};

const TaskDetails = () => {
  const location = useLocation();
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState(false);
  const [delMedia, setDelMedia] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [desc, setDesc] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { taskId } = useParams();

  const { user } = useSelector((state) => state.auth);
  const [delTask] = useDelTaskMutation();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const { data, refetch: taskRefetch } = useGetTaskDetailsQuery(taskId);

  const assets = data?.tasks?.assets;
  const task = data?.tasks;
  const projectId = task?.projectId;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const hiddenModules = {
    toolbar: false,
    clipboard: {
      matchVisual: false,
    },
  };

  const { data: users, refetch } = useGetUsersQuery(taskId);
  const isTasksPage = location.pathname.includes("/tasks");

  const getFileTypeIcon = (fileUrl) => {
    const lowerCaseUrl = fileUrl.toLowerCase();

    if (
      lowerCaseUrl.includes("jpg") ||
      lowerCaseUrl.includes("jpeg") ||
      lowerCaseUrl.includes("png") ||
      lowerCaseUrl.includes("gif")
    ) {
      return "image";
    } else if (lowerCaseUrl.includes("pdf")) {
      return "pdf";
    } else if (lowerCaseUrl.includes("doc") || lowerCaseUrl.includes("docx")) {
      return "doc";
    }
    return "default";
  };

  useEffect(() => {
    refetch();
    taskRefetch();
    if (task?.desc) {
      setDesc(task?.desc);
    }
  }, [open, openEdit, data]);

  const [update] = useUpdateDescMutation();

  const [deletemedia] = useDelMediaMutation();

  const delHandler = (id) =>{
    setDelMedia(id);
    setOpenDialog2(true);
  }

  const delMediaFunction = async(mediaId) =>{
    try {
      const data = { taskId , mediaId};
      console.log("Before sending=>", data);
      const res = await deletemedia(data).unwrap();
      console.log(res);
      toast.success("Deleted media successfully");
      setOpenDialog2(false);
      taskRefetch(); 
    } catch (error) {
      toast.error("Failed to delete media");
      setOpenDialog(false);
      console.log(error);
    }
  }

  const submitHandler = async () => {
    try {
      const data = { desc, taskId };
      const res = await update(data).unwrap();
      refetch();
      toast.success("Description Updated");
      setOpen(false);

      if (res) {
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const deleteHandler = async () => {
    if (isTasksPage) {
      try {
        setOpenDialog(false);
        const res = await delTask({
          id: task._id,
        }).unwrap();
        toast.success("Deleted Successfully");
        navigate(`/projects/${projectId}/tasks`);
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



  return (
    <div className="w-full flex flex-col gap-3 mb-3 overflow-y-hidden text-sm">
      <div className="flex items-center justify-between">
        <Title title={task?.title} />
      </div>

      <Tabs
        tabs={TABS}
        setSelected={setSelected}
        open={openEdit}
        setOpen={setOpenEdit}
        setOpenDialog={setOpenDialog}
      >
        {
          selected === 0 ? (
            <>
              <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-md p-5 overflow-y-auto rounded-lg">
                <div className="w-full  md:w-1/2 space-y-1">
                  <div className="flex items-center gap-5">
                    <div
                      className={clsx(
                        "flex gap-1 items-center text-xs font-semibold px-3 py-1 rounded-full",
                        PRIORITYSTYLES[task?.priority],
                        bgColor[task?.priority]
                      )}
                    >
                      <span className="text-lg">{ICONS[task?.priority]}</span>
                      <span className="uppercase">
                        {task?.priority} Priority
                      </span>
                    </div>

                    <div className={clsx("flex items-center gap-2")}>
                      <div
                        className={clsx(
                          "w-4 h-4 rounded-full",
                          TASK_TYPE[task?.stage]
                        )}
                      />
                      <span className="text-black uppercase text-sm">
                        {task?.stage}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-black">
                      Created On: {new Date(task?.date).toDateString()}
                    </p>
                    <p className=" text-lg font-bold">
                      Due On: {new Date(task?.due).toDateString()}
                    </p>
                    <div className="border-t border-gray-200"></div>
                  </div>

                  <form onSubmit={handleSubmit(submitHandler)} className="">
                    <div>
                      <div className="text-gray-600 font-semibold text-sm mt-3 mb-2">
                        <p>DESCRIPTION</p>
                      </div>

                      {isEditing ? (
                        <div tabIndex="0">
                          {" "}
                          {/* Focusable to detect blur */}
                          <TextEditor
                            content={desc}
                            setContent={setDesc}
                            modules={modules}
                            className="border border-gray-300 rounded-md p-2" // Optional: Styling for editor
                          />
                          {user.isAdmin && isEditing && (
                            <Button
                              type="submit"
                              label="SAVE"
                              className="flex flex-row gap-1 items-center bg-blue-600 text-white rounded-md py-2 mt-2 mb-3 2xl:py-2.5"
                            />
                          )}
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer rounded-md"
                          onDoubleClick={handleDoubleClick}
                        >
                          <TextEditor
                            content={desc}
                            setContent={setDesc}
                            modules={hiddenModules}
                            status={true}
                            className="border border-gray-300 rounded-md p-2" // Optional: Styling for editor
                          />
                        </div>
                      )}
                    </div>
                  </form>

                  <p className="text-gray-600 pt-4 font-semibold test-sm">
                    TASK TEAM
                  </p>
                  <div className="py-1 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                    <div className="space-y-1">
                      {users?.map((m, index) => (
                        <div
                          key={index}
                          className="flex gap-4 py-2 items-center"
                        >
                          <div
                            className={
                              "w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-blue-600"
                            }
                          >
                            <span className="text-center">
                              {getInitials(m?.name)}
                            </span>
                          </div>

                          <div>
                            <p className="text-sm font-semibold">{m?.name}</p>
                            {/* <span className="text-gray-500">{m?.role}</span> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="py-1">
                    <p className="flex flex-row items-center gap-x-2 justify-start text-gray-500 font-semibold text-sm pt-2 pb-3">
                      SUB-TASKS
                      <ButtonIconOnly
                        onClick={() => setOpen(true)}
                        icon={<IoMdAdd className="text-lg" />}
                        className="outline outline-1 outline-gray-400"
                      />
                    </p>
                    {/* <div className="mt-2">
                      <Button //Visible only if admin
                        type="button"
                        label="ADD SUBTASK"
                        onClick={() => setOpen(true)} //set up the button to add the description to the db
                        className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
                        icon={<IoMdAdd className="text-lg" />}
                      />
                    </div> */}

                    <div className="space-y-1 rounded-lg p-1">
                      {task?.subTasks?.map((el, index) => (
                        <div
                          key={index}
                          className="flex gap-3 p-1 transition-shadow duration-300 hover:shadow-lg rounded-lg"
                        >
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-50-200">
                            <MdTaskAlt className="text-violet-600" size={26} />
                          </div>
                          <div className="flex flex-col pb-1 flex-grow">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-row space-x-2">
                                <p className="text-gray-700">{el?.title}</p>
                              </div>
                              <SubTaskDialog task={el} />
                            </div>
                            <div>
                              <span
                                className={clsx(
                                  "h-6 px-2 py-1 text-center text-sm rounded-full font-semibold",
                                  TASK_TYPE_SUB[el?.stage],
                                  STAGE_TYPE[el?.stage]
                                )}
                              >
                                {el?.stage}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col flex-grow md:w-1/3 ">
                  <div className="w-full space-y-4">
                    <p className="text-lg font-semibold">ASSETS</p>
                    {/* <div className="w-full"> */}
                    <button
                      onClick={() => setMedia(true)}
                      className="w-full flex gap-4 items-center text-sm text-gray-500 font-semibold"
                    >
                      <IoMdAdd className="text-lg" />
                      <span>ADD MEDIA</span>
                    </button>
                    {/* </div> */}
                    <div className="w-full grid grid-cols-3 gap-4">
                      {task?.assets?.map((el, index) => {
                        const fileType = getFileTypeIcon(el.link);
                        return (
                          <div className="relative ">
                            <a
                              key={index}
                              href={el.link}
                              target="_blank" // Opens the link in a new tab
                              rel="noopener noreferrer" // Provides security benefits when opening links in a new tab
                              className="w-full rounded h-28 md:h-36 2xl:h-52 cursor-pointer transition-all hover:scale-105 duration-700 hover:z-50 flex items-center justify-center bg-gray-100"
                            >
                              {fileType === "image" ? (
                                <div className="relative w-full h-full">
                                  <img
                                    src={el.link}
                                    alt={el.desc}
                                    className="w-full h-full object-cover rounded"
                                  />
                                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 text-white text-center text-xs p-2 rounded">
                                    {el.desc}
                                  </div>
                                </div>
                              ) : fileType === "pdf" ? (
                                <FaFilePdf className="text-red-500 text-4xl" />
                              ) : fileType === "doc" ? (
                                <FaFileWord className="text-blue-500 text-4xl" />
                              ) : (
                                <p className="text-gray-500">
                                  Unknown File Type
                                </p>
                              )}
                            </a>
                            <div className="absolute top-2 right-2 z-10">
                              <ButtonIconOnly
                                type="button"
                                className="flex items-center justify-center bg-red-600 rounded-xl w-6 h-6"
                                icon={
                                  <MdDelete className="text-white rounded-lg" />
                                }
                                onClick={() => delHandler(el._id)}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            //selected === 1 ?
            <>
              <Activities
                activity={task?.activities}
                id={taskId}
                refetch={taskRefetch}
              />
            </>
          )
          /*
         : (
          <>
            <Chatbox />
          </>
        )
        */
        }
      </Tabs>

      {openEdit && (
        <AddTask open={openEdit} setOpen={setOpenEdit} taskData={task} />
      )}
      {open && <AddSubTask open={open} setOpen={setOpen} />}
      {openDialog && (
        <ConfirmatioDialog
          open={openDialog}
          setOpen={setOpenDialog}
          onClick={deleteHandler}
        />
      )}
      {openDialog2 && (
        <ConfirmatioDialog
          open={openDialog2}
          setOpen={setOpenDialog2}
          onClick={() => delMediaFunction(delMedia)}
        />
      )}
      {media && <MediaUpload open={media} setOpen={setMedia} />}
    </div>
  );
};

const Activities = ({ activity, id, refetch }) => {
  const Card = ({ item }) => {
    return (
      <div className="flex space-x-4">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-10 h-10 flex items-center justify-center">
            {TASKTYPEICON[item?.type]}
          </div>
          <div className="w-full flex items-center">
            <div className="w-0.5 bg-gray-300 h-full"></div>
          </div>
        </div>

        <div className="flex flex-col gap-y-1 mb-8">
          <div className="text-black space-y-2">
            <span className="capitalize">New Update</span>
          </div>
          <span className="text-sm">{moment(item?.date).fromNow()}</span>
          <div
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: item?.activity }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex gap-10 2xl:gap-20 min-h-screen px-8 py-6 bg-white shadow rounded-md justify-between overflow-y-auto">
      <div className="w-full md:w-1/2">
        <h4 className="text-gray-600 font-semibold text-lg mb-5">Activities</h4>

        <div className="w-full">
          {activity?.map((el, index) => (
            <Card key={index} item={el} isConnected={true} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default TaskDetails;
