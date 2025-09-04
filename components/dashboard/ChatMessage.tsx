"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ChatMessageProps } from "@/types/dashboard"

export const ChatMessage = ({ message, isUser, isLoading, suggestions, onSuggestionClick }: ChatMessageProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-full">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        </div>
        <span className="text-sm text-slate-600">AI is thinking...</span>
      </div>
    )
  }

  return (
    <div className={`mb-6 ${isUser ? "flex justify-end" : "flex justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
          isUser 
            ? "bg-blue-600 text-white ml-8" 
            : "bg-white border border-slate-200 text-slate-800 mr-8"
        }`}
      >
        <p className="text-sm leading-relaxed">{message}</p>
        {suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {suggestions.map((suggestion: string, index: number) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick?.(suggestion)}
                className="text-xs bg-slate-50 border-slate-300 hover:bg-slate-100 rounded-lg"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
