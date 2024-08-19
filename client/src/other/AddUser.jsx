/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Dialog } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  useAddUserMutation,
  useGetTeamListQuery,
  useUpdateUserMutation
} from "../redux/slice/api/userApi";
import { setCredentials } from "../redux/slice/authS";
import Button from "./Button";
import Textbox from "./Textbox";
import Wrapper from "./Wrapper";

const AddUser = ({ open, setOpen, userData }) => {
  let defaultValues = userData ?? {};

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [adduser] = useAddUserMutation(); //definitely using mail registration
  const [updateuser] = useUpdateUserMutation();

  const { refetch } = useGetTeamListQuery();

  const handleOnSubmit = async (data) => {
    data.isAdmin = data.isAdmin === "true";
    try {
      if (userData) {
        console.log(data);
        const res = await updateuser(data).unwrap();
        toast.success("Successfully updated");
        if (userData?._id === user._id) {
          dispatch(setCredentials(data));
        }
        setOpen(false);
        refetch();
        console.log(userData);
      } else {
        console.log(data);
        const res = await adduser(data).unwrap();
        console.log("res", res);
        toast.success("Successfully added");
        setOpen(false);
        refetch();
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
            {user.isAdmin && (
              <div className="w-full flex flex-col gap-1">
                <label className="text-slate-800">Admin User</label>
                <select
                  id="isAdmin"
                  name="isAdmin"
                  className="bg-transparent px-2.5 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 rounded-sm"
                  {...register("isAdmin", {
                    required: "Selection is required!",
                  })}
                  defaultValue="false"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            )}
          </div>

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
                label="Close"
              />
            </div>
        
        </form>
      </Wrapper>
    </>
  );
};

export default AddUser;
