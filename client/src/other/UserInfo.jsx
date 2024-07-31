/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Dialog } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import Wrapper from "./Wrapper";
import Textbox from "./Textbox";
import { toast } from "sonner";
import { getInitials } from "../assets";

const UserInfo = ({open, setOpen, userData}) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm();

    const password = watch("password");

    const handleOnSubmit = async(data) => {
        if(data.password !== data.cpass)
        {
            toast.warning("Password doesn't match");
            return;
        }
        try{
            //const res = await cPass(data).unwrap();
            toast.success("Password changed successfully");
        }
        catch(error)
        {
            console.log('error', error);
        }
    };

    return(
        <Wrapper open={open} setOpen={setOpen}>
        <Dialog.Title
          as="h2"
          className="text-base text-left font-bold leading-6 text-gray-900 mb-4"
        >
          User Profile
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
        <div className='flex items-center gap-4 bg-white p-8'>
                <div className='w-16 h-16 bg-blue-600 rounded-full text-white flex items-center justify-center text-2xl '>
                  <span className='text-center font-bold'>
                    {getInitials(userData?.name)}
                  </span>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <p className='text-black text-xl font-bold'>{userData?.name}</p>
                  <span className='text-base text-gray-500'>{userData?.role}</span>
                  <span className='text-blue-500'>
                    {userData?.email ?? "email@example.com"}
                  </span>
                </div>
              </div>

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto rounded-sm'
                onClick={() => setOpen(false)}
                label='Close'
              />
            </div>
      </Wrapper>
    )
};

export default UserInfo;