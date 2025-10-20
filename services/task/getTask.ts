import { NotFoundError } from "../../utils/errors";
import { prisma } from "../../lib/prisma";
import { TaskResponse } from "./types";

/**
 * Ottiene i dettagli di una task
 * @param taskId - ID della task
 * @returns Task con dettagli
 */
export const getTask = async (taskId: string): Promise<TaskResponse> => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignee: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

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
};
