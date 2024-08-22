/* eslint-disable no-unused-vars */
import express from 'express';
import userRoute from './userRoute.js';
import taskRoute from './taskRoute.js';
import projectRoute from './projectRoute.js';
import chatRoute from './chatRoute.js'

const router = express.Router();

router.use("/user",userRoute); //api/user/login
router.use("/task",taskRoute);
router.use("/project", projectRoute);
router.use("/chat", chatRoute);

export default router;