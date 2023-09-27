import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../errors/CustomError.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import mongoose from "mongoose";
import Job from "../models/jobModel.js";
import User from "../models/userModel.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith("no job")) {
          throw new NotFoundError(errorMessages);
        }

        if (errorMessages[0].startsWith("not authorized")) {
          throw new ForbiddenError(errorMessages);
        }

        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateJobInput = withValidationErrors([
  body("company").notEmpty().withMessage("company is required!"),
  body("position").notEmpty().withMessage("position is required!"),
  body("jobLocation").notEmpty().withMessage("job location is required!"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("invalid status code"),
  body("jobType")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("invalid type code"),
]);

export const validateIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("Invalid mongoDB Id");
    const job = await Job.findById(value);
    if (!job) throw new NotFoundError(`no job found with id ${value}`);
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === job.createdBy.toString();
    if (!isAdmin && !isOwner)
      throw new ForbiddenError("not authorized to access this route");
  }),
]);

export const validateRegisterInput = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage("Name is required!")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name should be between 3-50 characters length")
    .trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Invalid email id")
    .custom(async (email) => {
      const hasUser = await User.findOne({ email });
      if (hasUser) {
        throw new BadRequestError("Email already in use");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 5 })
    .withMessage("Password should be of 5 characters long")
    .trim(),
  body("location").notEmpty().withMessage("Location is required!"),
  body("lastName").notEmpty().withMessage("Last Name is required!"),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Invalid email id"),
  body("password").notEmpty().withMessage("Password is required!"),
]);

export const validateUpdateUserInput = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage("Name is required!")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name should be between 3-50 characters length")
    .trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Invalid email id")
    .custom(async (email, { req }) => {
      const hasUser = await User.findOne({ email });
      if (hasUser && req.user.userId !== hasUser._id.toString()) {
        throw new BadRequestError("Email already in use");
      }
    }),
  body("location").notEmpty().withMessage("Location is required!"),
  body("lastName").notEmpty().withMessage("Last Name is required!"),
]);
