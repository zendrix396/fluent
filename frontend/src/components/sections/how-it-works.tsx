"use client";

import React from 'react';
import Image from 'next/image';
import { FileSpreadsheet, FileText, Database, BarChart3, Calculator, TrendingUp, FileDown, Download, MoreHorizontal } from '@/icons/lucide';

const ExcelIcon = ({ className }: { className?: string }) => (
  <FileSpreadsheet className={className} />
);

const CSVIcon = ({ className }: { className?: string }) => (
  <FileText className={className} />
);

const JSONIcon = ({ className }: { className?: string }) => (
  <Database className={className} />
);

const ManualIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Badge = ({ iconUrl, text }: { iconUrl: string; text: string }) => (
  <div className="flex items-center gap-x-2 rounded-md border border-white/5 bg-white/5 px-2.5 py-1.5 backdrop-blur-[5px]">
    <Image src={iconUrl} alt={text} width={16} height={16} />
    <p className="text-sm font-medium leading-none tracking-tight text-foreground">{text}</p>
  </div>
);

const DataSourceCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex items-center gap-x-3 rounded-[5px] border border-[#2A2F3E] bg-[#1A1F2E]/50 p-2.5">
    <div className="flex size-9 shrink-0 items-center justify-center rounded-[5px] border border-[#2A2F3E] bg-[#0F1419]/50 text-text-secondary">
      {icon}
    </div>
    <div className="flex flex-col gap-y-1">
      <p className="text-[15px] font-medium leading-none tracking-tight text-foreground">{title}</p>
      <p className="text-[13px] leading-none tracking-tight text-text-secondary">{description}</p>
    </div>
  </div>
);

const AnalysisCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
    <div className="pointer-events-none relative flex flex-col gap-y-2.5 rounded-lg border border-[#202637] bg-gradient-to-b from-[#1C2030] to-[#121621] p-3 text-left">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-card text-text-secondary">{icon}</div>
                <p className="text-[15px] font-medium leading-none tracking-tight text-foreground">{title}</p>
            </div>
            <MoreHorizontal className="size-4 text-text-secondary" />
        </div>
        <p className="text-[13px] tracking-tight text-text-secondary">{description}</p>
    </div>
);

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-background pt-32 pb-24 lg:pt-24 lg:pb-20 md:pt-20 md:pb-16 sm:pt-16 sm:pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[48px] font-semibold leading-snug tracking-tighter text-center text-foreground md:text-[36px] sm:text-[28px]">
          How Fluent transforms your data:
        </h2>

        <div className="relative mt-20 lg:mt-16 md:mt-12 sm:mt-10">
          <div className="flex flex-col gap-y-20 lg:gap-y-16 md:gap-y-12 sm:gap-y-10">
            {/* Panel 1 - Upload Data */}
            <div className="flex items-start gap-x-12 px-8 lg:px-0 md:flex-col md:items-stretch md:gap-y-8">
              <div className="sticky top-40 flex h-min w-[352px] shrink-0 flex-col gap-y-3 rounded-xl border border-[#202637] bg-gradient-to-b from-[#171c2a] to-[#10141e] p-4 shadow-[0_12px_24px_-4px_rgba(0,0,0,0.2),_0_8px_16px_-4px_rgba(0,0,0,0.2)] md:w-full">
                <DataSourceCard icon={<ExcelIcon />} title="Excel Files" description="Upload .xlsx and .xls files" />
                <DataSourceCard icon={<CSVIcon />} title="CSV Data" description="Import comma-separated values" />
                <DataSourceCard icon={<JSONIcon />} title="JSON Format" description="Structured data import" />
                <DataSourceCard icon={<ManualIcon />} title="Manual Input" description="Enter arrays and data points" />
              </div>
              <div className="flex-1 pt-12 lg:pt-10 md:pt-0">
                <div className="flex gap-x-3">
                  <Badge iconUrl="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/47c54e52c851c21b0f530f5741e6baed-15.svg" text="Multiple Formats" />
                  <Badge iconUrl="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/1ab25a8e1a9939eb600016985765d1b3-16.svg" text="Flexible Input" />
                </div>
                <h3 className="mt-8 text-[32px] font-medium leading-tight tracking-tight text-foreground lg:mt-6 lg:text-[28px] md:mt-5 md:text-[24px]">
                  Upload your data in any format
                </h3>
                <p className="mt-4 text-[18px] leading-relaxed tracking-tight text-text-secondary md:mt-3 md:text-base">
                  Fluent accepts Excel spreadsheets, CSV files, JSON data, or manual array input. No matter how your data is structured, we&apos;ll process it seamlessly.
                </p>
              </div>
            </div>

            {/* Panel 2 - Analysis */}
            <div className="flex items-start gap-x-12 px-8 lg:px-0 md:flex-col md:items-stretch md:gap-y-8">
              <div className="sticky top-40 flex h-min w-[352px] shrink-0 justify-center rounded-xl border border-[#202637] bg-gradient-to-b from-[#171c2a] to-[#10141e] px-3 pt-3 pb-8 shadow-[0_12px_24px_-4px_rgba(0,0,0,0.2),_0_8px_16px_-4px_rgba(0,0,0,0.2)] md:w-full">
                <div className="relative w-full">
                  <button className="relative flex w-full items-center justify-center gap-x-2.5 rounded-md bg-white p-2.5 text-[15px] font-medium tracking-tight text-black">
                    <BarChart3 className="h-4 w-4" />
                    Analyze Data
                  </button>
                  <div className="absolute top-full flex w-full flex-col gap-y-6 pt-6">
                    <AnalysisCard icon={<BarChart3 />} title="Data Visualization" description="Generate charts, graphs, and plots auto..." />
                    <AnalysisCard icon={<Calculator />} title="Function Fitting" description="Discover polynomial functions like 3x²+5..." />
                    <AnalysisCard icon={<TrendingUp />} title="Pattern Recognition" description="Identify mathematical relationships in..." />
                  </div>
                  <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-t from-background via-transparent to-transparent"></div>
                </div>
              </div>
              <div className="flex-1 pt-12 lg:pt-10 md:pt-0">
                <div className="flex flex-wrap gap-3">
                  <Badge iconUrl="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/85c3404cbbfb456b6d06f7021fc04209-17.svg" text="Auto-Analysis" />
                  <Badge iconUrl="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/edb6c0845e8286b730f3cc503f479a2c-18.svg" text="High Accuracy" />
                  <Badge iconUrl="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/64a9823923a6ca940aa3c409c2917d75-19.svg" text="Mathematical" />
                </div>
                <h3 className="mt-8 text-[32px] font-medium leading-tight tracking-tight text-foreground lg:mt-6 lg:text-[28px] md:mt-5 md:text-[24px]">
                  Automatic analysis and visualization
                </h3>
                <p className="mt-4 text-[18px] leading-relaxed tracking-tight text-text-secondary md:mt-3 md:text-base">
                  Fluent automatically generates graphs and discovers mathematical functions that map your data. From simple linear relationships to complex polynomials - all with high accuracy.
                </p>
              </div>
            </div>

            {/* Panel 3 - Export */}
            <div className="flex items-start gap-x-12 px-8 lg:px-0 md:flex-col md:items-stretch md:gap-y-8">
              <div className="relative w-[352px] shrink-0 md:w-full">
                <div className="sticky top-40 flex h-min flex-col gap-y-2 rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-lg">
                  <div className="flex gap-x-3">
                    <div className="size-8 shrink-0 rounded-full bg-gray-700 flex items-center justify-center">
                      <FileDown className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[15px] font-medium leading-normal tracking-tight text-foreground">Analysis Complete <span className="text-text-muted">Now</span></p>
                      <p className="mt-1 text-[15px] leading-normal tracking-tight text-text-secondary">
                        Your mathematical function: <span className="text-primary font-mono">f(x) = 3x² + 5x + 7</span>
                      </p>
                    </div>
                  </div>
                  <div className="ml-5 mt-2 rounded-r-lg rounded-bl-lg border border-border bg-card p-3">
                    <div className="flex items-center gap-x-2 text-sm">
                      <div className="flex size-7 items-center justify-center rounded-full bg-foreground">
                        <Calculator className="h-4 w-4 text-background" />
                      </div>
                      <p className="font-medium leading-none tracking-tight text-foreground">Fluent <span className="font-normal text-text-muted">AI</span></p>
                      <p className="text-text-muted">Now</p>
                    </div>
                    <p className="mt-2.5 text-[15px] leading-normal tracking-tight text-text-secondary">
                      LaTeX document ready with graphs and function derivations. R² = 0.98 accuracy.
                    </p>
                  </div>
                  <div className="mt-3.5 rounded-lg border border-border bg-background p-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[15px] text-text-secondary">Ready to download</p>
                      <button className="flex items-center gap-x-2 rounded-md bg-foreground px-3 py-1.5">
                        <Download className="h-3.5 w-3.5 text-background" />
                        <span className="text-[14px] font-medium text-background">LaTeX</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 pt-12 lg:pt-10 md:pt-0">
                <div className="flex gap-x-3">
                  <Badge iconUrl="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/b8e83717a987df1e58c53185cb94dc99-20.svg" text="LaTeX Export" />
                  <Badge iconUrl="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/6db10665a09b2dfd743b8bd40fbab4a0-21.svg" text="Predictions" />
                </div>
                <h3 className="mt-8 text-[32px] font-medium leading-tight tracking-tight text-foreground lg:mt-6 lg:text-[28px] md:mt-5 md:text-[24px]">
                  Export and predict with precision
                </h3>
                <p className="mt-4 text-[18px] leading-relaxed tracking-tight text-text-secondary md:mt-3 md:text-base">
                  Download publication-ready LaTeX documents with embedded graphs and mathematical formulations. Input new data points for instant predictions using your custom functions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;