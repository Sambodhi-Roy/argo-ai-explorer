"use client"

import { useEffect, useState, useMemo } from "react"
import { Float } from "@/types/dashboard"

interface OceanMapProps {
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

const LeafletMap = ({ floats, selectedFloat, onFloatClick }: OceanMapProps) => {
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
    // Import and initialize Leaflet dynamically
    const initializeMap = async () => {
      const L = (await import('leaflet')).default
      const { MapContainer, TileLayer, CircleMarker, Popup } = await import('react-leaflet')
      
      // Fix for default markers in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
      })

      // Create map container
      const mapContainer = document.getElementById('map-container')
      if (mapContainer && !mapContainer.hasChildNodes()) {
        const map = L.map(mapContainer).setView([20, 0], 2)
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)

        // Add ARGO float markers
        floats.forEach((float) => {
          const isSelected = selectedFloat?.id === float.id
          const marker = L.circleMarker([float.lat, float.lon], {
            color: "#ffffff",
            weight: 2,
            fillColor: isSelected ? "#ff6b35" : "#22c55e",
            fillOpacity: 0.8,
            radius: 8
          }).addTo(map)

          marker.bindPopup(`
            <div style="font-size: 12px;">
              <div style="font-weight: bold;">ARGO Float ${float.id}</div>
              <div>Position: ${float.lat.toFixed(4)}, ${float.lon.toFixed(4)}</div>
              <div>Last Report: ${float.lastReported.toLocaleDateString()}</div>
              <button onclick="window.selectFloat('${float.id}')" style="margin-top: 8px; padding: 4px 8px; background: #3b82f6; color: white; border: none; border-radius: 4px; font-size: 10px; cursor: pointer;">
                View Details
              </button>
            </div>
          `)

          marker.on('mouseover', () => marker.setStyle({ fillOpacity: 1 }))
          marker.on('mouseout', () => marker.setStyle({ fillOpacity: 0.8 }))
          marker.on('click', () => onFloatClick(float))
        })

        // Add device dots
        deviceDots.forEach((device) => {
          const marker = L.circleMarker([device.lat, device.lon], {
            color: "#ffffff",
            weight: 2,
            fillColor: "#0077ff",
            fillOpacity: 0.7,
            radius: 6
          }).addTo(map)

          marker.bindPopup(`
            <div style="font-size: 12px;">
              <div style="font-weight: bold;">${device.id}</div>
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: ${device.status === 'active' ? '#22c55e' : '#ef4444'};"></div>
                <span style="text-transform: capitalize;">${device.status}</span>
              </div>
              <div style="font-size: 10px; color: #64748b; margin-top: 4px;">
                ${device.lat.toFixed(4)}, ${device.lon.toFixed(4)}
              </div>
            </div>
          `)

          marker.on('mouseover', () => {
            marker.setStyle({ fillOpacity: 1 })
            document.body.style.cursor = "pointer"
          })
          marker.on('mouseout', () => {
            marker.setStyle({ fillOpacity: 0.7 })
            document.body.style.cursor = "default"
          })
        })
      }
    }

    initializeMap()

    // Global function for popup buttons
    ;(window as any).selectFloat = (floatId: string) => {
      const float = floats.find(f => f.id === floatId)
      if (float) onFloatClick(float)
    }

    return () => {
      // Cleanup
      const mapContainer = document.getElementById('map-container')
      if (mapContainer) {
        mapContainer.innerHTML = ''
      }
    }
  }, [floats, selectedFloat, deviceDots, onFloatClick])

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
      <div id="map-container" className="w-full h-full" />
    </div>
  )
}

export const OceanMap = (props: OceanMapProps) => {
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

  return <LeafletMap {...props} />
}
