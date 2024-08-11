/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Dialog } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiImages } from "react-icons/bi";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import Button from "../Button";
import SelectList from "../SelectList";
import Textbox from "../Textbox";
import Wrapper from "../Wrapper";
import UserList from "./UserList";
import {
  useAddTaskMutation,
  useGetTaskQuery,
} from "../../redux/slice/api/taskApi.js";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable
} from "firebase/storage";
import { app } from "../../assets/firebase";

const LISTS = ["todo", "in progress", "completed"];
const PRIORITY = ["high", "medium", "low"];

const uploadedFileURLs = [];

const AddTask = ({ open, setOpen, taskData }) => {
  //console.log(taskData);
  let userTeam = [];

  if (taskData && taskData.uTeam) {
    userTeam = taskData?.uTeam?.map((user) => ({
      id: user._id,
    }));
  }

  const uid = userTeam.map(item => item.id);

  const { projectId } = useParams();
  const { refetch } = useGetTaskQuery();

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
      date: taskData
        ? new Date(taskData?.date).toISOString().split("T")[0]
        : today,
      title: taskData?.title,
      desc: taskData?.desc,
      due: taskData
        ? new Date(taskData?.due).toISOString().split("T")[0]
        : today,
    },
  });

  const [uTeam, setUTeam] = useState([]);
  const [stage, setStage] = useState(null);
  const [priority, setPriority] = useState(null);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);


  const [addtask] = useAddTaskMutation();
  const taskId = taskData?.id;
  const URLS = taskData?.assets ? [...taskData.assets] : []; 

  const submitHandler = async (data) => {
    for ( const file of assets){
      setUploading(true);
      try{
        await uploadFile(file);
      }catch(error){
        console.error("Error uploading file", error.message);
        return;
      }finally{
        setUploading(false)
      }
    }
    try {
      const tskData = { ...data, uTeam, stage, priority, taskId, projectId, assets: [...URLS, ...uploadedFileURLs] };
      console.log("Before sending=>",tskData);
      const res = await addtask(tskData).unwrap();
      console.log(res);
      refetch();
      toast.success(res?.message);
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (taskData) {
      if (taskData?.uTeam && taskData?.priority && taskData?.stage) {
        setUTeam(uid);
        setPriority(taskData?.priority);
        setStage(taskData?.stage);
      }
    }
  }, [taskData]);

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  const uploadFile = async(file) => {
    const storage = getStorage(app);
    
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, name);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log("Uploading");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            uploadedFileURLs.push(downloadURL);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
        }
      )
    });
  };

  return (
    <>
      <Wrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {taskData ? "UPDATE TASK" : getTitle()}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-3">
            <Textbox
              placeholder={getPlaceholder()}
              type="text"
              name="title"
              label={getPlaceholder()}
              className="w-full rounded"
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />

            <UserList setUTeam={setUTeam} uTeam={uTeam} />

            <div className="flex gap-2">
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

            <div className="bg-white pb-5 pt-2 inline-block sm:flex sm:flex-row-reverse gap-4">
              {uploading ? (
                <span className="text-sm py-2 text-red-500">
                  Uploading assets
                </span>
              ) : (
                <Button
                  label="Submit"
                  type="submit"
                  className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto rounded-md"
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
