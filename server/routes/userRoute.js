import express from "express";

import { activateUserProfile, changeUserPassword, deleteUserProfile, forgotUser, getNotificationsList, getTeamList, loginUser, logoutUser, markNotificationRead, registerUser, updateUserProfile } from "../controller/userCont.js";
import { isAdminRoute, protectRoute } from "../middleware/authWare.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot",forgotUser);

router.get("/get-team", protectRoute, isAdminRoute, getTeamList);
router.get("/notifications", protectRoute, getNotificationsList);

router.put("/profile", protectRoute, updateUserProfile);
router.put("/read-noti", protectRoute, markNotificationRead);
router.put("/change-password", protectRoute, changeUserPassword);

//FOR ADMIN ONLY - ADMIN ROUTES
router
  .route("/:id")
  .put(protectRoute, isAdminRoute, activateUserProfile)
  .delete(protectRoute, isAdminRoute, deleteUserProfile);

export default router;
