"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Download, Settings, Trash2, Star } from "lucide-react"

interface Plugin {
  id: string
  name: string
  description: string
  version: string
  author: string
  rating: number
  downloads: number
  installed: boolean
  enabled: boolean
  category: string
}

export function PluginManager() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const mockPlugins: Plugin[] = [
      {
        id: "ai-assistant",
        name: "AI Code Assistant",
        description: "Enhanced AI-powered code suggestions and completions",
        version: "1.2.0",
        author: "FSIDE Team",
        rating: 4.8,
        downloads: 15420,
        installed: true,
        enabled: true,
        category: "ai",
      },
      {
        id: "git-lens",
        name: "Git Lens Pro",
        description: "Advanced Git integration with blame annotations and history",
        version: "2.1.5",
        author: "Git Tools Inc",
        rating: 4.9,
        downloads: 28350,
        installed: false,
        enabled: false,
        category: "version-control",
      },
      {
        id: "theme-pack",
        name: "Premium Themes",
        description: "Collection of beautiful dark and light themes",
        version: "1.0.3",
        author: "Theme Studio",
        rating: 4.6,
        downloads: 9876,
        installed: true,
        enabled: false,
        category: "themes",
      },
    ]
    setPlugins(mockPlugins)
  }, [])

  const filteredPlugins = plugins.filter((plugin) => {
    const matchesSearch =
      plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || plugin.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleInstall = async (pluginId: string) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setPlugins((prev) =>
      prev.map((plugin) => (plugin.id === pluginId ? { ...plugin, installed: true, enabled: true } : plugin)),
    )
    setLoading(false)
  }

  const handleUninstall = async (pluginId: string) => {
    setPlugins((prev) =>
      prev.map((plugin) => (plugin.id === pluginId ? { ...plugin, installed: false, enabled: false } : plugin)),
    )
  }

  const handleToggle = (pluginId: string) => {
    setPlugins((prev) =>
      prev.map((plugin) => (plugin.id === pluginId ? { ...plugin, enabled: !plugin.enabled } : plugin)),
    )
  }

  return (
    <div className="h-full bg-gray-900 text-white p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Plugin Manager</h2>

        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search plugins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          >
            <option value="all">All Categories</option>
            <option value="ai">AI & ML</option>
            <option value="version-control">Version Control</option>
            <option value="themes">Themes</option>
            <option value="productivity">Productivity</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPlugins.map((plugin) => (
          <Card key={plugin.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-white">{plugin.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    by {plugin.author} • v{plugin.version}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-300">{plugin.rating}</span>
                  </div>
                  <Badge variant="secondary" className="bg-gray-700">
                    {plugin.downloads.toLocaleString()} downloads
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-gray-300 mb-4">{plugin.description}</p>

              <div className="flex justify-between items-center">
                <Badge variant={plugin.installed ? "default" : "outline"}>
                  {plugin.installed ? "Installed" : "Not Installed"}
                </Badge>

                <div className="flex gap-2">
                  {plugin.installed ? (
                    <>
                      <Button
                        size="sm"
                        variant={plugin.enabled ? "default" : "outline"}
                        onClick={() => handleToggle(plugin.id)}
                      >
                        {plugin.enabled ? "Enabled" : "Disabled"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleUninstall(plugin.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => handleInstall(plugin.id)} disabled={loading}>
                      <Download className="w-4 h-4 mr-2" />
                      Install
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
