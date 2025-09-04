"use client"

import { useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, Calculator, Loader2, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { useConfig } from '@/hooks/use-config'
import type { AnalysisResult } from '@/app/page'

interface AnalysisResultsProps {
  result: AnalysisResult | null
  isAnalyzing: boolean
}

export function AnalysisResults({ result, isAnalyzing }: AnalysisResultsProps) {
  const [predictionInputs, setPredictionInputs] = useState<{[key: string]: string}>({})
  const [predictionResult, setPredictionResult] = useState<any>(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const { backendUrl } = useConfig()

  const handlePredict = async () => {
    if (!result || !(result as any).model?.feature_names) {
      toast.error("No model available", {
        description: "Please analyze data first.",
      })
      return
    }

    const featureNames = (result as any).model.feature_names as string[]
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
      const response = await axios.post(`${backendUrl}/predict`, {
        x_values: [inputValues],
        coefficients: (result as any).model?.coefficients ?? [],
        intercept: (result as any).model?.intercepts ?? (result as any).model?.intercept ?? 0,
        is_polynomial: (result as any).model?.is_polynomial ?? false,
        degree: (result as any).model?.degree ?? 1,
        multi_output: (result as any).model?.multi_output ?? false,
        feature_names: featureNames,
        model_id: (result as any).model?.model_id,
      })

      if (response.data.success && response.data.predictions.length > 0) {
        setPredictionResult(response.data.predictions[0])
        const targetNames = (result as any).model?.target_names || ['Output']
        
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
    } catch (error: any) {
      console.error('Prediction error:', error)
      toast.error("Prediction failed", {
        description: error.response?.data?.detail || "An error occurred during prediction.",
      })
    } finally {
      setIsPredicting(false)
    }
  }

  const handleDownloadReport = async () => {
    if (!result) return;

    setIsDownloading(true);

    try {
      const formData = new FormData();
      formData.append('data_points', result.data_points.toString());
      formData.append('filename', (result as any).filename || 'uploaded_file');
      
      const model = (result as any).model;
      if (model) {
          formData.append('x_columns', JSON.stringify(model.feature_names || []));
          formData.append('y_columns', JSON.stringify(model.target_names || []));
          formData.append('coefficients', JSON.stringify(model.coefficients || []));
      }
      
      if ((result as any).functions && (result as any).accuracies) {
          formData.append('functions', JSON.stringify((result as any).functions));
          formData.append('accuracies', JSON.stringify((result as any).accuracies));
      } else {
          formData.append('functions', JSON.stringify([(result as any).function || '']));
          formData.append('accuracies', JSON.stringify([(result as any).accuracy || '']));
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
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error("Download failed", {
        description: error.response?.data?.detail || "Failed to generate PDF report.",
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Generated Function(s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.isArray((result as any).functions) ? (
              <div className="space-y-2">
                {(result as any).functions.map((fn: string, idx: number) => (
                  <div key={idx} className="p-3 bg-muted rounded">
                    <p className="font-mono text-sm">{fn}</p>
                    {(result as any).accuracies && (
                      <p className="text-xs text-muted-foreground mt-1">Accuracy: {(result as any).accuracies[idx]}%</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-mono text-lg text-center">{(result as any).function}</p>
                {(result as any).accuracy && (
                  <p className="text-xs text-muted-foreground text-center mt-2">Accuracy: {(result as any).accuracy}</p>
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

      {(result as any).target_visualizations ? (
        <Card>
          <CardHeader>
            <CardTitle>Data Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={(result as any).target_visualizations?.[0]?.target || '0'} className="w-full">
              <TabsList className="flex flex-wrap">
                {(result as any).target_visualizations.map((tv: any) => (
                  <TabsTrigger key={tv.target} value={tv.target} className="mr-1 mb-1">
                    {tv.target}
                  </TabsTrigger>
                ))}
              </TabsList>
              {(result as any).target_visualizations.map((tv: any) => (
                <TabsContent key={tv.target} value={tv.target}>
                  <div className="flex justify-center">
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
        <Card>
          <CardHeader>
            <CardTitle>Data Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <img 
                src={`data:image/png;base64,${result.visualization}`} 
                alt="Data visualization"
                className="max-w-full h-auto rounded-lg border"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="predict" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="predict">Prediction</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>
            
            <TabsContent value="predict" className="space-y-4 pt-4">
              {(result as any).model?.feature_names ? (
                <div className="space-y-4">
                  <Label>Enter values for prediction</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(Array.from(new Set((result as any).model.feature_names.filter((f: string) => !f.includes('^') && !f.includes('*')))) as string[]).map((feature: string) => (
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
                        />
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={handlePredict}
                    disabled={isPredicting}
                    className="w-full"
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
                        const targetName = (result as any).model?.target_names?.[idx] || `Target ${idx + 1}`
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
                className="w-full"
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