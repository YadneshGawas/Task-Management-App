/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useParams } from "react-router-dom";
import BoardView from "../other/BoardView";
import Button from "../other/Button";

import AddTask from "../other/task/AddTask";
import Title from "../other/Title";
import { useGetTaskQuery } from "../redux/slice/api/taskApi";
import { useGetAProjectQuery } from "../redux/slice/api/projApi";

const AdminTasks = () => {
  const [selected, setSelected] = useState(0);
  const handleOpen = () => setOpen(true);
  const [open, setOpen] = useState(false);
  const [disable,setDisable] = useState(false);
  const { projectId } = useParams();
  const { data, refetch } = useGetTaskQuery();
  const { data: project } = useGetAProjectQuery(projectId);

  let title = "";
  let tasks = [];
  if (data && data.tasks) {
    tasks = data.tasks.map((task) => ({
      id: task._id,
      lTeam: task.lTeam,
      title: task.title,
      date: task.date,
      due: task.due,
      desc: task.desc,
      priority: task.priority,
      projectId: task.projectId,
      stage: task.stage,
      assets: task.assets,
      uTeam: task.uTeam,
      creator: task.creator,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      subTasks: task.subTasks,
      projectTitle: task.projectTitle,
      projectDue: task.projectDue,
      projectPriority: task.projectPriority,
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

  // Filter tasks based on the projectId and the filters
  const filteredTasks = tasks?.filter((task) => {
    const priorityMatch =
      filters.priority === "all" || task.priority === filters.priority;
    const stageMatch = filters.stage === "all" || task.stage === filters.stage;
    const projectMatch = task.projectId === projectId; // Ensure task belongs to the current project
    return priorityMatch && stageMatch && projectMatch;
  });

  if (filteredTasks) {
    console.log(filteredTasks);
    if (filteredTasks?.length > 0) {
      const projName = filteredTasks[0].projectTitle;
      title = projName;
    } else {
      title = "No tasks found";
    }
  }

  const disableAfterDue = () => {
    const currentDate = new Date();
    const dueDate = new Date(project?.projects?.due);
    if(currentDate>dueDate){
      setDisable(true);
    }else{
      setDisable(false);
    }
  }

  useEffect(() => {
    disableAfterDue();
    refetch();
  }, [ disableAfterDue]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={`${title} `} />

        {!disable && 
        <Button
          onClick={() => setOpen(true)}
          label="Create Task"
          icon={<IoMdAdd className="text-lg" />}
          className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
        />}
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

      {filteredTasks && <BoardView tasks={filteredTasks} />}

      {open && <AddTask open={open} setOpen={setOpen} />}
    </div>
  );
};

export default AdminTasks;
