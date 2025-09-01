"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, FileText, Settings, GitBranch, Terminal, Zap } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Command {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: string
  action: () => void
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFileOpen: (file: { name: string; path: string; content: string; language: string }) => void
}

export function CommandPalette({ open, onOpenChange, onFileOpen }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands: Command[] = [
    {
      id: "open-file",
      title: "Open File",
      description: "Open a file in the editor",
      icon: <FileText className="w-4 h-4" />,
      category: "File",
      action: () => {
        onFileOpen({
          name: "NewFile.tsx",
          path: "src/NewFile.tsx",
          content: 'import React from "react"\n\nexport default function NewFile() {\n  return <div>New File</div>\n}',
          language: "typescript",
        })
        onOpenChange(false)
      },
    },
    {
      id: "settings",
      title: "Open Settings",
      description: "Open IDE settings",
      icon: <Settings className="w-4 h-4" />,
      category: "Settings",
      action: () => {
        console.log("Open settings")
        onOpenChange(false)
      },
    },
    {
      id: "git-status",
      title: "Git Status",
      description: "Show git status",
      icon: <GitBranch className="w-4 h-4" />,
      category: "Git",
      action: () => {
        console.log("Show git status")
        onOpenChange(false)
      },
    },
    {
      id: "terminal",
      title: "New Terminal",
      description: "Open a new terminal",
      icon: <Terminal className="w-4 h-4" />,
      category: "Terminal",
      action: () => {
        console.log("Open terminal")
        onOpenChange(false)
      },
    },
    {
      id: "ai-generate",
      title: "Generate Code",
      description: "Generate code with AI",
      icon: <Zap className="w-4 h-4" />,
      category: "AI",
      action: () => {
        console.log("Generate code")
        onOpenChange(false)
      },
    },
  ]

  const filteredCommands = commands.filter(
    (command) =>
      command.title.toLowerCase().includes(query.toLowerCase()) ||
      command.description.toLowerCase().includes(query.toLowerCase()) ||
      command.category.toLowerCase().includes(query.toLowerCase()),
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) {
      setQuery("")
      setSelectedIndex(0)
    }
  }, [open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
        break
      case "Enter":
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action()
        }
        break
      case "Escape":
        onOpenChange(false)
        break
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 bg-card border-border">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-none bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
        </div>

        <ScrollArea className="max-h-96">
          <div className="p-2">
            {filteredCommands.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No commands found</div>
            ) : (
              filteredCommands.map((command, index) => (
                <div
                  key={command.id}
                  className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${
                    index === selectedIndex ? "bg-primary/20 text-primary" : "text-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => command.action()}
                >
                  <div className={index === selectedIndex ? "text-primary" : "text-muted-foreground"}>
                    {command.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{command.title}</div>
                    <div className="text-sm text-muted-foreground">{command.description}</div>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{command.category}</div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
