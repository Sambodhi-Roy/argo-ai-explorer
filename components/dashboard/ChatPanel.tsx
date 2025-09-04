"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Send } from "lucide-react"
import { ChatMessage } from "./ChatMessage"
import { ChatPanelProps } from "@/types/dashboard"

export const ChatPanel = ({ 
  isOpen, 
  messages, 
  inputValue, 
  isLoading, 
  onClose, 
  onInputChange, 
  onSendMessage, 
  onSuggestionClick, 
  onKeyPress 
}: ChatPanelProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed top-16 right-0 w-96 h-[calc(100vh-4rem)] border-l-2 border-cyan-400 bg-slate-800 flex flex-col z-50 shadow-xl">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-700">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-cyan-400" />
          <span className="font-semibold text-white">AI Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isUser={message.isUser}
            suggestions={message.suggestions}
            onSuggestionClick={onSuggestionClick}
          />
        ))}
        {isLoading && <ChatMessage isLoading={true} />}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Ask about ARGO float data..."
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            disabled={isLoading}
          />
          <Button
            onClick={onSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
