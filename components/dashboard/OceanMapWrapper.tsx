"use client"

import { useEffect, useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { Float } from "@/types/dashboard"

// Dynamically import all map-related components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false })
const CircleMarker = dynamic(() => import("react-leaflet").then(mod => mod.CircleMarker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false })

interface OceanMapWrapperProps {
  floats: Float[]
  selectedFloat: Float | null
  onFloatClick: (float: Float) => void
  focusRegion?: string
}

interface DeviceDot {
  id: string
  lat: number
  lon: number
  status: "active" | "inactive"
}

// Hardcoded ocean bounding boxes for lightweight mode
const OCEAN_REGIONS = {
  pacific: [
    { lat: 60, lon: -180 }, { lat: 60, lon: -100 },
    { lat: -60, lon: -100 }, { lat: -60, lon: -180 }
  ],
  atlantic: [
    { lat: 70, lon: -80 }, { lat: 70, lon: 20 },
    { lat: -60, lon: 20 }, { lat: -60, lon: -80 }
  ],
  indian: [
    { lat: 30, lon: 20 }, { lat: 30, lon: 120 },
    { lat: -60, lon: 120 }, { lat: -60, lon: 20 }
  ]
}

// Generate random point within ocean bounding box
const generateRandomOceanPoint = (useAccurateMode: boolean): { lat: number; lon: number } => {
  if (!useAccurateMode) {
    // Lightweight mode: use hardcoded ocean regions
    const regions = Object.values(OCEAN_REGIONS)
    const region = regions[Math.floor(Math.random() * regions.length)]
    
    const minLat = Math.min(...region.map(p => p.lat))
    const maxLat = Math.max(...region.map(p => p.lat))
    const minLon = Math.min(...region.map(p => p.lon))
    const maxLon = Math.max(...region.map(p => p.lon))
    
    return {
      lat: minLat + Math.random() * (maxLat - minLat),
      lon: minLon + Math.random() * (maxLon - minLon)
    }
  } else {
    // Accurate mode: generate truly random ocean points
    const oceanAreas = [
      // Pacific Ocean
      { latRange: [-60, 60], lonRange: [-180, -100] },
      { latRange: [-60, 60], lonRange: [120, 180] },
      // Atlantic Ocean
      { latRange: [-60, 70], lonRange: [-80, 20] },
      // Indian Ocean
      { latRange: [-60, 30], lonRange: [20, 120] },
      // Arctic Ocean
      { latRange: [60, 85], lonRange: [-180, 180] },
      // Southern Ocean
      { latRange: [-85, -60], lonRange: [-180, 180] }
    ]
    
    const area = oceanAreas[Math.floor(Math.random() * oceanAreas.length)]
    return {
      lat: area.latRange[0] + Math.random() * (area.latRange[1] - area.latRange[0]),
      lon: area.lonRange[0] + Math.random() * (area.lonRange[1] - area.lonRange[0])
    }
  }
}

// Check if point is in ocean
const isPointInOcean = (lat: number, lon: number): boolean => {
  // Simplified check using ocean regions
  for (const region of Object.values(OCEAN_REGIONS)) {
    const minLat = Math.min(...region.map(p => p.lat))
    const maxLat = Math.max(...region.map(p => p.lat))
    const minLon = Math.min(...region.map(p => p.lon))
    const maxLon = Math.max(...region.map(p => p.lon))
    
    if (lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon) {
      return true
    }
  }
  return false
}

const OceanMapComponent = ({ floats, selectedFloat, onFloatClick }: OceanMapWrapperProps) => {
  const [useAccurateMode, setUseAccurateMode] = useState(false)
  const [deviceDots, setDeviceDots] = useState<DeviceDot[]>([])

  // Generate device dots
  const generateDeviceDots = useMemo(() => {
    const dots: DeviceDot[] = []
    let attempts = 0
    const maxAttempts = 200
    
    while (dots.length < 50 && attempts < maxAttempts) {
      const point = generateRandomOceanPoint(useAccurateMode)
      
      if (isPointInOcean(point.lat, point.lon)) {
        dots.push({
          id: `device-${dots.length + 1}`,
          lat: point.lat,
          lon: point.lon,
          status: Math.random() > 0.3 ? "active" : "inactive"
        })
      }
      attempts++
    }
    
    return dots
  }, [useAccurateMode])

  useEffect(() => {
    setDeviceDots(generateDeviceDots)
  }, [generateDeviceDots])

  useEffect(() => {
    // Initialize Leaflet icons on client side
    if (typeof window !== "undefined") {
      const L = require("leaflet")
      
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
      })
    }
  }, [])

  return (
    <div className="w-full h-full relative">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/50">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="accurateMode"
            checked={useAccurateMode}
            onChange={(e) => setUseAccurateMode(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="accurateMode" className="text-sm font-medium text-slate-700">
            Accurate Mode
          </label>
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {deviceDots.length} devices shown
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="w-full h-full"
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ARGO Float Markers */}
        {floats.map((float) => (
          <CircleMarker
            key={`float-${float.id}`}
            center={[float.lat, float.lon]}
            radius={8}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: selectedFloat?.id === float.id ? "#ff6b35" : "#22c55e",
              fillOpacity: 0.8,
            }}
            eventHandlers={{
              click: () => onFloatClick(float),
              mouseover: (e) => {
                e.target.setStyle({ fillOpacity: 1 })
              },
              mouseout: (e) => {
                e.target.setStyle({ fillOpacity: 0.8 })
              }
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">ARGO Float {float.id}</div>
                <div>Position: {float.lat.toFixed(4)}, {float.lon.toFixed(4)}</div>
                <div>Last Report: {float.lastReported.toLocaleDateString()}</div>
                <div className="mt-2">
                  <button
                    onClick={() => onFloatClick(float)}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Device Dots */}
        {deviceDots.map((device) => (
          <CircleMarker
            key={device.id}
            center={[device.lat, device.lon]}
            radius={6}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: "#0077ff",
              fillOpacity: 0.7,
            }}
            eventHandlers={{
              mouseover: (e) => {
                e.target.setStyle({ fillOpacity: 1 })
                if (typeof document !== "undefined") {
                  document.body.style.cursor = "pointer"
                }
              },
              mouseout: (e) => {
                e.target.setStyle({ fillOpacity: 0.7 })
                if (typeof document !== "undefined") {
                  document.body.style.cursor = "default"
                }
              }
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{device.id}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className={`w-2 h-2 rounded-full ${
                      device.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="capitalize">{device.status}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {device.lat.toFixed(4)}, {device.lon.toFixed(4)}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}

export const OceanMapWrapper = (props: OceanMapWrapperProps) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50/50 to-indigo-100/70">
        <div className="text-slate-600">Loading map...</div>
      </div>
    )
  }

  return <OceanMapComponent {...props} />
}
