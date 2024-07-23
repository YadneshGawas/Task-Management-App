/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { BiImages } from "react-icons/bi";
import { useForm } from "react-hook-form";
import Wrapper from "../Wrapper";
import Textbox from "./../Textbox";
import UserList from "./UserList";
import SelectList from "./../SelectList";
import Button from "./../Button";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const uploadedFileURLs = [];

const AddTask = ({ proj, open, setOpen }) => {
  const { user } = useSelector((state) => state.auth);

  const location = useLocation();

  const id = proj?._id;
  console.log(id);

  const getTitle = () => {
    const isTasksPage = location.pathname.includes("/tasks");
    if (isTasksPage) {
      return "ADD TASK";
    }
    return "ADD PROJECT";
  };

  const getPlaceholder = () => {
    const isTasksPage = location.pathname.includes("/tasks");
    if (isTasksPage) {
      return "Task Name";
    }
    return "Project Name";
  };

  const getDate = () => {
    const isTasksPage = location.pathname.includes("/tasks");
    if (isTasksPage) {
      return "Task Created On";
    }
    return "Project Created On";
  };

  const getStage = () => {
    const isTasksPage = location.pathname.includes("/tasks");
    if (isTasksPage) {
      return "Task Stage";
    }
    return "Project Stage";
  };

  const task = "";

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: today
    }
  });

  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORIRY[2]
  );
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const submitHandler = () => {};

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
            {user.isAdmin ? getTitle(): "ADD TASK"}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder={user.isAdmin ? getPlaceholder(): "Task Title"}
              type="text"
              name="title"
              label={user.isAdmin ? getPlaceholder(): "Task Title"}
              className="w-full rounded"
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />

            <UserList setTeam={setTeam} team={team} />

            <div className="flex gap-4">
              <SelectList
                label={user.isAdmin ? getStage() : "Task Stage"}
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <Textbox
                placeholder="Date"
                type="date"
                name="default"
                label={user.isAdmin ? getDate() : "Task Date"}
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
                name="date"
                label="Due Date"
                read={false}
                className="w-full rounded"
                register={register("date", {
                  required: "Date is required!",
                })}
                error={errors.date ? errors.date.message : ""}
              />

              <SelectList
                label="Priority Level"
                lists={PRIORIRY}
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
