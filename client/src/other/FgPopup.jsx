/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Dialog } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Wrapper from "./Wrapper";
import Button from "./Button";

const FgPopup = ({ open, setOpen }) => {
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      <Wrapper open={open} setOpen={setOpen}>
        <Dialog.Title
          as="h2"
          className="text-base text-center font-bold leading-6 text-gray-900 mb-4"
        >
          Password reset link has been sent to your account!
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          <Button
            type="button"
            className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
            onClick={() => setOpen(false)}
            label="Close"
          />
        </div>
      </Wrapper>
    </>
  );
};

export default FgPopup;
