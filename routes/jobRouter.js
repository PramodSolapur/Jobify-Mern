import express from "express";
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
} from "../controllers/jobController.js";
import {
  validateJobInput,
  validateIdParam,
} from "../middlewares/validationMiddleware.js";
import { checkForTestUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.get('/',getAllJobs)

router
  .route("/")
  .get(getAllJobs)
  .post(validateJobInput, checkForTestUser, createJob);

router.route("/stats").get(showStats);

router
  .route("/:id")
  .get(validateIdParam, getJob)
  .patch(checkForTestUser, validateJobInput, validateIdParam, updateJob)
  .delete(checkForTestUser, validateIdParam, deleteJob);

export default router;
