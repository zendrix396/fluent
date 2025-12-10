"use client"

import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Loader2, Keyboard } from 'lucide-react'
import { toast } from 'sonner'
import { useConfig } from '@/hooks/use-config'
import type { AnalysisResult } from '@/types'

interface DataPoint {
  x: string
  y: string
}

interface ManualInputProps {
  onAnalysisComplete: (result: AnalysisResult) => void
  isAnalyzing: boolean
  setIsAnalyzing: (analyzing: boolean) => void
}

interface ParsedDataPoint {
  x: number | number[]
  y: number
}

export function ManualInput({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }: ManualInputProps) {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { x: '1.5', y: '10' },
    { x: '2.0', y: '15' },
    { x: '2.5', y: '20' },
    { x: '3.0', y: '25' },
    { x: '3.5', y: '30' },
  ])
  const { backendUrl } = useConfig()

  const addDataPoint = () => setDataPoints([...dataPoints, { x: '', y: '' }])

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
      toast.error("Insufficient Data", { description: "Minimum 2 points required." })
      return null
    }
    const parsedPoints: ParsedDataPoint[] = []
    for (const point of validPoints) {
      const xValue = parseXValue(point.x)
      const yValue = parseFloat(point.y)
      if (isNaN(yValue) || (typeof xValue === 'number' && isNaN(xValue))) {
        toast.error("Invalid Input", { description: "Numbers only." })
        return null
      }
      parsedPoints.push({ x: xValue, y: yValue })
    }
    return parsedPoints
  }

  const handleAnalyze = async () => {
    const parsedData = validateAndParseData()
    if (!parsedData) return

    setIsAnalyzing(true)
    try {
      const response = await axios.post(`${backendUrl}/analyze-manual`, { data_points: parsedData })
      if (response.data.success) {
        onAnalysisComplete(response.data)
        toast.success("Analysis Complete")
      }
    } catch {
      toast.error("Analysis Failed")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-white/0 dark:bg-zinc-950/0 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-900 dark:text-white">
            <Keyboard className="w-5 h-5 text-zinc-500" />
            Manual Entry
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-zinc-50/50 dark:bg-zinc-900/30 backdrop-blur-sm rounded-lg p-4 border border-zinc-200 dark:border-zinc-800 space-y-3 max-h-[400px] overflow-y-auto">
            {dataPoints.map((point, index) => (
            <div key={index} className="flex items-center gap-3 animate-fade-in-up">
                <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">X</span>
                    <Input
                        className="pl-8 font-mono text-sm bg-white/0 dark:bg-zinc-950/0 border-zinc-200 dark:border-zinc-800"
                        placeholder="1.5"
                        value={point.x}
                        onChange={(e) => updateDataPoint(index, 'x', e.target.value)}
                    />
                </div>
                <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">Y</span>
                    <Input
                        className="pl-8 font-mono text-sm bg-white/0 dark:bg-zinc-950/0 border-zinc-200 dark:border-zinc-800"
                        placeholder="10"
                        value={point.y}
                        onChange={(e) => updateDataPoint(index, 'y', e.target.value)}
                    />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDataPoint(index)}
                    disabled={dataPoints.length <= 2}
                    className="h-9 w-9 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                <Trash2 className="h-4 w-4" />
                </Button>
            </div>
            ))}
        </div>

        <div className="flex gap-4">
            <Button variant="outline" onClick={addDataPoint} className="flex-1 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-950/20">
                <Plus className="mr-2 h-4 w-4" /> Add Row
            </Button>
            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="flex-1 !bg-primary/50 dark:!bg-primary/30 backdrop-blur-sm !border-0 !shadow-none">
                {isAnalyzing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Analyze"}
            </Button>
        </div>
      </CardContent>
    </Card>
  )
}