/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import Wrapper from "./Wrapper";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../redux/slice/authS";
import { toast } from "sonner";
import {
  useAddUserMutation,
  useUpdateUserMutation,
} from "../redux/slice/api/userApi";
import { useDispatch } from "react-redux";
import { MdCheckCircleOutline } from "react-icons/md";

const AddUser = ({ open, setOpen, userData }) => {

  let defaultValues = userData ?? {};

  const { user } = useSelector((state) => state.auth);

  const isLoading = false;
  const isUpdating = false;

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [adduser] = useAddUserMutation(); //definitely using mail registration
  const [updateuser] = useUpdateUserMutation();

  const handleOnSubmit = async (data) => {
    data.isAdmin = data.isAdmin === 'true';
    console.log(data);
    try {
      if (userData) {
        console.log(data);
        const res = await updateuser(data).unwrap();
        toast.success("Successfully updated");
        //window.location.reload();
        if (userData?._id === user._id) {
          dispatch(setCredentials(userData));
        }
        console.log(userData);
      } else {
        console.log(data);
        const res = await adduser(data).unwrap();
        console.log("res", res);
        toast.success("Successfully added");
        window.location.reload();
      }
    } catch (error) {
      toast.error(error?.data?.message || error.message);
      console.log("Error", error);
    }
  };

  return (
    <>
      <Wrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Full name"
              type="text"
              name="name"
              label="Full Name"
              className="w-full rounded"
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder="Email Address"
              type="email"
              name="email"
              label="Email Address"
              className="w-full rounded"
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />

            <Textbox
              placeholder="Role"
              type="text"
              name="role"
              label="Role"
              className="w-full rounded"
              register={register("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
            />

            <div className="w-full flex flex-col gap-1">
              <label className="text-slate-800">
                Admin User
              </label>
              <select
                id="isAdmin"
                name="isAdmin"
                className="bg-transparent px-2.5 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 rounded-sm"
                {...register("isAdmin", {
                  required: "Selection is required!",
                })}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          {isLoading || isUpdating ? (
            <div className="py-5">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
                label="Submit"
              />

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          )}
        </form>
      </Wrapper>
    </>
  );
};

export default AddUser;
