"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Waves, MessageSquare } from "lucide-react"
import { DashboardHeaderProps } from "@/types/dashboard"

export const DashboardHeader = ({ isChatOpen, onToggleChat }: DashboardHeaderProps) => {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-10 relative shadow-sm">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Waves className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-slate-800">ARGO-AI Explorer</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleChat();
          }}
          className="border-slate-300 text-slate-700 hover:bg-slate-100 bg-white relative z-50"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          AI Chat
        </Button>
      </div>
    </header>
  )
}
