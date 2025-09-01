"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { FixedSizeTree as Tree } from "react-window"
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react"

interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  children?: FileNode[]
  isOpen?: boolean
  level: number
}

interface VirtualFileTreeProps {
  files: FileNode[]
  onFileSelect: (file: FileNode) => void
  height: number
}

export function VirtualFileTree({ files, onFileSelect, height }: VirtualFileTreeProps) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set())

  const flattenedItems = useMemo(() => {
    const items: (FileNode & { level: number })[] = []

    const traverse = (nodes: FileNode[], level = 0) => {
      nodes.forEach((node) => {
        items.push({ ...node, level })

        if (node.type === "folder" && openFolders.has(node.id) && node.children) {
          traverse(node.children, level + 1)
        }
      })
    }

    traverse(files)
    return items
  }, [files, openFolders])

  const toggleFolder = (folderId: string) => {
    setOpenFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
  }

  const TreeItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = flattenedItems[index]
    const isOpen = openFolders.has(item.id)

    return (
      <div
        style={style}
        className={`flex items-center px-2 py-1 hover:bg-gray-800 cursor-pointer text-sm`}
        onClick={() => {
          if (item.type === "folder") {
            toggleFolder(item.id)
          } else {
            onFileSelect(item)
          }
        }}
      >
        <div style={{ paddingLeft: `${item.level * 16}px` }} className="flex items-center gap-1">
          {item.type === "folder" ? (
            <>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              {isOpen ? <FolderOpen className="w-4 h-4 text-blue-400" /> : <Folder className="w-4 h-4 text-blue-400" />}
            </>
          ) : (
            <>
              <div className="w-4" />
              <File className="w-4 h-4 text-gray-300" />
            </>
          )}
          <span className="text-gray-200 truncate">{item.name}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-900 border-r border-gray-700">
      <Tree height={height} itemCount={flattenedItems.length} itemSize={28} width="100%">
        {TreeItem}
      </Tree>
    </div>
  )
}
