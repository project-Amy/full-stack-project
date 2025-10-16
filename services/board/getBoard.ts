import { NotFoundError, ForbiddenError } from "../../utils/errors";
import { prisma } from "../../lib/prisma";
import { ViewType, TaskStatus, Priority } from "@prisma/client";

export interface UserInfo {
  id: string;
  name: string | null;
}

export interface BoardMemberResponse {
  id: string;
  userId: string;
  boardId: string;
  role: string;
  joinedAt: Date;
  user: UserInfo;
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority | null;
  position: number;
  dueDate: Date | null;
  boardId: string;
  assigneeId: string | null;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  assignee: UserInfo | null;
  creator: UserInfo;
}

export interface BoardDetailResponse {
  id: string;
  name: string;
  description: string | null;
  defaultView: ViewType;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner: UserInfo;
  members: BoardMemberResponse[];
  tasks: TaskResponse[];
}

/**
 * @param boardId
 * @param userId
 * @returns Board con owner, members e tasks
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
          name: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      tasks: {
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [{ status: "asc" }, { position: "asc" }],
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

  return board;
};
