import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import AgentScoutHub from './components/agentHub/AgentScoutHub'
import MessengerPanel from './components/messenger/MessengerPanel'
import ResearchPanel from './components/research/ResearchPanel'
import AccessibilityToolbar from './components/ui/AccessibilityToolbar'
import CommandPalette from './components/ui/CommandPalette'
import FeedbackWidget from './components/ui/FeedbackWidget'
import FloatingMamaBearWidget from './components/ui/FloatingMamaBearWidget'
import MamaBearChatOverlay from './components/ui/MamaBearChatOverlay'
import NotificationCenter from './components/ui/NotificationCenter'
import ThemeToggle from './components/ui/ThemeToggle'
import UserProfileMenu from './components/ui/UserProfileMenu'
import IDEWorkspace from './components/workspace/IDEWorkspace'
import MarketplacePanel from './components/workspace/MarketplacePanel'
import MCPMarketDockPanel from './components/workspace/MCPMarketDockPanel'
import PipedreamStudioPanel from './components/workspace/PipedreamStudioPanel'

function App() {
  const [chatOpen, setChatOpen] = useState(false)
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Top Bar with Theme Toggle and User Profile */}
        <div className="w-full flex justify-end items-center px-4 py-2 space-x-2">
          <ThemeToggle />
          <UserProfileMenu />
        </div>
        {/* Main Content */}
        <Routes>
          <Route path="/" element={<AgentScoutHub />} />
          <Route path="/workspace" element={<IDEWorkspace />} />
          <Route path="/research" element={<ResearchPanel />} />
          <Route path="/messenger" element={<MessengerPanel />} />
          <Route path="/marketplace" element={<MarketplacePanel />} />
          <Route path="/pipedream" element={<PipedreamStudioPanel />} />
          <Route path="/mcp-marketdock" element={<MCPMarketDockPanel />} />
        </Routes>
        {/* Floating Mama Bear Widget - Always Present */}
        <FloatingMamaBearWidget onOpen={() => setChatOpen(true)} />
        {/* Mama Bear Chat Overlay - Always Present */}
        <MamaBearChatOverlay open={chatOpen} onClose={() => setChatOpen(false)} />
        {/* Notification Center - Always Present */}
        <NotificationCenter />
        {/* Command Palette - Always Present */}
        <CommandPalette />
        {/* Accessibility Toolbar - Always Present */}
        <AccessibilityToolbar />
        {/* Feedback Widget - Always Present */}
        <FeedbackWidget />
      </div>
    </BrowserRouter>
  )
}

export default App
