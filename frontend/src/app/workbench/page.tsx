"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/file-upload";
import { ManualInput } from "@/components/manual-input";
import { AnalysisResults } from "@/components/analysis-results";
import SpotlightCard from "@/components/spotlight-card";
import { BrainCircuit, FileSpreadsheet, Github, Heart } from "lucide-react";
import type { AnalysisResult } from "@/types";

export default function Workbench() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 transition-colors duration-300 relative overflow-hidden">
      {/* Background Gradient - subtle matching hero */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-400/5 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/8 dark:bg-cyan-400/4 rounded-full blur-[100px]"></div>
      </div>
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 cursor-pointer group">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 group-hover:border-zinc-900 dark:group-hover:border-zinc-500 transition-colors">
                <BrainCircuit className="h-6 w-6 text-zinc-900 dark:text-white" />
              </div>
              <span className="text-xl font-bold tracking-wider text-zinc-900 dark:text-white">FLUENT</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - with proper top padding for navbar */}
      <div className="relative z-10 pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT PANEL: CONFIGURATION */}
        <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Upload Card */}
        <SpotlightCard 
          className="p-6 shadow-sm transition-colors duration-300 w-full mt-2"
          spotlightColor="rgba(59, 130, 246, 0.25)"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-zinc-500" />
              Data Source
            </h2>
          </div>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <TabsTrigger 
                value="upload" 
                className="data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-800 data-[state=active]:text-zinc-900 data-[state=active]:dark:text-white text-zinc-500 dark:text-zinc-400 rounded-md transition-all"
              >
                Upload File
              </TabsTrigger>
              <TabsTrigger 
                value="manual"
                className="data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-800 data-[state=active]:text-zinc-900 data-[state=active]:dark:text-white text-zinc-500 dark:text-zinc-400 rounded-md transition-all"
              >
                Manual Entry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
              <FileUpload
                onAnalysisComplete={setAnalysisResult}
                isAnalyzing={isAnalyzing}
                setIsAnalyzing={setIsAnalyzing}
              />
            </TabsContent>

            <TabsContent value="manual" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
              <ManualInput
                onAnalysisComplete={setAnalysisResult}
                isAnalyzing={isAnalyzing}
                setIsAnalyzing={setIsAnalyzing}
              />
            </TabsContent>
          </Tabs>
        </SpotlightCard>
      </div>

      {/* RIGHT PANEL: VISUALIZATION */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <AnalysisResults result={analysisResult} isAnalyzing={isAnalyzing} />
      </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-12 border-t border-zinc-200 dark:border-zinc-800 w-full pt-6 pb-6 flex flex-col md:flex-row justify-between items-center gap-4 px-4 sm:px-8 text-base font-mono text-zinc-500">
        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
          <p className="uppercase">© 2025 Fluent Analytics.</p>
          <span className="text-zinc-400">•</span>
          <a 
            href="https://github.com/zendrix396/fluent" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <span>Made with</span>
          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          <span>by</span>
          <a 
            href="https://zendrix.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors font-semibold"
          >
            Aditya
          </a>
        </div>
        <p className="uppercase">v2.1.0</p>
      </footer>
    </div>
  );
}