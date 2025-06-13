import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Heart, Loader2, XCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface HealthStatus {
  success: boolean
  status?: string
  mama_bear_ready?: boolean
  models_available?: number
  services?: Record<string, boolean>
  timestamp?: string
}

const BackendHealthCheck: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkBackendHealth = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:5001/api/chat/health')
      const data = await response.json()
      setHealthStatus(data)
    } catch (err) {
      setError('Failed to connect to backend. Make sure it\'s running on port 5001.')
      setHealthStatus(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkBackendHealth()
  }, [])

  const getStatusColor = (status: boolean | undefined) => {
    if (status === true) return 'text-green-600'
    if (status === false) return 'text-red-600'
    return 'text-gray-400'
  }

  const getStatusIcon = (status: boolean | undefined) => {
    if (status === true) return <CheckCircle className="w-4 h-4" />
    if (status === false) return <XCircle className="w-4 h-4" />
    return <Loader2 className="w-4 h-4 animate-spin" />
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Backend Health Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={checkBackendHealth}
            disabled={isLoading}
            size="sm"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? 'Checking...' : 'Check Health'}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
            <p className="text-red-600 text-xs mt-1">
              Start backend: <code>cd backend && source .venv/bin/activate && python app.py</code>
            </p>
          </div>
        )}

        {healthStatus && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Backend Status</span>
              <Badge
                variant={healthStatus.success ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                {getStatusIcon(healthStatus.success)}
                {healthStatus.success ? 'Healthy' : 'Error'}
              </Badge>
            </div>

            {healthStatus.mama_bear_ready !== undefined && (
              <div className="flex items-center justify-between">
                <span>🐻 Mama Bear</span>
                <Badge
                  variant={healthStatus.mama_bear_ready ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {getStatusIcon(healthStatus.mama_bear_ready)}
                  {healthStatus.mama_bear_ready ? 'Ready' : 'Not Ready'}
                </Badge>
              </div>
            )}

            {healthStatus.models_available && (
              <div className="flex items-center justify-between">
                <span>AI Models</span>
                <Badge variant="outline">
                  {healthStatus.models_available} Available
                </Badge>
              </div>
            )}

            {healthStatus.services && (
              <div className="space-y-2">
                <h4 className="font-medium">Services</h4>
                {Object.entries(healthStatus.services).map(([service, status]) => (
                  <div key={service} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{service.replace('_', ' ')}</span>
                    <span className={getStatusColor(status)}>
                      {getStatusIcon(status)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {healthStatus.timestamp && (
              <p className="text-xs text-gray-500">
                Last checked: {new Date(healthStatus.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">🚀 Quick Start</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Backend:</strong> http://localhost:5001</p>
            <p><strong>Frontend:</strong> http://localhost:5173</p>
            <p><strong>Features:</strong> 67+ AI Models, Express Mode, Memory System</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BackendHealthCheck
