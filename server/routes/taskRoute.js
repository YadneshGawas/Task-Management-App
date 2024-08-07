/* eslint-disable no-unused-vars */
import express from "express";
import { createSubTask, createTask, dashboardStatistics, delTasks, getTask, getTasks, postTaskActivity, updateTask } from "../controller/taskCont.js";
import { isAdminRoute, protectRoute } from "../middleware/authWare.js";

const router = express.Router();

router.post("/createtask" , createTask);
router.post("/gettask" , getTask);
router.put("/delete/:id",delTasks);
// router.post("/activity/:id", protectRoute, postTaskActivity);

// router.get("/dashboard", protectRoute, dashboardStatistics);
// router.get("/", protectRoute, getTasks);
// router.get("/:id", protectRoute, getTask);

// router.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);
// router.put("/update/:id", protectRoute, isAdminRoute, updateTask);


export default router;
