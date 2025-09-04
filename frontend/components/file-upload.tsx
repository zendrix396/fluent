"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useConfig } from '@/hooks/use-config'
import type { AnalysisResult } from '@/app/page'

interface FileUploadProps {
  onAnalysisComplete: (result: AnalysisResult) => void
  isAnalyzing: boolean
  setIsAnalyzing: (analyzing: boolean) => void
}

interface FileInfo {
  filename: string
  shape: [number, number]
  columns: string[]
  numeric_columns: string[]
  head: any[]
}

export function FileUpload({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [selectedXColumns, setSelectedXColumns] = useState<string[]>([])
  const [selectedYColumns, setSelectedYColumns] = useState<string[]>([])
  const [polyDegree, setPolyDegree] = useState<number>(1)
  const { toast } = useToast()
  const { backendUrl, loading: configLoading } = useConfig()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file type
    const validTypes = ['.csv', '.xlsx', '.xls', '.json']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!validTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV, XLSX, or JSON file.",
        variant: "destructive",
      })
      return
    }

    setUploadedFile(file)
    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(`${backendUrl}/upload-file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        setFileInfo(response.data.data)
        toast({
          title: "File uploaded successfully",
          description: `Loaded ${response.data.data.shape[0]} rows with ${response.data.data.shape[1]} columns.`,
        })
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: error.response?.data?.detail || "Failed to upload file. Please try again.",
        variant: "destructive",
      })
      setUploadedFile(null)
    } finally {
      setIsAnalyzing(false)
    }
  }, [toast, setIsAnalyzing, backendUrl])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json'],
    },
    multiple: false,
  })

  const handleAnalyze = async () => {
    if (!uploadedFile || selectedXColumns.length === 0 || selectedYColumns.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select at least one X column and one Y column.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)
      formData.append('x_columns', JSON.stringify(selectedXColumns))
      formData.append('y_columns', JSON.stringify(selectedYColumns))
      formData.append('poly_degree', String(polyDegree || 1))

      const response = await axios.post(`${backendUrl}/analyze-data`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        onAnalysisComplete(response.data)
        toast({
          title: "Analysis complete",
          description: `Generated the required function(s).`,
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
      {/* File Drop Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-primary">Drop the file here...</p>
            ) : (
              <div>
                <p className="text-foreground font-medium mb-2">
                  Drag & drop your data file here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports CSV, XLSX, and JSON files
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Info */}
      {uploadedFile && fileInfo && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{fileInfo.filename}</p>
                <p className="text-sm text-muted-foreground">
                  {fileInfo.shape[0]} rows × {fileInfo.shape[1]} columns
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Numeric columns: {fileInfo.numeric_columns.join(', ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Column Selection with checkboxes */}
      {fileInfo && fileInfo.numeric_columns.length >= 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label>Regression:</Label>
              <Button variant={polyDegree === 1 ? 'secondary' : 'ghost'} size="sm" onClick={() => setPolyDegree(1)}>Linear</Button>
              <Button variant={polyDegree > 1 ? 'secondary' : 'ghost'} size="sm" onClick={() => setPolyDegree(2)}>Polynomial (deg 2)</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 md:pr-4">
              <div className="flex items-center justify-between">
                <Label>X Columns (Inputs)</Label>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setSelectedXColumns(fileInfo.numeric_columns)}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => {
                      const remaining = fileInfo.numeric_columns.filter(
                        col => !selectedYColumns.includes(col)
                      )
                      setSelectedXColumns(remaining)
                    }}
                  >
                    Select Remaining
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setSelectedXColumns([])}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="max-h-80 overflow-auto rounded-md border p-3 space-y-2">
                {fileInfo.numeric_columns.map((column) => (
                  <label key={column} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={selectedXColumns.includes(column)}
                      onCheckedChange={(checked) => {
                        setSelectedXColumns((prev) =>
                          checked ? [...prev, column] : prev.filter((c) => c !== column)
                        )
                      }}
                    />
                    <span className="truncate">{column}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3 md:pl-4">
              <div className="flex items-center justify-between">
                <Label>Y Columns (Targets)</Label>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setSelectedYColumns(fileInfo.numeric_columns)}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => {
                      const remaining = fileInfo.numeric_columns.filter(
                        col => !selectedXColumns.includes(col)
                      )
                      setSelectedYColumns(remaining)
                    }}
                  >
                    Select Remaining
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setSelectedYColumns([])}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="max-h-80 overflow-auto rounded-md border p-3 space-y-2">
                {fileInfo.numeric_columns.map((column) => (
                  <label key={column} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={selectedYColumns.includes(column)}
                      onCheckedChange={(checked) => {
                        setSelectedYColumns((prev) =>
                          checked ? [...prev, column] : prev.filter((c) => c !== column)
                        )
                      }}
                    />
                    <span className="truncate">{column}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning for insufficient numeric columns */}
      {fileInfo && fileInfo.numeric_columns.length < 2 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">
                At least 2 numeric columns are required for analysis. 
                Found {fileInfo.numeric_columns.length} numeric column(s).
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analyze Button */}
      {fileInfo && selectedXColumns.length > 0 && selectedYColumns.length > 0 && (
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Data...
            </>
          ) : (
            'Analyze Data'
          )}
        </Button>
      )}
    </div>
  )
}
