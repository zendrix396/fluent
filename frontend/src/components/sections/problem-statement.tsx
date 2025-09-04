import React from 'react';

const ProblemStatementSection = () => {
  return (
    <section className="h-[252vh] bg-background">
      <div className="sticky top-0 flex h-screen items-start justify-center overflow-hidden px-5">
        <div className="relative z-10 mt-[50vh] flex max-w-[704px] flex-col gap-y-10 will-change-transform lg:gap-y-9 md:gap-y-8 sm:gap-y-5">
          <h2 className="text-[48px] font-semibold leading-snug tracking-tighter text-foreground will-change-transform lg:text-[40px] md:text-[32px] sm:text-[28px]">
            Your data tells a story...
          </h2>
          <h2 className="text-[48px] font-semibold leading-snug tracking-tighter text-foreground will-change-transform lg:text-[40px] md:text-[32px] sm:text-[28px]">
            But finding the mathematical patterns is complex.
          </h2>
          <h2 className="text-[48px] font-semibold leading-snug tracking-tighter text-foreground will-change-transform lg:text-[40px] md:text-[32px] sm:text-[28px]">
            Hours spent plotting. Functions guessed. The insights remain hidden.
          </h2>
          <h2 className="text-[48px] font-semibold leading-snug tracking-tighter text-foreground will-change-transform lg:text-[40px] md:text-[32px] sm:text-[28px]">
            Until now.
          </h2>
        </div>
        <div
          className="absolute inset-x-2.5 inset-y-0 z-0 m-auto h-[636px] max-w-[1088px] transform-gpu bg-[radial-gradient(50%_50%_at_50%_50%,rgba(46,48,56,1)_0%,rgba(46,48,56,0.9)_10%,rgba(46,48,56,0.8)_20%,rgba(46,48,56,0.7)_30%,rgba(46,48,56,0.6)_40%,rgba(46,48,56,0.5)_50%,rgba(46,48,56,0.4)_60%,rgba(46,48,56,0.3)_70%,rgba(46,48,56,0.2)_80%,rgba(46,48,56,0.1)_90%,rgba(46,48,56,0.0)_100%)] brightness-[0.6] lg:h-[558px] md:h-[402px] sm:-inset-x-[70px] sm:h-[280px]"
        />
      </div>
    </section>
  );
};

export default ProblemStatementSection;