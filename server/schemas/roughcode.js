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

//REMOVE LEAD USING METHODS
const removeLeadFromProject = async (req, res) => {
  try {
    const { projectId, userId } = req.body; // Assuming projectId and userId are passed in the request body

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.removeLead(userId);

    res.status(200).json({ message: 'Lead removed successfully', project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


