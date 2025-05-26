"use client"

import { useState, useEffect } from "react"
import { TaskForm } from "@/components/task-form"
import { TaskList } from "@/components/task-list"
import { TaskStats } from "@/components/task-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/types/task"
import { loadTasks, saveTasks } from "@/lib/storage"
import { createTask, updateTask, sortTasksByPriority, filterTasksByStatus } from "@/lib/task-utils"
import { CheckSquare, Plus, BarChart3 } from "lucide-react"

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("Loading tasks...")
    const savedTasks = loadTasks()
    console.log("Loaded tasks:", savedTasks)
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      data-testid="task-management-app"
    >
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <CheckSquare className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">TaskEasy</h1>
                <p className="text-gray-600 mt-1">
                  Manage your tasks efficiently with our lightweight task management system
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                <BarChart3 className="w-4 h-4 mr-1" />
                {tasks.length} Total Tasks
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Task Creation & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Task Creation Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Create New Task</span>
                </CardTitle>
                <CardDescription className="text-blue-100">Add a new task to your workflow</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <TaskForm onSubmit={addTask} />
              </CardContent>
            </Card>

            {/* Task Statistics */}
            <TaskStats tasks={tasks} />
          </div>

          {/* Right Content - Task Lists */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Your Tasks</CardTitle>
                <CardDescription>Organize and track your tasks by status</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100">
                    <TabsTrigger
                      value="all"
                      data-testid="all-tasks-tab"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      All ({tasks.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="to-do"
                      data-testid="todo-tasks-tab"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      To Do ({tasksByStatus["to-do"].length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="in-progress"
                      data-testid="in-progress-tasks-tab"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      In Progress ({tasksByStatus["in-progress"].length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="done"
                      data-testid="done-tasks-tab"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Done ({tasksByStatus["done"].length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-0">
                    <TaskList tasks={sortedTasks} onUpdate={updateTaskById} onDelete={deleteTask} title="All Tasks" />
                  </TabsContent>

                  <TabsContent value="to-do" className="mt-0">
                    <TaskList
                      tasks={tasksByStatus["to-do"]}
                      onUpdate={updateTaskById}
                      onDelete={deleteTask}
                      title="To Do Tasks"
                    />
                  </TabsContent>

                  <TabsContent value="in-progress" className="mt-0">
                    <TaskList
                      tasks={tasksByStatus["in-progress"]}
                      onUpdate={updateTaskById}
                      onDelete={deleteTask}
                      title="In Progress Tasks"
                    />
                  </TabsContent>

                  <TabsContent value="done" className="mt-0">
                    <TaskList
                      tasks={tasksByStatus["done"]}
                      onUpdate={updateTaskById}
                      onDelete={deleteTask}
                      title="Completed Tasks"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
