/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Wrapper from "./Wrapper";
import Button from "./Button";
import TextEditor from "./TextEditor";
import { IoMdAdd } from "react-icons/io";
import {
  useAddSubTaskMutation,
  useUpdateSubTaskDescMutation,
} from "../redux/slice/api/taskApi";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import Title from "./Title";
import { FaFilePdf, FaFileWord } from "react-icons/fa";

const LISTS = ["todo", "in progress", "completed"];

const PopupViewInfo = ({ open, setOpen, taskData }) => {
  const [isEditing, setIsEditing] = useState(false);

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

  const handleBlur = () => {
    setIsEditing(false);
  };

  const getFileTypeIcon = (fileUrl) => {
    console.log("URL =>", fileUrl);
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

  console.log("Task data descripton =>", taskData?.desc);

  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (taskData?.desc) {
      setDesc(taskData?.desc);
    }
  }, [taskData]);

  const { taskId } = useParams();
  const subId = taskData._id;

  console.log("TASKID=>", taskId);
  console.log("TASKDATA=>", subId);
  console.log("Assets=>", taskData?.assets);

  const [addsub] = useUpdateSubTaskDescMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleOnSubmit = async () => {
    try {
      const d = { desc, taskId, subId };
      const res = await addsub(d).unwrap();
      console.log(res);
      toast.success(res?.message);
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Wrapper open={open} setOpen={setOpen}>
        <Dialog.Title
          as="h2"
          className="text-xl font-bold leading-6 text-gray-900 mb-4"
        >
          <span>Details</span>
        </Dialog.Title>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <div className="w-full flex flex-col mb-3">
            <div className="text-gray-600 font-semibold text-md mt-3 mb-2">
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
                {isEditing && (
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
        <div className="w-full md:w-1/2 space-y-2">
          <p className="text-gray-600 font-semibold text-md mt-1 mb-1">
            ASSETS
          </p>
          <div className="w-full grid grid-cols-2 gap-2">
            {taskData?.assets?.map((el, index) => {
              const fileType = getFileTypeIcon(el);
              return (
                <a
                  key={index}
                  href={el}
                  target="_blank" // Opens the link in a new tab
                  rel="noopener noreferrer" // Provides security benefits when opening links in a new tab
                  className="w-full rounded h-28 md:h-36 2xl:h-52 cursor-pointer transition-all duration-700 hover:scale-125 hover:z-50 flex items-center justify-center bg-gray-100"
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
              );
            })}
          </div>
        </div>

        <div className="py-3 mt-1 flex sm:flex-row-reverse gap-4">
          <Button
            type="button"
            className="bg-white border text-sm font-semibold text-gray-900 sm:w-auto rounded-md"
            onClick={() => setOpen(false)}
            label="Cancel"
          />
        </div>
      </Wrapper>
    </>
  );
};

export default PopupViewInfo;
