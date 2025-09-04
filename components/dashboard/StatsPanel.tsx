"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Globe, BarChart3 } from "lucide-react"
import { StatsCard } from "./StatsCard"
import { Float } from "@/types/dashboard"

interface StatsPanelProps {
  floats: Float[]
}

export const StatsPanel = ({ floats }: StatsPanelProps) => {
  return (
    <div className="h-32 border-t border-slate-200 bg-white/80 backdrop-blur-md p-4 shadow-sm">
      <div className="grid grid-cols-4 gap-4 h-full">
        <StatsCard
          title="Total Profiles"
          value="2,847"
          color="text-blue-600"
        />
        <StatsCard
          title="Data Quality"
          value="94%"
          color="text-green-600"
        />
        <StatsCard
          title="Avg Temperature"
          value="15.2°C"
          color="text-orange-600"
        />
        <StatsCard
          title="Avg Salinity"
          value="34.7 PSU"
          color="text-purple-600"
        />
      </div>
    </div>
  )
}
