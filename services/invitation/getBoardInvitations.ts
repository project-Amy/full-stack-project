import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/errors";
import { BoardInvitationResponse } from "./types";

/**
 * Owner only
 * @param boardId - Board ID
 * @param requestingUserId - User requesting the invitations (must be board owner)
 * @returns Array of invitations for the board
 */
export const getBoardInvitations = async (
  boardId: string,
  requestingUserId: string
): Promise<BoardInvitationResponse[]> => {
  // Check if requesting user is the board owner
  const board = await prisma.board.findUnique({
    where: { id: boardId },
  });

  if (!board) {
    throw new AppError("Board not found", 404);
  }

  if (board.ownerId !== requestingUserId) {
    throw new AppError("Only board owner can view invitations", 403);
  }

  const invitations = await prisma.boardInvitation.findMany({
    where: { boardId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      invitedAt: "desc",
    },
  });

  return invitations;
};
