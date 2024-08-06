/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Dialog } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiImages } from "react-icons/bi";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useAddProjectMutation,
  useGetProjectQuery,
} from "../../redux/slice/api/projApi.js";
import Button from "../Button";
import SelectList from "../SelectList";
import Textbox from "../Textbox";
import Wrapper from "../Wrapper";
import LeadsList from "./LeadsList";
import UserList from "./UserList";
import { useAddTaskMutation } from "../../redux/slice/api/taskApi.js";

const LISTS = ["todo", "in progress", "completed"];
const PRIORITY = ["high", "medium", "low"];

const uploadedFileURLs = [];

const AddTask = ({ open, setOpen, taskData }) => {
  //console.log(taskData);

  const { projectId } = useParams();
  const { refetch } = useGetProjectQuery();

  //Getch details of person reatong the proj from local storage
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userid = user._id;

  const location = useLocation();

  const getTitle = () => {
    const isTasksPage = location.pathname.includes("/task");
    if (isTasksPage) {
      return "ADD TASK";
    }
    return "ADD PROJECT";
  };

  const getPlaceholder = () => {
    const isTasksPage = location.pathname.includes("/task");
    if (isTasksPage) {
      return "Task Name";
    }
    return "Project Name";
  };

  const getDate = () => {
    const isTasksPage = location.pathname.includes("/task");
    if (isTasksPage) {
      return "Task Created On";
    }
    return "Project Created On";
  };

  const getStage = () => {
    const isTasksPage = location.pathname.includes("/task");
    if (isTasksPage) {
      return "Task Stage";
    }
    return "Project Stage";
  };

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: today,
      title: taskData?.title,
    },
  });

  const [lTeam, setLTeam] = useState([]);

  const [uTeam, setUTeam] = useState([]);

  const [stage, setStage] = useState(null);
  const [priority, setPriority] = useState(null);

  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [addtask] = useAddTaskMutation();

  const projId = taskData?.id;

  const submitHandler = async (data) => {
    try {
      const tskData = { ...data, uTeam, stage, priority, projId, projectId };
      console.log(tskData);
      const res = await addtask(tskData).unwrap();
      console.log(res);
      refetch();
      toast.success(res?.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (taskData) {
      if (
        taskData?.lTeam &&
        taskData?.uTeam &&
        taskData?.priority &&
        taskData?.stage
      ) {
        setLTeam(taskData?.lTeam);
        setUTeam(taskData?.uTeam);
        setPriority(taskData?.priority);
        setStage(taskData?.stage);
      }
    }
  }, [taskData]);

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <>
      <Wrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {taskData ? "UPDATE PROJECT" : getTitle()}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder={getPlaceholder()}
              type="text"
              name="title"
              label={getPlaceholder()}
              className="w-full rounded"
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />

            <Textbox
              placeholder="Enter description"
              type="text"
              name="desc"
              label={getPlaceholder()}
              className="w-full rounded"
              register={register("desc")}
              error={errors.title ? errors.title.message : ""}
            />

            <UserList setUTeam={setUTeam} uTeam={uTeam} />

            <div className="flex gap-4">
              <SelectList
                label={getStage()}
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <Textbox
                placeholder="Date"
                type="date"
                name="default"
                label={getDate()}
                read={true}
                className="w-full rounded"
                defaultValue={new Date().toISOString().split("T")[0]}
                register={register("date", {
                  required: "Date is required!",
                })}
                error={errors.date ? errors.date.message : ""}
              />
            </div>

            <div className="flex gap-4">
              <Textbox
                placeholder="Date"
                type="date"
                name="due"
                label="Due Date"
                read={false}
                className="w-full rounded"
                register={register("due", {
                  required: "Date is required!",
                })}
                error={errors.date ? errors.date.message : ""}
              />

              <SelectList
                label="Priority Level"
                lists={PRIORITY}
                selected={priority}
                setSelected={setPriority}
              />
            </div>

            <div className="inline-block items-center justify-start mt-4">
              <label
                className="inline-flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                htmlFor="imgUpload"
              >
                <input
                  type="file"
                  className="hidden"
                  id="imgUpload"
                  onChange={(e) => handleSelect(e)}
                  accept=".jpg, .png, .jpeg"
                  multiple={true}
                />
                <BiImages />
                <span>Add Assets</span>
              </label>
            </div>

            <div className="bg-gray-50 pb-5 pt-2 inline-block sm:flex sm:flex-row-reverse gap-4">
              {uploading ? (
                <span className="text-sm py-2 text-red-500">
                  Uploading assets
                </span>
              ) : (
                <Button
                  label="Submit"
                  type="submit"
                  className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                />
              )}

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          </div>
        </form>
      </Wrapper>
    </>
  );
};

export default AddTask;
