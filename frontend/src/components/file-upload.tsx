"use client"

import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Upload, FileText, CheckCircle2, Loader2, Database, AlertCircle, X, Play } from 'lucide-react'
import { toast } from 'sonner'
import { useConfig } from '@/hooks/use-config'
import type { AnalysisResult } from '@/types'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

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
  head: unknown[]
}

export function FileUpload({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [selectedXColumns, setSelectedXColumns] = useState<string[]>([])
  const [selectedYColumns, setSelectedYColumns] = useState<string[]>([])
  const [polyDegree, setPolyDegree] = useState<number>(1)
  const { backendUrl } = useConfig()
  
  const settingsRef = useRef<HTMLDivElement>(null)

  // GSAP animation for settings reveal
  useGSAP(() => {
    if (fileInfo && settingsRef.current) {
      gsap.fromTo(settingsRef.current, 
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out' }
      )
    }
  }, [fileInfo])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const validTypes = ['.csv', '.xlsx', '.xls', '.json']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!validTypes.includes(fileExtension)) {
      toast.error("Invalid file type", {
        description: "Please upload a CSV, XLSX, or JSON file.",
      })
      return
    }

    setUploadedFile(file)
    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(`${backendUrl}/upload-file`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.success) {
        setFileInfo(response.data.data)
        toast.success("File uploaded")
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file"
      toast.error("Upload failed", { description: errorMessage })
      setUploadedFile(null)
    } finally {
      setIsAnalyzing(false)
    }
  }, [setIsAnalyzing, backendUrl])

  const loadExampleData = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/Cricket_ODI_DataSet.csv')
      const csvText = await response.text()
      const csvBlob = new Blob([csvText], { type: 'text/csv' })
      const csvFile = new File([csvBlob], 'Cricket_ODI_DataSet.csv', { type: 'text/csv' })
      
      const formData = new FormData()
      formData.append('file', csvFile)
      const uploadResponse = await axios.post(`${backendUrl}/upload-file`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (uploadResponse.data.success) {
        setUploadedFile(csvFile)
        setFileInfo(uploadResponse.data.data)
        setSelectedXColumns([])
        setSelectedYColumns([])
        toast.success("Example Data Loaded")
      }
    } catch {
      toast.error("Failed to load example data")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleColumn = (column: string, type: 'x' | 'y') => {
    if (type === 'x') {
      setSelectedXColumns(prev => 
        prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
      )
    } else {
      setSelectedYColumns(prev => 
        prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
      )
    }
  }

  const handleAnalyze = async () => {
    if (!uploadedFile || selectedXColumns.length === 0 || selectedYColumns.length === 0) {
      toast.error("Selection Required", { description: "Please select X and Y columns." })
      return
    }

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)
      formData.append('x_columns', JSON.stringify(selectedXColumns))
      formData.append('y_columns', JSON.stringify(selectedYColumns))
      formData.append('poly_degree', String(polyDegree))

      const response = await axios.post(`${backendUrl}/analyze-data`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

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

  const reset = () => {
    setUploadedFile(null)
    setFileInfo(null)
    setSelectedXColumns([])
    setSelectedYColumns([])
    setPolyDegree(1)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json'],
    },
    multiple: false,
  })

  // Column Selector Component
  const ColumnSelector = ({ title, selected, onToggle, columns, otherSelected }: { 
    title: string
    selected: string[]
    onToggle: (col: string) => void
    columns: string[]
    otherSelected: string[]
  }) => (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-semibold uppercase tracking-wider text-zinc-500">{title}</Label>
          <span className="text-xs text-zinc-500">{selected.length} selected</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              columns.forEach(col => {
                if (!selected.includes(col)) onToggle(col)
              })
            }}
            className="h-7 px-3 text-xs border-zinc-300 dark:border-zinc-700 hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-950/20"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const remaining = columns.filter(col => !otherSelected.includes(col))
              remaining.forEach(col => {
                if (!selected.includes(col)) onToggle(col)
              })
            }}
            className="h-7 px-3 text-xs border-zinc-300 dark:border-zinc-700 hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-950/20"
          >
            Select Remaining
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              selected.forEach(col => onToggle(col))
            }}
            className="h-7 px-3 text-xs border-zinc-300 dark:border-zinc-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            Clear
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
          {columns.map(col => {
            const isSelected = selected.includes(col);
            return (
              <div 
                key={col}
                onClick={() => onToggle(col)}
                className={`
                  cursor-pointer text-xs p-2 rounded-md border-2 transition-all duration-200 flex items-center justify-between
                  ${isSelected 
                    ? 'border-primary bg-blue-50 dark:bg-blue-950/30 text-zinc-900 dark:text-white font-medium shadow-sm' 
                    : 'border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm text-zinc-500 hover:border-primary/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
                  }
                `}
              >
                <span className="truncate mr-2">{col}</span>
                {isSelected && <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />}
              </div>
            )
          })}
        </div>
      </div>
  )

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      
      {/* Upload Zone */}
      {!fileInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            {...getRootProps()}
            className={`
              relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed p-10 text-center transition-all duration-300 bg-transparent
              ${isDragActive ? 'border-primary scale-[0.99]' : 'border-zinc-300 dark:border-zinc-700 hover:border-primary'}
            `}
          >
            <input {...getInputProps()} />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-700 mb-4 group-hover:scale-110 group-hover:border-primary transition-all duration-300">
                <Upload className="h-6 w-6 text-zinc-900 dark:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Upload Dataset</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Drag & drop CSV, JSON or Excel</p>
            </div>
          </div>

          {/* Example Data Card */}
          <div 
            onClick={loadExampleData}
            className="relative group cursor-pointer overflow-hidden rounded-xl border-2 border-zinc-300 dark:border-zinc-700 p-10 text-center transition-all duration-300 bg-transparent hover:border-primary hover:shadow-lg"
          >
             <div className="relative z-10 flex flex-col items-center">
               <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-700 mb-4 group-hover:scale-110 group-hover:border-primary transition-all duration-300">
                 <Database className="h-6 w-6 text-zinc-900 dark:text-white" />
               </div>
               <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Use Example Data</h3>
               <p className="text-sm text-zinc-500 dark:text-zinc-400">Test with Cricket ODI dataset</p>
             </div>
             {isAnalyzing && (
               <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center">
                 <Loader2 className="animate-spin text-primary" />
               </div>
             )}
          </div>
        </div>
      )}

      {/* File Loaded View */}
      {fileInfo && (
        <Card className="border-zinc-200 dark:border-zinc-800 bg-blue-50/30 dark:bg-blue-950/20 overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-700">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">{fileInfo.filename}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{fileInfo.shape[0]} rows • {fileInfo.shape[1]} columns</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={reset} className="text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
              <X className="w-4 h-4 mr-2" /> Change File
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Configuration Panel */}
      {fileInfo && (
        <div ref={settingsRef} className="overflow-hidden">
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white/0 dark:bg-zinc-950/0 backdrop-blur-xl">
            <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 bg-transparent backdrop-blur-sm pb-4">
              <CardTitle className="text-base font-medium flex items-center gap-2 text-zinc-900 dark:text-white">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Configure Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              
              {/* Regression Type */}
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Model Type</Label>
                <div className="flex gap-3">
                  {[1, 2].map((degree) => (
                    <div
                      key={degree}
                      onClick={() => setPolyDegree(degree)}
                      className={`
                        flex-1 cursor-pointer p-4 rounded-lg border-2 text-center transition-all duration-200
                        ${polyDegree === degree 
                          ? 'border-primary bg-blue-50 dark:bg-blue-950/30 text-primary font-semibold shadow-md' 
                          : 'border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm text-zinc-500 hover:border-primary/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
                        }
                      `}
                    >
                      <div className="text-sm">{degree === 1 ? "Linear Regression" : "Polynomial (deg 2)"}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Columns Grid */}
              <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                 <ColumnSelector 
                    title="X Columns (Features)" 
                    columns={fileInfo.numeric_columns} 
                    selected={selectedXColumns} 
                    onToggle={(col) => toggleColumn(col, 'x')}
                    otherSelected={selectedYColumns}
                 />
                 <ColumnSelector 
                    title="Y Columns (Targets)" 
                    columns={fileInfo.numeric_columns} 
                    selected={selectedYColumns} 
                    onToggle={(col) => toggleColumn(col, 'y')}
                    otherSelected={selectedXColumns}
                 />
              </div>

              {/* Analyze Button */}
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing || selectedXColumns.length === 0 || selectedYColumns.length === 0} 
                  className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" /> Run Analysis
                    </>
                  )}
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      )}

      {fileInfo && fileInfo.numeric_columns.length < 2 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">
                At least 2 numeric columns are required for analysis. Found {fileInfo.numeric_columns.length} numeric column(s).
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}