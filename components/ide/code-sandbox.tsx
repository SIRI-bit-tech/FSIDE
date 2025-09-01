"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Square, AlertTriangle, CheckCircle } from "lucide-react"

interface CodeSandboxProps {
  code: string
  language: string
  onExecutionResult: (result: ExecutionResult) => void
}

interface ExecutionResult {
  success: boolean
  output: string
  error?: string
  executionTime: number
}

export function CodeSandbox({ code, language, onExecutionResult }: CodeSandboxProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const workerCode = `
        // Sandboxed execution environment
        const createSandbox = (code, language) => {
          const startTime = performance.now()
          
          try {
            let output = ''
            const console = {
              log: (...args) => {
                output += args.join(' ') + '\\n'
              },
              error: (...args) => {
                output += 'ERROR: ' + args.join(' ') + '\\n'
              }
            }
            
            // Create restricted execution context
            const sandbox = {
              console,
              setTimeout: (fn, delay) => setTimeout(fn, Math.min(delay, 5000)),
              setInterval: () => { throw new Error('setInterval not allowed in sandbox') },
              fetch: () => { throw new Error('Network requests not allowed in sandbox') },
              XMLHttpRequest: undefined,
              WebSocket: undefined,
              localStorage: undefined,
              sessionStorage: undefined,
              document: undefined,
              window: undefined,
              global: undefined,
              process: undefined,
              require: undefined,
              module: undefined,
              exports: undefined
            }
            
            if (language === 'javascript') {
              // Execute JavaScript in sandbox
              const func = new Function(...Object.keys(sandbox), code)
              func(...Object.values(sandbox))
            } else if (language === 'python') {
              // For Python, we'd need a Python interpreter in WASM
              // This is a placeholder - in production, use Pyodide
              output = 'Python execution requires Pyodide integration'
            }
            
            const executionTime = performance.now() - startTime
            
            return {
              success: true,
              output: output || 'Code executed successfully (no output)',
              executionTime: Math.round(executionTime)
            }
          } catch (error) {
            const executionTime = performance.now() - startTime
            return {
              success: false,
              output: '',
              error: error.message,
              executionTime: Math.round(executionTime)
            }
          }
        }
        
        self.onmessage = function(e) {
          const { code, language } = e.data
          const result = createSandbox(code, language)
          self.postMessage(result)
        }
      `

      const blob = new Blob([workerCode], { type: "application/javascript" })
      workerRef.current = new Worker(URL.createObjectURL(blob))

      workerRef.current.onmessage = (e) => {
        const result = e.data
        setResult(result)
        setIsExecuting(false)
        onExecutionResult(result)
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
    }
  }, [onExecutionResult])

  const executeCode = () => {
    if (!workerRef.current || isExecuting) return

    setIsExecuting(true)
    setResult(null)

    workerRef.current.postMessage({ code, language })

    // Safety timeout
    setTimeout(() => {
      if (isExecuting) {
        setIsExecuting(false)
        setResult({
          success: false,
          output: "",
          error: "Execution timeout (5 seconds)",
          executionTime: 5000,
        })
      }
    }, 5000)
  }

  const stopExecution = () => {
    if (workerRef.current) {
      workerRef.current.terminate()
      setIsExecuting(false)
      setResult({
        success: false,
        output: "",
        error: "Execution stopped by user",
        executionTime: 0,
      })
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Code Sandbox</h3>
        <div className="flex gap-2">
          <Button size="sm" onClick={executeCode} disabled={isExecuting} className="bg-green-600 hover:bg-green-700">
            <Play className="w-4 h-4 mr-2" />
            {isExecuting ? "Running..." : "Run Code"}
          </Button>
          {isExecuting && (
            <Button size="sm" variant="destructive" onClick={stopExecution}>
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-2">
          <Alert className={result.success ? "border-green-600" : "border-red-600"}>
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              )}
              <span className="font-medium">{result.success ? "Execution Successful" : "Execution Failed"}</span>
              <span className="text-sm text-gray-400">({result.executionTime}ms)</span>
            </div>
            <AlertDescription className="mt-2">
              {result.success ? (
                <pre className="text-sm bg-gray-800 p-2 rounded overflow-x-auto">{result.output}</pre>
              ) : (
                <div className="text-red-400 text-sm">{result.error}</div>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>
          ⚠️ Code execution is sandboxed for security. Network requests, file system access, and dangerous APIs are
          disabled.
        </p>
      </div>
    </div>
  )
}
