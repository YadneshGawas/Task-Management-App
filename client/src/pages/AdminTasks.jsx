/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useParams } from "react-router-dom";
import { tasks, projects } from "../assets/data";
import BoardView from "../other/BoardView";
import Loading from "../other/Loader";
import Title from "../other/Title";
import Button from "../other/Button";
import AddTask from "../other/task/AddTask";

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const AdminTasks = () => {
  const { projectId } = useParams(); // Access the projectId from the URL
  console.log(projectId);
};

export default AdminTasks;

 