"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Waves, MessageSquare } from "lucide-react"
import { DashboardHeaderProps } from "@/types/dashboard"

export const DashboardHeader = ({ isChatOpen, onToggleChat }: DashboardHeaderProps) => {
  return (
    <header className="h-16 border-b border-slate-200/50 bg-white/90 backdrop-blur-lg flex items-center justify-between px-8 z-10 relative shadow-sm">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <Waves className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800">ARGO-AI Explorer</span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleChat();
          }}
          className="border-slate-300 text-slate-700 hover:bg-slate-100 bg-white/80 relative z-50 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          AI Chat
        </Button>
      </div>
    </header>
  )
}
