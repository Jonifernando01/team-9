"use client"

import { useState, useEffect } from "react"
import { TaskForm } from "@/components/task-form"
import { TaskList } from "@/components/task-list"
import { TaskStats } from "@/components/task-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Task } from "@/types/task"
import { loadTasks, saveTasks } from "@/lib/storage"
import { createTask, updateTask, sortTasksByPriority, filterTasksByStatus } from "@/lib/task-utils"

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedTasks = loadTasks()
    setTasks(savedTasks)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      saveTasks(tasks)
    }
  }, [tasks, loading])

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask = createTask(taskData)
    setTasks((prev) => [...prev, newTask])
  }

  const updateTaskById = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? updateTask(task, updates) : task)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const sortedTasks = sortTasksByPriority(tasks)

  const tasksByStatus = {
    "to-do": filterTasksByStatus(sortedTasks, "to-do"),
    "in-progress": filterTasksByStatus(sortedTasks, "in-progress"),
    done: filterTasksByStatus(sortedTasks, "done"),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-testid="task-management-app">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">TaskEasy</h1>
          <p className="text-gray-600 mt-2">
            Manage your tasks efficiently with our lightweight task management system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Creation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Create New Task</CardTitle>
                <CardDescription>Add a new task to your workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <TaskForm onSubmit={addTask} />
              </CardContent>
            </Card>

            {/* Task Statistics */}
            <div className="mt-6">
              <TaskStats tasks={tasks} />
            </div>
          </div>

          {/* Task Lists */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" data-testid="all-tasks-tab">
                  All Tasks ({tasks.length})
                </TabsTrigger>
                <TabsTrigger value="to-do" data-testid="todo-tasks-tab">
                  To Do ({tasksByStatus["to-do"].length})
                </TabsTrigger>
                <TabsTrigger value="in-progress" data-testid="in-progress-tasks-tab">
                  In Progress ({tasksByStatus["in-progress"].length})
                </TabsTrigger>
                <TabsTrigger value="done" data-testid="done-tasks-tab">
                  Done ({tasksByStatus["done"].length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <TaskList tasks={sortedTasks} onUpdate={updateTaskById} onDelete={deleteTask} title="All Tasks" />
              </TabsContent>

              <TabsContent value="to-do" className="mt-6">
                <TaskList
                  tasks={tasksByStatus["to-do"]}
                  onUpdate={updateTaskById}
                  onDelete={deleteTask}
                  title="To Do Tasks"
                />
              </TabsContent>

              <TabsContent value="in-progress" className="mt-6">
                <TaskList
                  tasks={tasksByStatus["in-progress"]}
                  onUpdate={updateTaskById}
                  onDelete={deleteTask}
                  title="In Progress Tasks"
                />
              </TabsContent>

              <TabsContent value="done" className="mt-6">
                <TaskList
                  tasks={tasksByStatus["done"]}
                  onUpdate={updateTaskById}
                  onDelete={deleteTask}
                  title="Completed Tasks"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
