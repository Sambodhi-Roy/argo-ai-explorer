"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { Float } from "@/types/dashboard"

interface OceanMapProps {
  floats: Float[]
  selectedFloat: Float | null
  onFloatClick: (float: Float) => void
  focusRegion?: string
}

const LeafletMap = ({ floats, selectedFloat, onFloatClick }: OceanMapProps) => {
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Predefined ARGO float coordinates
  const argoCoordinates = [
    { lat: -16.632799219509792, lon: 112.42996957985378 },
    { lat: 5.734533042265042, lon: 164.93872562445455 },
    { lat: 18.575038696619103, lon: -28.23210091310696 },
    { lat: 39.79716788492594, lon: -41.57015262074455 },
    { lat: -40.89691697412366, lon: -173.3377754176046 },
    { lat: -9.970232931413662, lon: 96.85218783652795 },
    { lat: -69.76907409074383, lon: -171.38366524390472 },
    { lat: -70.55177377816105, lon: 90.1400808605357 },
    { lat: 25.187657202218332, lon: -41.66251153764463 },
    { lat: -55.06066230286733, lon: 61.039769004029296 },
    { lat: -69.85812225892965, lon: -166.43053497546867 },
    { lat: -40.3923942266764, lon: 167.46590856102438 },
    { lat: -69.27732499837218, lon: -22.43105086751686 },
    { lat: 76.89203926754226, lon: -42.696542781342686 },
    { lat: -66.0144121362892, lon: 19.097945777698015 },
    { lat: 9.732617659901308, lon: -30.881350262029684 },
    { lat: 6.855087568743443, lon: -177.72977657605432 },
    { lat: 19.885971092343695, lon: -42.26220368524031 },
    { lat: -43.01218371438864, lon: -9.081492090108725 },
    { lat: -41.281832129921966, lon: 26.363144102360764 },
    { lat: -10.226581509771066, lon: -30.247987889859303 },
    { lat: -67.17547419487899, lon: -104.39904977805789 },
    { lat: 47.436840368454085, lon: -22.237619904916954 },
    { lat: -28.788066456270144, lon: 95.02491796125213 },
    { lat: -74.39333061475568, lon: 90.49413946810887 },
    { lat: -57.062657966196596, lon: -25.59974189878332 },
    { lat: 32.39572098351117, lon: -170.72483972061667 },
    { lat: -76.01072194459115, lon: 105.03583436761505 },
    { lat: -13.063114672311968, lon: 61.79820197697484 },
    { lat: 32.3540440464148, lon: -26.08622673079128 },
    { lat: -60.43913624380927, lon: 161.9794114690519 },
    { lat: -71.56741756959073, lon: -152.0515725677506 },
    { lat: 57.315887572901346, lon: -39.50451230524959 },
    { lat: -20.527478763309333, lon: 73.48016596774744 },
    { lat: 48.535843222465274, lon: -26.837701175010693 },
    { lat: -38.16428594294629, lon: -179.32830179551348 }
  ]

  // Create ARGO float objects with the predefined coordinates
  const argoFloats = useMemo(() => {
    return argoCoordinates.map((coord, index) => ({
      id: `ARGO-${String(index + 1).padStart(3, '0')}`,
      lat: coord.lat,
      lon: coord.lon,
      lastReported: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      isHighlighted: false,
      trajectory: [] // Empty trajectory for now
    }))
  }, [])

  useEffect(() => {
    // Import and initialize Leaflet dynamically
    const initializeMap = async () => {
      const L = (await import('leaflet')).default
      
      // Fix for default markers in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
      })

      // Clean up existing map if it exists
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      // Create map container
      const mapContainer = document.getElementById('map-container')
      if (mapContainer) {
        // Clear any existing content
        mapContainer.innerHTML = ''
        
        const map = L.map(mapContainer).setView([20, 0], 2)
        mapRef.current = map
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)

        // Add ARGO float markers (using predefined coordinates)
        argoFloats.forEach((float) => {
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
      }
    }

    initializeMap()

    // Global function for popup buttons
    ;(window as any).selectFloat = (floatId: string) => {
      const float = argoFloats.find(f => f.id === floatId)
      if (float) onFloatClick(float)
    }

    return () => {
      // Cleanup map instance
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      
      // Clear global function
      delete (window as any).selectFloat
    }
  }, [argoFloats, selectedFloat, onFloatClick])

  return (
    <div className="w-full h-full relative">
      {/* Stats */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/50">
        <div className="text-sm font-medium text-slate-700">
          ARGO Floats
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {argoFloats.length} floats shown
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
