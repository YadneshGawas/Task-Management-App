/* eslint-disable no-unused-vars */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { projects } from "../assets/data";

const Testing = () => {
  const location = useLocation();
  const { projectId } = location.state || {};

  return (
    <div>
      Task ID: {projectId}
    </div>
  )

}

export default Testing;
