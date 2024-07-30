/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/slice/api/authApi";
import Button from "./../other/Button";
import Textbox from "./../other/Textbox";
import { setCredentials } from "../redux/slice/authS";
import { toast } from "sonner";

const Login = () => {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loginUser, { isLoading, isError, error }] = useLoginMutation();

  const submitHandler = async (data) => {
    try {
      const res = await loginUser(data).unwrap(); // Call the login mutation and unwrap the response
      //navigate("/home");
      console.log("Server response=>",res);
      dispatch(setCredentials(res));
      toast.success("Successfully logged in");
      //navigate("/dashboard");
    } catch (error) {
      console.error("Failed to login: ", error); // Handle login error
      toast.error(error?.data?.message || error.message);
    }
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user]);

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
                Welcome back!
              </p>
              <p className="text-center text-base text-gray-700 ">
                Login to continue.
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
              <Textbox
                placeholder="your password"
                type="password"
                name="password"
                label="Password"
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

              <span className="ml-2 pb-1">
                <a
                  href="/forgot"
                  className="hover:text-blue-700  hover:underline"
                >
                  Forget Password
                </a>
              </span>

              <Button
                type="submit"
                label="Log In"
                className="w-full h-10 bg-blue-400 text-white rounded-full"
              />

              <span className="ml-2 pb-2">
                New here?{" "}
                <a href="./create" className="text-blue-700 underline">
                  Create an account
                </a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
