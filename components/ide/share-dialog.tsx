"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, Share2, Mail, Link, Users, Eye, Edit } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ShareDialogProps {
  projectId: string
  projectName: string
}

export default function ShareDialog({ projectId, projectName }: ShareDialogProps) {
  const [shareLink, setShareLink] = useState(`${window.location.origin}/ide/shared/${projectId}`)
  const [inviteEmail, setInviteEmail] = useState("")
  const [permission, setPermission] = useState<"view" | "edit">("edit")
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: "Share link has been copied to your clipboard.",
      })
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const generateShareLink = async () => {
    setIsGeneratingLink(true)
    try {
      const response = await fetch("/api/projects/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          permission: permission,
          expires_in: "7d",
        }),
      })

      const data = await response.json()
      if (data.share_url) {
        setShareLink(data.share_url)
        toast({
          title: "Share link generated",
          description: "Your project share link is ready.",
        })
      }
    } catch (error) {
      console.error("Error generating share link:", error)
      toast({
        title: "Error",
        description: "Failed to generate share link.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingLink(false)
    }
  }

  const sendInvite = async () => {
    if (!inviteEmail.trim()) return

    try {
      const response = await fetch("/api/projects/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          email: inviteEmail,
          permission: permission,
        }),
      })

      if (response.ok) {
        toast({
          title: "Invitation sent",
          description: `Invitation sent to ${inviteEmail}`,
        })
        setInviteEmail("")
      }
    } catch (error) {
      console.error("Error sending invite:", error)
      toast({
        title: "Error",
        description: "Failed to send invitation.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Share "{projectName}"</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Permission Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Permission Level</Label>
            <div className="flex space-x-2">
              <Button
                variant={permission === "view" ? "default" : "outline"}
                size="sm"
                onClick={() => setPermission("view")}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Only
              </Button>
              <Button
                variant={permission === "edit" ? "default" : "outline"}
                size="sm"
                onClick={() => setPermission("edit")}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Can Edit
              </Button>
            </div>
          </div>

          {/* Share Link */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Share Link</Label>
            <div className="flex space-x-2">
              <Input value={shareLink} readOnly className="flex-1 bg-gray-800 border-gray-600 text-white" />
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(shareLink)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={generateShareLink}
              disabled={isGeneratingLink}
              className="w-full bg-transparent"
            >
              <Link className="w-4 h-4 mr-2" />
              {isGeneratingLink ? "Generating..." : "Generate New Link"}
            </Button>
          </div>

          {/* Email Invitation */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Invite by Email</Label>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-600 text-white"
              />
              <Button onClick={sendInvite} disabled={!inviteEmail.trim()} size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>

          {/* Active Collaborators */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Active Collaborators</Label>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>3 people have access</span>
              <Badge variant="secondary" className="text-xs">
                2 online
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
