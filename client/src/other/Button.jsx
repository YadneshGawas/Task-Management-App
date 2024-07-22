/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import clsx from "clsx";
import React from "react";

const Button = ({ icon, className, label, type, onClick = () => {}, status }) => {
  return (
    <button 
      type={type || "button"} 
      className={clsx("px-3 py-2 outline-none", className)}
      disabled={status}
      onClick={() => {
        console.log("Button clicked");  // Log button click
        onClick();  // Call the onClick function passed as a prop
      }}
    >
      <span>{label}</span>
      {icon && <span>{icon}</span>}
    </button>
  );
};

export default Button;
