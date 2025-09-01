"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Clock, Globe, TrendingUp, AlertTriangle, CheckCircle, XCircle, Zap } from "lucide-react"
import APIVisualizer3D from "./api-visualizer-3d"

interface APIMetrics {
  totalEndpoints: number
  activeEndpoints: number
  averageResponseTime: number
  totalRequests: number
  errorRate: number
  uptime: number
}

interface APIEndpoint {
  id: string
  name: string
  method: string
  path: string
  status: "healthy" | "warning" | "error"
  responseTime: number
  requestCount: number
  errorCount: number
  lastChecked: string
}

export default function APIDashboard() {
  const [metrics, setMetrics] = useState<APIMetrics>({
    totalEndpoints: 12,
    activeEndpoints: 11,
    averageResponseTime: 145,
    totalRequests: 45678,
    errorRate: 2.3,
    uptime: 99.8,
  })

  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([
    {
      id: "1",
      name: "User Authentication",
      method: "POST",
      path: "/api/auth/login",
      status: "healthy",
      responseTime: 89,
      requestCount: 1250,
      errorCount: 3,
      lastChecked: "2 minutes ago",
    },
    {
      id: "2",
      name: "Get Users",
      method: "GET",
      path: "/api/users",
      status: "healthy",
      responseTime: 120,
      requestCount: 890,
      errorCount: 0,
      lastChecked: "1 minute ago",
    },
    {
      id: "3",
      name: "Create Payment",
      method: "POST",
      path: "/api/payments",
      status: "warning",
      responseTime: 340,
      requestCount: 156,
      errorCount: 8,
      lastChecked: "30 seconds ago",
    },
    {
      id: "4",
      name: "File Upload",
      method: "POST",
      path: "/api/upload",
      status: "error",
      responseTime: 0,
      requestCount: 45,
      errorCount: 45,
      lastChecked: "5 minutes ago",
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "healthy":
        return "default"
      case "warning":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "text-blue-400"
      case "POST":
        return "text-green-400"
      case "PUT":
        return "text-yellow-400"
      case "DELETE":
        return "text-red-400"
      case "PATCH":
        return "text-purple-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="h-full bg-gray-900 text-white">
      <Tabs defaultValue="overview" className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">API Dashboard</h2>
              <p className="text-sm text-gray-400">Monitor and visualize your API ecosystem</p>
            </div>
            <Button variant="outline" size="sm">
              <Activity className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <TabsList className="bg-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="visualization">3D Visualization</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="overview" className="h-full p-4 space-y-4">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Endpoints</CardTitle>
                  <Globe className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{metrics.totalEndpoints}</div>
                  <p className="text-xs text-green-400">{metrics.activeEndpoints} active</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Avg Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{metrics.averageResponseTime}ms</div>
                  <p className="text-xs text-green-400">-12ms from last hour</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Requests</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{metrics.totalRequests.toLocaleString()}</div>
                  <p className="text-xs text-green-400">+2.1% from yesterday</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Uptime</CardTitle>
                  <Zap className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{metrics.uptime}%</div>
                  <Progress value={metrics.uptime} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent API Activity</CardTitle>
                <CardDescription className="text-gray-400">Latest endpoint status and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {endpoints.slice(0, 4).map((endpoint) => (
                    <div key={endpoint.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(endpoint.status)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs font-mono ${getMethodColor(endpoint.method)}`}>
                              {endpoint.method}
                            </span>
                            <span className="text-sm font-medium text-white">{endpoint.path}</span>
                          </div>
                          <p className="text-xs text-gray-400">{endpoint.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white">{endpoint.responseTime}ms</div>
                        <div className="text-xs text-gray-400">{endpoint.lastChecked}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="h-full p-4">
            <Card className="bg-gray-800 border-gray-700 h-full">
              <CardHeader>
                <CardTitle className="text-white">API Endpoints</CardTitle>
                <CardDescription className="text-gray-400">
                  Detailed view of all API endpoints and their status
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full overflow-auto">
                <div className="space-y-2">
                  {endpoints.map((endpoint) => (
                    <div key={endpoint.id} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(endpoint.status)}
                          <div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={getMethodColor(endpoint.method)}>
                                {endpoint.method}
                              </Badge>
                              <span className="text-sm font-medium text-white">{endpoint.path}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{endpoint.name}</p>
                          </div>
                        </div>
                        <Badge variant={getStatusBadgeVariant(endpoint.status)}>{endpoint.status}</Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-gray-400">Response Time:</span>
                          <div className="text-white font-medium">{endpoint.responseTime}ms</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Requests:</span>
                          <div className="text-white font-medium">{endpoint.requestCount}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Errors:</span>
                          <div className="text-white font-medium">{endpoint.errorCount}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visualization" className="h-full">
            <APIVisualizer3D />
          </TabsContent>

          <TabsContent value="analytics" className="h-full p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Performance charts would be rendered here
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Error Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Error analysis charts would be rendered here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
