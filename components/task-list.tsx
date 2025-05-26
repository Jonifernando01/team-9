"use client"

import type { Task } from "@/types/task"
import { TaskItem } from "@/components/task-item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TaskListProps {
  tasks: Task[]
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  title: string
}

export function TaskList({ tasks, onUpdate, onDelete, title }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No tasks found</p>
            <p className="text-sm mt-1">Create a new task to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
