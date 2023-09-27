import {
  ForbiddenError,
  UnauthenticatedError,
  BadRequestError,
} from "../errors/CustomError.js";
import { verifyToken } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) throw new UnauthenticatedError("Authentication failed!");

  try {
    const { userId, role } = verifyToken(token);
    const testUser = userId === "64f9ab5289fe1ef04dde3a80";
    req.user = { userId, role, testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication failed!");
  }
};

export const authorizePermissions = (...rest) => {
  return (req, res, next) => {
    if (rest.includes(req.user.role)) {
      return next();
    }
    throw new ForbiddenError("You are not authorized to access this route");
  };
};

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) throw new BadRequestError("Demo user. Read only!");
  next();
};
