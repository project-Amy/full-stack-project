import { prisma } from "../../lib/prisma";
import { NotFoundError, ForbiddenError } from "../../utils/errors";
import { BoardTasksResponse } from "./types";

/**
 * Get all tasks for a board
 * @param boardId - Board ID
 * @param userId - User ID (for access validation)
 * @returns Board with tasks
 */
export const getBoardTasks = async (
  boardId: string,
  userId: string
): Promise<BoardTasksResponse> => {
  // 1. Verify board exists and user has access
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      members: true,
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

  // 2. Get all tasks for the board
  const tasks = await prisma.task.findMany({
    where: { boardId },
    include: {
      assignee: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: [{ status: "asc" }, { position: "asc" }],
  });

  // 3. Map to response format
  return {
    id: board.id,
    name: board.name,
    tasks: tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.assignee
        ? {
            id: task.assignee.id,
            name: task.assignee.email,
          }
        : null,
    })),
  };
};
