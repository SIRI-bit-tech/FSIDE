"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

interface TerminalLine {
  id: string
  type: "command" | "output" | "error"
  content: string
  timestamp: Date
}

export function TerminalPanel() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: "1",
      type: "output",
      content: "FSIDE Pro Terminal v1.0.0",
      timestamp: new Date(),
    },
    {
      id: "2",
      type: "command",
      content: "$ npm run dev",
      timestamp: new Date(),
    },
    {
      id: "3",
      type: "output",
      content: "✓ Ready on http://localhost:3000",
      timestamp: new Date(),
    },
    {
      id: "4",
      type: "output",
      content: "✓ Django server running on http://localhost:8000",
      timestamp: new Date(),
    },
  ])
  const [currentCommand, setCurrentCommand] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentCommand.trim()) return

    const newCommandLine: TerminalLine = {
      id: Date.now().toString(),
      type: "command",
      content: `$ ${currentCommand}`,
      timestamp: new Date(),
    }

    // Mock command execution
    let outputLine: TerminalLine | null = null
    switch (currentCommand.toLowerCase()) {
      case "ls":
        outputLine = {
          id: (Date.now() + 1).toString(),
          type: "output",
          content: "src/  backend/  package.json  README.md",
          timestamp: new Date(),
        }
        break
      case "pwd":
        outputLine = {
          id: (Date.now() + 1).toString(),
          type: "output",
          content: "/workspace/fside-pro",
          timestamp: new Date(),
        }
        break
      case "clear":
        setLines([])
        setCurrentCommand("")
        return
      default:
        outputLine = {
          id: (Date.now() + 1).toString(),
          type: "error",
          content: `Command not found: ${currentCommand}`,
          timestamp: new Date(),
        }
    }

    setLines((prev) => [...prev, newCommandLine, ...(outputLine ? [outputLine] : [])])
    setCurrentCommand("")
  }

  useEffect(() => {
    // Auto-scroll to bottom when new lines are added
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [lines])

  const getLineColor = (type: string) => {
    switch (type) {
      case "command":
        return "text-primary"
      case "error":
        return "text-destructive"
      case "output":
        return "text-foreground"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="h-full flex flex-col bg-terminal-background">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-1 font-mono text-sm">
          {lines.map((line) => (
            <div key={line.id} className={`${getLineColor(line.type)} whitespace-pre-wrap`}>
              {line.content}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-border/30 p-4">
        <form onSubmit={handleCommandSubmit} className="flex items-center gap-2">
          <span className="text-primary font-mono text-sm">$</span>
          <Input
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            placeholder="Enter command..."
            className="bg-transparent border-none text-foreground font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
        </form>
      </div>
    </div>
  )
}
