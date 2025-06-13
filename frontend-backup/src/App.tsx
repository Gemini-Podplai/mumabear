import BackendHealthCheck from '@/components/BackendHealthCheck'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🐻 Podplay Sanctuary
          </h1>
          <p className="text-lg text-gray-600">
            World-Class AI Development Platform
          </p>
          <p className="text-sm text-gray-500">
            67+ AI Models • Express Mode • Memory System • Real-time Chat
          </p>
        </header>

        <BackendHealthCheck />

        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>🚀 Ready for investor demonstrations</p>
        </footer>
      </div>
    </div>
  )
}

export default App
