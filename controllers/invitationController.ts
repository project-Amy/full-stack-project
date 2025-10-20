import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as invitationService from "../services/invitation";
import { sendSuccess, sendError } from "../utils/responses";
import { AppError } from "../utils/errors";

/**
 * POST /api/invitations
 * Create a board invitation
 */
export const createInvitation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "User not authenticated", 401);
    }

    const { boardId, invitedUserId } = req.body;
    if (!boardId || !invitedUserId) {
      return sendError(res, "boardId and invitedUserId are required", 400);
    }
    const invitation = await invitationService.createInvitation(
      boardId,
      invitedUserId,
      userId
    );

    return sendSuccess(res, invitation, "Invitation created successfully", 201);
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, error.message, error.statusCode);
    }
    return sendError(res, "Internal server error", 500);
  }
};

/**
 * POST /api/invitations/:id/respond
 * Respond to an invitation (accept/reject)
 */
export const respondToInvitation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "User not authenticated", 401);
    }

    const { id } = req.params;
    const { response } = req.body;

    if (!response || !["ACCEPTED", "REJECTED"].includes(response)) {
      return sendError(
        res,
        "response must be either ACCEPTED or REJECTED",
        400
      );
    }

    const invitation = await invitationService.respondToInvitation(
      id,
      userId,
      response
    );

    return sendSuccess(
      res,
      invitation,
      `Invitation ${response.toLowerCase()} successfully`
    );
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, error.message, error.statusCode);
    }
    return sendError(res, "Internal server error", 500);
  }
};

/**
 * GET /api/invitations/user
 * Get all pending invitations for current user
 */
export const getUserInvitations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "User not authenticated", 401);
    }
    const invitations = await invitationService.getUserInvitations(userId);
    return sendSuccess(
      res,
      invitations,
      "User invitations retrieved successfully"
    );
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, error.message, error.statusCode);
    }
    return sendError(res, "Internal server error", 500);
  }
};

/**
 * GET /api/invitations/board/:boardId
 * Get all invitations for a specific board (owner only)
 */
export const getBoardInvitations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "User not authenticated", 401);
    }

    const { boardId } = req.params;
    if (!boardId) {
      return sendError(res, "boardId is required", 400);
    }

    const invitations = await invitationService.getBoardInvitations(boardId);

    return sendSuccess(
      res,
      invitations,
      "Board invitations retrieved successfully"
    );
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, error.message, error.statusCode);
    }
    return sendError(res, "Internal server error", 500);
  }
};
