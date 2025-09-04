# ARGO AI Explorer - Component Structure

This document outlines the refactored component structure of the ARGO AI Explorer dashboard.

## Overview

The original single-file dashboard has been broken down into a modular, maintainable structure with properly separated concerns.

## File Structure

```
├── app/dashboard/page.tsx              # Main dashboard page (refactored)
├── types/dashboard.ts                  # TypeScript type definitions
├── lib/mock-data.ts                   # Mock data and utilities
├── hooks/use-ai-chat.ts               # Custom hook for AI chat logic
└── components/dashboard/
    ├── index.ts                       # Component exports
    ├── Globe3D.tsx                    # 3D globe visualization component
    ├── ChatMessage.tsx                # Individual chat message component
    ├── ChatPanel.tsx                  # Chat panel with input and messages
    ├── DataModal.tsx                  # Scientific data visualization modal
    ├── DashboardHeader.tsx            # Top navigation header
    ├── StatsCard.tsx                  # Individual statistics card
    ├── StatsPanel.tsx                 # Bottom statistics panel
    └── GlobeOverlayStats.tsx          # Stats overlay on the globe
```

## Components Description

### Core Components

#### `Globe3D.tsx`
- **Purpose**: 3D interactive globe visualization using Three.js
- **Props**: `floats`, `selectedFloat`, `onFloatClick`, `focusRegion?`
- **Features**: 
  - Interactive rotation and zooming
  - Float point visualization with highlighting
  - Click detection for float selection
  - Auto-rotation animation

#### `DataModal.tsx`
- **Purpose**: Scientific data visualization modal with charts
- **Props**: `float`, `isOpen`, `onClose`
- **Features**:
  - Tabbed interface for different data views
  - Temperature, salinity, and pressure profiles
  - Time series charts
  - T-S diagrams and cross-sections
  - Export functionality

#### `ChatPanel.tsx`
- **Purpose**: AI chat interface panel
- **Props**: Complex props for chat state management
- **Features**:
  - Collapsible side panel
  - Message history with suggestions
  - Input handling and loading states

### UI Components

#### `DashboardHeader.tsx`
- **Purpose**: Top navigation with branding and controls
- **Props**: `isChatOpen`, `onToggleChat`
- **Features**: Logo, navigation, chat toggle button

#### `ChatMessage.tsx`
- **Purpose**: Individual chat message with suggestions
- **Props**: `message`, `isUser`, `isLoading`, `suggestions`, `onSuggestionClick`
- **Features**: Different styling for user/AI messages, suggestion buttons

#### `StatsPanel.tsx`
- **Purpose**: Bottom statistics panel
- **Props**: `floats` array
- **Features**: Grid of statistics cards

#### `StatsCard.tsx`
- **Purpose**: Individual statistic display card
- **Props**: `title`, `value`, `color`, `icon?`
- **Features**: Consistent styling for metrics

#### `GlobeOverlayStats.tsx`
- **Purpose**: Overlay statistics on the globe
- **Props**: `floats` array
- **Features**: Real-time float count and highlights

## Utilities and Hooks

### `types/dashboard.ts`
- Centralized TypeScript type definitions
- Interface definitions for all component props
- Data structure types (Float, Message, ProfileData, etc.)

### `lib/mock-data.ts`
- Mock data generation utilities
- Realistic scientific data simulation
- Exportable data structures

### `hooks/use-ai-chat.ts`
- Custom hook for AI chat functionality
- Manages message state and AI response simulation
- Encapsulates chat logic away from UI components

## Benefits of This Structure

### 1. **Maintainability**
- Each component has a single responsibility
- Easy to locate and modify specific functionality
- Reduced coupling between components

### 2. **Reusability**
- Components can be used in other parts of the application
- Consistent interfaces and props
- Modular design patterns

### 3. **Testing**
- Individual components can be unit tested
- Isolated logic in custom hooks
- Clear separation of concerns

### 4. **Performance**
- Components can be optimized individually
- Lazy loading potential for large components
- Better tree shaking opportunities

### 5. **Development Experience**
- Clear file organization
- TypeScript support throughout
- Easier collaboration between developers

## Component Relationships

```
Dashboard (main page)
├── DashboardHeader
├── Globe3D
│   └── GlobeOverlayStats
├── StatsPanel
│   └── StatsCard (×4)
├── ChatPanel
│   └── ChatMessage (multiple)
└── DataModal
    └── (Chart components from recharts)
```

## Usage Example

```tsx
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

export default function Dashboard() {
  const [floats, setFloats] = useState<Float[]>(mockFloats)
  const { messages, isLoading, simulateAIResponse } = useAIChat(floats, setFloats)
  
  // Component logic...
  
  return (
    <div className="dashboard">
      <DashboardHeader onToggleChat={handleToggleChat} />
      <Globe3D floats={floats} onFloatClick={handleFloatClick} />
      {/* Other components... */}
    </div>
  )
}
```

## Future Enhancements

### Possible Improvements
1. **State Management**: Consider Redux or Zustand for complex state
2. **Real API Integration**: Replace mock data with actual ARGO data
3. **Performance**: Implement React.memo for expensive components
4. **Accessibility**: Add ARIA labels and keyboard navigation
5. **Testing**: Add Jest/React Testing Library tests
6. **Storybook**: Create component documentation
7. **Error Boundaries**: Add error handling components

### Architecture Considerations
- **Context API**: For global state sharing
- **React Query**: For data fetching and caching
- **Web Workers**: For heavy computations in Globe3D
- **Service Workers**: For offline functionality

This refactored structure provides a solid foundation for scaling the application while maintaining code quality and developer productivity.
