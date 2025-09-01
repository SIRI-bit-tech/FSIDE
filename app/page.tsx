"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Code2,
  FileType as FileTree,
  Terminal,
  GitBranch,
  Play,
  Zap,
  Brain,
  Layers3,
  Shield,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function FSIDEProLanding() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Code Generation",
      description:
        "Generate React components and Django models from natural language descriptions using Hugging Face models",
    },
    {
      icon: <Layers3 className="w-6 h-6" />,
      title: "Real-time Synchronization",
      description: "Seamless sync between frontend and backend changes with live preview and hot-reload",
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Visual API Mapping",
      description: "3D visualization of API relationships and component dependencies",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Intelligent Debugging",
      description: "AI-powered error tracking and automated solution suggestions",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
      {/* Header */}
      <header className="border-b border-border/20 backdrop-blur-sm bg-panel-background">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">FSIDE Pro</h1>
              <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
                Beta
              </Badge>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="/demo" className="text-muted-foreground hover:text-primary transition-colors">
                Demo
              </a>
              <a href="/docs" className="text-muted-foreground hover:text-primary transition-colors">
                Docs
              </a>
              <Button variant="outline" size="sm" asChild className="border-border hover:bg-card bg-transparent">
                <a href="/admin/auth">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </a>
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Full Stack IDE
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              AI-powered orchestration platform that synergizes React and Django development through intelligent
              automation and real-time synchronization
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8" asChild>
                <a href="/ide">
                  <Play className="w-5 h-5 mr-2" />
                  Launch IDE
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-border hover:bg-card bg-transparent" asChild>
                <a href="/api-dashboard">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  API Dashboard
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-border hover:bg-card bg-transparent">
                <GitBranch className="w-5 h-5 mr-2" />
                View on GitHub
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* IDE Preview */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/30 p-1 rounded-xl shadow-2xl">
            <div className="bg-editor-background rounded-lg overflow-hidden">
              {/* IDE Header */}
              <div className="bg-status-bar px-4 py-2 flex items-center justify-between border-b border-border/30">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  <span className="text-sm text-muted-foreground ml-4">FSIDE Pro - main.tsx</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>React + Django</span>
                  <span>AI: Active</span>
                  <span>Git: main</span>
                </div>
              </div>

              {/* IDE Layout */}
              <div className="flex h-96">
                {/* Sidebar */}
                <div className="w-64 bg-sidebar border-r border-sidebar-border p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sidebar-foreground">
                      <FileTree className="w-4 h-4" />
                      <span className="text-sm font-medium">Explorer</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-sidebar-primary">
                        <span>📁 src</span>
                      </div>
                      <div className="flex items-center gap-2 ml-4 text-sidebar-foreground">
                        <span>📄 App.tsx</span>
                      </div>
                      <div className="flex items-center gap-2 ml-4 text-sidebar-foreground">
                        <span>📄 main.tsx</span>
                      </div>
                      <div className="flex items-center gap-2 text-sidebar-primary">
                        <span>📁 backend</span>
                      </div>
                      <div className="flex items-center gap-2 ml-4 text-sidebar-foreground">
                        <span>🐍 models.py</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editor */}
                <div className="flex-1 bg-editor-background">
                  <Tabs defaultValue="react" className="h-full">
                    <TabsList className="bg-transparent border-b border-border/30 rounded-none w-full justify-start">
                      <TabsTrigger value="react" className="ide-tab active">
                        React Component
                      </TabsTrigger>
                      <TabsTrigger value="django" className="ide-tab inactive">
                        Django Model
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="react" className="p-4 text-sm font-mono">
                      <div className="space-y-2">
                        <div>
                          <span className="text-secondary">import</span> <span className="text-primary">React</span>{" "}
                          <span className="text-secondary">from</span> <span className="text-chart-1">'react'</span>
                        </div>
                        <div>
                          <span className="text-secondary">import</span> <span className="text-primary">Button</span>{" "}
                          <span className="text-secondary">from</span>{" "}
                          <span className="text-chart-1">'@/components/ui/button'</span>
                        </div>
                        <div className="mt-4">
                          <span className="text-secondary">export default function</span>{" "}
                          <span className="text-primary">UserProfile</span>
                          <span className="text-muted-foreground">{"() {"}</span>
                        </div>
                        <div className="ml-4">
                          <span className="text-secondary">return</span>{" "}
                          <span className="text-muted-foreground">{"("}</span>
                        </div>
                        <div className="ml-8">
                          <span className="text-chart-2">{"<div"}</span> <span className="text-primary">className</span>
                          <span className="text-muted-foreground">=</span>
                          <span className="text-chart-1">"profile-container"</span>
                          <span className="text-chart-2">{">"}</span>
                        </div>
                        <div className="ml-8">
                          <span className="text-chart-2">{"</div>"}</span>
                        </div>
                        <div className="ml-4">
                          <span className="text-muted-foreground">{")"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{"}"}</span>
                        </div>
                        <div className="ml-4 text-muted-foreground">// AI-generated component</div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Right Panel */}
                <div className="w-64 bg-sidebar border-l border-sidebar-border p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sidebar-foreground">
                      <Brain className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium">AI Assistant</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="bg-sidebar-accent/20 p-2 rounded border border-sidebar-accent/30">
                        <span className="text-sidebar-accent">💡 Suggestion:</span>
                        <p className="text-sidebar-foreground mt-1">Add error handling to this component</p>
                      </div>
                      <div className="bg-primary/20 p-2 rounded border border-primary/30">
                        <span className="text-primary">🔗 API Mapping:</span>
                        <p className="text-sidebar-foreground mt-1">Connected to /api/users/</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Panel */}
              <div className="bg-terminal-background border-t border-border/30 p-4 h-24">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="w-4 h-4" />
                  <span>Terminal</span>
                </div>
                <div className="font-mono text-sm">
                  <span className="text-primary">$</span> <span className="text-foreground">npm run dev</span>
                  <div className="text-secondary">✓ Ready on http://localhost:3000</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Quick Access Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Quick Access</h3>
          <p className="text-xl text-muted-foreground">Jump directly to any part of the platform</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-border/30 p-6 hover:border-primary/50 transition-colors">
            <div className="text-center">
              <Code2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">IDE Environment</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Full-featured development environment with AI assistance
              </p>
              <Button className="w-full" asChild>
                <a href="/ide">Open IDE</a>
              </Button>
            </div>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/30 p-6 hover:border-primary/50 transition-colors">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">API Dashboard</h4>
              <p className="text-muted-foreground text-sm mb-4">
                3D visualization and monitoring of your API ecosystem
              </p>
              <Button className="w-full bg-transparent" variant="outline" asChild>
                <a href="/api-dashboard">View Dashboard</a>
              </Button>
            </div>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/30 p-6 hover:border-primary/50 transition-colors">
            <div className="text-center">
              <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Admin Panel</h4>
              <p className="text-muted-foreground text-sm mb-4">System administration and user management</p>
              <Button className="w-full bg-transparent" variant="outline" asChild>
                <a href="/admin/auth">Admin Access</a>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for modern full-stack development in one intelligent platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setActiveFeature(index)}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/30 p-6 h-full hover:border-primary/50 transition-colors">
                <div className="text-primary mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-panel-background">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Code2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">FSIDE Pro</span>
              <Badge variant="outline" className="text-xs">
                v1.0.0
              </Badge>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="/docs" className="hover:text-primary transition-colors">
                Documentation
              </a>
              <a href="https://github.com/SIRI-bit-tech/FSIDE" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href="/admin/auth" className="hover:text-primary transition-colors">
                Admin
              </a>
              <a href="/support" className="hover:text-primary transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
