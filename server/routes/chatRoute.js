/* eslint-disable no-unused-vars */
import express from "express";
import { protectRoute } from "../middleware/authWare.js";
import { fetchMessage, writeMessage } from "../controller/chatCont.js";

const router = express.Router();

router.get("/fetchmessage", fetchMessage);
router.post("/writemessage",protectRoute, writeMessage);

export default router;
