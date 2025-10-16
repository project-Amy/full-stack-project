import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as boardService from "../services/board";
import { sendSuccess, sendError } from "../utils/responses";
import { AppError } from "../utils/errors";

/**
 * GET /api/boards
 */
export const getAllBoards = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "User not authenticated", 401);
    }
    const boards = await boardService.getAllBoards(userId);
    return sendSuccess(res, boards, "Boards retrieved successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, error.message, error.statusCode);
    }
    return sendError(res, "Internal server error", 500);
  }
};

/**
 * POST /api/boards
 */
export const createBoard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "User not authenticated", 401);
    }
    const { name, description, defaultView } = req.body;
    const board = await boardService.createBoard(userId, {
      name,
      description,
      defaultView,
    });

    return sendSuccess(res, board, "Board created successfully", 201);
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, error.message, error.statusCode);
    }
    // console.error("Error in createBoard controller:", error);
    return sendError(res, "Internal server error", 500);
  }
};

/**
 * GET /api/boards/:id
 */
export const getBoard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "User not authenticated", 401);
    }
    const { id } = req.params;
    const board = await boardService.getBoard(id, userId);
    return sendSuccess(res, board, "Board retrieved successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, error.message, error.statusCode);
    }
    return sendError(res, "Internal server error", 500);
  }
};
