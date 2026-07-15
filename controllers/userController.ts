import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as userService from "../services/user";
import { sendSuccess, sendError } from "../utils/responses";
import { AppError } from "../utils/errors";

/**
 * GET /api/users
 */
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "User not authenticated", 401);
    }
    const users = await userService.getAllUsers();
    return sendSuccess(res, users, "Users retrieved successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, error.message, error.statusCode);
    }
    console.error(`${req.method} ${req.originalUrl} error:`, error);
    return sendError(res, "Internal server error", 500);
  }
};
