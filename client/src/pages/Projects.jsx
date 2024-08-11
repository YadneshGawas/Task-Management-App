/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import BoardView from "../other/BoardView";
import Button from "../other/Button";
import AddProject from "../other/task/AddProject";
import Title from "../other/Title";
import { useGetProjectQuery } from "../redux/slice/api/projApi";

const Projects = () => {
  const [open, setOpen] = useState(false);

  const { data } = useGetProjectQuery();

  let projects = [];
  if (data && data.projects) {
    projects = data.projects.map((project) => ({
      id: project._id,
      lTeam: project.lTeam,
      title: project.title,
      date: project.date,
      due: project.due,
      priority: project.priority,
      stage: project.stage,
      assets: project.assets,
      uTeam: project.uTeam,
      creator: project.creator,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));
  }

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

  const filteredProjects = projects?.filter((project) => {
    const priorityMatch =
      filters.priority === "all" || project.priority === filters.priority;
    const stageMatch =
      filters.stage === "all" || project.stage === filters.stage;
    return priorityMatch && stageMatch;
  });

  // if (isLoading) {
  //   return (
  //     <div className="py-10">
  //       <Loading />
  //     </div>
  //   );
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title="Projects" />

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

      {filteredProjects &&
      <BoardView tasks={filteredProjects} />
      }

      {open &&
      <AddProject open={open} setOpen={setOpen} />
      }
      
    </div>
  );
};

export default Projects;
