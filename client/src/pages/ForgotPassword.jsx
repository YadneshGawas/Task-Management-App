/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../other/Button";
import FgPopup from "../other/FgPopup";
import Textbox from "../other/Textbox";
import { toast } from "sonner";
import { useForgotMutation } from "../redux/slice/api/authApi";

const ForgotPassword = () => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [forgotPass] = useForgotMutation();

  const submitHandler = async (data) => {
    try {
      const res = await forgotPass(data).unwrap();
      console.log("Response=>", res);
      if(res.status === 'ok'){
        toast.success("Link to reset password has been sent!!!");
      }
      else{
        toast.error("User not found");
      }
    } catch (error) {
      toast.error("User not found");
      console.log("Failed to reset ", error);
    }
  }

    return (
      <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
        <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
          <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
            <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
              <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-400">
                <span>TaskManager</span>
              </p>
              <p className="flex flex-col gap-0 md:gap-4 text-2xl md:text-6x1 2xl:text-7x1 font-black text-center text-blue-400">
                <span>Get your tasks managed</span>
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
            <form
              onSubmit={handleSubmit(submitHandler)}
              className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14 rounded-3xl shadow-lg"
            >
              <div className="">
                <p className="text-blue-400 text-3xl font-bold text-center">
                  Forgot your password?
                </p>
                <p className="text-center text-base text-gray-700 ">
                  We made it easy to get you back in
                </p>
              </div>
              <div className="flex flex-col gap-y-5">
                <Textbox
                  placeholder="email@example.com"
                  type="email"
                  name="email"
                  label="Email Address"
                  className="w-full rounded-full"
                  register={register("email", {
                    required: "Email Address is required!",
                  })}
                  error={errors.email ? errors.email.message : ""}
                />

                <Button
                  type="submit"
                  label="Reset Password"
                  onClick={() => setOpen(true)}
                  className="w-full h-10 bg-blue-400 text-white rounded-full"
                />

                <span className="ml-2 pb-2">
                  Remember your password?{" "}
                  <a href="./log-in" className="text-blue-700 underline">
                    Login
                  </a>
                </span>
              </div>
            </form>
            {/* <FgPopup open={open} setOpen={setOpen}/> */}
          </div>
        </div>
      </div>
    );
  };

export default ForgotPassword;
