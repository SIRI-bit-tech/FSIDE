"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileNode {
  name: string
  type: "file" | "folder"
  path: string
  children?: FileNode[]
  language?: string
}

const mockFileTree: FileNode[] = [
  {
    name: "src",
    type: "folder",
    path: "src",
    children: [
      {
        name: "components",
        type: "folder",
        path: "src/components",
        children: [
          { name: "Button.tsx", type: "file", path: "src/components/Button.tsx", language: "typescript" },
          { name: "Card.tsx", type: "file", path: "src/components/Card.tsx", language: "typescript" },
          { name: "Modal.tsx", type: "file", path: "src/components/Modal.tsx", language: "typescript" },
        ],
      },
      {
        name: "pages",
        type: "folder",
        path: "src/pages",
        children: [
          { name: "Home.tsx", type: "file", path: "src/pages/Home.tsx", language: "typescript" },
          { name: "About.tsx", type: "file", path: "src/pages/About.tsx", language: "typescript" },
        ],
      },
      { name: "App.tsx", type: "file", path: "src/App.tsx", language: "typescript" },
      { name: "main.tsx", type: "file", path: "src/main.tsx", language: "typescript" },
      { name: "index.css", type: "file", path: "src/index.css", language: "css" },
    ],
  },
  {
    name: "backend",
    type: "folder",
    path: "backend",
    children: [
      {
        name: "api",
        type: "folder",
        path: "backend/api",
        children: [
          { name: "models.py", type: "file", path: "backend/api/models.py", language: "python" },
          { name: "views.py", type: "file", path: "backend/api/views.py", language: "python" },
          { name: "serializers.py", type: "file", path: "backend/api/serializers.py", language: "python" },
        ],
      },
      { name: "settings.py", type: "file", path: "backend/settings.py", language: "python" },
      { name: "urls.py", type: "file", path: "backend/urls.py", language: "python" },
    ],
  },
  { name: "package.json", type: "file", path: "package.json", language: "json" },
  { name: "README.md", type: "file", path: "README.md", language: "markdown" },
]

interface FileExplorerProps {
  onFileOpen: (file: { name: string; path: string; content: string; language: string }) => void
  searchQuery: string
}

export function FileExplorer({ onFileOpen, searchQuery }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["src", "backend"]))

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  const handleFileClick = (file: FileNode) => {
    if (file.type === "file") {
      // Mock file content based on file type
      let content = ""
      switch (file.language) {
        case "typescript":
          content = `// ${file.name}\nimport React from 'react'\n\nexport default function Component() {\n  return (\n    <div>\n      <h1>Hello from ${file.name}</h1>\n    </div>\n  )\n}`
          break
        case "python":
          content = `# ${file.name}\nfrom django.db import models\n\nclass ExampleModel(models.Model):\n    name = models.CharField(max_length=100)\n    created_at = models.DateTimeField(auto_now_add=True)`
          break
        case "css":
          content = `/* ${file.name} */\nbody {\n  margin: 0;\n  padding: 0;\n  font-family: system-ui, sans-serif;\n}`
          break
        case "json":
          content = `{\n  "name": "fside-pro",\n  "version": "1.0.0",\n  "description": "AI-powered Full Stack IDE"\n}`
          break
        case "markdown":
          content = `# ${file.name.replace(".md", "")}\n\nThis is a sample markdown file.\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3`
          break
        default:
          content = `// ${file.name}\n// File content goes here`
      }

      onFileOpen({
        name: file.name,
        path: file.path,
        content,
        language: file.language || "text",
      })
    }
  }

  const filterFiles = (nodes: FileNode[]): FileNode[] => {
    if (!searchQuery) return nodes

    return nodes
      .filter((node) => {
        if (node.type === "file") {
          return node.name.toLowerCase().includes(searchQuery.toLowerCase())
        } else {
          const filteredChildren = filterFiles(node.children || [])
          return filteredChildren.length > 0 || node.name.toLowerCase().includes(searchQuery.toLowerCase())
        }
      })
      .map((node) => {
        if (node.type === "folder") {
          return {
            ...node,
            children: filterFiles(node.children || []),
          }
        }
        return node
      })
  }

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    const filteredNodes = filterFiles(nodes)

    return filteredNodes.map((node) => (
      <div key={node.path}>
        <Button
          variant="ghost"
          className={`w-full justify-start text-left p-1 h-auto text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50 ${
            node.type === "file" ? "pl-6" : ""
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node.path)
            } else {
              handleFileClick(node)
            }
          }}
        >
          <div className="flex items-center gap-2 text-sm">
            {node.type === "folder" ? (
              <>
                {expandedFolders.has(node.path) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                {expandedFolders.has(node.path) ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
              </>
            ) : (
              <>
                <div className="w-4" />
                <FileText className="w-4 h-4" />
              </>
            )}
            <span>{node.name}</span>
          </div>
        </Button>
        {node.type === "folder" && expandedFolders.has(node.path) && node.children && (
          <div>{renderFileTree(node.children, depth + 1)}</div>
        )}
      </div>
    ))
  }

  return <div className="p-2">{renderFileTree(mockFileTree)}</div>
}
