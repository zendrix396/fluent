"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Loader2, Lock } from '@/icons/lucide'
import { useToast } from '@/hooks/use-toast'
import { AnalysisResult } from './file-upload'
import config from '../../config.json'

interface DataPoint {
  x: string
  y: string
}

interface ManualInputProps {
  onAnalysisComplete: (result: AnalysisResult) => void
  isAnalyzing: boolean
  setIsAnalyzing: (analyzing: boolean) => void
}

export function ManualInput({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }: ManualInputProps) {
  const { data: session } = useSession()
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { x: '', y: '' },
    { x: '', y: '' },
  ])
  const [isMultiDimensional, setIsMultiDimensional] = useState(false)
  const { toast } = useToast()

  const addDataPoint = () => {
    setDataPoints([...dataPoints, { x: '', y: '' }])
  }

  const removeDataPoint = (index: number) => {
    if (dataPoints.length > 2) {
      setDataPoints(dataPoints.filter((_, i) => i !== index))
    }
  }

  const updateDataPoint = (index: number, field: 'x' | 'y', value: string) => {
    const updated = [...dataPoints]
    updated[index][field] = value
    setDataPoints(updated)
  }

  const parseXValue = (xStr: string) => {
    // Check if it's a multi-dimensional input (comma-separated values)
    if (xStr.includes(',')) {
      const values = xStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v))
      return values.length > 1 ? values : parseFloat(xStr)
    }
    return parseFloat(xStr)
  }

  const validateAndParseData = () => {
    const validPoints = dataPoints.filter(point => point.x.trim() && point.y.trim())
    
    if (validPoints.length < 2) {
      toast({
        title: "Insufficient data",
        description: "Please provide at least 2 valid data points.",
        variant: "destructive",
      })
      return null
    }

    const parsedPoints = []
    let hasMultiDimensional = false

    for (const point of validPoints) {
      const xValue = parseXValue(point.x)
      const yValue = parseFloat(point.y)

      if (isNaN(yValue) || (typeof xValue === 'number' && isNaN(xValue))) {
        toast({
          title: "Invalid data",
          description: "Please ensure all values are valid numbers.",
          variant: "destructive",
        })
        return null
      }

      if (Array.isArray(xValue)) {
        hasMultiDimensional = true
      }

      parsedPoints.push({
        x: xValue,
        y: yValue
      })
    }

    setIsMultiDimensional(hasMultiDimensional)
    return parsedPoints
  }

  const checkRequestLimits = async () => {
    if (!session) {
      // For non-authenticated users, we'll rely on backend to track requests
      return true
    }

    const user = session.user as any
    if (user.isPremium) return true

    if (user.requestCount >= config.limits.freeRequests) {
      toast({
        title: "Request limit reached",
        description: `You have reached the limit of ${config.limits.freeRequests} free requests. Please upgrade to premium.`,
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleAnalyze = async () => {
    const parsedData = validateAndParseData()
    if (!parsedData) return

    const canProceed = await checkRequestLimits()
    if (!canProceed) return

    setIsAnalyzing(true)

    try {
      // Update request count if authenticated
      if (session) {
        await fetch('/api/user/update-requests', {
          method: 'POST',
        })
      }

      const response = await axios.post(`${config.api.baseUrl}${config.api.endpoints.analyzeManual}`, {
        data_points: parsedData
      }, {
        headers: {
          ...(session && { 'Authorization': `Bearer ${session.user.email}` })
        }
      })

      if (response.data.success) {
        onAnalysisComplete(response.data)
        
        // Save analysis if authenticated
        if (session) {
          await fetch('/api/analysis/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              dataPoints: parsedData.length,
              analysisType: 'manual',
              functions: Array.isArray(response.data.functions) ? response.data.functions : [response.data.function],
              accuracy: response.data.accuracy,
              accuracies: response.data.accuracies,
            })
          })
        }

        toast({
          title: "Analysis complete",
          description: `Generated function with ${response.data.accuracy} accuracy.`,
        })
      }
    } catch (error: any) {
      console.error('Analysis error:', error)
      toast({
        title: "Analysis failed",
        description: error.response?.data?.detail || "Failed to analyze data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Authentication Notice */}
      {!session && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
              <Lock className="h-4 w-4" />
              <p className="text-sm">
                You have {config.limits.freeRequests} free requests without an account. 
                <a href="/auth/signin" className="ml-1 underline hover:no-underline">
                  Sign in
                </a> for unlimited access.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Points</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your data points manually. For multi-dimensional input, separate X values with commas (e.g., "1,2,3").
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {dataPoints.map((point, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-1">
                <Label htmlFor={`x-${index}`} className="sr-only">
                  X value {index + 1}
                </Label>
                <Input
                  id={`x-${index}`}
                  placeholder="X value (e.g., 1.5 or 1,2,3)"
                  value={point.x}
                  onChange={(e) => updateDataPoint(index, 'x', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`y-${index}`} className="sr-only">
                  Y value {index + 1}
                </Label>
                <Input
                  id={`y-${index}`}
                  placeholder="Y value"
                  value={point.y}
                  onChange={(e) => updateDataPoint(index, 'y', e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeDataPoint(index)}
                disabled={dataPoints.length <= 2}
                className="shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={addDataPoint}>
          <Plus className="mr-2 h-4 w-4" />
          Add Data Point
        </Button>
        
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Data'
          )}
        </Button>
      </div>

      {/* Example */}
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Examples:</p>
            <div className="space-y-1">
              <p><strong>Single dimension:</strong> X: 1, Y: 3</p>
              <p><strong>Multi-dimension:</strong> X: 1,2,3, Y: 7</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
