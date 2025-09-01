"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Line, Sphere, Box } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, Search, Filter, Database, Globe, Server, Layers } from "lucide-react"
import * as THREE from "three"

interface APINode {
  id: string
  name: string
  type: "endpoint" | "database" | "service" | "external"
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  position: [number, number, number]
  connections: string[]
  status: "active" | "inactive" | "error" | "loading"
  responseTime?: number
  requestCount?: number
  metadata?: {
    description?: string
    parameters?: string[]
    responses?: string[]
  }
}

interface APIConnection {
  from: string
  to: string
  type: "request" | "response" | "dependency"
  weight: number
  animated: boolean
}

// Sample API data
const sampleAPIData: APINode[] = [
  {
    id: "auth-service",
    name: "Auth Service",
    type: "service",
    position: [0, 2, 0],
    connections: ["user-db", "session-store"],
    status: "active",
    responseTime: 45,
    requestCount: 1250,
    metadata: {
      description: "User authentication and authorization service",
      parameters: ["email", "password", "token"],
      responses: ["200", "401", "403"],
    },
  },
  {
    id: "user-api",
    name: "/api/users",
    type: "endpoint",
    method: "GET",
    position: [-3, 0, 2],
    connections: ["auth-service", "user-db"],
    status: "active",
    responseTime: 120,
    requestCount: 890,
  },
  {
    id: "user-db",
    name: "User Database",
    type: "database",
    position: [-2, -2, 0],
    connections: [],
    status: "active",
    responseTime: 15,
    requestCount: 2340,
  },
  {
    id: "payment-api",
    name: "/api/payments",
    type: "endpoint",
    method: "POST",
    position: [3, 0, -2],
    connections: ["payment-service", "external-stripe"],
    status: "active",
    responseTime: 340,
    requestCount: 156,
  },
  {
    id: "payment-service",
    name: "Payment Service",
    type: "service",
    position: [2, 1, -1],
    connections: ["external-stripe"],
    status: "active",
    responseTime: 280,
    requestCount: 156,
  },
  {
    id: "external-stripe",
    name: "Stripe API",
    type: "external",
    position: [4, -1, -3],
    connections: [],
    status: "active",
    responseTime: 450,
    requestCount: 156,
  },
  {
    id: "session-store",
    name: "Redis Cache",
    type: "database",
    position: [1, -1, 2],
    connections: [],
    status: "active",
    responseTime: 8,
    requestCount: 1250,
  },
]

function APINode3D({
  node,
  isSelected,
  onSelect,
  scale = 1,
}: {
  node: APINode
  isSelected: boolean
  onSelect: (node: APINode) => void
  scale?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      if (hovered || isSelected) {
        meshRef.current.scale.setScalar(scale * 1.2)
      } else {
        meshRef.current.scale.setScalar(scale)
      }
    }
  })

  const getNodeColor = () => {
    switch (node.type) {
      case "endpoint":
        return node.method === "GET" ? "#00d4ff" : node.method === "POST" ? "#39ff14" : "#ff6b35"
      case "database":
        return "#8b5cf6"
      case "service":
        return "#f59e0b"
      case "external":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getStatusColor = () => {
    switch (node.status) {
      case "active":
        return "#10b981"
      case "error":
        return "#ef4444"
      case "loading":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }

  const getNodeShape = () => {
    switch (node.type) {
      case "database":
        return <Box ref={meshRef} args={[0.8, 0.4, 0.8]} />
      case "external":
        return <Sphere ref={meshRef} args={[0.4]} />
      default:
        return <Box ref={meshRef} args={[0.6, 0.6, 0.6]} />
    }
  }

  return (
    <group position={node.position}>
      <mesh
        onClick={() => onSelect(node)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={getNodeColor()}
          emissive={isSelected ? getNodeColor() : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
        {getNodeShape()}
      </mesh>

      {/* Status indicator */}
      <Sphere position={[0.5, 0.5, 0]} args={[0.1]}>
        <meshBasicMaterial color={getStatusColor()} />
      </Sphere>

      {/* Node label */}
      <Text position={[0, -0.8, 0]} fontSize={0.2} color="#ffffff" anchorX="center" anchorY="middle">
        {node.name}
      </Text>

      {/* Method badge for endpoints */}
      {node.method && (
        <Text position={[0, 0.8, 0]} fontSize={0.15} color={getNodeColor()} anchorX="center" anchorY="middle">
          {node.method}
        </Text>
      )}
    </group>
  )
}

function APIConnection3D({
  connection,
  nodes,
}: {
  connection: APIConnection
  nodes: APINode[]
}) {
  const fromNode = nodes.find((n) => n.id === connection.from)
  const toNode = nodes.find((n) => n.id === connection.to)

  if (!fromNode || !toNode) return null

  const points = [new THREE.Vector3(...fromNode.position), new THREE.Vector3(...toNode.position)]

  const getConnectionColor = () => {
    switch (connection.type) {
      case "request":
        return "#00d4ff"
      case "response":
        return "#39ff14"
      case "dependency":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }

  return (
    <Line points={points} color={getConnectionColor()} lineWidth={connection.weight * 2} dashed={connection.animated} />
  )
}

function Scene({
  nodes,
  connections,
  selectedNode,
  onNodeSelect,
  autoRotate,
}: {
  nodes: APINode[]
  connections: APIConnection[]
  selectedNode: APINode | null
  onNodeSelect: (node: APINode) => void
  autoRotate: boolean
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {nodes.map((node) => (
        <APINode3D key={node.id} node={node} isSelected={selectedNode?.id === node.id} onSelect={onNodeSelect} />
      ))}

      {connections.map((connection, index) => (
        <APIConnection3D key={`${connection.from}-${connection.to}-${index}`} connection={connection} nodes={nodes} />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
      />
    </>
  )
}

export default function APIVisualizer3D() {
  const [nodes, setNodes] = useState<APINode[]>(sampleAPIData)
  const [selectedNode, setSelectedNode] = useState<APINode | null>(null)
  const [autoRotate, setAutoRotate] = useState(false)
  const [filterType, setFilterType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)

  // Generate connections based on node relationships
  const connections: APIConnection[] = nodes.flatMap((node) =>
    node.connections.map((connectionId) => ({
      from: node.id,
      to: connectionId,
      type: "dependency" as const,
      weight: Math.random() * 3 + 1,
      animated: node.status === "active",
    })),
  )

  const filteredNodes = nodes.filter((node) => {
    const matchesType = filterType === "all" || node.type === filterType
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleNodeSelect = (node: APINode) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node)
  }

  const resetView = () => {
    setSelectedNode(null)
    setAutoRotate(false)
    setIsPlaying(false)
  }

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case "endpoint":
        return <Globe className="w-4 h-4" />
      case "database":
        return <Database className="w-4 h-4" />
      case "service":
        return <Server className="w-4 h-4" />
      case "external":
        return <Layers className="w-4 h-4" />
      default:
        return <Server className="w-4 h-4" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "error":
        return "destructive"
      case "loading":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="h-full flex bg-gray-900">
      {/* 3D Visualization */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [8, 8, 8], fov: 60 }}
          style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
        >
          <Scene
            nodes={filteredNodes}
            connections={connections}
            selectedNode={selectedNode}
            onNodeSelect={handleNodeSelect}
            autoRotate={autoRotate}
          />
        </Canvas>

        {/* 3D Controls Overlay */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-gray-800/80 border-gray-600 text-white hover:bg-gray-700"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRotate(!autoRotate)}
            className="bg-gray-800/80 border-gray-600 text-white hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
            className="bg-gray-800/80 border-gray-600 text-white hover:bg-gray-700"
          >
            Reset View
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-800/90 rounded-lg p-4 text-white">
          <h4 className="text-sm font-medium mb-2">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span>API Endpoints</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded"></div>
              <span>Databases</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
              <span>Services</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span>External APIs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        {/* Controls */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-medium text-white mb-4">API Visualization</h3>

          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search APIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="endpoint">Endpoints</SelectItem>
                <SelectItem value="database">Databases</SelectItem>
                <SelectItem value="service">Services</SelectItem>
                <SelectItem value="external">External</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Node List */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-2">
              {filteredNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => handleNodeSelect(node)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedNode?.id === node.id
                      ? "bg-blue-600/20 border-blue-500"
                      : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getNodeTypeIcon(node.type)}
                      <span className="text-sm font-medium text-white">{node.name}</span>
                    </div>
                    <Badge variant={getStatusBadgeVariant(node.status)} className="text-xs">
                      {node.status}
                    </Badge>
                  </div>

                  {node.method && (
                    <Badge variant="outline" className="text-xs mb-2">
                      {node.method}
                    </Badge>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    {node.responseTime && <div>Response: {node.responseTime}ms</div>}
                    {node.requestCount && <div>Requests: {node.requestCount}</div>}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Selected Node Details */}
        {selectedNode && (
          <div className="p-4 border-t border-gray-700">
            <h4 className="text-sm font-medium text-white mb-3">Node Details</h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-400">Type:</span>
                <span className="text-white ml-2">{selectedNode.type}</span>
              </div>
              {selectedNode.metadata?.description && (
                <div>
                  <span className="text-gray-400">Description:</span>
                  <p className="text-white mt-1">{selectedNode.metadata.description}</p>
                </div>
              )}
              {selectedNode.connections.length > 0 && (
                <div>
                  <span className="text-gray-400">Connections:</span>
                  <div className="mt-1">
                    {selectedNode.connections.map((conn) => (
                      <Badge key={conn} variant="outline" className="text-xs mr-1 mb-1">
                        {nodes.find((n) => n.id === conn)?.name || conn}
                      </Badge>
                    ))}
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
