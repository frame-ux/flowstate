export type TaskStatus = 'todo' | 'in-progress' | 'complete';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface AppState {
  tasks: Task[];
  todos: TodoItem[];
  notes: string;
}
