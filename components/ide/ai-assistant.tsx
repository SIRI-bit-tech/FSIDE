"use client"

import { useState } from "react"
import { Brain, Lightbulb, Link, AlertTriangle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface FileTab {
  id: string
  name: string
  path: string
  content: string
  language: string
  isDirty: boolean
}

interface AIAssistantProps {
  activeFile?: FileTab
}

export function AIAssistant({ activeFile }: AIAssistantProps) {
  const [query, setQuery] = useState("")
  const [suggestions] = useState([
    {
      type: "suggestion",
      icon: <Lightbulb className="w-4 h-4" />,
      title: "Add Error Handling",
      description: "Consider adding try-catch blocks for better error handling",
      confidence: 85,
    },
    {
      type: "api",
      icon: <Link className="w-4 h-4" />,
      title: "API Connection",
      description: "Connected to /api/users/ endpoint",
      confidence: 95,
    },
    {
      type: "warning",
      icon: <AlertTriangle className="w-4 h-4" />,
      title: "Performance Issue",
      description: "Large component detected. Consider code splitting",
      confidence: 70,
    },
    {
      type: "optimization",
      icon: <Zap className="w-4 h-4" />,
      title: "Optimization",
      description: "Use React.memo for this component to prevent re-renders",
      confidence: 90,
    },
  ])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "suggestion":
        return "text-secondary"
      case "api":
        return "text-primary"
      case "warning":
        return "text-destructive"
      case "optimization":
        return "text-chart-1"
      default:
        return "text-muted-foreground"
    }
  }

  const getTypeBg = (type: string) => {
    switch (type) {
      case "suggestion":
        return "bg-secondary/20 border-secondary/30"
      case "api":
        return "bg-primary/20 border-primary/30"
      case "warning":
        return "bg-destructive/20 border-destructive/30"
      case "optimization":
        return "bg-chart-1/20 border-chart-1/30"
      default:
        return "bg-muted/20 border-muted/30"
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* AI Query Input */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sidebar-foreground">
          <Brain className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium">Ask AI</span>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="How can I improve this code?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground"
          />
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Ask
          </Button>
        </div>
      </div>

      {/* Current File Info */}
      {activeFile && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-sidebar-foreground">Current File</h4>
          <div className="bg-sidebar-accent/50 p-3 rounded border border-sidebar-border">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-sidebar-foreground">{activeFile.name}</span>
              {activeFile.isDirty && (
                <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                  Modified
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{activeFile.path}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Language: {activeFile.language} • Lines: {activeFile.content.split("\n").length}
            </p>
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-sidebar-foreground">AI Suggestions</h4>
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-3 rounded border ${getTypeBg(suggestion.type)} cursor-pointer hover:opacity-80 transition-opacity`}
              >
                <div className="flex items-start gap-2">
                  <div className={getTypeColor(suggestion.type)}>{suggestion.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-sidebar-foreground">{suggestion.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.confidence}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-sidebar-foreground">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="text-xs bg-transparent">
            Generate Tests
          </Button>
          <Button variant="outline" size="sm" className="text-xs bg-transparent">
            Add Comments
          </Button>
          <Button variant="outline" size="sm" className="text-xs bg-transparent">
            Refactor Code
          </Button>
          <Button variant="outline" size="sm" className="text-xs bg-transparent">
            Fix Issues
          </Button>
        </div>
      </div>
    </div>
  )
}
