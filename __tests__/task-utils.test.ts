import { describe, it, expect } from "@jest/globals"
import {
  sortTasksByPriority,
  filterTasksByStatus,
  getTaskStats,
  validateTask,
  createTask,
  updateTask,
} from "@/lib/task-utils"
import type { Task } from "@/types/task"

// Mock tasks for testing
const mockTasks: Task[] = [
  {
    id: "1",
    title: "High Priority Task",
    description: "Important task",
    priority: "high",
    status: "to-do",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Medium Priority Task",
    description: "Medium task",
    priority: "medium",
    status: "in-progress",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    title: "Low Priority Task",
    description: "Low task",
    priority: "low",
    status: "done",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

describe("Task Utils", () => {
  describe("sortTasksByPriority", () => {
    it("should sort tasks by priority (high to low)", () => {
      const sorted = sortTasksByPriority(mockTasks)
      expect(sorted[0].priority).toBe("high")
      expect(sorted[1].priority).toBe("medium")
      expect(sorted[2].priority).toBe("low")
    })

    it("should not mutate the original array", () => {
      const original = [...mockTasks]
      sortTasksByPriority(mockTasks)
      expect(mockTasks).toEqual(original)
    })

    it("should handle empty array", () => {
      const result = sortTasksByPriority([])
      expect(result).toEqual([])
    })
  })

  describe("filterTasksByStatus", () => {
    it("should filter tasks by status", () => {
      const todoTasks = filterTasksByStatus(mockTasks, "to-do")
      expect(todoTasks).toHaveLength(1)
      expect(todoTasks[0].status).toBe("to-do")
    })

    it("should return empty array for non-existent status", () => {
      const result = filterTasksByStatus([], "done")
      expect(result).toHaveLength(0)
    })

    it("should filter in-progress tasks correctly", () => {
      const inProgressTasks = filterTasksByStatus(mockTasks, "in-progress")
      expect(inProgressTasks).toHaveLength(1)
      expect(inProgressTasks[0].title).toBe("Medium Priority Task")
    })
  })

  describe("getTaskStats", () => {
    it("should calculate correct task statistics", () => {
      const stats = getTaskStats(mockTasks)
      expect(stats.total).toBe(3)
      expect(stats.completed).toBe(1)
      expect(stats.inProgress).toBe(1)
      expect(stats.todo).toBe(1)
      expect(stats.highPriority).toBe(1)
      expect(stats.mediumPriority).toBe(1)
      expect(stats.lowPriority).toBe(1)
      expect(stats.completionRate).toBeCloseTo(33.33, 1)
    })

    it("should handle empty task array", () => {
      const stats = getTaskStats([])
      expect(stats.total).toBe(0)
      expect(stats.completed).toBe(0)
      expect(stats.completionRate).toBe(0)
    })

    it("should calculate 100% completion rate", () => {
      const completedTasks = mockTasks.map((task) => ({ ...task, status: "done" as const }))
      const stats = getTaskStats(completedTasks)
      expect(stats.completionRate).toBe(100)
    })
  })

  describe("validateTask", () => {
    it("should return no errors for valid task", () => {
      const validTask = {
        title: "Valid Task",
        description: "Valid description",
        priority: "medium" as const,
        status: "to-do" as const,
      }
      const errors = validateTask(validTask)
      expect(errors).toHaveLength(0)
    })

    it("should return error for missing title", () => {
      const invalidTask = {
        description: "Description without title",
        priority: "medium" as const,
        status: "to-do" as const,
      }
      const errors = validateTask(invalidTask)
      expect(errors).toContain("Task title is required")
    })

    it("should return error for empty title", () => {
      const invalidTask = {
        title: "   ",
        description: "Description",
        priority: "medium" as const,
        status: "to-do" as const,
      }
      const errors = validateTask(invalidTask)
      expect(errors).toContain("Task title is required")
    })

    it("should return error for title too long", () => {
      const invalidTask = {
        title: "a".repeat(101),
        description: "Description",
        priority: "medium" as const,
        status: "to-do" as const,
      }
      const errors = validateTask(invalidTask)
      expect(errors).toContain("Task title must be less than 100 characters")
    })

    it("should return error for description too long", () => {
      const invalidTask = {
        title: "Valid title",
        description: "a".repeat(501),
        priority: "medium" as const,
        status: "to-do" as const,
      }
      const errors = validateTask(invalidTask)
      expect(errors).toContain("Task description must be less than 500 characters")
    })
  })

  describe("createTask", () => {
    it("should create task with id and timestamps", () => {
      const taskData = {
        title: "New Task",
        description: "Task description",
        priority: "high" as const,
        status: "to-do" as const,
      }

      const task = createTask(taskData)

      expect(task.id).toBeDefined()
      expect(task.title).toBe("New Task")
      expect(task.createdAt).toBeDefined()
      expect(task.updatedAt).toBeDefined()
      expect(task.createdAt).toBe(task.updatedAt)
    })
  })

  describe("updateTask", () => {
    it("should update task and timestamp", () => {
      const originalTask = mockTasks[0]
      const updates = { title: "Updated Title", status: "done" as const }

      const updatedTask = updateTask(originalTask, updates)

      expect(updatedTask.title).toBe("Updated Title")
      expect(updatedTask.status).toBe("done")
      expect(updatedTask.updatedAt).not.toBe(originalTask.updatedAt)
      expect(updatedTask.createdAt).toBe(originalTask.createdAt)
    })
  })
})
