/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Dialog } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import Loading from './Loader';
import Wrapper from "./Wrapper";
import Textbox from "./Textbox";
import { toast } from "sonner";

const ChangePassword = ({open, setOpen}) => {
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
          className="text-base text-center font-bold leading-6 text-gray-900 mb-4"
        >
          Change Password
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
        <Textbox
                placeholder="Old password"
                type="password"
                name="oldpassword"
                label="Confirm password"
                id="password"
                className="w-full rounded-full"
                register={register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                error={
                  errors.confirmPassword ? errors.confirmPassword.message : ""
                }
              />
        <Textbox
                placeholder="New Password"
                type="password"
                name="password"
                id="password"
                label="Create Password"
                className="w-full rounded-full"
                register={register("password", {
                  required: "Password is required!",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
                    message:
                      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
                  },
                })}
                error={errors.password ? errors.password.message : ""}
              />

              <Textbox
                placeholder="Confirm password"
                type="password"
                name="confirmPassword"
                label="Confirm password"
                id="password"
                className="w-full rounded-full"
                register={register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                error={
                  errors.confirmPassword ? errors.confirmPassword.message : ""
                }
              />
              <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
              <Button
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto rounded-md'
                label='Submit'
              />

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto rounded-sm'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
        </div>
      </Wrapper>
    )
};

export default ChangePassword;