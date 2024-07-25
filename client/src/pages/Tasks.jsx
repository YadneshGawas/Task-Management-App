/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useLocation, useParams } from "react-router-dom";
import { tasks } from "../assets/data";
import BoardView from "../other/BoardView";
import Loading from "../other/Loader";
import Title from "../other/Title";
import Button from "../other/Button";
import AddTask from "../other/task/AddTask";
import { useSelector } from "react-redux";

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {

  const {user} =useSelector((state)=>state.auth);
  
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
    
  const params = useParams();
  const status = params?.status || "";

  const location = useLocation();
  const { projectId } = location.state || {};
  console.log(projectId," posted from tasks ");

  useEffect(()=>{
    console.log("Open variable status",open);
  }, [open]);

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

  const usrid = user._id;
  //First display only the tasks which belong to that user
  //Pass that object for another filtration

  const filteredTasks = tasks.filter((task) => {
    const priorityMatch = filters.priority === "all" || task.priority === filters.priority;
    const stageMatch = filters.stage === "all" || task.stage === filters.stage;
    const taskMatch = task.team.some(team => team._id === usrid);
    return priorityMatch && stageMatch && taskMatch;
  });


  return loading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status} Tasks` : "Tasks"} />
        <div><p>User ID:{user._id}</p></div>
        {/* <div><p>Task ID:{tasks?.team?._id}</p></div> */}

        {!status && (
          <Button
            onClick={()=>setOpen(true)}
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
          />
        )}

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

          <BoardView tasks={filteredTasks} />
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
