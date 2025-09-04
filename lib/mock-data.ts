import { Float, ProfileData, ProfileDataPoint, Message } from "@/types/dashboard"

export const mockFloats: Float[] = Array.from({ length: 200 }, (_, i) => ({
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

export const generateRealisticProfileData = (): ProfileData => {
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

export const mockProfileData = generateRealisticProfileData()

export const initialMessages: Message[] = [
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
]
