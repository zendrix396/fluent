"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Github, Heart } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";
import { Button } from "@/components/ui/button";
import MagicBento from "@/components/magic-bento";

gsap.registerPlugin(ScrollTrigger);

// --- Navbar Component ---
const Navbar = () => {
  
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center rounded-sm transition-colors group-hover:scale-105">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <span className="font-bold tracking-tighter text-xl text-zinc-900 dark:text-white">FLUENT</span>
      </Link>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-zinc-500">
          <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Capabilities</a>
          <a href="#process" className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Process</a>
        </div>
        
        <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 hidden md:block"></div>

        <Link href="/workbench" className="cursor-pointer">
          <Button variant="default" className="rounded-full font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
            Launch App
          </Button>
        </Link>
      </div>
    </nav>
  );
};


export default function Home() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero Text Stagger
    const tl = gsap.timeline();
    tl.from(".hero-line", { y: "110%", stagger: 0.1, duration: 1.2, ease: "power4.out" })
      .from(".hero-sub", { opacity: 0, y: 20, duration: 1 }, "-=0.8")
      .from(".hero-ui-container", { 
        y: 100, 
        opacity: 0, 
        rotationX: 10,
        duration: 1.5, 
        ease: "power3.out" 
      }, "-=1");

    // Floating animation for Hero UI
    gsap.to(".hero-ui-container", {
      y: "-=20",
      rotationX: 5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.5
    });

    // Process Section Pinning
    if (typeof window !== "undefined" && window.innerWidth > 768) {
      ScrollTrigger.create({
        trigger: ".process-section",
        start: "top top",
        end: "bottom bottom",
        pin: ".process-left",
        pinSpacing: false
      });
    }
  }, { scope: container });

  return (
    <ReactLenis root>
      <div ref={container} className="bg-background min-h-screen text-foreground selection:bg-foreground selection:text-background transition-colors duration-300">
        <Navbar />

        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col justify-center items-center pt-32 px-6 overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
          
          {/* Gradient Effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-400/5 rounded-full blur-[100px]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/8 dark:bg-cyan-400/4 rounded-full blur-[100px]"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center mb-16">
            <div className="overflow-hidden mb-2">
              <h1 className="hero-line text-[12vw] md:text-[8rem] font-bold leading-[0.85] tracking-tighter text-zinc-900 dark:text-white">
                DATA TO
              </h1>
            </div>
            <div className="overflow-hidden mb-8">
              <h1 className="hero-line text-[12vw] md:text-[8rem] font-bold leading-[0.85] tracking-tighter text-zinc-500 dark:text-zinc-400">
                EQUATION
              </h1>
            </div>
            
            <p className="hero-sub text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light">
              Stop guessing. Upload your dataset and let our engine derive the precise mathematical function that defines it in seconds.
            </p>

            <div className="hero-sub flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/workbench" className="cursor-pointer">
                 <Button size="lg" className="rounded-full px-8 h-14 text-lg font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                    Start Analyzing <ArrowRight className="ml-2 w-5 h-5" />
                 </Button>
              </Link>
              <a href="#features" className="cursor-pointer">
                <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg cursor-pointer border-zinc-300 dark:border-zinc-700">
                    Explore Docs
                </Button>
              </a>
            </div>
          </div>

          {/* UI Mockup - 3D Perspective Container */}
          <div className="w-full max-w-5xl relative px-4 perspective-2000">
            {/* Glow Behind */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-cyan-400/10 rounded-2xl blur-xl opacity-50"></div>
            
            <div className="hero-ui-container relative transform-style-3d origin-center border border-border bg-card backdrop-blur-xl rounded-t-2xl overflow-hidden shadow-2xl">
              {/* Fake Window Header */}
              <div className="h-10 border-b border-border flex items-center px-4 gap-2 bg-gradient-to-r from-card to-muted/50">
                <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500/50"></div>
                <div className="ml-4 font-mono text-[10px] text-muted-foreground">fluent</div>
              </div>
              
              <div className="p-8 grid md:grid-cols-3 gap-8 bg-gradient-to-br from-card to-muted/30">
                {/* Mock Code */}
                <div className="font-mono text-xs space-y-2">
                   <p><span className="text-blue-600 dark:text-blue-400 font-semibold">const</span> <span className="text-foreground">data</span> = [</p>
                   <p className="pl-4 text-foreground/80">{`{ x: 1, y: 2.4 },`}</p>
                   <p className="pl-4 text-foreground/80">{`{ x: 2, y: 8.9 },`}</p>
                   <p className="pl-4 text-foreground/80">{`{ x: 3, y: 18.1 }`}</p>
                   <p className="text-foreground">]</p>
                   <p className="text-emerald-600 dark:text-emerald-400 mt-4 italic">Analyzing regression...</p>
                </div>
                {/* Mock Graph Area */}
                <div className="md:col-span-2 h-48 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-cyan-50/50 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-cyan-950/30 rounded border border-border relative overflow-hidden">
                  <svg className="w-full h-full absolute bottom-0" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5" />
                        <stop offset="50%" stopColor="rgb(168, 85, 247)" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="rgb(6, 182, 212)" />
                      </linearGradient>
                    </defs>
                    <path d="M0,190 Q150,180 300,50 T600,20" fill="none" stroke="url(#lineGradient)" strokeWidth="3" className="drop-shadow-lg" />
                    {/* Data Points */}
                    <circle cx="50" cy="185" r="4" fill="rgb(59, 130, 246)" className="drop-shadow-md" />
                    <circle cx="200" cy="155" r="4" fill="rgb(168, 85, 247)" className="drop-shadow-md" />
                    <circle cx="350" cy="75" r="4" fill="rgb(6, 182, 212)" className="drop-shadow-md" />
                    <circle cx="480" cy="35" r="4" fill="rgb(6, 182, 212)" className="drop-shadow-md" />
                  </svg>
                  {/* Floating Result Badge */}
                  <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-md border border-blue-500/30 dark:border-blue-400/30 p-3 rounded-lg shadow-xl text-xs font-mono">
                    <span className="text-muted-foreground">f(x) =</span> <span className="font-bold text-blue-600 dark:text-blue-400">2.1x² + 0.3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features - Bento Grid */}
        <section id="features" className="relative py-32 px-6 max-w-7xl mx-auto overflow-hidden border-y border-zinc-200 dark:border-zinc-800">
          {/* Background Gradient matching hero - opacity 0 to match hero background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-cyan-50/30 dark:from-blue-950/15 dark:via-purple-950/10 dark:to-cyan-950/15 opacity-0 pointer-events-none"></div>
          
          <div className="relative z-10 mb-20 border-b border-zinc-200 dark:border-zinc-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-4xl md:text-6xl font-light tracking-tight text-zinc-900 dark:text-white">Capabilities</h2>
            <p className="font-mono text-xs text-zinc-500">[ SYSTEM_MODULES ]</p>
          </div>

          <div className="relative z-10">
            <MagicBento
              cards={[
                {
                  color: 'var(--card)',
                  title: 'Regression Engine',
                  description: 'Our core algorithm instantly identifies linear, polynomial, exponential, and logarithmic relationships in your data.',
                  label: '01'
                },
                {
                  color: 'var(--card)',
                  title: 'Smart Parsing',
                  description: 'Drop any CSV, JSON, or Excel file. Fluent automatically detects headers.',
                  label: '02'
                },
                {
                  color: 'var(--card)',
                  title: 'Live Predict',
                  description: 'Use the interactive console to input X values and get Y instantly.',
                  label: '03'
                },
                {
                  color: 'var(--card)',
                  title: 'Visualizer',
                  description: 'See your raw data points plotted against the function curve in real-time.',
                  label: '04'
                },
                {
                  color: 'var(--card)',
                  title: 'Auto-Tuning',
                  description: 'Tests multiple polynomial degrees to find the perfect balance between fit and complexity.',
                  label: '05'
                },
                {
                  color: 'var(--card)',
                  title: 'PDF Export',
                  description: 'Generate professional laboratory or business reports with a single click.',
                  label: '06'
                }
              ]}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              glowColor="59, 130, 246"
              enableMagnetism={true}
              clickEffect={true}
            />
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="process-section relative py-32 border-y border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {/* Background Gradient matching hero - same orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-400/5 rounded-full blur-[100px]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/8 dark:bg-cyan-400/4 rounded-full blur-[100px]"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-20">
            <div className="process-left md:w-1/3 h-fit">
            <div className="md:sticky md:top-32">
              <p className="font-mono text-sm mb-4 tracking-widest text-zinc-500 uppercase">Workflow</p>
              <h2 className="text-5xl md:text-7xl font-bold leading-[0.9] tracking-tighter mb-8 text-zinc-900 dark:text-white">
                HOW IT<br/>WORKS
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
                Complex mathematics distilled into a three-step user experience. No coding required.
              </p>
            </div>
            </div>

            <div className="md:w-2/3 space-y-24 pt-10 md:pt-0">
              {[
                { title: "Upload Source", desc: "Drag and drop your dataset. We handle cleaning, normalization, and outlier detection automatically.", num: "01" },
                { title: "Curve Fitting", desc: "Our engine runs regression analysis across multiple models simultaneously to minimize error (MSE).", num: "02" },
                { title: "Equation Extraction", desc: "Get the clean mathematical formula (LaTeX or Plain Text) ready for your papers or codebase.", num: "03" }
              ].map((step, i) => (
                <div key={i} className="group border-l-2 border-zinc-300 dark:border-zinc-700 pl-12 relative pb-10 last:pb-0">
                  <span className="absolute -left-[10px] top-0 w-[17px] h-[17px] rounded-full border-2 border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-900 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:border-zinc-900 dark:group-hover:border-white transition-all duration-500"></span>
                  <span className="font-mono text-xs font-bold text-zinc-500 mb-4 block">{step.num}</span>
                  <h3 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">{step.title}</h3>
                  <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-md">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="relative py-16 flex flex-col justify-center items-center overflow-hidden">
           {/* Background Gradient matching hero */}
           <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-[120px]"></div>
             <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-400/5 rounded-full blur-[100px]"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/8 dark:bg-cyan-400/4 rounded-full blur-[100px]"></div>
           </div>
           
          <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto p-6">
              <h2 className="text-[10vw] font-bold leading-none tracking-tighter text-zinc-900 dark:text-white mb-6">
                 SOLVE IT.
               </h2>
               <Link href="/workbench" className="cursor-pointer">
                <Button variant="ghost" size="lg" className="!bg-transparent !border-0 !shadow-none !p-0 !h-auto !font-normal">
                  Launch Workbench
                </Button>
               </Link>
           </div>
           
          <div className="relative z-10 mt-10 border-t border-zinc-200 dark:border-zinc-800 w-full pt-6 pb-2 flex flex-col md:flex-row justify-between items-center gap-4 px-4 sm:px-8 text-base font-mono text-zinc-500">
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
           </div>
        </section>

      </div>
    </ReactLenis>
  );
}