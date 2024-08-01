/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Dialog } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import Wrapper from "./Wrapper";
import Textbox from "./Textbox";
import { toast } from "sonner";
import { getInitials } from "../assets";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserQuery } from "../redux/slice/api/userApi";
import { setCredentials } from "../redux/slice/authS";

const UserInfo = ({ open, setOpen }) => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [userObject, setUserObject] = useState(null);
  const userId = user._id;

  //const [getUser] = useGetUserQuery();

  const refreshData = async () => {
    try {
      const res = await fetch(`api/user/getuser/${userId}`, {
        method: "POST",
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        throw new Error("Response not ok", ...res.data);
      }
      // Parse the JSON response
      const userData = await res.json();
      console.log("User data:", userData);
      dispatch(setCredentials(userData));
      // Create an object from the response data
      const userObject = {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        // Add other properties as needed
      };
      setUserObject(userObject);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (open) {
      refreshData();
    }
  }, [open]);

  return (
    <Wrapper open={open} setOpen={setOpen}>
      <Dialog.Title
        as="h2"
        className="text-base text-left font-bold leading-6 text-gray-900 mb-4"
      >
        User Profile
      </Dialog.Title>
      {userObject ? (
      <div className="mt-2 flex flex-col gap-6">
        <div className="flex items-center gap-4 bg-white p-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full text-white flex items-center justify-center text-2xl ">
            <span className="text-center font-bold">
              {getInitials(userObject.name)}
            </span>
          </div>
          <div className="flex flex-col gap-y-1">
            <p className="text-black text-xl font-bold">{userObject.name}</p>
            <span className="text-base text-gray-500">{userObject.role}</span>
            <span className="text-blue-500">
              {userObject.email ?? "email@example.com"}
            </span>
          </div>
        </div>

        <Button
          type="button"
          className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto rounded-sm"
          onClick={() => setOpen(false)}
          label="Close"
        />
      </div>
      ) : (
        <p>Error</p>
      )}
    </Wrapper>
  );
};

export default UserInfo;
