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
  });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  return task;
};
