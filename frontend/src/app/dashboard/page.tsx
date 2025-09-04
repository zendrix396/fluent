"use client"

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileUpload, AnalysisResult } from '@/components/file-upload'
import { ManualInput } from '@/components/manual-input'
import { AnalysisResults } from '@/components/analysis-results'
import { ThemeToggle } from '@/components/theme-toggle'
import { Calculator, Upload, PenTool, LogOut, User, Crown } from 'lucide-react'
import config from '../../config.json'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const user = session.user as any
  const remainingRequests = user.isPremium ? 'Unlimited' : Math.max(0, config.limits.freeRequests - (user.requestCount || 0))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Fluent Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Transform your data into mathematical functions
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" />
                <span className="text-foreground">{user.name}</span>
                {user.isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
              </div>
              <div className="text-sm text-muted-foreground">
                Requests: {remainingRequests}
              </div>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
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
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Smart polynomial function generation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Automatic data visualization
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    LaTeX document export
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Real-time predictions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Multi-variable support
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <AnalysisResults result={analysisResult} isAnalyzing={isAnalyzing} />
          </div>
        </div>
      </main>
    </div>
  )
}
