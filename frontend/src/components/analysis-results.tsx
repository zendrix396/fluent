"use client"

import { useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, Calculator, Loader2, TrendingUp, Target, Layers } from 'lucide-react'
import { toast } from 'sonner'
import { useConfig } from '@/hooks/use-config'
import type { AnalysisResult } from '@/types'

interface AnalysisResultsProps {
  result: AnalysisResult | null
  isAnalyzing: boolean
}

interface ModelData {
  feature_names?: string[]
  target_names?: string[]
  coefficients?: number[]
  intercepts?: number[]
  intercept?: number
  is_polynomial?: boolean
  degree?: number
  multi_output?: boolean
  model_id?: string
}

interface ExtendedAnalysisResult {
  function: string
  accuracy: string
  visualization: string
  data_points: number
  x_column?: string
  y_column?: string
  model?: ModelData
  functions?: string[]
  accuracies?: number[]
  filename?: string
  target_visualizations?: Array<{
    target: string
    image: string
  }>
}

interface PredictionResponse {
  success: boolean
  predictions: number[]
}

export function AnalysisResults({ result, isAnalyzing }: AnalysisResultsProps) {
  const [predictionInputs, setPredictionInputs] = useState<{[key: string]: string}>({})
  const [predictionResult, setPredictionResult] = useState<number | number[] | null>(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const { backendUrl } = useConfig()
  const extendedResult = result as ExtendedAnalysisResult
  const accuracyRaw = extendedResult?.accuracy || extendedResult?.accuracies?.[0]
  const accuracyValue = accuracyRaw
    ? `${parseFloat(String(accuracyRaw).replace('%', '')).toFixed(1)}%`
    : '—'
  const modelDegree = extendedResult?.model?.degree ?? 1
  const modelLabel = extendedResult?.model?.is_polynomial ? `Polynomial (deg ${modelDegree})` : 'Linear'
  const targetCount = extendedResult?.model?.target_names?.length || 1

  const handlePredict = async () => {
    const extendedResult = result as ExtendedAnalysisResult
    if (!extendedResult || !extendedResult.model?.feature_names) {
      toast.error("No model available", {
        description: "Please analyze data first.",
      })
      return
    }

    const featureNames = extendedResult.model.feature_names
    const baseFeatures = Array.from(new Set(
      featureNames.filter((f: string) => !f.includes('^') && !f.includes('*'))
    ))
    const inputValues: number[] = []
    
    for (const feature of baseFeatures) {
      const value = predictionInputs[feature]
      if (!value || value.trim() === '') {
        toast.error("Missing input", {
          description: `Please enter a value for ${feature}.`,
        })
        return
      }
      const numValue = parseFloat(value.trim())
      if (isNaN(numValue)) {
        toast.error("Invalid input", {
          description: `Please enter a valid number for ${feature}.`,
        })
        return
      }
      inputValues.push(numValue)
    }

    setIsPredicting(true)

    try {
      const response = await axios.post<PredictionResponse>(`${backendUrl}/predict`, {
        x_values: [inputValues],
        coefficients: extendedResult.model?.coefficients ?? [],
        intercept: extendedResult.model?.intercepts ?? extendedResult.model?.intercept ?? 0,
        is_polynomial: extendedResult.model?.is_polynomial ?? false,
        degree: extendedResult.model?.degree ?? 1,
        multi_output: extendedResult.model?.multi_output ?? false,
        feature_names: featureNames,
        model_id: extendedResult.model?.model_id,
      })

      if (response.data.success && response.data.predictions.length > 0) {
        setPredictionResult(response.data.predictions[0])
        const targetNames = extendedResult.model?.target_names || ['Output']
        
        if (Array.isArray(response.data.predictions[0])) {
          const predictions = response.data.predictions[0]
          let description = 'Predictions: '
          predictions.forEach((pred: number, idx: number) => {
            description += `${targetNames[idx] || `Target ${idx + 1}`}: ${pred.toFixed(4)}`
            if (idx < predictions.length - 1) description += ', '
          })
          toast.success("Prediction complete", {
            description,
          })
        } else {
          toast.success("Prediction complete", {
            description: `${targetNames[0] || 'Predicted'}: ${response.data.predictions[0].toFixed(4)}`,
          })
        }
      }
    } catch (error: unknown) {
      console.error('Prediction error:', error)
      const errorMessage = error instanceof Error ? error.message : "An error occurred during prediction."
      toast.error("Prediction failed", {
        description: errorMessage,
      })
    } finally {
      setIsPredicting(false)
    }
  }

  const handleDownloadReport = async () => {
    if (!result) return;

    const extendedResult = result as ExtendedAnalysisResult
    setIsDownloading(true);

    try {
      const formData = new FormData();
      formData.append('data_points', result.data_points.toString());
      formData.append('filename', extendedResult.filename || 'uploaded_file');
      
      const model = extendedResult.model;
      if (model) {
          formData.append('x_columns', JSON.stringify(model.feature_names || []));
          formData.append('y_columns', JSON.stringify(model.target_names || []));
          formData.append('coefficients', JSON.stringify(model.coefficients || []));
      }
      
      if (extendedResult.functions && extendedResult.accuracies) {
          formData.append('functions', JSON.stringify(extendedResult.functions));
          formData.append('accuracies', JSON.stringify(extendedResult.accuracies));
      } else {
          formData.append('functions', JSON.stringify([extendedResult.function || '']));
          formData.append('accuracies', JSON.stringify([extendedResult.accuracy || '']));
      }

      const response = await axios.post(`${backendUrl}/generate-pdf`, formData);

      if (response.data?.job_id) {
        const { job_id, filename } = response.data;
        toast.info("Report Generation Started", {
          description: "Your PDF report will be downloaded shortly.",
        });
        
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = `${backendUrl}/download-report/${job_id}`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 1000);

      } else {
        throw new Error('Failed to start report generation');
      }
    } catch (error: unknown) {
      console.error('Download error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate PDF report."
      toast.error("Download failed", {
        description: errorMessage,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing your data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!result) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-foreground">No Analysis Yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Upload a file or input data manually to see your mathematical function
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-border/70 bg-card/80">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Accuracy
              </p>
              <p className="text-lg font-semibold text-foreground">{accuracyValue}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/80">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Data points
              </p>
              <p className="text-lg font-semibold text-foreground">
                {result.data_points}
                <span className="ml-2 text-xs text-muted-foreground">
                  {modelLabel} · {targetCount} target{targetCount > 1 ? 's' : ''}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl">
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
          <CardTitle className="flex items-center gap-2 text-zinc-900 dark:text-white">
            <Calculator className="h-5 w-5" />
            Generated Function(s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.isArray(extendedResult.functions) ? (
              <div className="space-y-2">
                {extendedResult.functions.map((fn: string, idx: number) => (
                  <div key={idx} className="p-3 bg-muted rounded">
                    <p className="font-mono text-sm">{fn}</p>
                    {extendedResult.accuracies && (
                      <p className="text-xs text-muted-foreground mt-1">Accuracy: {extendedResult.accuracies[idx]}%</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-mono text-lg text-center">{extendedResult.function}</p>
                {extendedResult.accuracy && (
                  <p className="text-xs text-muted-foreground text-center mt-2">Accuracy: {extendedResult.accuracy}</p>
                )}
              </div>
            )}
            <div className="text-sm">
              <span className="text-muted-foreground">Data Points:</span>
              <span className="ml-2 font-semibold">{result.data_points}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {extendedResult.target_visualizations ? (
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl">
          <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
            <CardTitle className="text-zinc-900 dark:text-white">Data Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={extendedResult.target_visualizations?.[0]?.target || '0'} className="w-full">
              <TabsList className="flex flex-wrap">
                {extendedResult.target_visualizations.map((tv) => (
                  <TabsTrigger key={tv.target} value={tv.target} className="mr-1 mb-1">
                    {tv.target}
                  </TabsTrigger>
                ))}
              </TabsList>
              {extendedResult.target_visualizations.map((tv) => (
                <TabsContent key={tv.target} value={tv.target}>
                  <div className="flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:image/png;base64,${tv.image}`}
                      alt={`Visualization for ${tv.target}`}
                      className="max-w-full h-auto rounded-lg border"
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      ) : result.visualization && (
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl">
          <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
            <CardTitle className="text-zinc-900 dark:text-white">Data Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`data:image/png;base64,${result.visualization}`} 
                alt="Data visualization"
                className="max-w-full h-auto rounded-lg border"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl">
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
          <CardTitle className="text-zinc-900 dark:text-white">Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="predict" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <TabsTrigger value="predict" className="data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-800 data-[state=active]:text-zinc-900 data-[state=active]:dark:text-white text-zinc-500 dark:text-zinc-400 rounded-md transition-all">Prediction</TabsTrigger>
              <TabsTrigger value="export" className="data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-800 data-[state=active]:text-zinc-900 data-[state=active]:dark:text-white text-zinc-500 dark:text-zinc-400 rounded-md transition-all">Export</TabsTrigger>
            </TabsList>
            
            <TabsContent value="predict" className="space-y-4 pt-4">
              {extendedResult.model?.feature_names ? (
                <div className="space-y-4">
                  <Label>Enter values for prediction</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(Array.from(new Set(extendedResult.model.feature_names.filter((f: string) => !f.includes('^') && !f.includes('*')))) as string[]).map((feature: string) => (
                      <div key={feature} className="space-y-1">
                        <Label htmlFor={`input-${feature}`} className="text-xs">
                          {feature}
                        </Label>
                        <Input
                          id={`input-${feature}`}
                          placeholder={`Enter ${feature}`}
                          value={predictionInputs[feature] || ''}
                          onChange={(e) => setPredictionInputs(prev => ({
                            ...prev,
                            [feature]: e.target.value
                          }))}
                          className="bg-white/0 dark:bg-zinc-950/0 backdrop-blur-sm border-zinc-200 dark:border-zinc-800"
                        />
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={handlePredict}
                    disabled={isPredicting}
                    className="w-full !bg-primary/50 dark:!bg-primary/30 backdrop-blur-sm !border-0 !shadow-none hover:!bg-primary/60 dark:hover:!bg-primary/40"
                  >
                    {isPredicting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Predicting...
                      </>
                    ) : (
                      'Predict'
                    )}
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No model available for prediction.</p>
              )}
              
              {predictionResult !== null && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Prediction Results:</p>
                  {Array.isArray(predictionResult) ? (
                    <div className="space-y-1">
                      {predictionResult.map((pred: number, idx: number) => {
                        const targetName = extendedResult.model?.target_names?.[idx] || `Target ${idx + 1}`
                        return (
                          <p key={idx} className="font-mono text-sm">
                            <span className="text-muted-foreground">{targetName}:</span> {pred.toFixed(4)}
                          </p>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="font-mono text-lg font-semibold">
                      {predictionResult.toFixed(4)}
                    </p>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="export" className="space-y-4 pt-4">
              <Button 
                onClick={handleDownloadReport}
                disabled={isDownloading}
                className="w-full border-2 border-transparent"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF Report
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Download a comprehensive PDF document with your analysis results
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}