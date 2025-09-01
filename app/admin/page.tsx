"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Code2,
  Database,
  Activity,
  Settings,
  Shield,
  BarChart3,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Search,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "developer" | "viewer"
  status: "active" | "inactive" | "suspended"
  lastActive: string
  projectsCount: number
  avatar?: string
}

interface Project {
  id: string
  name: string
  description: string
  owner: string
  collaborators: number
  status: "active" | "archived" | "draft"
  lastModified: string
  filesCount: number
  aiUsage: number
}

interface SystemMetrics {
  totalUsers: number
  activeUsers: number
  totalProjects: number
  activeProjects: number
  aiRequestsToday: number
  systemUptime: number
  storageUsed: number
  storageLimit: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      status: "active",
      lastActive: "2 minutes ago",
      projectsCount: 5,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "developer",
      status: "active",
      lastActive: "1 hour ago",
      projectsCount: 3,
    },
    {
      id: "3",
      name: "Bob Wilson",
      email: "bob@example.com",
      role: "viewer",
      status: "inactive",
      lastActive: "2 days ago",
      projectsCount: 1,
    },
  ])

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Full-stack e-commerce solution with React and Django",
      owner: "John Doe",
      collaborators: 3,
      status: "active",
      lastModified: "1 hour ago",
      filesCount: 45,
      aiUsage: 89,
    },
    {
      id: "2",
      name: "Mobile App Backend",
      description: "REST API for mobile application",
      owner: "Jane Smith",
      collaborators: 2,
      status: "active",
      lastModified: "3 hours ago",
      filesCount: 28,
      aiUsage: 56,
    },
  ])

  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalUsers: 156,
    activeUsers: 89,
    totalProjects: 234,
    activeProjects: 178,
    aiRequestsToday: 1247,
    systemUptime: 99.8,
    storageUsed: 2.4,
    storageLimit: 10,
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("overview")

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/auth")
      return
    }

    setIsAuthenticated(true)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "developer":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "inactive":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "suspended":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">FSIDE Pro Admin</h1>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Administrator
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("adminToken")
                router.push("/admin/auth")
              }}
            >
              Logout
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button
              variant={selectedTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedTab("overview")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={selectedTab === "users" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedTab("users")}
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </Button>
            <Button
              variant={selectedTab === "projects" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedTab("projects")}
            >
              <Code2 className="w-4 h-4 mr-2" />
              Projects
            </Button>
            <Button
              variant={selectedTab === "system" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedTab("system")}
            >
              <Database className="w-4 h-4 mr-2" />
              System
            </Button>
            <Button
              variant={selectedTab === "logs" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedTab("logs")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Logs
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {selectedTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
                <p className="text-gray-600">System metrics and activity summary</p>
              </div>

              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalUsers}</div>
                    <p className="text-xs text-green-600">{metrics.activeUsers} active users</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                    <Code2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.activeProjects}</div>
                    <p className="text-xs text-blue-600">{metrics.totalProjects} total projects</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">AI Requests Today</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.aiRequestsToday}</div>
                    <p className="text-xs text-purple-600">+12% from yesterday</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.systemUptime}%</div>
                    <p className="text-xs text-green-600">All systems operational</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent User Activity</CardTitle>
                    <CardDescription>Latest user registrations and activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users.slice(0, 5).map((user) => (
                        <div key={user.id} className="flex items-center space-x-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                            <p className="text-xs text-gray-500 mt-1">{user.lastActive}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Projects</CardTitle>
                    <CardDescription>Most recently modified projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                            <p className="text-sm text-gray-500 truncate">
                              by {project.owner} • {project.collaborators} collaborators
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{project.status}</Badge>
                            <p className="text-xs text-gray-500 mt-1">{project.lastModified}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {selectedTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
                  <p className="text-gray-600">Manage user accounts and permissions</p>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Projects
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Active
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getStatusIcon(user.status)}
                                <span className="ml-2 text-sm text-gray-900">{user.status}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.projectsCount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastActive}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTab === "projects" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Project Management</h2>
                <p className="text-gray-600">Monitor and manage all projects</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge variant="outline">{project.status}</Badge>
                      </div>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Owner:</span>
                          <span>{project.owner}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Collaborators:</span>
                          <span>{project.collaborators}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Files:</span>
                          <span>{project.filesCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">AI Usage:</span>
                          <span>{project.aiUsage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Modified:</span>
                          <span>{project.lastModified}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {selectedTab === "system" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">System Status</h2>
                <p className="text-gray-600">Monitor system health and performance</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Storage Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Used: {metrics.storageUsed} GB</span>
                        <span>Limit: {metrics.storageLimit} GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(metrics.storageUsed / metrics.storageLimit) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Database</span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Redis Cache</span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI Services</span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">WebSocket</span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {selectedTab === "logs" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">System Logs</h2>
                <p className="text-gray-600">View system activity and error logs</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-2 font-mono text-sm">
                      <div className="text-green-600">[2024-01-15 10:30:15] INFO: User john@example.com logged in</div>
                      <div className="text-blue-600">
                        [2024-01-15 10:29:45] INFO: Project 'E-commerce Platform' created
                      </div>
                      <div className="text-yellow-600">
                        [2024-01-15 10:28:30] WARN: High AI usage detected for user jane@example.com
                      </div>
                      <div className="text-green-600">
                        [2024-01-15 10:27:12] INFO: Database backup completed successfully
                      </div>
                      <div className="text-red-600">[2024-01-15 10:25:45] ERROR: Failed to connect to external API</div>
                      <div className="text-green-600">[2024-01-15 10:24:30] INFO: System health check passed</div>
                      <div className="text-blue-600">
                        [2024-01-15 10:23:15] INFO: New user registration: bob@example.com
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
