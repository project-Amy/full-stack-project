import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/errors";
import { BoardInvitationResponse } from "./types";

/**
 * Owner only
 * @param boardId - Board ID
 * @returns Array of invitations for the board
 */
export const getBoardInvitations = async (
  boardId: string,
): Promise<BoardInvitationResponse[]> => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
  });

  if (!board) {
    throw new AppError("Board not found", 404);
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
