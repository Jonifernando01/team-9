import type { Task, TaskPriority, TaskStatus, TaskStats } from "@/types/task"

export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityOrder: Record<TaskPriority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  }

  return [...tasks].sort((a, b) => {
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}

export function filterTasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((task) => task.status === status)
}

export function getTaskStats(tasks: Task[]): TaskStats {
  const total = tasks.length
  const completed = tasks.filter((task) => task.status === "done").length
  const inProgress = tasks.filter((task) => task.status === "in-progress").length
  const todo = tasks.filter((task) => task.status === "to-do").length

  const highPriority = tasks.filter((task) => task.priority === "high").length
  const mediumPriority = tasks.filter((task) => task.priority === "medium").length
  const lowPriority = tasks.filter((task) => task.priority === "low").length

  const completionRate = total > 0 ? (completed / total) * 100 : 0

  return {
    total,
    completed,
    inProgress,
    todo,
    highPriority,
    mediumPriority,
    lowPriority,
    completionRate,
  }
}

export function validateTask(task: Partial<Task>): string[] {
  const errors: string[] = []

  if (!task.title || task.title.trim().length === 0) {
    errors.push("Task title is required")
  }

  if (task.title && task.title.length > 100) {
    errors.push("Task title must be less than 100 characters")
  }

  if (task.description && task.description.length > 500) {
    errors.push("Task description must be less than 500 characters")
  }

  const validPriorities: TaskPriority[] = ["low", "medium", "high"]
  if (task.priority && !validPriorities.includes(task.priority)) {
    errors.push("Invalid task priority")
  }

  const validStatuses: TaskStatus[] = ["to-do", "in-progress", "done"]
  if (task.status && !validStatuses.includes(task.status)) {
    errors.push("Invalid task status")
  }

  return errors
}

export function createTask(taskData: Omit<Task, "id" | "createdAt" | "updatedAt">): Task {
  return {
    ...taskData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function updateTask(task: Task, updates: Partial<Task>): Task {
  return {
    ...task,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
}
