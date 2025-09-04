"use client"

import { Card, CardContent } from "@/components/ui/card"
import { StatsCardProps } from "@/types/dashboard"

export const StatsCard = ({ title, value, color, icon: Icon }: StatsCardProps) => {
  return (
    <Card className="bg-white/90 border-slate-200 shadow-sm">
      <CardContent className="p-3 h-full flex flex-col justify-center">
        <div className={`text-2xl font-bold ${color}`}>
          {Icon && <Icon className="h-6 w-6 inline mr-2" />}
          {value}
        </div>
        <div className="text-xs text-slate-600">{title}</div>
      </CardContent>
    </Card>
  )
}
