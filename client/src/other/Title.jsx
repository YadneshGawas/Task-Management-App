/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import clsx from "clsx";
import React from "react";

const Title = ({ title, className }) => {
  return (
    <h2 className={clsx(" text-4xl font-sans capitalize", className)}>
      {title}
    </h2>
  );
};

export default Title;
