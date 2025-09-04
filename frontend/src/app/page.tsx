"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUpload } from '@/components/file-upload'
import { ManualInput } from '@/components/manual-input'
import { AnalysisResults } from '@/components/analysis-results'
import { ThemeToggle } from '@/components/theme-toggle'
import { Calculator, Upload, PenTool } from 'lucide-react'

export interface AnalysisResult {
  function: string
  accuracy: string
  visualization: string
  data_points: number
  x_column?: string
  y_column?: string
}

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Fluent</h1>
                <p className="text-sm text-muted-foreground">
                  Transform your data into mathematical functions
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Input</CardTitle>
                <CardDescription>
                  Upload your data file or input data points manually to generate mathematical functions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      File Upload
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="flex items-center gap-2">
                      <PenTool className="h-4 w-4" />
                      Manual Input
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="mt-4">
                    <FileUpload 
                      onAnalysisComplete={setAnalysisResult}
                      isAnalyzing={isAnalyzing}
                      setIsAnalyzing={setIsAnalyzing}
                    />
                  </TabsContent>
                  
                  <TabsContent value="manual" className="mt-4">
                    <ManualInput 
                      onAnalysisComplete={setAnalysisResult}
                      isAnalyzing={isAnalyzing}
                      setIsAnalyzing={setIsAnalyzing}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Support for CSV, XLSX, and JSON files</li>
                  <li>• Automatic polynomial degree selection</li>
                  <li>• High-accuracy function generation</li>
                  <li>• Interactive data visualization</li>
                  <li>• LaTeX document export</li>
                  <li>• Prediction capabilities</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            <AnalysisResults 
              result={analysisResult}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Fluent - Powered by scikit-learn and advanced polynomial regression</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
