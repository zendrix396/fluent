"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/icons/lucide";
import { useEffect } from "react";

const logos = [
  { name: "Universities", src: "https://www.scoutos.com/_next/static/media/16c9842d2b39d485fb84a8de9abe594a.svg" },
  { name: "Research Labs", src: "https://www.scoutos.com/_next/static/media/41e8b95ed79c5e293a670543b18979f7.svg" },
  { name: "Data Teams", src: "https://www.scoutos.com/_next/static/media/1462e55f81ca0695150e3cf23b8d6f80.svg" },
  { name: "Analytics Firms", src: "https://www.scoutos.com/_next/static/media/2af004a964397ea395548de850211b64.svg" },
  { name: "Financial Services", src: "https://www.scoutos.com/_next/static/media/e510fb33ce897e477edc44deabf0798c.svg" },
  { name: "Tech Companies", src: "https://www.scoutos.com/_next/static/media/0c52c48b95a3d3229d36feaf487c4450.svg" },
  { name: "Consulting", src: "https://www.scoutos.com/_next/static/media/f3c09ad6ed666042a06abdf1d54412de.svg" },
  { name: "Startups", src: "https://www.scoutos.com/_next/static/media/266277405c38539027c979a0c3511938.svg" },
];

const HeroSection = () => {
  useEffect(() => {
    // Skip external script loading to prevent CORS errors
    console.log("External script loading disabled to prevent CORS errors");
  }, []);

  const handleBookDemo = () => {
    // Direct redirect to demo instead of using embed script
    window.open('https://fluent-demo.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="overflow-hidden bg-background pt-[120px] px-safe lg:pt-[112px] md:pt-[84px] sm:pt-[84px]">
      <div className="mx-auto max-w-[1248px] px-6">
        <div className="relative flex justify-between gap-x-[130px] lg:gap-x-16 lg:pr-4 md:flex-col md:items-center md:pr-0 sm:items-start">
          <div className="w-full max-w-[580px] pt-20 lg:pt-10 md:max-w-lg md:pt-0 sm:mx-auto">
            <h1 className="text-[64px] font-semibold leading-[1.1] tracking-[-0.03em] text-text-primary lg:text-[44px] md:text-pretty md:text-center md:text-[40px] sm:text-[28px]">
              Transform your data into mathematical insights instantly
            </h1>
            <p className="mt-[26px] text-[20px] leading-snug tracking-tight text-text-secondary lg:mt-5 lg:text-[18px] md:text-pretty md:text-center md:text-[16px] sm:mt-3.5">
              Upload your data in any format - Excel, CSV, JSON, or manual arrays. Fluent automatically generates precise mathematical functions, creates stunning visualizations, and exports everything as professional LaTeX documents.
            </p>
            <div className="mt-9 flex items-center gap-x-7 lg:mt-8 md:mt-6 md:justify-center sm:mt-7 sm:flex-col sm:items-center sm:gap-5">
              <button
                onClick={handleBookDemo}
                className="group relative inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-white to-[#B0B4BE] px-7 font-medium tracking-tight text-black transition-colors duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-b before:from-white before:to-[#DDDFE3] before:opacity-0 before:transition-opacity hover:before:opacity-100 md:h-9 md:px-6"
              >
                <span className="relative z-10">Try live demo</span>
              </button>
              <Link href="/upload" className="group inline-flex items-center gap-1 font-medium tracking-tight text-text-primary transition-colors duration-200 hover:text-text-secondary focus-visible:text-text-secondary text-[16px]">
                Upload your data
                <ArrowRight className="h-4 w-4 shrink-0 text-inherit transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
              </Link>
            </div>
          </div>
          <div className="relative h-auto w-[542px] shrink-0 aspect-[542/572] lg:w-[400px] md:ml-5 md:mt-12 md:w-[466px] sm:mx-auto sm:mt-8 sm:w-[104.0625%] sm:max-w-[542px]">
            <Image
              alt="Fluent data analysis dashboard showing graphs and mathematical functions"
              width={588}
              height={614}
              className="absolute left-[-3.875%] top-[-3.147%] z-10 h-auto w-[108.487%] max-w-none"
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/images/next-894133-illustration.902ffbbf.png"
            />
            <div className="pointer-events-none absolute bottom-[44.93%] left-[-18.081%] z-0 aspect-square h-auto w-[217.712%] rounded-full bg-[radial-gradient(33.76%_33.76%_at_50%_50%,#85A0FF_0%,rgba(133,160,255,0)_100%)] opacity-[0.06] blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-[35.978%] z-0 h-[82.517%] w-[133.763%] rotate-[48deg] rounded-full bg-[radial-gradient(37.96%_37.93%_at_49.66%_45.84%,#85FFD3_0%,rgba(41,115,97,0)_100%)] opacity-[0.27] blur-3xl" />
            <div className="pointer-events-none absolute left-[1.476%] top-[-6.119%] z-0 h-[148.601%] w-[170.849%] rotate-[-31deg] rounded-full bg-[radial-gradient(33.76%_33.76%_at_50%_50%,#6B5F9A_0%,rgba(107,95,154,0)_100%)] opacity-[0.25] blur-3xl" />
            <div className="pointer-events-none absolute right-[-7.517%] top-[-57.565%] z-0 h-[178.846%] w-[205.719%] rotate-[-31deg] rounded-full bg-[radial-gradient(33.76%_33.76%_at_50%_50%,#85A0FF_0%,rgba(133,160,255,0)_100%)] opacity-[0.25] blur-3xl" />
          </div>
        </div>

        <div className="relative z-10 mt-16 flex max-w-full border-t border-border pt-6 lg:mt-[55px] md:mt-[49px] md:pt-4 sm:mt-8 sm:flex-col sm:gap-y-5 sm:border-none sm:pt-0">
          <h2 className="max-w-40 shrink-0 text-sm font-medium uppercase leading-normal tracking-tight text-text-muted sm:max-w-none sm:text-xs">
            Trusted by data teams worldwide
          </h2>
          <div className="flex w-full items-center overflow-hidden [mask-image:linear-gradient(to_right,transparent_3%,black_20%,black_80%,transparent_97%)]">
            <div className="flex animate-logos-scroll">
                 <ul className="flex shrink-0 items-center gap-[54px] pr-[54px] lg:gap-[52px] md:gap-12 sm:gap-7">
                {logos.map((logo, index) => (
                  <li key={`${logo.name}-${index}`} className="flex items-center justify-center">
                    <Image alt={logo.name} src={logo.src} width={150} height={28} className="h-7 w-auto max-w-none sm:h-[18px] object-contain" />
                  </li>
                ))}
              </ul>
              <ul className="flex shrink-0 items-center gap-[54px] pr-[54px] lg:gap-[52px] md:gap-12 sm:gap-7" aria-hidden="true">
                {logos.map((logo, index) => (
                  <li key={`${logo.name}-${index}-clone`} className="flex items-center justify-center">
                     <Image alt={logo.name} src={logo.src} width={150} height={28} className="h-7 w-auto max-w-none sm:h-[18px] object-contain" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;