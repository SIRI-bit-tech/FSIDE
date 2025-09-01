"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, MessageSquare, Video, Mic, MicOff, VideoOff } from "lucide-react"

interface CollaboratorData {
  id: string
  name: string
  email: string
  avatar?: string
  cursor_position?: { line: number; column: number }
  active_file?: string
  status: "online" | "away" | "offline"
  color: string
}

interface ChatMessage {
  id: string
  user_id: string
  user_name: string
  message: string
  timestamp: string
  type: "text" | "system"
}

interface CollaborationPanelProps {
  projectId: string
  currentUser: { id: string; name: string; email: string }
}

export default function CollaborationPanel({ projectId, currentUser }: CollaborationPanelProps) {
  const [collaborators, setCollaborators] = useState<CollaboratorData[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isVideoCall, setIsVideoCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [activeTab, setActiveTab] = useState<"collaborators" | "chat" | "video">("collaborators")

  const wsRef = useRef<WebSocket | null>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize WebSocket connection for real-time collaboration
    const wsUrl = `ws://localhost:8000/ws/collaboration/${projectId}/`
    wsRef.current = new WebSocket(wsUrl)

    wsRef.current.onopen = () => {
      console.log("[v0] Collaboration WebSocket connected")
      // Send join message
      wsRef.current?.send(
        JSON.stringify({
          type: "join_project",
          user_id: currentUser.id,
          user_name: currentUser.name,
          user_email: currentUser.email,
        }),
      )
    }

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("[v0] Received collaboration message:", data)

      switch (data.type) {
        case "collaborator_joined":
        case "collaborator_left":
        case "collaborators_update":
          setCollaborators(data.collaborators || [])
          break
        case "chat_message":
          setChatMessages((prev) => [...prev, data.message])
          break
        case "cursor_update":
          setCollaborators((prev) =>
            prev.map((collab) =>
              collab.id === data.user_id
                ? { ...collab, cursor_position: data.position, active_file: data.file }
                : collab,
            ),
          )
          break
        case "video_call_started":
          setIsVideoCall(true)
          break
        case "video_call_ended":
          setIsVideoCall(false)
          break
      }
    }

    wsRef.current.onclose = () => {
      console.log("[v0] Collaboration WebSocket disconnected")
    }

    return () => {
      wsRef.current?.close()
    }
  }, [projectId, currentUser])

  useEffect(() => {
    // Auto-scroll chat to bottom
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [chatMessages])

  const sendChatMessage = () => {
    if (!newMessage.trim() || !wsRef.current) return

    const message = {
      type: "chat_message",
      message: newMessage,
      user_id: currentUser.id,
      user_name: currentUser.name,
      timestamp: new Date().toISOString(),
    }

    wsRef.current.send(JSON.stringify(message))
    setNewMessage("")
  }

  const startVideoCall = () => {
    if (!wsRef.current) return

    wsRef.current.send(
      JSON.stringify({
        type: "start_video_call",
        user_id: currentUser.id,
      }),
    )
    setIsVideoCall(true)
  }

  const endVideoCall = () => {
    if (!wsRef.current) return

    wsRef.current.send(
      JSON.stringify({
        type: "end_video_call",
        user_id: currentUser.id,
      }),
    )
    setIsVideoCall(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 border-l border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Collaboration</h3>
          <Badge variant="secondary" className="text-xs">
            {collaborators.length} online
          </Badge>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("collaborators")}
            className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
              activeTab === "collaborators" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Users className="w-3 h-3 inline mr-1" />
            Users
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
              activeTab === "chat" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3 h-3 inline mr-1" />
            Chat
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
              activeTab === "video" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Video className="w-3 h-3 inline mr-1" />
            Video
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "collaborators" && (
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{collaborator.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 ${getStatusColor(collaborator.status)}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{collaborator.name}</p>
                    <p className="text-xs text-gray-400 truncate">{collaborator.active_file || "No file open"}</p>
                  </div>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: collaborator.color }} />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {activeTab === "chat" && (
          <div className="h-full flex flex-col">
            <ScrollArea className="flex-1 p-4" ref={chatScrollRef}>
              <div className="space-y-3">
                {chatMessages.map((message) => (
                  <div key={message.id} className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-blue-400">{message.user_name}</span>
                      <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-gray-300">{message.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 border-gray-600 text-white"
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                />
                <Button onClick={sendChatMessage} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "video" && (
          <div className="h-full p-4">
            <div className="space-y-4">
              {!isVideoCall ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                    <Video className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-400">Start a video call with your team</p>
                  <Button onClick={startVideoCall} className="bg-green-600 hover:bg-green-700">
                    <Video className="w-4 h-4 mr-2" />
                    Start Call
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400 mb-4">Video call in progress</p>

                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                        className={isMuted ? "bg-red-600 hover:bg-red-700" : ""}
                      >
                        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                        className={!isVideoEnabled ? "bg-red-600 hover:bg-red-700" : ""}
                      >
                        {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={endVideoCall}>
                        End Call
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
