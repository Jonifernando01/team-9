import { describe, it, expect, beforeEach, jest } from "@jest/globals"
import { loadTasks, saveTasks, clearTasks } from "@/lib/storage"
import type { Task } from "@/types/task"

const mockTask: Task = {
  id: "1",
  title: "Test Task",
  description: "Test Description",
  priority: "medium",
  status: "to-do",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
}

describe("Storage Utils", () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe("loadTasks", () => {
    it("should return empty array when no tasks stored", () => {
      localStorage.getItem = jest.fn().mockReturnValue(null)
      const tasks = loadTasks()
      expect(tasks).toEqual([])
    })

    it("should return parsed tasks from localStorage", () => {
      const storedTasks = [mockTask]
      localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify(storedTasks))

      const tasks = loadTasks()
      expect(tasks).toEqual(storedTasks)
    })

    it("should return empty array on parse error", () => {
      localStorage.getItem = jest.fn().mockReturnValue("invalid json")
      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      const tasks = loadTasks()
      expect(tasks).toEqual([])
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe("saveTasks", () => {
    it("should save tasks to localStorage", () => {
      const tasks = [mockTask]
      localStorage.setItem = jest.fn()

      saveTasks(tasks)

      expect(localStorage.setItem).toHaveBeenCalledWith("taskeasy-tasks", JSON.stringify(tasks))
    })

    it("should handle save errors gracefully", () => {
      const tasks = [mockTask]
      localStorage.setItem = jest.fn().mockImplementation(() => {
        throw new Error("Storage error")
      })
      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      saveTasks(tasks)

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe("clearTasks", () => {
    it("should remove tasks from localStorage", () => {
      localStorage.removeItem = jest.fn()

      clearTasks()

      expect(localStorage.removeItem).toHaveBeenCalledWith("taskeasy-tasks")
    })
  })
})
