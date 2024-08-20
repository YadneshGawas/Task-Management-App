/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Button from "../Button";
import Wrapper from "./../Wrapper";
import {
  useAddSubTaskMutation,
  useDelSubMediaMutation,
  useGetSubtaskQuery,
  useGetTaskDetailsQuery,
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
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../assets/firebase";
import { BiImages } from "react-icons/bi";
import TextEditor from "../TextEditor";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import ButtonIconOnly from "../ButtonIconOnly";
import { MdDelete } from "react-icons/md";
import ConfirmatioDialog from "../Dialogs";
import UserList from "./UserList";
import SingleMember from "../SingleMember";
const uploadedFileURLs = [];

const AddSubTask = ({ open, setOpen, taskData, users }) => {
  const [assignee, setAssignee] = useState([]);
  const [addsub] = useAddSubTaskMutation();
  const [stage, setStage] = useState("Select stage");
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fileName, setfileName] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [delMedia, setDelMedia] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [desc, setDesc] = useState("");
  const URLS = taskData?.assets ? [...taskData.assets] : [];
  const [deletemedia] = useDelSubMediaMutation();
  const { taskId } = useParams();
  const { refetch } = useGetTaskDetailsQuery(taskId);

  let subId = "";
  if (taskData) {
    subId = taskData._id;
  } else {
    subId = "";
  }
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: taskData?.title,
    },
  });

  const delHandler = (el) => {
    setDelMedia(el);
    setOpenDialog(true);
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
    const selectedFiles = e.target.files;
    const filesNameArray = Array.from(selectedFiles).map((file) => file.name);
    setfileName(filesNameArray);
  };

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
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  const hiddenModules = {
    toolbar: false,
    clipboard: {
      matchVisual: false,
    },
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

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

  const uploadFile = async (file) => {
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
      );
    });
  };

  const handleOnSubmit = async (data) => {
    for (const file of assets) {
      setUploading(true);
      try {
        await uploadFile(file);
      } catch (error) {
        console.error("Error uploading file", error.message);
        return;
      } finally {
        setUploading(false);
      }
    }
    try {
      const d = {
        ...data,
        desc,
        subId,
        stage,
        taskId,
        assignee,
        assets: [...uploadedFileURLs],
      };
      console.log("Before sending=>",d);
      const res = await addsub(d).unwrap();
      toast.success(res?.message);
      setIsEditing(false);
      setTimeout(() => {
        setOpen(false);
      }, 500);
      refetch();
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  const delSubMediaFunction = async () => {
    try {
      const data = { taskId, subId, delMedia };
      const res = await deletemedia(data).unwrap();
      setOpenDialog(false);
      console.log(res);
      refetch();
      toast.success("Deleted media successfully");
    } catch (error) {
      toast.error("Failed to delete media");
    }
  };

  useEffect(() => {
    if (taskData) {
      if (taskData?.stage) {
        setStage(taskData?.stage);
      }
      if (taskData?.desc) {
        setDesc(taskData?.desc);
      }
      if(taskData?.by){
        setAssignee(taskData?.by)
      }
    }
  }, [taskData]);


  return (
    <>
      <Wrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <div className="w-full flex overflow-y-auto flex-col">
            <Dialog.Title
              as="h2"
              className="text-xl font-bold leading-6 text-gray-900 mb-4"
            >
              <span>{taskData ? taskData?.title : "ADD SUB-TASK"}</span>
            </Dialog.Title>
            <div className="mt-2 flex flex-col gap-3">
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
              
              <SingleMember
                label="Assign Task To"
                lists={users}
                assignee={assignee}
                setAssignee={setAssignee}
              />
              
              <div className="w-full flex flex-col mb-3">
                <div className="text-black text-md mb-2">
                  <p>Description</p>
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
                    {/* {isEditing && (
                      <Button
                        type="submit"
                        label="SAVE"
                        className="flex flex-row gap-1 items-center bg-blue-600 text-white rounded-md py-2 mt-2 mb-3 2xl:py-2.5"
                      />
                    )} */}
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

              {/* <UserList/> */}

              <div className="w-full md:w-1/2">
                <p className="text-black text-xl mb-2">
                  Assets
                </p>
                {taskData?.assets.length > 0 ? (
                <div className="w-full grid grid-cols-2 gap-2">
                  {taskData?.assets?.map((el, index) => {
                    const fileType = getFileTypeIcon(el);
                    return (
                      <div key={index} className="relative">
                        <a
                          href={el}
                          target="_blank" // Opens the link in a new tab
                          rel="noopener noreferrer" // Provides security benefits when opening links in a new tab
                          className="w-full rounded h-20 md:h-25 2xl:h-30 cursor-pointer transition-all duration-700 hover:scale-105 hover:z-50 flex items-center justify-center bg-gray-100"
                        >
                          {fileType === "image" ? (
                            <img
                              src={el}
                              alt={taskData?.title}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : fileType === "pdf" ? (
                            <FaFilePdf className="text-red-500 text-4xl" />
                          ) : fileType === "doc" ? (
                            <FaFileWord className="text-blue-500 text-4xl" />
                          ) : (
                            <p className="text-gray-500">Unknown File Type</p>
                          )}
                        </a>
                        <div className="absolute top-2 right-2 z-10">
                          <ButtonIconOnly
                            type="button"
                            className="flex items-center justify-center bg-red-600 rounded-xl w-6 h-6"
                            icon={
                              <MdDelete className=" text-white rounded-lg" />
                            }
                            onClick={() => delHandler(el)} // Add your delete handler function here
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                ):(
                  <p className="text-black text-sm mb-2">
                  No assets found
                </p>
                )}
              </div>
            </div>
            <div className="inline-block items-center justify-start">
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
            <div className="bg-white pb-2 inline-block sm:flex sm:flex-row-reverse gap-4">
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

              {openDialog && (
                <ConfirmatioDialog
                  open={openDialog}
                  setOpen={setOpenDialog}
                  onClick={() => delSubMediaFunction()}
                />
              )}
            </div>
          </div>
        </form>
      </Wrapper>
    </>
  );
};

export default AddSubTask;
