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
    <div className="fixed top-16 right-0 w-96 h-[calc(100vh-4rem)] border-l-2 border-blue-400 bg-white flex flex-col z-50 shadow-xl">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-slate-800">AI Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-slate-600 hover:bg-slate-200"
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
      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Ask about ARGO float data..."
            className="flex-1 bg-white border-slate-300 text-slate-800 placeholder:text-gray-500"
            disabled={isLoading}
          />
          <Button
            onClick={onSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
