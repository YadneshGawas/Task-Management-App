/* eslint-disable no-unused-vars */
import express from "express";

import { adduser, changeUserPassword, deleteUserProfile, forgotUser, getNotificationsList, getTeamList, getUserInfo, getUsers, loginUser, logoutUser, markNotificationRead, registerUser, resetPassword, updateUserProfile } from "../controller/userCont.js";
import { isAdminRoute, protectRoute } from "../middleware/authWare.js";

const router = express.Router();
/*OUTSIDE APP ROUTES*/
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot",forgotUser);
router.post("/reset/:userId/:token",resetPassword);
router.put("/logout", logoutUser);


/*INSIDE APP ROUTES*/
/*MANIPULATION DATA*/
router.post("/add", protectRoute, isAdminRoute, adduser);//New route added
router.put("/update", protectRoute, updateUserProfile);
router.post("/delete", deleteUserProfile);
router.get("/getusers/:taskId", getUsers);
router.get("/getuserinfo/:id", getUserInfo);

/*VIEWING DATA*/
//router.post("/getuser/:userId", getUserProfile);

router.get("/get-team",getTeamList);
router.get("/notifications", protectRoute, getNotificationsList);
router.put("/changepassword",protectRoute, changeUserPassword);
router.put("/read-noti", protectRoute, markNotificationRead);


export default router;
