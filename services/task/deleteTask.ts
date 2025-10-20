import { NotFoundError } from "../../utils/errors";
import { prisma } from "../../lib/prisma";

/**
 * Elimina una task
 * @param taskId - ID della task da eliminare
 * @returns Messaggio di conferma
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });
};
