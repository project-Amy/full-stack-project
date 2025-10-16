import { prisma } from "../../lib/prisma";
import { UserInvitationResponse } from "./types";

/**
 * Get all pending invitations for a user
 * @param userId - User ID
 * @returns Array of pending invitations with board and owner info
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
          description: true,
          owner: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      invitedAt: "desc",
    },
  });

  return invitations;
};
