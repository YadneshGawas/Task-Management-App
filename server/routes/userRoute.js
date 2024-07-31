import express from "express";

import { activateUserProfile, adduser, changeUserPassword, deleteUserProfile, forgotUser, getNotificationsList, getTeamList, loginUser, logoutUser, markNotificationRead, registerUser, resetPassword, updateUserProfile } from "../controller/userCont.js";
import { isAdminRoute, protectRoute, testingApis } from "../middleware/authWare.js";

const router = express.Router();
/*OUTSIDE APP ROUTES*/
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot",forgotUser);
router.post("/reset/:userId/:token",resetPassword);


/*INSIDE APP ROUTES*/
router.post("/add", protectRoute,isAdminRoute, adduser);//New route added
router.put("/update", protectRoute, updateUserProfile);
router.get("/get-team", protectRoute, isAdminRoute, getTeamList);
router.get("/notifications", protectRoute, getNotificationsList);
router.put("/change-password", protectRoute, changeUserPassword);
router.put("/read-noti", protectRoute, markNotificationRead);

//FOR ADMIN ONLY - ADMIN ROUTES
router
  .route("/:id")
  .put(protectRoute, isAdminRoute, activateUserProfile)
  .delete(protectRoute, isAdminRoute, deleteUserProfile);

export default router;
