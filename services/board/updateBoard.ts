import { NotFoundError, ForbiddenError } from "../../utils/errors";
import { prisma } from "../../lib/prisma";
import { ViewType } from "@prisma/client";

export interface UpdateBoardDTO {
  name?: string;
  description?: string | null;
  defaultView?: ViewType;
}

/**
 * @param boardId - ID della board da aggiornare
 * @param userId - ID dell'utente che richiede l'aggiornamento
 * @param data - Dati da aggiornare (name, description, defaultView)
 * @returns Board aggiornata
 */
export const updateBoard = async (
  boardId: string,
  userId: string,
  data: UpdateBoardDTO
) => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
  });
  if (!board) {
    throw new NotFoundError("Board not found");
  }
  if (board.ownerId !== userId) {
    throw new ForbiddenError("Only the board owner can update the board");
  }
  const updatedBoard = await prisma.board.update({
    where: { id: boardId },
    data,
  });

  return updatedBoard;
};
