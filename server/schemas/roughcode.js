/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//ADD LEAD

const addLead = async (projectId, userId) => {
  try {
    await Project.findByIdAndUpdate(
      projectId,
      { $push: { leads: userId } },
      { new: true, useFindAndModify: false }
    );
    console.log("Lead added successfully.");
  } catch (error) {
    console.error("Error adding lead:", error);
  }
};

//REMOVE LEAD
const removeLead = async (projectId, userId) => {
  try {
    await Project.findByIdAndUpdate(
      projectId,
      { $pull: { leads: userId } },
      { new: true, useFindAndModify: false }
    );
    console.log("Lead removed successfully.");
  } catch (error) {
    console.error("Error removing lead:", error);
  }
};


//USING THE SCHEMA
const createProject = async () => {
  const project = new Project({
    leads: ["userId1", "userId2"], // Replace with actual user IDs
    title: "New Project",
    due: new Date("2024-12-31"),
    priority: "high",
  });

  try {
    const savedProject = await project.save();
    console.log("Project created successfully:", savedProject);
  } catch (error) {
    console.error("Error creating project:", error);
  }
};

