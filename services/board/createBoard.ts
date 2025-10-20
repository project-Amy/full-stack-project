import { ViewType } from "@prisma/client";
import { BadRequestError } from "../../utils/errors";
import { prisma } from "../../lib/prisma";

export interface CreateBoardDTO {
  name: string;
  description?: string;
  defaultView?: ViewType;
}

export interface BoardResponse {
  id: string;
  name: string;
  description: string | null;
  defaultView: ViewType;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @param userId - owner
 * @param data - data board
 * @returns board
 */
export const createBoard = async (
  userId: string,
  data: CreateBoardDTO
): Promise<BoardResponse> => {
  if (!data.name || data.name.trim().length === 0) {
    throw new BadRequestError("Board name is required");
  }
  if (data.name.length > 30) {
    throw new BadRequestError("Board name cannot exceed 30 characters");
  }
  try {
    const board = await prisma.board.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        defaultView: data.defaultView || ViewType.LIST,
        ownerId: userId,
      },
    });
    return board;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new BadRequestError("A board with this name already exists");
    }
    throw new BadRequestError("Failed to create board");
  }
};
