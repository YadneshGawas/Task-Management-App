/* eslint-disable no-unused-vars */
import { useState } from "react";
import Textbox from "../other/Textbox";
import Button from "../other/Button";
import Checkbox from "../other/Checkbox";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../redux/slice/api/authApi";

const CreateAcc = () => {

  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [registerUser, { isLoading, isError, error }] = useRegisterMutation();

  const submitHandler = async(data) => {
    try {
      await registerUser(data).unwrap(); // Call the register mutation and unwrap the response
      console.log("Registration successful");
      navigate("/log-in");
    } catch (err) {
      console.error("Failed to register: ", err); // Handle registration error
    }
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const password = watch("password");

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
            className="form-container w-full md:w-[400px] flex flex-col gap-y-3 bg-white px-10 pt-5 pb-5 rounded-3xl shadow-lg"
          >
            <div>
              <p className="text-blue-400 text-3xl font-bold text-center pt-3">
                New Here?
              </p>
              <p className="text-center text-base text-gray-700">
                Create an account
              </p>
              <p className="text-center text-lg text-red-500 font-bold">
                *Only for admins
              </p>
            </div>
            <div className="flex flex-col gap-y-5">
              <Textbox
                placeholder="Your full name"
                type="text"
                name="name"
                label="Enter your name"
                className="w-full rounded-full"
                register={register("name", {
                  required: "Name is required!",
                })}
                error={errors.name ? errors.name.message : ""}
              />
              <Textbox
                placeholder="email@example.com"
                type="email"
                name="email"
                label="Email Address"
                className="w-full rounded-full"
                register={register("email", {
                  required: "Email Address is required!",
                  pattern: {
                    value: /^[A-Z0-9. _%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Enter porper email id",
                  },
                })}
                error={errors.email ? errors.email.message : ""}
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

              <label className="inline-flex items-center">
                <Checkbox
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <span className="ml-2">
                  I agree to the{" "}
                  <a href="/" className="text-blue-500 underline">
                    terms and conditions
                  </a>
                </span>
              </label>

              <Button
                type="submit"
                label="Create Account"
                className="w-full h-10 bg-blue-400 text-white rounded-full"
                status={!isChecked}
              ></Button>

              <span className="ml-2 pb-2">
                Already have an account?{" "}
                <a href="./log-in" className="text-blue-700 underline">
                  Login here
                </a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAcc;
