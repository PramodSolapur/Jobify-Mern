import express from "express";
import {
  updateUser,
  getApplicationStats,
  getCurrentUser,
} from "../controllers/userController.js";
import { validateUpdateUserInput } from "../middlewares/validationMiddleware.js";
import {
  authorizePermissions,
  checkForTestUser,
} from "../middlewares/authMiddleware.js";
import upload from "../middlewares/MulterMiddleware.js";

const router = express.Router();

router.get("/currentUser", getCurrentUser);
router.get("/admin/app-stats", [
  authorizePermissions("admin"),
  getApplicationStats,
]);
router.patch("/update-user", [
  checkForTestUser,
  upload.single("avatar"),
  validateUpdateUserInput,
  updateUser,
]);

export default router;
