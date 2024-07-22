/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useParams } from "react-router-dom";
import { tasks } from "../assets/data";
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
  
  const [selected, setSelected] = useState(0);
  const handleOpen = () => setOpen(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
    
  const params = useParams();
  const status = params?.status || "";



  return loading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && (
          <Button
            onClick={()=>setOpen(true)}
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
          />
        )}

      </div>

      

          <BoardView tasks={filteredTasks} />
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default AdminTasks;
