"use client"

import { useRef, useEffect } from "react"
import { Editor } from "@monaco-editor/react"
import * as monaco from "monaco-editor"
import type { editor } from "monaco-editor"

interface MonacoEditorProps {
  value: string
  language: string
  onChange: (value: string | undefined) => void
  onSave: () => void
}

export function MonacoEditor({ value, language, onChange, onSave }: MonacoEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor

    editor.updateOptions({
      theme: "vs-dark",
      fontSize: 14,
      fontFamily: "var(--font-mono)",
      lineNumbers: "on",
      minimap: { enabled: true, scale: 2, showSlider: "always" },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: "on",
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      // Multi-cursor editing features
      multiCursorModifier: "ctrlCmd",
      multiCursorMergeOverlapping: true,
      // Code folding enhancements
      folding: true,
      foldingStrategy: "indentation",
      foldingHighlight: true,
      unfoldOnClickAfterEndOfLine: true,
      // Advanced scrolling and navigation
      smoothScrolling: true,
      mouseWheelZoom: true,
      fastScrollSensitivity: 5,
      // Enhanced selection and editing
      selectOnLineNumbers: true,
      selectionHighlight: true,
      occurrencesHighlight: true,
      renderLineHighlight: "all",
      // Code intelligence features
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true,
      },
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: "on",
      tabCompletion: "on",
      wordBasedSuggestions: true,
      // Performance optimizations
      renderValidationDecorations: "on",
      renderControlCharacters: false,
      renderWhitespace: "selection",
    })

    // Multi-cursor shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.DownArrow, () => {
      editor.getAction("editor.action.insertCursorBelow")?.run()
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.UpArrow, () => {
      editor.getAction("editor.action.insertCursorAbove")?.run()
    })

    // Save shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave()
    })

    // Code folding shortcuts
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit0,
      () => {
        editor.getAction("editor.foldAll")?.run()
      },
    )

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.unfoldAll")?.run()
    })

    // Format document
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      editor.getAction("editor.action.formatDocument")?.run()
    })
  }

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose()
      }
    }
  }, [])

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: "line",
          automaticLayout: true,
          glyphMargin: true,
          folding: true,
          lineNumbersMinChars: 3,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          wrappingIndent: "indent",
          renderLineHighlight: "all",
          contextmenu: true,
          mouseWheelZoom: true,
          smoothScrolling: true,
          cursorBlinking: "blink",
          cursorSmoothCaretAnimation: "on",
          renderWhitespace: "selection",
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  )
}
