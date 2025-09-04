export interface Float {
  id: string
  lat: number
  lon: number
  lastReported: Date
  isHighlighted: boolean
  trajectory: {
    lat: number
    lon: number
    date: Date
  }[]
}

export interface Message {
  id: number
  text: string
  isUser: boolean
  suggestions: string[]
}

export interface ProfileDataPoint {
  depth: number
  value: number
  pressure: number
}

export interface TimeSeriesDataPoint {
  date: string
  temperature: number
  salinity: number
}

export interface TSDiagramDataPoint {
  temperature: number
  salinity: number
  depth: number
}

export interface CrossSectionDataPoint {
  lat: number
  depth: number
  temperature: number
}

export interface ProfileData {
  temperature: ProfileDataPoint[]
  salinity: ProfileDataPoint[]
  timeSeries: TimeSeriesDataPoint[]
  tsDiagram: TSDiagramDataPoint[]
  crossSection: CrossSectionDataPoint[]
}

export interface Globe3DProps {
  floats: Float[]
  selectedFloat: Float | null
  onFloatClick: (float: Float) => void
  focusRegion?: string
}

export interface ChatMessageProps {
  message?: string
  isUser?: boolean
  isLoading?: boolean
  suggestions?: string[]
  onSuggestionClick?: (suggestion: string) => void
}

export interface DataModalProps {
  float: Float | null
  isOpen: boolean
  onClose: () => void
}

export interface DashboardHeaderProps {
  isChatOpen: boolean
  onToggleChat: () => void
}

export interface StatsCardProps {
  title: string
  value: string | number
  color: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface ChatPanelProps {
  isOpen: boolean
  messages: Message[]
  inputValue: string
  isLoading: boolean
  onClose: () => void
  onInputChange: (value: string) => void
  onSendMessage: () => void
  onSuggestionClick: (suggestion: string) => void
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
}
