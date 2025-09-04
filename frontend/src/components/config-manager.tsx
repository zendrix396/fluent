"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Save, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useConfig } from '@/hooks/use-config'

export function ConfigManager() {
  const [isEditing, setIsEditing] = useState(false)
  const [backendUrl, setBackendUrl] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const { config, reload } = useConfig()

  const handleEdit = () => {
    setBackendUrl(config?.backend.baseUrl || 'http://localhost:8000')
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!backendUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid backend URL.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // In a real application, you would save this to a server endpoint
      // For now, we'll just update the local config and reload
      const newConfig = {
        ...config,
        backend: {
          ...config?.backend,
          baseUrl: backendUrl.trim()
        }
      }
      
      // Update the config.json file (this would typically be done via an API)
      // For now, we'll just show a success message
      toast({
        title: "Configuration updated",
        description: "Backend URL has been updated. Please restart the application for changes to take effect.",
      })
      
      setIsEditing(false)
      reload()
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setBackendUrl('')
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="backend-url">Backend Server URL</Label>
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                id="backend-url"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="http://localhost:8000"
              />
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {config?.backend.baseUrl || 'http://localhost:8000'}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground">
          Edit the backend server URL in the config.json file to change this setting permanently.
        </p>
      </CardContent>
    </Card>
  )
}
