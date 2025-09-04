"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Globe, BarChart3 } from "lucide-react"
import { Float } from "@/types/dashboard"

interface GlobeOverlayStatsProps {
  floats: Float[]
}

export const GlobeOverlayStats = ({ floats }: GlobeOverlayStatsProps) => {
  return (
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
  )
}
