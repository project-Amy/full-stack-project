import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/errors";
import { InvitationBasicResponse } from "./types";

/**
 * @param boardId - Board ID
 * @param invitedUserId - User to invite
 * @param requestingUserId - User creating the invitation (must be board owner)
 * @returns Created invitation basic info
 */
export const createInvitation = async (
  boardId: string,
  invitedUserId: string,
  requestingUserId: string
): Promise<InvitationBasicResponse> => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
  });

  if (!board) {
    throw new AppError("Board not found", 404);
  }

  if (board.ownerId !== requestingUserId) {
    throw new AppError("Only board owner can invite members", 403);
  }

  const existingMember = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId,
        userId: invitedUserId,
      },
    },
  });

  if (existingMember) {
    throw new AppError("User is already a member of this board", 400);
  }

  const existingInvitation = await prisma.boardInvitation.findUnique({
    where: {
      boardId_userId: {
        boardId,
        userId: invitedUserId,
      },
    },
  });

  if (existingInvitation && existingInvitation.status === "PENDING") {
    throw new AppError("User already has a pending invitation for this board", 400);
  }

  const invitation = await prisma.boardInvitation.upsert({
    where: {
      boardId_userId: {
        boardId,
        userId: invitedUserId,
      },
    },
    update: {
      status: "PENDING",
      invitedAt: new Date(),
      respondedAt: null,
    },
    create: {
      boardId,
      userId: invitedUserId,
      status: "PENDING",
    },
  });

  return invitation;
};
