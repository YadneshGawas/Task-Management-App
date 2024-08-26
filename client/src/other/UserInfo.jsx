/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Dialog } from "@headlessui/react";
import React from "react";
import { useSelector } from "react-redux";
import { getInitials } from "../assets";
import Button from "./Button";
import Wrapper from "./Wrapper";


const UserInfo = ({ open, setOpen, userData }) => {
  const { user } = useSelector((state) => state.auth);

  const data = userData ? userData : user;

  return (
    <Wrapper open={open} setOpen={setOpen}>
      <Dialog.Title
        as="h2"
        className="text-base text-left font-bold leading-6 text-gray-900 mb-4"
      >
        User Profile
      </Dialog.Title>
      {data ? (
      <div className="mt-2 flex flex-col gap-6">
        <div className="flex items-center gap-4 bg-white p-8">
          <div className="w-16 h-16 min-w-16 bg-blue-600 rounded-full text-white flex items-center justify-center text-2xl ">
            <span className="text-center font-bold">
              {getInitials(data.name)}
            </span>
          </div>
          <div className="flex flex-col gap-y-1">
            <p className="text-black text-xl font-bold flex-wrap">{data.name}</p>
            <span className="text-base text-gray-500">{data.role}</span>
            <span className="text-blue-500">
              {data.email ?? "email@example.com"}
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