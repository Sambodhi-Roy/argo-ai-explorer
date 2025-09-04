"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Waves, MessageSquare } from "lucide-react"
import { DashboardHeaderProps } from "@/types/dashboard"

export const DashboardHeader = ({ isChatOpen, onToggleChat }: DashboardHeaderProps) => {
  return (
    <header className="h-16 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 z-10 relative">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Waves className="h-8 w-8 text-cyan-400" />
          <span className="text-xl font-bold text-white">ARGO-AI Explorer</span>
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
          className="border-white/20 text-white hover:bg-white/10 bg-transparent relative z-50"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          AI Chat
        </Button>
      </div>
    </header>
  )
}
