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
    <div className="fixed top-20 right-4 w-96 max-w-[calc(100vw-2rem)] h-[calc(100vh-6rem)] bg-white flex flex-col z-50 shadow-2xl border border-slate-200 rounded-2xl overflow-hidden backdrop-blur-sm max-h-[calc(100vh-6rem)]">
      {/* Chat Header */}
      <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
          <span className="font-semibold text-slate-800">AI Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-slate-600 hover:bg-white/80 hover:text-slate-800 rounded-full h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 min-h-0">
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
      <div className="p-6 border-t border-slate-200 bg-white rounded-b-2xl">
        <div className="flex gap-3">
          <Input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Ask about ARGO float data..."
            className="flex-1 bg-white border-slate-300 text-slate-800 placeholder:text-gray-500 rounded-xl h-11 px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            disabled={isLoading}
          />
          <Button
            onClick={onSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl h-11 px-4 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
