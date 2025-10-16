import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/errors";
import { InvitationStatus } from "@prisma/client";
import { InvitationBasicResponse } from "./types";

/**
 * Respond to a board invitation (accept or reject)
 * @param invitationId - Invitation ID
 * @param userId - User responding to the invitation
 * @param response - ACCEPTED or REJECTED
 * @returns Updated invitation
 */
export const respondToInvitation = async (
  invitationId: string,
  userId: string,
  response: "ACCEPTED" | "REJECTED"
): Promise<InvitationBasicResponse> => {
  const invitation = await prisma.boardInvitation.findUnique({
    where: { id: invitationId },
  });

  if (!invitation) {
    throw new AppError("Invitation not found", 404);
  }

  if (invitation.userId !== userId) {
    throw new AppError("Not authorized to respond to this invitation", 403);
  }

  if (invitation.status !== "PENDING") {
    throw new AppError("Invitation already responded to", 400);
  }

  // Update invitation status
  const updatedInvitation = await prisma.boardInvitation.update({
    where: { id: invitationId },
    data: {
      status: response as InvitationStatus,
      respondedAt: new Date(),
    },
  });

  // If accepted, create board membership
  if (response === "ACCEPTED") {
    await prisma.boardMember.create({
      data: {
        boardId: invitation.boardId,
        userId: invitation.userId,
        role: "MEMBER",
      },
    });
  }

  return updatedInvitation;
};
