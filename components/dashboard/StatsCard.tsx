"use client"

import { Card, CardContent } from "@/components/ui/card"
import { StatsCardProps } from "@/types/dashboard"

export const StatsCard = ({ title, value, color, icon: Icon }: StatsCardProps) => {
  return (
    <Card className="bg-white/90 border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl border backdrop-blur-sm">
      <CardContent className="p-4 h-full flex flex-col justify-center">
        <div className={`text-2xl font-bold ${color} mb-1`}>
          {Icon && <Icon className="h-6 w-6 inline mr-2" />}
          {value}
        </div>
        <div className="text-sm text-slate-600 font-medium">{title}</div>
      </CardContent>
    </Card>
  )
}
