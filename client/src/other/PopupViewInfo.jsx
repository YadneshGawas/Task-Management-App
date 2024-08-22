/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ConfirmatioDialog from "../other/Dialogs";
import {
  useDelSubMediaMutation,
  useGetTaskDetailsQuery,
  useUpdateSubTaskDescMutation
} from "../redux/slice/api/taskApi";
import Button from "./Button";
import ButtonIconOnly from "./ButtonIconOnly";
import TextEditor from "./TextEditor";
import Wrapper from "./Wrapper";


const PopupViewInfo = ({ open, setOpen, taskData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [delMedia, setDelMedia] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  console.log(taskData);

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

  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (taskData?.desc) {
      setDesc(taskData?.desc);
    }
  }, [taskData]);

  const { taskId } = useParams();
  const subId = taskData._id;

  const [addsub] = useUpdateSubTaskDescMutation();
  const { refetch } = useGetTaskDetailsQuery(taskId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const delHandler = (el) => {
    setDelMedia(el);
    console.log("Del handler is working =>",el);
    setOpenDialog(true);
  };

  const handleOnSubmit = async () => {
    try {
      const d = { desc, taskId, subId };
      const res = await addsub(d).unwrap();
      console.log(res);
      toast.success(res?.message);
      refetch();
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  const [deletemedia] = useDelSubMediaMutation();

  const delSubMediaFunction = async() => {
    try {
      const data = { taskId, subId, delMedia };
      console.log("Before sending=>", data);
      const res = await deletemedia(data).unwrap();
      console.log(res);
      toast.success("Deleted media successfully");
      window.location.reload();
      setOpenDialog(false);
    } catch (error) {
      toast.error("Failed to delete media");
      setOpenDialog(false);
      console.log(error);
    }
  };

  return (
    <>
      <Wrapper open={open} setOpen={setOpen}>
        <Dialog.Title
          as="h2"
          className="text-xl font-bold leading-6 text-gray-900 mb-4"
        >
          <span>{taskData?.title}</span>
        </Dialog.Title>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <div className="w-full flex flex-col mb-3">
            <div className="text-gray-600 font-semibold text-md mb-2">
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
                <div key={index} className="relative">
                  <a
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
                  <div className="absolute top-2 right-2 z-10">
                    <ButtonIconOnly
                      type="button"
                      className="flex items-center justify-center bg-red-600 rounded-xl w-6 h-6"
                      icon={<MdDelete className=" text-white rounded-lg" />}
                      onClick={() => delHandler(el)} // Add your delete handler function here
                    />
                  </div>
                </div>
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
      {openDialog && (
        <ConfirmatioDialog
          open={openDialog}
          setOpen={setOpenDialog}
          //onClick={console.log("hello world")}
          onClick={() => delSubMediaFunction()}
        />
      )}
      </Wrapper>

    </>
  );
};

export default PopupViewInfo;
