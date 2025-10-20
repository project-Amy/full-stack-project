import { NotFoundError, ForbiddenError } from "../../utils/errors";
import { prisma } from "../../lib/prisma";
import { ViewType } from "@prisma/client";

export interface UserInfo {
  id: string;
  name: string;
}

export interface BoardDetailResponse {
  id: string;
  name: string;
  description: string | null;
  defaultView: ViewType;
  owner: UserInfo;
  members: UserInfo[];
}

/**
 * @param boardId
 * @param userId
 * @returns Board con owner e members
 */
export const getBoard = async (
  boardId: string,
  userId: string
): Promise<BoardDetailResponse> => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      owner: {
        select: {
          id: true,
          email: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
    },
  });
  if (!board) {
    throw new NotFoundError("Board not found");
  }
  const isOwner = board.ownerId === userId;
  const isMember = board.members.some((member) => member.userId === userId);
  if (!isOwner && !isMember) {
    throw new ForbiddenError("You don't have access to this board");
  }

  return {
    id: board.id,
    name: board.name,
    description: board.description,
    defaultView: board.defaultView,
    owner: {
      id: board.owner.id,
      name: board.owner.email,
    },
    members: board.members.map((member) => ({
      id: member.user.id,
      name: member.user.email,
    })),
  };
};
