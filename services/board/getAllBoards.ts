import { prisma } from "../../lib/prisma";

export interface BoardSummaryResponse {
  id: string;
  name: string;
  ownerId: string;
}

/**
 * all user board (owned + member)
 * @param userId 
 * @returns summary board array
 */
export const getAllBoards = async (
  userId: string
): Promise<BoardSummaryResponse[]> => {
  const boards = await prisma.board.findMany({
    where: {
      OR: [
        { ownerId: userId }, 
        { members: { some: { userId } } }, 
      ],
    },
    select: {
      id: true,
      name: true,
      ownerId: true,
      description: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return boards;
};
