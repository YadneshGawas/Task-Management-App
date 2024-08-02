/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useParams } from "react-router-dom";
import { projects } from "../assets/data";
import BoardView from "../other/BoardView";
import Loading from "../other/Loader";
import Title from "../other/Title";
import Button from "../other/Button";
import AddTask from "./../other/task/AddTask";
import TaskDialog from "./../other/task/TaskDialog";
import AddProject from "../other/task/AddProject";

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Projects = () => {
  const params = useParams();

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const status = params?.status || "";

  const [filters, setFilters] = useState({
    priority: "all",
    stage: "all",
  });

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  const filteredProjects = projects.filter((projects) => {
    const priorityMatch =
      filters.priority === "all" || projects.priority === filters.priority;
    const stageMatch =
      filters.stage === "all" || projects.stage === filters.stage;
    return priorityMatch && stageMatch;
  });

  return loading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Projects"} />

  
          <Button
            onClick={() => setOpen(true)}
            label="Create Project"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
  
      </div>

      <div className="flex gap-4 mb-4">
        {/* Filter by Priority */}
        <div className="w-1/5">
          <label
            htmlFor="priorityFilter"
            className="block text-sm font-medium text-gray-700"
          >
            Filter by Priority:
          </label>
          <select
            id="priorityFilter"
            name="priorityFilter"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Filter by Stage */}
        <div className="w-1/5">
          <label
            htmlFor="stageFilter"
            className="block text-sm font-medium text-gray-700"
          >
            Filter by Stage:
          </label>
          <select
            id="stageFilter"
            name="stageFilter"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filters.stage}
            onChange={(e) => handleFilterChange("stage", e.target.value)}
          >
            <option value="all">All</option>
            <option value="todo">To Do</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <BoardView tasks={filteredProjects} />
      <AddProject proj={filteredProjects} open={open} setOpen={setOpen} />
    </div>
  );
};

export default Projects;
