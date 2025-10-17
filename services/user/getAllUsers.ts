import { prisma } from "../../lib/prisma";

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

/**
 *  all users from the database
 * @returns Array of users with basic information
 */
export const getAllUsers = async (): Promise<UserResponse[]> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};
