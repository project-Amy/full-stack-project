import { prisma } from "../../lib/prisma";
import { UserInvitationResponse } from "./types";

/**
 * Get all pending invitations for a user
 * @param userId - User ID
 * @returns Array of pending invitations with board info
 */
export const getUserInvitations = async (
  userId: string
): Promise<UserInvitationResponse[]> => {
  const invitations = await prisma.boardInvitation.findMany({
    where: {
      userId,
      status: "PENDING",
    },
    include: {
      board: {
        select: {
          id: true,
          name: true,
          owner: {
            select: {
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      invitedAt: "desc",
    },
  });

  return invitations.map((invitation) => ({
    id: invitation.id,
    userId: invitation.userId,
    status: invitation.status,
    board: {
      id: invitation.board.id,
      name: invitation.board.name,
      ownerName: invitation.board.owner.email,
    },
  }));
};
