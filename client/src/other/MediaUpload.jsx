/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Dialog } from "@headlessui/react";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable
} from "firebase/storage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiImages } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { app } from "../../assets/firebase";
import Button from "../Button";
import Textbox from "../Textbox";
import Wrapper from "./../Wrapper";
const uploadedFileURLs = [];

const MediaUpload = ({ open, setOpen, taskData }) => {

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
  const URLS = taskData?.assets ? [...taskData.assets] : []; 

  const { taskId } = useParams();
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
        <form className="">
          <div className="w-full flex overflow-y-auto flex-col p-2 pb-4">
            <Dialog.Title
              as="h2"
              className="text-base font-bold leading-6 text-gray-900 mb-4"
            >
              <span>Assets Upload</span>
            </Dialog.Title>
            <div className="mt-2 flex flex-col gap-6">
              <Textbox
                placeholder="Description"
                type="text"
                name="desc"
                label="Title"
                className="w-full rounded"
                register={register("desc", {
                  required: "Title is required!",
                })}
                error={errors.title ? errors.title.message : ""}
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

export default MediaUpload;
