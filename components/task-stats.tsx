"use client"

import type { Task } from "@/types/task"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { getTaskStats } from "@/lib/task-utils"

interface TaskStatsProps {
  tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const stats = getTaskStats(tasks)

  return (
    <Card data-testid="task-stats">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Task Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Completion Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-gray-600" data-testid="completion-rate">
              {Math.round(stats.completionRate)}%
            </span>
          </div>
          <Progress value={stats.completionRate} className="h-2" data-testid="progress-bar" />
          <p className="text-xs text-gray-500 mt-1">
            {stats.completed} of {stats.total} tasks completed
          </p>
        </div>

        {/* Status Breakdown */}
        <div>
          <h4 className="text-sm font-medium mb-3">Status Breakdown</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Done</span>
              </div>
              <span className="text-sm font-medium" data-testid="completed-count">
                {stats.completed}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm">In Progress</span>
              </div>
              <span className="text-sm font-medium" data-testid="in-progress-count">
                {stats.inProgress}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-600" />
                <span className="text-sm">To Do</span>
              </div>
              <span className="text-sm font-medium" data-testid="todo-count">
                {stats.todo}
              </span>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div>
          <h4 className="text-sm font-medium mb-3">Priority Breakdown</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">High</span>
              </div>
              <span className="text-sm font-medium" data-testid="high-priority-count">
                {stats.highPriority}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Medium</span>
              </div>
              <span className="text-sm font-medium" data-testid="medium-priority-count">
                {stats.mediumPriority}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Low</span>
              </div>
              <span className="text-sm font-medium" data-testid="low-priority-count">
                {stats.lowPriority}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
