/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import { projects } from "../assets/data";

const Projects = () => {
  const navigate = useNavigate();

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}/tasks`);
  };

  return (
    <div>
      <h1>Projects</h1>
      <div>
        {projects.map((project) => (
          <div key={project._id} onClick={() => handleProjectClick(project._id)}>
            {project.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
