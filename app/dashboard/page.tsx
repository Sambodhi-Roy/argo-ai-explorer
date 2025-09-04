"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"
import { Send, Download, X, Waves, Loader2, MessageSquare, BarChart3, Globe } from "lucide-react"
import * as THREE from "three"
import Link from "next/link"

// Type definitions
interface Float {
  id: string
  lat: number
  lon: number
  lastReported: Date
  isHighlighted: boolean
  trajectory: {
    lat: number
    lon: number
    date: Date
  }[]
}

interface Message {
  id: number
  text: string
  isUser: boolean
  suggestions: string[]
}

interface ProfileDataPoint {
  depth: number
  value: number
  pressure: number
}

interface TimeSeriesDataPoint {
  date: string
  temperature: number
  salinity: number
}

interface TSDiagramDataPoint {
  temperature: number
  salinity: number
  depth: number
}

interface CrossSectionDataPoint {
  lat: number
  depth: number
  temperature: number
}

interface ProfileData {
  temperature: ProfileDataPoint[]
  salinity: ProfileDataPoint[]
  timeSeries: TimeSeriesDataPoint[]
  tsDiagram: TSDiagramDataPoint[]
  crossSection: CrossSectionDataPoint[]
}

interface Globe3DProps {
  floats: Float[]
  selectedFloat: Float | null
  onFloatClick: (float: Float) => void
  focusRegion?: string
}

interface ChatMessageProps {
  message?: string
  isUser?: boolean
  isLoading?: boolean
  suggestions?: string[]
  onSuggestionClick?: (suggestion: string) => void
}

interface DataModalProps {
  float: Float | null
  isOpen: boolean
  onClose: () => void
}

const mockFloats = Array.from({ length: 200 }, (_, i) => ({
  id: `ARGO_${String(i + 1).padStart(4, "0")}`,
  lat: (Math.random() - 0.5) * 160, // -80 to 80 latitude
  lon: (Math.random() - 0.5) * 360, // -180 to 180 longitude
  lastReported: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  isHighlighted: false,
  trajectory: Array.from({ length: 10 }, (_, j) => ({
    lat: (Math.random() - 0.5) * 160 + (Math.random() - 0.5) * 10,
    lon: (Math.random() - 0.5) * 360 + (Math.random() - 0.5) * 10,
    date: new Date(Date.now() - (10 - j) * 24 * 60 * 60 * 1000),
  })),
}))

const generateRealisticProfileData = () => {
  const depths = Array.from({ length: 100 }, (_, i) => i * 20) // 0 to 2000m depth

  return {
    // Temperature decreases with depth (thermocline)
    temperature: depths.map((depth) => ({
      depth,
      value:
        depth < 200
          ? 25 - depth * 0.08 + Math.random() * 2
          : // Mixed layer
            depth < 1000
            ? 8 - (depth - 200) * 0.005 + Math.random() * 1
            : // Thermocline
              2 + Math.random() * 0.5, // Deep water
      pressure: depth * 0.1 + Math.random() * 0.1, // Pressure increases linearly with depth
    })),

    // Salinity profile with halocline
    salinity: depths.map((depth) => ({
      depth,
      value:
        depth < 100
          ? 34.5 + Math.random() * 0.3
          : // Surface mixed layer
            depth < 800
            ? 34.7 + (depth - 100) * 0.0003 + Math.random() * 0.2
            : // Halocline
              34.9 + Math.random() * 0.1, // Deep water
      pressure: depth * 0.1 + Math.random() * 0.1,
    })),

    // Time series data (30 days)
    timeSeries: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      temperature: 15 + Math.sin(i * 0.2) * 3 + Math.random() * 2,
      salinity: 34.5 + Math.sin(i * 0.15) * 0.5 + Math.random() * 0.3,
    })),

    // T-S diagram data (Temperature vs Salinity scatter)
    tsDiagram: depths.slice(0, 50).map((depth) => ({
      temperature: depth < 200 ? 25 - depth * 0.08 + Math.random() * 2 : 8 - (depth - 200) * 0.005 + Math.random() * 1,
      salinity: depth < 100 ? 34.5 + Math.random() * 0.3 : 34.7 + (depth - 100) * 0.0003 + Math.random() * 0.2,
      depth,
    })),

    // Cross-section data (Latitude vs Depth)
    crossSection: Array.from({ length: 20 }, (_, i) => {
      const lat = -60 + i * 6 // -60 to 60 degrees
      return Array.from({ length: 10 }, (_, j) => {
        const depth = j * 200 // 0 to 1800m
        return {
          lat,
          depth,
          temperature:
            Math.abs(lat) < 30
              ? 25 - depth * 0.01
              : // Tropical
                15 - depth * 0.008, // Polar
        }
      })
    }).flat(),
  }
}

const mockProfileData = generateRealisticProfileData()

// 3D Globe Component
const Globe3D = ({ floats, selectedFloat, onFloatClick, focusRegion }: Globe3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const globeRef = useRef<THREE.Mesh | null>(null)
  const floatPointsRef = useRef<(THREE.Mesh | null)[]>([])
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
  })

  useEffect(() => {
    if (!mountRef.current) return

    // Three.js setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // Create globe
    const geometry = new THREE.SphereGeometry(5, 64, 64)
    const material = new THREE.MeshPhongMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.8,
    })
    const globe = new THREE.Mesh(geometry, material)
    scene.add(globe)

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    scene.add(directionalLight)

    // Create float points
    const floatGeometry = new THREE.SphereGeometry(0.02, 8, 8)
    floats.forEach((float, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: float.isHighlighted ? 0xffff00 : 0x00ffff,
        transparent: true,
        opacity: float.isHighlighted ? 1 : 0.7,
      })
      const point = new THREE.Mesh(floatGeometry, material)

      // Convert lat/lon to 3D coordinates
      const phi = (90 - float.lat) * (Math.PI / 180)
      const theta = (float.lon + 180) * (Math.PI / 180)
      const radius = 5.1

      point.position.x = -(radius * Math.sin(phi) * Math.cos(theta))
      point.position.y = radius * Math.cos(phi)
      point.position.z = radius * Math.sin(phi) * Math.sin(theta)

      point.userData = { floatData: float, index }
      scene.add(point)
      floatPointsRef.current[index] = point
    })

    camera.position.z = 15

    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault()
      controlsRef.current.isDragging = true
      controlsRef.current.previousMousePosition = { x: event.clientX, y: event.clientY }
      if (rendererRef.current) {
        rendererRef.current.domElement.style.cursor = "grabbing"
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      event.preventDefault()
      if (!controlsRef.current.isDragging) return

      const deltaMove = {
        x: event.clientX - controlsRef.current.previousMousePosition.x,
        y: event.clientY - controlsRef.current.previousMousePosition.y,
      }

      // Apply rotation to globe and all float points together
      const rotationSpeed = 0.005
      if (globeRef.current) {
        globeRef.current.rotation.y += deltaMove.x * rotationSpeed
        globeRef.current.rotation.x += deltaMove.y * rotationSpeed

        // Clamp vertical rotation to prevent flipping
        globeRef.current.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, globeRef.current.rotation.x))
      }

      // Update float points to rotate with globe
      floatPointsRef.current.forEach((point) => {
        if (point && point.userData && globeRef.current) {
          // Apply the same rotation to each point
          const phi = (90 - point.userData.floatData.lat) * (Math.PI / 180)
          const theta = (point.userData.floatData.lon + 180) * (Math.PI / 180)
          const radius = 5.1

          // Create rotation matrix
          const rotationMatrix = new THREE.Matrix4()
          rotationMatrix.makeRotationFromEuler(new THREE.Euler(globeRef.current.rotation.x, globeRef.current.rotation.y, globeRef.current.rotation.z))

          // Calculate original position
          const originalPos = new THREE.Vector3(
            -(radius * Math.sin(phi) * Math.cos(theta)),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta),
          )

          // Apply rotation
          originalPos.applyMatrix4(rotationMatrix)
          point.position.copy(originalPos)
        }
      })

      controlsRef.current.previousMousePosition = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = (event: MouseEvent) => {
      event.preventDefault()
      controlsRef.current.isDragging = false
      if (rendererRef.current) {
        rendererRef.current.domElement.style.cursor = "grab"
      }
    }

    const handleClick = (event: MouseEvent) => {
      // Only handle click if not dragging
      if (controlsRef.current.isDragging) return

      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()

      if (!rendererRef.current) return

      const rect = rendererRef.current.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      if (cameraRef.current) {
        raycaster.setFromCamera(mouse, cameraRef.current)
        const validPoints = floatPointsRef.current.filter((point): point is THREE.Mesh => point !== null)
        const intersects = raycaster.intersectObjects(validPoints)

        if (intersects.length > 0) {
          const clickedFloat = intersects[0].object.userData.floatData
          onFloatClick(clickedFloat)
        }
      }
    }

    renderer.domElement.style.cursor = "grab"
    renderer.domElement.addEventListener("mousedown", handleMouseDown, { passive: false })
    document.addEventListener("mousemove", handleMouseMove, { passive: false })
    document.addEventListener("mouseup", handleMouseUp, { passive: false })
    renderer.domElement.addEventListener("click", handleClick)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      if (!controlsRef.current.isDragging) {
        globe.rotation.y += 0.001
        // Update float points with auto-rotation
        floatPointsRef.current.forEach((point) => {
          if (point) {
            const phi = (90 - point.userData.floatData.lat) * (Math.PI / 180)
            const theta = (point.userData.floatData.lon + 180) * (Math.PI / 180)
            const radius = 5.1

            const rotationMatrix = new THREE.Matrix4()
            rotationMatrix.makeRotationFromEuler(new THREE.Euler(globe.rotation.x, globe.rotation.y, globe.rotation.z))

            const originalPos = new THREE.Vector3(
              -(radius * Math.sin(phi) * Math.cos(theta)),
              radius * Math.cos(phi),
              radius * Math.sin(phi) * Math.sin(theta),
            )

            originalPos.applyMatrix4(rotationMatrix)
            point.position.copy(originalPos)
          }
        })
      }

      renderer.render(scene, camera)
    }
    animate()

    // Store refs
    sceneRef.current = scene
    rendererRef.current = renderer
    globeRef.current = globe
    cameraRef.current = camera

    // Handle resize
    const handleResize = () => {
      if (mountRef.current && renderer && camera) {
        const width = mountRef.current.clientWidth
        const height = mountRef.current.clientHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Update float highlighting
  useEffect(() => {
    floatPointsRef.current.forEach((point, index) => {
      if (point && floats[index] && point.material instanceof THREE.MeshBasicMaterial) {
        point.material.color.setHex(floats[index].isHighlighted ? 0xffff00 : 0x00ffff)
        point.material.opacity = floats[index].isHighlighted ? 1 : 0.7
      }
    })
  }, [floats])

  return <div ref={mountRef} className="w-full h-full" />
}

// Chat Message Component
const ChatMessage = ({ message, isUser, isLoading, suggestions, onSuggestionClick }: ChatMessageProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 mb-4">
        <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
        <span className="text-sm text-muted-foreground">AI is thinking...</span>
      </div>
    )
  }

  return (
    <div className={`mb-4 ${isUser ? "flex justify-end" : "flex justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser ? "bg-primary text-primary-foreground" : "bg-card border text-card-foreground"
        }`}
      >
        <p className="text-sm">{message}</p>
        {suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {suggestions.map((suggestion: string, index: number) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick?.(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const DataModal = ({ float, isOpen, onClose }: DataModalProps) => {
  if (!isOpen || !float) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-cyan-400" />
              Float {float.id} - Scientific Data Analysis
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Location: {float.lat.toFixed(2)}°, {float.lon.toFixed(2)}° | Last Report:{" "}
              {float.lastReported.toLocaleDateString()}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          <Tabs defaultValue="profiles" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profiles">Depth Profiles</TabsTrigger>
              <TabsTrigger value="timeseries">Time Series</TabsTrigger>
              <TabsTrigger value="tsdiagram">T-S Diagram</TabsTrigger>
              <TabsTrigger value="crosssection">Cross Section</TabsTrigger>
            </TabsList>

            <TabsContent value="profiles" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Temperature vs Depth */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Temperature Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockProfileData.temperature}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="value"
                            label={{ value: "Temperature (°C)", position: "insideBottom", offset: -10 }}
                          />
                          <YAxis
                            dataKey="depth"
                            reversed
                            label={{ value: "Depth (m)", angle: -90, position: "insideLeft" }}
                          />
                          <Tooltip formatter={(value: number | string, name) => [`${typeof value === 'number' ? value.toFixed(2) : value}°C`, "Temperature"]} />
                          <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Salinity vs Depth */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Salinity Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockProfileData.salinity}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="value"
                            label={{ value: "Salinity (PSU)", position: "insideBottom", offset: -10 }}
                            domain={["dataMin - 0.1", "dataMax + 0.1"]}
                          />
                          <YAxis
                            dataKey="depth"
                            reversed
                            label={{ value: "Depth (m)", angle: -90, position: "insideLeft" }}
                          />
                          <Tooltip formatter={(value: number | string, name) => [`${typeof value === 'number' ? value.toFixed(2) : value} PSU`, "Salinity"]} />
                          <Line type="monotone" dataKey="value" stroke="#eab308" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Pressure vs Depth */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Pressure Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockProfileData.temperature}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="pressure"
                            label={{ value: "Pressure (dbar)", position: "insideBottom", offset: -10 }}
                          />
                          <YAxis
                            dataKey="depth"
                            reversed
                            label={{ value: "Depth (m)", angle: -90, position: "insideLeft" }}
                          />
                          <Tooltip formatter={(value: number | string, name) => [`${typeof value === 'number' ? value.toFixed(1) : value} dbar`, "Pressure"]} />
                          <Line type="monotone" dataKey="pressure" stroke="#22c55e" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeseries" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Temperature Time Series */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Temperature Time Series</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockProfileData.timeSeries}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            label={{ value: "Date", position: "insideBottom", offset: -10 }}
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis label={{ value: "Temperature (°C)", angle: -90, position: "insideLeft" }} />
                          <Tooltip
                            labelFormatter={(value) => `Date: ${value}`}
                            formatter={(value: number | string, name) => [`${typeof value === 'number' ? value.toFixed(2) : value}°C`, "Temperature"]}
                          />
                          <Line type="monotone" dataKey="temperature" stroke="#06b6d4" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Salinity Time Series */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Salinity Time Series</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockProfileData.timeSeries}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            label={{ value: "Date", position: "insideBottom", offset: -10 }}
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis label={{ value: "Salinity (PSU)", angle: -90, position: "insideLeft" }} />
                          <Tooltip
                            labelFormatter={(value) => `Date: ${value}`}
                            formatter={(value: number | string, name) => [`${typeof value === 'number' ? value.toFixed(2) : value} PSU`, "Salinity"]}
                          />
                          <Line type="monotone" dataKey="salinity" stroke="#eab308" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tsdiagram" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Temperature-Salinity Diagram</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Scatter plot showing the relationship between temperature and salinity at different depths
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={mockProfileData.tsDiagram}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="salinity"
                          label={{ value: "Salinity (PSU)", position: "insideBottom", offset: -10 }}
                          domain={["dataMin - 0.1", "dataMax + 0.1"]}
                        />
                        <YAxis
                          dataKey="temperature"
                          label={{ value: "Temperature (°C)", angle: -90, position: "insideLeft" }}
                        />
                        <Tooltip
                          formatter={(value: number | string, name, props) => [
                            name === "temperature" ? 
                              `${typeof value === 'number' ? value.toFixed(2) : value}°C` : 
                              `${typeof value === 'number' ? value.toFixed(2) : value} PSU`,
                            name === "temperature" ? "Temperature" : "Salinity",
                          ]}
                          labelFormatter={(label, payload) =>
                            payload?.[0] ? `Depth: ${payload[0].payload.depth}m` : ""
                          }
                        />
                        <Scatter dataKey="temperature" fill="#06b6d4" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crosssection" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Latitude vs Depth Cross Section</CardTitle>
                  <p className="text-xs text-muted-foreground">Temperature distribution across latitudes and depths</p>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={mockProfileData.crossSection}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="lat" label={{ value: "Latitude (°)", position: "insideBottom", offset: -10 }} />
                        <YAxis
                          dataKey="depth"
                          reversed
                          label={{ value: "Depth (m)", angle: -90, position: "insideLeft" }}
                        />
                        <Tooltip
                          formatter={(value: number | string, name, props) => [`${typeof value === 'number' ? value.toFixed(1) : value}°C`, "Temperature"]}
                          labelFormatter={(label, payload) =>
                            payload?.[0] ? `Lat: ${payload[0].payload.lat}°, Depth: ${payload[0].payload.depth}m` : ""
                          }
                        />
                        <Scatter dataKey="temperature" fill="#06b6d4" fillOpacity={0.7} />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export ASCII
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export NetCDF
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Plots
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main Dashboard Component
export default function Dashboard() {
  const [floats, setFloats] = useState(mockFloats)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to ARGO-AI Explorer! I can help you explore global ocean data from ARGO floats. Try asking me about salinity profiles, temperature data, or specific regions.",
      isUser: false,
      suggestions: [
        "Show floats near the equator",
        "Temperature profiles in the Atlantic",
        "Recent data from the Pacific",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFloat, setSelectedFloat] = useState<Float | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Simulate AI response
  const simulateAIResponse = useCallback(async (query: string) => {
    setIsLoading(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: query,
      isUser: true,
      suggestions: [],
    }
    setMessages((prev) => [...prev, userMessage])

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Simulate highlighting floats based on query
    if (query.toLowerCase().includes("indian ocean") || query.toLowerCase().includes("equator")) {
      setFloats((prev) =>
        prev.map((float) => ({
          ...float,
          isHighlighted: float.lat > -10 && float.lat < 10 && float.lon > 60 && float.lon < 100,
        })),
      )

      const aiResponse: Message = {
        id: Date.now() + 1,
        text: "I've found 7 floats matching your query in the Indian Ocean near the equator. They are now highlighted in yellow on the globe. Click on any highlighted float to see its detailed profile.",
        isUser: false,
        suggestions: ["Compare BGC parameters", "What is the average temperature?", "Export summary"],
      }
      setMessages((prev) => [...prev, aiResponse])
    } else {
      // Generic response
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: "I've processed your query and updated the globe visualization. You can see the relevant ARGO floats highlighted on the map. Click on any float for detailed measurements.",
        isUser: false,
        suggestions: ["Show temperature profiles", "Filter by date range", "Export data"],
      }
      setMessages((prev) => [...prev, aiResponse])
    }

    setIsLoading(false)
  }, [])

  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      simulateAIResponse(inputValue)
      setInputValue("")
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    simulateAIResponse(suggestion)
  }

  const handleFloatClick = (float: Float) => {
    setSelectedFloat(float)
    setIsModalOpen(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen w-screen bg-slate-900 text-white overflow-x-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 z-10 relative">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Waves className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold text-white">ARGO-AI Explorer</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Chat
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left Panel - Globe and Stats */}
        <div className="flex-1 flex flex-col">
          {/* Globe Container */}
          <div className="h-[calc(100vh-12rem)] relative">
            <Globe3D floats={floats} selectedFloat={selectedFloat} onFloatClick={handleFloatClick} />

            {/* Overlay Stats */}
            <div className="absolute top-4 left-4 space-y-2">
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm text-white">Active Floats: {floats.length}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-white">
                      Highlighted: {floats.filter((f) => f.isHighlighted).length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Stats Panel */}
          <div className="h-32 border-t border-white/10 bg-black/20 backdrop-blur-md p-4">
            <div className="grid grid-cols-4 gap-4 h-full">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3 h-full flex flex-col justify-center">
                  <div className="text-2xl font-bold text-cyan-400">2,847</div>
                  <div className="text-xs text-gray-300">Total Profiles</div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3 h-full flex flex-col justify-center">
                  <div className="text-2xl font-bold text-green-400">94%</div>
                  <div className="text-xs text-gray-300">Data Quality</div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3 h-full flex flex-col justify-center">
                  <div className="text-2xl font-bold text-yellow-400">15.2°C</div>
                  <div className="text-xs text-gray-300">Avg Temperature</div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3 h-full flex flex-col justify-center">
                  <div className="text-2xl font-bold text-purple-400">34.7 PSU</div>
                  <div className="text-xs text-gray-300">Avg Salinity</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Panel - Chat (Collapsible) */}
        {isChatOpen && (
          <div className="w-96 border-l border-white/10 bg-black/20 backdrop-blur-md flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-cyan-400" />
                <span className="font-semibold text-white">AI Assistant</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  suggestions={message.suggestions}
                  onSuggestionClick={handleSuggestionClick}
                />
              ))}
              {isLoading && <ChatMessage isLoading={true} />}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about ARGO float data..."
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Visualization Modal */}
      <DataModal float={selectedFloat} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
