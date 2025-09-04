"use client";

import Image from "next/image";
import { ArrowRight } from "@/icons/lucide";

const FinalCta = () => {
  return (
    <section className="relative overflow-hidden bg-[#0F1419] px-6 py-24 sm:px-4 sm:py-16 md:py-20">
      <Image
        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/images/next-887837-bg.f823b8ff.png"
        alt="Abstract gradient background"
        fill
        className="pointer-events-none object-cover"
        priority
      />

      <div className="relative z-10 mx-auto flex flex-col items-center">
        <h2 className="max-w-[550px] text-center text-[48px] font-semibold leading-tight tracking-tighter text-white sm:max-w-[280px] sm:text-[28px] md:max-w-md md:text-[40px]">
          Skip the dev lift &amp; launch your agent today
        </h2>
        <div className="mt-9 flex items-center gap-x-7 sm:mt-7 sm:flex-col sm:gap-5 md:mt-8">
          <button
            className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-white to-[#B0B4BE] px-7 font-medium tracking-tight text-zinc-900 transition-colors duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-b before:from-white before:to-[#DDDFE3] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 md:h-9 md:px-6"
            data-cal-link="bchappell/30min"
            data-cal-config='{"layout":"month_view"}'
          >
            <span className="relative z-10">Book a 15-min demo</span>
          </button>
          <a
            href="https://studio.scoutos.com/onboarding/step-1"
            className="group inline-flex items-center gap-1 text-base font-medium tracking-tight text-white transition-colors duration-200 hover:text-[#9CA3AF] focus-visible:text-[#9CA3AF]"
          >
            Try for free
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;