"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Globe, BarChart3 } from "lucide-react"
import { Float } from "@/types/dashboard"

interface GlobeOverlayStatsProps {
  floats: Float[]
}

export const GlobeOverlayStats = ({ floats }: GlobeOverlayStatsProps) => {
  return (
    <div className="absolute top-6 left-6 space-y-3">
      <Card className="bg-white/95 backdrop-blur-md border-slate-200/50 shadow-lg rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-800">Active Floats: {floats.length}</span>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white/95 backdrop-blur-md border-slate-200/50 shadow-lg rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-slate-800">
              Highlighted: {floats.filter((f) => f.isHighlighted).length}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
