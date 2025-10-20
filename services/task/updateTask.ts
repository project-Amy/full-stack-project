import { BadRequestError, NotFoundError } from "../../utils/errors";
import { prisma } from "../../lib/prisma";
import { UpdateTaskDTO, TaskResponse } from "./types";

/**
 * Update current task
 * @param taskId
 * @param data
 * @returns Updated task
 */
export const updateTask = async (
  taskId: string,
  data: UpdateTaskDTO
): Promise<TaskResponse> => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true, boardId: true, board: { select: { ownerId: true } } },
  });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  if (data.title !== undefined) {
    if (!data.title || data.title.trim().length === 0) {
      throw new BadRequestError("Task title cannot be empty");
    }
    if (data.title.length > 20) {
      throw new BadRequestError("Task title cannot exceed 20 characters");
    }
  }

  if (data.assigneeId !== undefined && data.assigneeId !== null) {
    const assigneeIsMember = await prisma.boardMember.findFirst({
      where: {
        boardId: task.boardId,
        userId: data.assigneeId,
      },
    });
    const assigneeIsOwner = task.board.ownerId === data.assigneeId;
    if (!assigneeIsMember && !assigneeIsOwner) {
      throw new BadRequestError("Assignee must be a member of the board");
    }
  }
  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...data,
        ...(data.title && { title: data.title.trim() }),
        ...(data.description !== undefined && {
          description: data.description?.trim() || null,
        }),
      },
      include: {
        assignee: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      dueDate: updatedTask.dueDate,
      assignee: updatedTask.assignee
        ? {
            id: updatedTask.assignee.id,
            name: updatedTask.assignee.email,
          }
        : null,
    };
  } catch (error: any) {
    console.error("Error updating task:", error);
    throw new BadRequestError("Failed to update task");
  }
};
