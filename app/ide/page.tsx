"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Code2,
  FileText,
  Folder,
  Terminal,
  Search,
  Settings,
  GitBranch,
  Brain,
  X,
  Plus,
  Command,
  Zap,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { MonacoEditor } from "@/components/ide/monaco-editor"
import { FileExplorer } from "@/components/ide/file-explorer"
import { AIAssistant } from "@/components/ide/ai-assistant"
import { TerminalPanel } from "@/components/ide/terminal-panel"
import { CommandPalette } from "@/components/ide/command-palette"
import CollaborationPanel from "@/components/ide/collaboration-panel" // Added collaboration panel import
import ShareDialog from "@/components/ide/share-dialog" // Added share dialog import

interface FileTab {
  id: string
  name: string
  path: string
  content: string
  language: string
  isDirty: boolean
}

export default function IDEPage() {
  const [openTabs, setOpenTabs] = useState<FileTab[]>([
    {
      id: "1",
      name: "App.tsx",
      path: "src/App.tsx",
      content: `import React from 'react'
import { Button } from '@/components/ui/button'

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">My App</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Button>Click me</Button>
      </main>
    </div>
  )
}`,
      language: "typescript",
      isDirty: false,
    },
  ])
  const [activeTab, setActiveTab] = useState("1")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  const [bottomPanelCollapsed, setBottomPanelCollapsed] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [collaborationPanelOpen, setCollaborationPanelOpen] = useState(false) // Added collaboration state
  const [currentUser] = useState({
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
  })
  const [projectId] = useState("project-123")

  const handleFileOpen = useCallback(
    (file: { name: string; path: string; content: string; language: string }) => {
      const existingTab = openTabs.find((tab) => tab.path === file.path)
      if (existingTab) {
        setActiveTab(existingTab.id)
        return
      }

      const newTab: FileTab = {
        id: Date.now().toString(),
        name: file.name,
        path: file.path,
        content: file.content,
        language: file.language,
        isDirty: false,
      }

      setOpenTabs((prev) => [...prev, newTab])
      setActiveTab(newTab.id)
    },
    [openTabs],
  )

  const handleTabClose = useCallback(
    (tabId: string) => {
      setOpenTabs((prev) => {
        const newTabs = prev.filter((tab) => tab.id !== tabId)
        if (activeTab === tabId && newTabs.length > 0) {
          setActiveTab(newTabs[newTabs.length - 1].id)
        }
        return newTabs
      })
    },
    [activeTab],
  )

  const handleCodeChange = useCallback((tabId: string, newContent: string) => {
    setOpenTabs((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, content: newContent, isDirty: true } : tab)))
  }, [])

  const handleSave = useCallback((tabId: string) => {
    setOpenTabs((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, isDirty: false } : tab)))
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "P") {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        if (activeTab) {
          handleSave(activeTab)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeTab, handleSave])

  const activeTabData = openTabs.find((tab) => tab.id === activeTab)

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-status-bar border-b border-border/30 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <div className="w-3 h-3 rounded-full bg-secondary"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Code2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">FSIDE Pro</span>
            <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
              Beta
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            <span>main</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-secondary" />
            <span>AI: Active</span>
          </div>
          <div className="flex items-center gap-2">
            <ShareDialog projectId={projectId} projectName="My Project" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollaborationPanelOpen(!collaborationPanelOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Users className="w-4 h-4 mr-1" />
              <span className="hidden md:inline">Collaborate</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCommandPaletteOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Command className="w-4 h-4 mr-1" />
            <span className="hidden md:inline">Command Palette</span>
          </Button>
        </div>
      </header>

      {/* Main IDE Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-sidebar-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-sidebar-foreground">Explorer</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarCollapsed(true)}
                    className="h-6 w-6 p-0 text-sidebar-foreground hover:text-sidebar-primary"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 bg-sidebar-accent border-sidebar-border text-sidebar-foreground"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <FileExplorer onFileOpen={handleFileOpen} searchQuery={searchQuery} />
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Sidebar Button */}
        {sidebarCollapsed && (
          <div className="w-12 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(false)}
              className="h-8 w-8 p-0 text-sidebar-foreground hover:text-sidebar-primary"
            >
              <Folder className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCommandPaletteOpen(true)}
              className="h-8 w-8 p-0 text-sidebar-foreground hover:text-sidebar-primary"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-sidebar-foreground hover:text-sidebar-primary"
            >
              <GitBranch className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Bar */}
          <div className="bg-editor-background border-b border-border/30 flex items-center">
            <ScrollArea orientation="horizontal" className="flex-1">
              <div className="flex">
                {openTabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`flex items-center gap-2 px-4 py-2 border-r border-border/30 cursor-pointer transition-colors ${
                      activeTab === tab.id
                        ? "bg-background text-foreground border-b-2 border-b-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">{tab.name}</span>
                    {tab.isDirty && <div className="w-2 h-2 rounded-full bg-secondary" />}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTabClose(tab.id)
                      }}
                      className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 m-1 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </ScrollArea>
          </div>

          {/* Editor Content */}
          <div className="flex-1 bg-editor-background">
            {activeTabData ? (
              <MonacoEditor
                value={activeTabData.content}
                language={activeTabData.language}
                onChange={(value) => handleCodeChange(activeTabData.id, value || "")}
                onSave={() => handleSave(activeTabData.id)}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Welcome to FSIDE Pro</p>
                  <p className="text-sm">Open a file to start coding</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <AnimatePresence>
          {!rightPanelCollapsed && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: collaborationPanelOpen ? 640 : 320 }} // Dynamic width for collaboration
              exit={{ width: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-sidebar border-l border-sidebar-border flex overflow-hidden"
            >
              {/* AI Assistant Panel */}
              <div className="w-320 flex flex-col border-r border-sidebar-border">
                <div className="p-4 border-b border-sidebar-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-sidebar-foreground">AI Assistant</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRightPanelCollapsed(true)}
                      className="h-6 w-6 p-0 text-sidebar-foreground hover:text-sidebar-primary"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <AIAssistant activeFile={activeTabData} />
                </ScrollArea>
              </div>

              {/* Collaboration Panel */}
              {collaborationPanelOpen && (
                <div className="w-320 flex flex-col">
                  <CollaborationPanel projectId={projectId} currentUser={currentUser} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Right Panel Button */}
        {rightPanelCollapsed && (
          <div className="w-12 bg-sidebar border-l border-sidebar-border flex flex-col items-center py-4 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightPanelCollapsed(false)}
              className="h-8 w-8 p-0 text-sidebar-foreground hover:text-sidebar-primary"
            >
              <Brain className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRightPanelCollapsed(false)
                setCollaborationPanelOpen(true)
              }}
              className="h-8 w-8 p-0 text-sidebar-foreground hover:text-sidebar-primary"
            >
              <Users className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-sidebar-foreground hover:text-sidebar-primary"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Panel */}
      <AnimatePresence>
        {!bottomPanelCollapsed && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 200 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-terminal-background border-t border-border/30 flex flex-col overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-border/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Terminal className="w-4 h-4" />
                  <span>Terminal</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4" />
                  <span>Output</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBottomPanelCollapsed(true)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1">
              <TerminalPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Bottom Panel Button */}
      {bottomPanelCollapsed && (
        <div className="h-8 bg-terminal-background border-t border-border/30 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBottomPanelCollapsed(false)}
            className="h-6 text-muted-foreground hover:text-foreground"
          >
            <Terminal className="w-4 h-4 mr-2" />
            <span className="text-xs">Terminal</span>
          </Button>
        </div>
      )}

      {/* Command Palette */}
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} onFileOpen={handleFileOpen} />
    </div>
  )
}
