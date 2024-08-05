/* eslint-disable no-unused-vars */
import express from "express";
import { createProject, getProjects, testingApis } from './../controller/projectCont.js';
import { protectRoute } from "../middleware/authWare.js";

const router = express.Router();

router.post("/createproject",protectRoute, createProject);
router.get("/getproject",getProjects);


export default router;
