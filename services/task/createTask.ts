import { TaskStatus } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../../utils/errors";
import { prisma } from "../../lib/prisma";
import { CreateTaskDTO, TaskResponse } from "./types";

/**
 * New task
 * @param userId - ID dell'utente che crea la task
 * @param data - Dati della task
 * @returns Task creata
 */
export const createTask = async (
  userId: string,
  data: CreateTaskDTO
): Promise<TaskResponse> => {
  if (!data.title || data.title.trim().length === 0) {
    throw new BadRequestError("Task title is required");
  }
  if (data.title.length > 20) {
    throw new BadRequestError("Task title cannot exceed 20 characters");
  }
  if (!data.boardId) {
    throw new BadRequestError("Board ID is required");
  }

  const board = await prisma.board.findUnique({
    where: { id: data.boardId },
    select: { id: true, ownerId: true },
  });
  if (!board) {
    throw new NotFoundError("Board not found");
  }
  if (data.assigneeId) {
    const assigneeIsMember = await prisma.boardMember.findFirst({
      where: {
        boardId: data.boardId,
        userId: data.assigneeId,
      },
    });
    const assigneeIsOwner = board.ownerId === data.assigneeId;
    if (!assigneeIsMember && !assigneeIsOwner) {
      throw new BadRequestError("Assignee must be a member of the board");
    }
  }
  // (ultima position + 1)
  const lastTask = await prisma.task.findFirst({
    where: { boardId: data.boardId },
    orderBy: { position: "desc" },
  });
  const position = lastTask ? lastTask.position + 1 : 0;
  try {
    const task = await prisma.task.create({
      data: {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        status: data.status || TaskStatus.TODO,
        priority: data.priority || null,
        dueDate: data.dueDate || null,
        position,
        boardId: data.boardId,
        assigneeId: data.assigneeId || null,
        creatorId: userId,
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
    };
  } catch (error: any) {
    throw new BadRequestError("Failed to create task");
  }
};
