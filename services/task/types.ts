import { TaskStatus, Priority } from "@prisma/client";

export interface UserInfo {
  id: string;
  name: string | null;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: Date;
  boardId: string;
  assigneeId?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: Date;
  assigneeId?: string;
  position?: number;
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority | null;
  dueDate: Date | null;
  position: number;
  boardId: string;
  assigneeId: string | null;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  assignee: UserInfo | null;
  creator: UserInfo;
}
