"use client"

import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useConfig } from '@/hooks/use-config'
import type { AnalysisResult } from '@/app/page'

interface DataPoint {
  x: string
  y: string
}

interface ManualInputProps {
  onAnalysisComplete: (result: AnalysisResult) => void
  isAnalyzing: boolean
  setIsAnalyzing: (analyzing: boolean) => void
}

interface FileInfo {
  filename: string
  shape: [number, number]
  columns: string[]
  numeric_columns: string[]
  head: unknown[]
}

interface ParsedDataPoint {
  x: number | number[]
  y: number
}

export function ManualInput({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }: ManualInputProps) {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { x: '', y: '' },
    { x: '', y: '' },
  ])
  const { backendUrl } = useConfig()

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

  const parseXValue = (xStr: string): number | number[] => {
    if (xStr.includes(',')) {
      const values = xStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v))
      return values.length > 1 ? values : parseFloat(xStr)
    }
    return parseFloat(xStr)
  }

  const validateAndParseData = (): ParsedDataPoint[] | null => {
    const validPoints = dataPoints.filter(point => point.x.trim() && point.y.trim())
    
    if (validPoints.length < 2) {
      toast.error("Insufficient data", {
        description: "Please provide at least 2 valid data points.",
      })
      return null
    }

    const parsedPoints: ParsedDataPoint[] = []

    for (const point of validPoints) {
      const xValue = parseXValue(point.x)
      const yValue = parseFloat(point.y)

      if (isNaN(yValue) || (typeof xValue === 'number' && isNaN(xValue))) {
        toast.error("Invalid data", {
          description: "Please ensure all values are valid numbers.",
        })
        return null
      }

      parsedPoints.push({
        x: xValue,
        y: yValue
      })
    }

    return parsedPoints
  }

  const handleAnalyze = async () => {
    const parsedData = validateAndParseData()
    if (!parsedData) return

    setIsAnalyzing(true)

    try {
      const response = await axios.post(`${backendUrl}/analyze-manual`, {
        data_points: parsedData
      })

      if (response.data.success) {
        onAnalysisComplete(response.data)
        toast.success("Analysis complete", {
          description: `Generated the required function(s).`,
        })
      }
    } catch (error: unknown) {
      console.error('Analysis error:', error)
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze data. Please try again."
      toast.error("Analysis failed", {
        description: errorMessage,
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Points</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your data points manually. For multi-dimensional input, separate X values with commas (e.g., &quot;1,2,3&quot;).
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