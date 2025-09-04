"use client"

import { useState, useCallback } from "react"
import { Float, Message } from "@/types/dashboard"

export const useAIChat = (floats: Float[], setFloats: (floats: Float[] | ((prev: Float[]) => Float[])) => void) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to ARGO-AI Explorer! I can help you explore global ocean data from ARGO floats. Try asking me about salinity profiles, temperature data, or specific regions.",
      isUser: false,
      suggestions: [
        "Show floats near the equator",
        "Temperature profiles in the Atlantic",
        "Recent data from the Pacific",
      ],
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  // Simulate AI response
  const simulateAIResponse = useCallback(async (query: string) => {
    setIsLoading(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: query,
      isUser: true,
      suggestions: [],
    }
    setMessages((prev) => [...prev, userMessage])

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Simulate highlighting floats based on query
    if (query.toLowerCase().includes("indian ocean") || query.toLowerCase().includes("equator")) {
      setFloats((prev) =>
        prev.map((float) => ({
          ...float,
          isHighlighted: float.lat > -10 && float.lat < 10 && float.lon > 60 && float.lon < 100,
        })),
      )

      const aiResponse: Message = {
        id: Date.now() + 1,
        text: "I've found 7 floats matching your query in the Indian Ocean near the equator. They are now highlighted in yellow on the globe. Click on any highlighted float to see its detailed profile.",
        isUser: false,
        suggestions: ["Compare BGC parameters", "What is the average temperature?", "Export summary"],
      }
      setMessages((prev) => [...prev, aiResponse])
    } else {
      // Generic response
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: "I've processed your query and updated the globe visualization. You can see the relevant ARGO floats highlighted on the map. Click on any float for detailed measurements.",
        isUser: false,
        suggestions: ["Show temperature profiles", "Filter by date range", "Export data"],
      }
      setMessages((prev) => [...prev, aiResponse])
    }

    setIsLoading(false)
  }, [setFloats])

  return {
    messages,
    isLoading,
    simulateAIResponse,
  }
}
