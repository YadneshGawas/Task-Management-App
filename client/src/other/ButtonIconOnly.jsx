/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import clsx from "clsx";
import React from "react";

const ButtonIconOnly = ({ icon, className, label, type, onClick = () => {}, status }) => {
  return (
    <button 
      type={type || "button"} 
      className={clsx("px-2 py-1 p-2 rounded-lg", className)}
      disabled={status}
      onClick={() => {
        onClick();  // Call the onClick function passed as a prop
      }}
    >
    {/* <span>{label}</span> */}
      {icon && <span>{icon}</span>}
    </button>
  );
};

export default ButtonIconOnly;
