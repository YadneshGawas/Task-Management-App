/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Dialog } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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

const LISTS = ["todo", "in progress", "completed"];
const PRIORITY = ["high", "medium", "low"];

const AddProject = ({ open, setOpen, taskData }) => {
  let userTeam = [];
  let leadTeam = [];
  console.log("TaskData=>", taskData);

  if (taskData && taskData.uTeam) {
    userTeam = taskData?.uTeam?.map((user) => ({
      id: user._id,
    }));
  }

  if (taskData && taskData.lTeam) {
    leadTeam = taskData?.lTeam?.map((user) => ({
      id: user._id,
    }));
  }

  console.log("LeadTeam=>",leadTeam);
  console.log("UserTeam=>",userTeam);

  const uid = userTeam.map(item => item.id);
  const lid = leadTeam.map(item => item.id);

  const { refetch } = useGetProjectQuery();

  //Getch details of person reatong the proj from local storage
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userid = user._id;
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: taskData
        ? new Date(taskData?.date).toISOString().split("T")[0]
        : today,
      title: taskData?.title,
      due: taskData
        ? new Date(taskData?.due).toISOString().split("T")[0]
        : today,
    },
  });

  const [lTeam, setLTeam] = useState([]);

  const [uTeam, setUTeam] = useState([]);

  const [stage, setStage] = useState(null);
  const [priority, setPriority] = useState(null);



  const [addproj] = useAddProjectMutation();

  const projId = taskData?.id;

  const submitHandler = async (data) => {
    try {
      const projData = { ...data, lTeam, uTeam, stage, priority, projId };
      const res = await addproj(projData).unwrap();
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
        setLTeam(lid);
        setUTeam(uid);
        setPriority(taskData?.priority);
        setStage(taskData?.stage);
      }
    }
  }, [taskData]);

  return (
    <>
      <Wrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {taskData ? "UPDATE PROJECT" : "ADD PROJECT"}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-3">
            <Textbox
              placeholder="Project Name"
              type="text"
              name="title"
              label="Project Name"
              className="w-full rounded"
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />

            <LeadsList setLTeam={setLTeam} admin={userid} lTeam={lTeam} />

            <UserList setUTeam={setUTeam} uTeam={uTeam} />

            <div className="flex gap-4">
              <SelectList
                label="Project Stage"
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <Textbox
                placeholder="Date"
                type="date"
                name="default"
                label="Project Created On"
                read={true}
                className="w-full rounded"
                defaultValue={new Date().toISOString().split("T")[0]}
                register={register("date", {
                  required: "Date is required!",
                })}
                error={errors.date ? errors.date.message : ""}
              />
            </div>

            <div className="flex gap-2">
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

            <div className="bg-white pb-5 pt-2 inline-block sm:flex sm:flex-row-reverse gap-4">
              <Button
                label="Submit"
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto rounded-md"
              />
              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto rounded-md"
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

export default AddProject;
