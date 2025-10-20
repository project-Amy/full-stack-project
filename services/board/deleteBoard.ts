import { NotFoundError, ForbiddenError } from "../../utils/errors";
import { prisma } from "../../lib/prisma";

/**
 * Elimina una board e tutte le sue risorse associate (tasks, members, invitations)
 * @param boardId - ID della board da eliminare
 * @param userId - ID dell'utente che richiede l'eliminazione
 * @returns void
 */
export const deleteBoard = async (
  boardId: string,
  userId: string
): Promise<void> => {
  // Verifica che la board esista
  const board = await prisma.board.findUnique({
    where: { id: boardId },
  });

  if (!board) {
    throw new NotFoundError("Board not found");
  }

  // Verifica che l'utente sia il proprietario della board
  if (board.ownerId !== userId) {
    throw new ForbiddenError("Only the board owner can delete the board");
  }

  // Elimina la board (i tasks, members e invitations verranno eliminati automaticamente grazie a onDelete: Cascade)
  await prisma.board.delete({
    where: { id: boardId },
  });
};
