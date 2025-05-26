import type { Task } from "@/types/task"

const STORAGE_KEY = "taskeasy-tasks"

export function loadTasks(): Task[] {
  console.log("loadTasks called")
  if (typeof window === "undefined") {
    console.log("Window undefined, returning empty array")
    return []
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    console.log("Stored data:", stored)
    if (!stored) {
      console.log("No stored data found")
      return []
    }

    const tasks = JSON.parse(stored)
    console.log("Parsed tasks:", tasks)
    return Array.isArray(tasks) ? tasks : []
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error)
    return []
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error)
  }
}

export function clearTasks(): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Error clearing tasks from localStorage:", error)
  }
}
