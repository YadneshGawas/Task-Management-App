/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import TaskCard from "./TaskCard";
import { motion } from "framer-motion";

const BoardView = ({ tasks }) => {
  // Variants for the task card animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between each child's animation
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 }, // Start slightly below and hidden
    show: {
      opacity: 1,
      y: 0, // Move to the original position
      transition: {
        duration: 0.3, // Duration of each child's animation
      },
    },
  };

  return (
    <motion.div
      className="w-full h-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {tasks.map((task, index) => (
        <motion.div
          key={index}
          variants={childVariants} // Apply the child variants to each TaskCard
        >
          <TaskCard task={task} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BoardView;
