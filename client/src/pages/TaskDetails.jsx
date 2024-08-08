/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaBug, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import AddSubTask from "../other/task/AddSubTask";
import SubTaskDialog from "../other/task/SubTaskDialog";
import Title from "../other/Title";
import {
  useGetTaskQuery,
  usePostActivityMutation,
  useUpdateDescMutation,
} from "../redux/slice/api/taskApi";
import { useGetUsersQuery } from "../redux/slice/api/userApi";
import { TASK_TYPE, getInitials } from "./../assets/index";
import Button from "./../other/Button";
import Loading from "./../other/Loader";
import Tabs from "./../other/Tabs";
import TextEditor from "../other/TextEditor";
import { useForm } from "react-hook-form";

const assets = [];

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
];

const TASKTYPEICON = {
  commented: (
    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
      <MdOutlineMessage />,
    </div>
  ),
  started: (
    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className="text-red-600">
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  working: (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "Working",
  "Commented",
  "Bug",
  "Assigned",
];

const TaskDetails = () => {
  const location = useLocation();
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [desc, setDesc] = useState("");

  const { user } = useSelector((state) => state.auth);

  const { data, refetch: taskRefetch } = useGetTaskQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let tasks = [];
  if (data && data.tasks) {
    tasks = data.tasks.map((task) => ({
      id: task._id,
      lTeam: task.lTeam,
      title: task.title,
      date: task.date,
      desc: task.desc,
      due: task.due,
      activities: task.activities,
      subTasks: task.subTasks,
      priority: task.priority,
      projectId: task.projectId,
      stage: task.stage,
      assets: task.assets,
      uTeam: task.uTeam,
      creator: task.creator,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));
  }

  const { taskId } = useParams();

  const task = tasks.find((task) => task.id === taskId);

  const descStat = task?.desc?.length > 0;
  console.log("Description:", task?.activities);

  const { data: users, refetch } = useGetUsersQuery(taskId);

  useEffect(() => {
    refetch();
    taskRefetch();
    if (task?.desc) {
      setDesc(task?.desc);
    }
  }, [refetch, taskRefetch, users]);

  const getDesc = () => {
    if (descStat) {
      return task?.desc;
    } else {
      return "No description";
    }
  };

  const [update] = useUpdateDescMutation();

  const submitHandler = async () => {
    try {
      const data = { desc, taskId };
      console.log(data);
      const res = await update(data).unwrap();
      console.log(res);
      refetch();
      toast.success("Description Updated");
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return loading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full flex flex-col gap-3 mb-3 overflow-y-hidden text-sm">
      <div className="flex items-center justify-between">
        <Title title={task?.title} />

        {/* <Button
          onClick={() => setOpen(true)}
          label="Add Sub Task"
          icon={<IoMdAdd className="text-lg" />}
          className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
        /> */}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
          <>
            <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-md p-5 overflow-y-auto">
              {/* LEFT */}
              <div className="w-full md:w-1/2 space-y-1">
                <div className="flex items-center gap-5">
                  <div
                    className={clsx(
                      "flex gap-1 items-center text-xs font-semibold px-3 py-1 rounded-full",
                      PRIORITYSTYLES[task?.priority],
                      bgColor[task?.priority]
                    )}
                  >
                    <span className="text-lg">{ICONS[task?.priority]}</span>
                    <span className="uppercase">{task?.priority} Priority</span>
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

                <p className="text-gray-500 pb-1">
                  Created At: {new Date(task?.date).toDateString()}
                </p>

                <div className="flex items-center gap-0 p-2 border-y border-gray-200">
                  <div className="space-x-2">
                    <span className="font-semibold">Assets :</span>
                    <span>{task?.assets?.length}</span>
                  </div>

                  <span className="text-gray-400">&nbsp;|&nbsp;</span>

                  <div className="space-x-2">
                    <span className="font-semibold">Sub-Task :</span>
                    <span>{task?.subTasks?.length}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit(submitHandler)} className="">
                  <div className="w-full flex flex-wrap">
                    <div className="text-gray-600 font-semibold test-sm mt-3 mb-2">
                      <p>DESCRIPTION</p>
                    </div>
                    <TextEditor content={desc} setContent={setDesc} />
                    {user.isAdmin && (
                      <Button //Visible only if admin
                        type="submit"
                        label="ADD DESCRIPTION"
                        icon={<IoMdAdd className="text-lg" />}
                        className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 mt-2 mb-3 2xl:py-2.5"
                      />
                    )}
                  </div>
                </form>

                <p className="text-gray-600 font-semibold test-sm">TASK TEAM</p>
                <div className="py-1 max-h-32 overflow-y-auto">
                  <div className="space-y-1">
                    {users?.map((m, index) => (
                      <div
                        key={index}
                        className="flex gap-4 py-2 items-center border-t border-gray-200"
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
                          <span className="text-gray-500">{m?.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 py-6">
                  <p className="text-gray-500 font-semibold text-sm">
                    SUB-TASKS
                  </p>

                  <div className="space-y-1 overflow-y-auto pb-4 px-2 max-h-auto">
                    {task?.subTasks?.map((el, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-2 transition-shadow duration-300 hover:shadow-lg hover:border hover:border-gray-300 rounded-lg"
                      >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-50-200">
                          <MdTaskAlt className="text-violet-600" size={26} />
                        </div>
                        <div className="flex flex-col space-y-2 pb-2 flex-grow">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-row space-x-2">
                              <p className="text-gray-700">{el?.title}</p>
                              <span
                                className={clsx(
                                  "h-6 px-2 py-0.5 text-center text-sm rounded-full font-semibold",
                                  TASK_TYPE_SUB[el?.stage],
                                  STAGE_TYPE[el?.stage]
                                )}
                              >
                                {el?.stage}
                              </span>
                            </div>
                            <SubTaskDialog task={el} />
                          </div>
                          <p>{el?.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button //Visible only if admin
                    type="button"
                    label="ADD SUBTASK"
                    onClick={() => setOpen(true)} //set up the button to add the description to the db
                    className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
                    icon={<IoMdAdd className="text-lg" />}
                  />
                </div>
              </div>
              {/* RIGHT */}
              <div className="w-full md:w-1/2 space-y-8">
                <p className="text-lg font-semibold">ASSETS</p>

                <div className="w-full grid grid-cols-2 gap-4">
                  {task?.assets?.map((el, index) => (
                    <img
                      key={index}
                      src={el}
                      alt={task?.title}
                      className="w-full rounded h-28 md:h-36 2xl:h-52 cursor-pointer transition-all duration-700 hover:scale-125 hover:z-50"
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Activities activity={task?.activities} id={taskId} refetch={taskRefetch} />
          </>
        )}
      </Tabs>
      <AddSubTask open={open} setOpen={setOpen} />
    </div>
  );
};

const Activities = ({ activity, id, refetch }) => {
  const [selected, setSelected] = useState(act_types[0]);
  const [text, setText] = useState("");
  const isLoading = false;

  const [postTaskActivity] = usePostActivityMutation();

  const handleSubmit = async () => {
    try{
      const result = await postTaskActivity({
        type: selected?.toLowerCase(),
        activity: text,
        id: id,
      }).unwrap();
      console.log(result);
      setText("");
      toast.success(result?.message);
      console.log(activity);
      refetch();
    }catch(error){
      console.log(error);
      toast.error(error?.data?.message || error.error)
    }
  };

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
          <p className="font-semibold">{item?.by?.name}</p>
          <div className="text-gray-500 space-y-2">
            <span className="capitalize">{item?.type}</span>
            <span className="text-sm">{moment(item?.date).fromNow()}</span>
          </div>
          <div className="text-gray-700">{item?.activity}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex gap-10 2xl:gap-20 min-h-screen px-10 py-8 bg-white shadow rounded-md justify-between overflow-y-auto">
      <div className="w-full md:w-1/2">
        <h4 className="text-gray-600 font-semibold text-lg mb-5">Activities</h4>

        <div className="w-full">
          {activity?.map((el, index) => (
            <Card
              key={index}
              item={el}
              isConnected={true}
            />
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/3">
        <h4 className="text-gray-600 font-semibold text-lg mb-5">
          Add Activity
        </h4>
        <div className="w-full flex flex-wrap gap-5">
          {act_types.map((item, index) => (
            <div key={item} className="flex gap-2 items-center">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={selected === item ? true : false}
                onChange={(e) => setSelected(item)}
              />
              <p>{item}</p>
            </div>
          ))}
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type ......"
            className="bg-white w-full mt-10 border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-blue-500"
          ></textarea>
          {isLoading ? (
            <Loading />
          ) : (
            <Button
              type="button"
              label="Submit"
              onClick={handleSubmit}
              className="bg-blue-600 text-white rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default TaskDetails;
