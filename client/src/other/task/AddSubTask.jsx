/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Button from "../Button";
import Wrapper from "./../Wrapper";
import {
  useAddSubTaskMutation,
} from "../../redux/slice/api/taskApi";
import { toast } from "sonner";
import SelectList from "../SelectList";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const LISTS = ["todo", "in progress", "completed"];
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable
} from "firebase/storage";
import { app } from "../../assets/firebase";
import { BiImages } from "react-icons/bi";
const uploadedFileURLs = [];

const AddSubTask = ({ open, setOpen, taskData }) => {
  const [stage, setStage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: taskData?.title,
    },
  });

  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fileName, setfileName] = useState([]);
  const URLS = taskData?.assets ? [...taskData.assets] : []; 

  const { taskId } = useParams();

  const handleSelect = (e) => {
    setAssets(e.target.files);
    const selectedFiles = e.target.files;
    const filesNameArray = Array.from(selectedFiles).map((file) => file.name);
    setfileName(filesNameArray);
    console.log("FileName =>", filesNameArray);
  };
  
  console.log(taskData);

  let subId = "";
  if (taskData) {
    subId = taskData._id;
  } else {
    subId = "";
  }

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


  const [addsub] = useAddSubTaskMutation();

  const handleOnSubmit = async (data) => {
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
      const d = { ...data, subId, stage, taskId, assets: [...URLS, ...uploadedFileURLs] };
      console.log("Before sending=>",d);
      const res = await addsub(d).unwrap();
      console.log(res);
      toast.success(res?.message);
      setOpen(false);
      //window.location.reload();
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
          <div className="w-full flex overflow-y-auto flex-col p-2 pb-4">
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
            <div className="overflow-x-hidden">
              <ul>
                {fileName.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
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

export default AddSubTask;
