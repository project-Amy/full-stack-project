import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as taskService from "../services/task";
import { sendSuccess, sendError } from "../utils/responses";
import { AppError } from "../utils/errors";

/**
 * POST /api/tasks
 */
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "User not authenticated", 401);
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      boardId,
      assigneeId,
    } = req.body;
    const task = await taskService.createTask(userId, {
      title,
      description,
      status,
      priority,
      dueDate,
      boardId,
      assigneeId,
    });

    return sendSuccess(res, task, "Task created successfully", 201);
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, error.message, error.statusCode);
    }
    return sendError(res, "Internal server error", 500);
  }
};

/**
 * GET /api/tasks/:id
 */
export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await taskService.getTask(id);

    return sendSuccess(res, task, "Task retrieved successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, error.message, error.statusCode);
    }
    return sendError(res, "Internal server error", 500);
  }
};

/**
 * PATCH /api/tasks/:id
 */
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assigneeId,
      position,
    } = req.body;

    const task = await taskService.updateTask(id, {
      title,
      description,
      status,
      priority,
      dueDate,
      assigneeId,
      position,
    });

    return sendSuccess(res, task, "Task updated successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, error.message, error.statusCode);
    }
    return sendError(res, "Internal server error", 500);
  }
};

/**
 * GET /api/tasks/board/:boardId
 */
export const getBoardTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "User not authenticated", 401);
    }

    const { boardId } = req.params;
    const boardWithTasks = await taskService.getBoardTasks(boardId, userId);

    return sendSuccess(
      res,
      boardWithTasks,
      "Board tasks retrieved successfully"
    );
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, error.message, error.statusCode);
    }
    return sendError(res, "Internal server error", 500);
  }
};

/**
 * DELETE /api/tasks/:id
 */
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await taskService.deleteTask(id);

    return sendSuccess(res, null, "Task deleted successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, error.message, error.statusCode);
    }
    return sendError(res, "Internal server error", 500);
  }
};
