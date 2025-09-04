"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ChatMessageProps } from "@/types/dashboard"

export const ChatMessage = ({ message, isUser, isLoading, suggestions, onSuggestionClick }: ChatMessageProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 mb-4">
        <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
        <span className="text-sm text-muted-foreground">AI is thinking...</span>
      </div>
    )
  }

  return (
    <div className={`mb-4 ${isUser ? "flex justify-end" : "flex justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser ? "bg-primary text-primary-foreground" : "bg-card border text-card-foreground"
        }`}
      >
        <p className="text-sm">{message}</p>
        {suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {suggestions.map((suggestion: string, index: number) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick?.(suggestion)}
                className="text-xs"
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
