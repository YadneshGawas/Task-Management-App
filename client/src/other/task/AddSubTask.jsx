/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Button from "../Button";
import Wrapper from "./../Wrapper";
import {
  useAddSubTaskMutation,
  useGetTaskDetailsQuery,
} from "../../redux/slice/api/taskApi";
import { toast } from "sonner";
import SelectList from "../SelectList";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const LISTS = ["todo", "in progress", "completed"];

const AddSubTask = ({ open, setOpen, taskData }) => {
  const [stage, setStage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: taskData?.title,
      desc: taskData?.desc,
    },
  });

  const { taskId } = useParams();

  let subId = ""
  if(taskData){
     subId = taskData._id;
  }else{
     subId = "";
  }

  const [addsub] = useAddSubTaskMutation();

  const handleOnSubmit = async (data) => {
    try {
      const d = { ...data, subId, stage, taskId };
      const res = await addsub(d).unwrap();
      console.log(res);
      toast.success(res?.message);
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  useEffect(() => {
    if (taskData) {
      if (taskData?.stage) {
        setStage(taskData?.stage);
      }
    }
  }, [taskData]);

  return (
    <>
      <Wrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            <span>{taskData ? "UPDATE SUB-TASK" : "ADD SUB-TASK"}</span>
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Sub-Task title"
              type="text"
              name="title"
              label="Title"
              className="w-full rounded"
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />

            <SelectList
              label="Stage"
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
            />

            <Textbox
              placeholder="Description"
              type="text"
              name="desc"
              label="Description"
              className="w-full rounded"
              register={register("desc")}
              error={errors.desc ? errors.desc.message : ""}
            />
          </div>
          <div className="py-3 mt-4 flex sm:flex-row-reverse gap-4">
            <Button
              type="submit"
              className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto rounded-md"
              label={taskData ? "Update Task" : "Add Task"}
            />

            <Button
              type="button"
              className="bg-white border text-sm font-semibold text-gray-900 sm:w-auto rounded-md"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        </form>
      </Wrapper>
    </>
  );
};

export default AddSubTask;
