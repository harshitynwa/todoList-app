export interface Todo {
  id: string;
  name: string;
  isCompleted: boolean;
  pendingCount: number;
  completedCount: number;
  totalCount: number;
}

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Task {
  id: string;
  todoId: string;
  name: string;
  description: string;
  dueDate: string;
  priority: Priority;
  isCompleted: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}
