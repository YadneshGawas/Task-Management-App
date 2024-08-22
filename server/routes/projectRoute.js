/* eslint-disable no-unused-vars */
import express from "express";
import { createProject, delProjects, getAProject, getProjects, testingApis } from './../controller/projectCont.js';
import { protectRoute } from "../middleware/authWare.js";

const router = express.Router();

router.post("/createproject",protectRoute, createProject);
router.get("/getproject",protectRoute,getProjects);
router.get("/getaproject/:projectId",getAProject);
router.put("/delete/:id",delProjects);

//router.get("/getTasks/:id",getProjects);


export default router;
