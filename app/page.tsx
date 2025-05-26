"use client"

import { useState } from "react"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "to-do" | "in-progress" | "done"
  createdAt: string
  updatedAt: string
}

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [status, setStatus] = useState<"to-do" | "in-progress" | "done">("to-do")

  const addTask = () => {
    if (!title.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setTasks([...tasks, newTask])
    setTitle("")
    setDescription("")
    setPriority("medium")
    setStatus("to-do")
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const updateTaskStatus = (id: string, newStatus: "to-do" | "in-progress" | "done") => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } : task,
      ),
    )
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    todo: tasks.filter((t) => t.status === "to-do").length,
  }

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

  return (
    <div className="task-easy-container">
      {/* Header */}
      <div className="header-section">
        <div className="header-content">
          <div className="header-icon">✓</div>
          <div>
            <h1 className="header-title">TaskEasy</h1>
            <p className="header-subtitle">Manage your tasks efficiently with our lightweight task management system</p>
          </div>
          <div className="header-badge">📊 {stats.total} Total Tasks</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="grid-layout">
          {/* Left Sidebar */}
          <div className="sidebar">
            {/* Task Creation Form */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">➕ Create New Task</h2>
                <p className="card-subtitle">Add a new task to your workflow</p>
              </div>

              <div className="card-content">
                <div className="form-group">
                  <label className="form-label">Task Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description (optional)"
                    rows={3}
                    className="form-textarea"
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="form-select"
                    >
                      <option value="low">🌱 Low</option>
                      <option value="medium">⚡ Medium</option>
                      <option value="high">🔥 High</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="form-select">
                      <option value="to-do">📋 To Do</option>
                      <option value="in-progress">⏳ In Progress</option>
                      <option value="done">✅ Done</option>
                    </select>
                  </div>
                </div>

                <button onClick={addTask} className="btn-primary">
                  ✅ Create Task
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="card">
              <div className="card-header purple">
                <h2 className="card-title">📊 Task Analytics</h2>
              </div>

              <div className="card-content">
                <div className="progress-section">
                  <div className="progress-header">
                    <span className="progress-label">Overall Progress</span>
                    <span className="progress-value">{Math.round(completionRate)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
                  </div>
                  <p className="progress-text">
                    {stats.completed} of {stats.total} tasks completed
                  </p>
                </div>

                <div className="stats-grid">
                  <div className="stat-item completed">
                    <span className="stat-label completed">✅ Completed</span>
                    <span className="stat-value completed">{stats.completed}</span>
                  </div>

                  <div className="stat-item in-progress">
                    <span className="stat-label in-progress">⏳ In Progress</span>
                    <span className="stat-value in-progress">{stats.inProgress}</span>
                  </div>

                  <div className="stat-item todo">
                    <span className="stat-label todo">📋 To Do</span>
                    <span className="stat-value todo">{stats.todo}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Task List */}
          <div className="card">
            <div className="card-content">
              <h2 className="card-title" style={{ color: "#111827", marginBottom: "8px" }}>
                Your Tasks
              </h2>
              <p style={{ color: "#6b7280", margin: "0 0 24px 0", fontSize: "14px" }}>
                Organize and track your tasks by status
              </p>

              {tasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3 className="empty-title">No tasks found</h3>
                  <p className="empty-text">Create your first task to get started with your productivity journey!</p>
                </div>
              ) : (
                <div className="task-list">
                  {tasks.map((task) => (
                    <div key={task.id} className={`task-item ${task.priority}`}>
                      <div className="task-header">
                        <div className="task-content">
                          <div className="task-title-row">
                            <h3 className="task-title">{task.title}</h3>
                            <span className={`priority-badge ${task.priority}`}>
                              {task.priority === "high"
                                ? "🔥 HIGH"
                                : task.priority === "medium"
                                  ? "⚡ MEDIUM"
                                  : "🌱 LOW"}
                            </span>
                          </div>

                          {task.description && <p className="task-description">{task.description}</p>}

                          <div className="task-controls">
                            <div className="status-control">
                              <span className="status-label">Status:</span>
                              <select
                                value={task.status}
                                onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                                className="status-select"
                              >
                                <option value="to-do">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                              </select>
                            </div>

                            <span
                              className={`status-badge ${
                                task.status === "done"
                                  ? "completed"
                                  : task.status === "in-progress"
                                    ? "in-progress"
                                    : "todo"
                              }`}
                            >
                              {task.status === "done"
                                ? "✅ Completed"
                                : task.status === "in-progress"
                                  ? "⏳ In Progress"
                                  : "📋 To Do"}
                            </span>
                          </div>
                        </div>

                        <button onClick={() => deleteTask(task.id)} className="btn-danger">
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
