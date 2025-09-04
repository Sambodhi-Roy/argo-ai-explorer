"use client"

import { useState } from "react"
import { Float } from "@/types/dashboard"
import { mockFloats } from "@/lib/mock-data"
import { useAIChat } from "@/hooks/use-ai-chat"
import {
  Globe3D,
  DataModal,
  DashboardHeader,
  StatsPanel,
  GlobeOverlayStats,
  ChatPanel,
} from "@/components/dashboard"

// Main Dashboard Component
export default function Dashboard() {
  const [floats, setFloats] = useState<Float[]>(mockFloats)
  const [inputValue, setInputValue] = useState("")
  const [selectedFloat, setSelectedFloat] = useState<Float | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const { messages, isLoading, simulateAIResponse } = useAIChat(floats, setFloats)

  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      simulateAIResponse(inputValue)
      setInputValue("")
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    simulateAIResponse(suggestion)
  }

  const handleFloatClick = (float: Float) => {
    setSelectedFloat(float)
    setIsModalOpen(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const handleToggleChat = () => {
    setIsChatOpen(prev => !prev)
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 text-slate-900 overflow-hidden">
      {/* Header */}
      <DashboardHeader 
        isChatOpen={isChatOpen} 
        onToggleChat={handleToggleChat} 
      />

      {/* Main Content */}
      <div className="h-[calc(100vh-4rem)] w-full flex flex-col">
        {/* Left Panel - Globe and Stats */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Globe Container */}
          <div className="flex-1 relative bg-gradient-to-br from-blue-50/50 to-indigo-100/70 m-4 mb-2 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm overflow-hidden min-h-0">
            <Globe3D 
              floats={floats} 
              selectedFloat={selectedFloat} 
              onFloatClick={handleFloatClick} 
            />

            {/* Overlay Stats */}
            <GlobeOverlayStats floats={floats} />
          </div>

          {/* Bottom Stats Panel */}
          <StatsPanel floats={floats} />
        </div>
      </div>

      {/* Chat Panel */}
      <ChatPanel
        isOpen={isChatOpen}
        messages={messages}
        inputValue={inputValue}
        isLoading={isLoading}
        onClose={() => setIsChatOpen(false)}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        onSuggestionClick={handleSuggestionClick}
        onKeyPress={handleKeyPress}
      />

      {/* Data Visualization Modal */}
      <DataModal 
        float={selectedFloat} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
