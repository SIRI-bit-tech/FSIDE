"use client"

import { useEffect, useState } from "react"

interface CursorPosition {
  userId: string
  userName: string
  line: number
  column: number
  color: string
}

interface LiveCursorsProps {
  cursors: CursorPosition[]
  editorRef: any
}

export default function LiveCursors({ cursors, editorRef }: LiveCursorsProps) {
  const [decorations, setDecorations] = useState<any[]>([])

  useEffect(() => {
    if (!editorRef?.current || !cursors.length) return

    const editor = editorRef.current
    const newDecorations = cursors.map((cursor) => ({
      range: new window.monaco.Range(cursor.line, cursor.column, cursor.line, cursor.column + 1),
      options: {
        className: "live-cursor",
        beforeContentClassName: "live-cursor-label",
        before: {
          content: cursor.userName,
          inlineClassName: "live-cursor-name",
          backgroundColor: cursor.color,
        },
        afterContentClassName: "live-cursor-line",
        after: {
          backgroundColor: cursor.color,
        },
      },
    }))

    const decorationIds = editor.deltaDecorations(decorations, newDecorations)
    setDecorations(decorationIds)

    return () => {
      if (editor && decorationIds.length) {
        editor.deltaDecorations(decorationIds, [])
      }
    }
  }, [cursors, editorRef, decorations])

  return null
}
