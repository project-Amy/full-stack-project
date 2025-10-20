import { TaskStatus, Priority } from "@prisma/client";

export interface UserInfo {
  id: string;
  name: string;
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
  assignee: UserInfo | null;
}

export interface BoardTaskItem {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority | null;
  dueDate: Date | null;
  assignee: UserInfo | null;
}

export interface BoardTasksResponse {
  id: string;
  name: string;
  tasks: BoardTaskItem[];
}
