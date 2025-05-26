export type TaskPriority = "low" | "medium" | "high"
export type TaskStatus = "to-do" | "in-progress" | "done"

export interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface TaskStats {
  total: number
  completed: number
  inProgress: number
  todo: number
  highPriority: number
  mediumPriority: number
  lowPriority: number
  completionRate: number
}
