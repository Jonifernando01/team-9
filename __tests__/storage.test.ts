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
  let localStorageMock: any
  let consoleErrorSpy: any

  beforeEach(() => {
    // Create fresh mocks for each test
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    }

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true
    })

    // Mock console.error
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("loadTasks", () => {
    it("should return empty array when no tasks stored", () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const tasks = loadTasks()
      
      expect(tasks).toEqual([])
      expect(localStorageMock.getItem).toHaveBeenCalledWith("taskeasy-tasks")
    })

    it("should return parsed tasks from localStorage", () => {
      const storedTasks = [mockTask]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedTasks))

      const tasks = loadTasks()
      
      expect(tasks).toEqual(storedTasks)
      expect(localStorageMock.getItem).toHaveBeenCalledWith("taskeasy-tasks")
    })

    it("should return empty array on parse error", () => {
      localStorageMock.getItem.mockReturnValue("invalid json")

      const tasks = loadTasks()
      
      expect(tasks).toEqual([])
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe("saveTasks", () => {
    it("should save tasks to localStorage", () => {
      const tasks = [mockTask]

      saveTasks(tasks)

      expect(localStorageMock.setItem).toHaveBeenCalledWith("taskeasy-tasks", JSON.stringify(tasks))
    })

    it("should handle save errors gracefully", () => {
      const tasks = [mockTask]
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("Storage error")
      })

      saveTasks(tasks)

      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe("clearTasks", () => {
    it("should remove tasks from localStorage", () => {
      clearTasks()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("taskeasy-tasks")
    })
  })
})