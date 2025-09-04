import React from 'react';

const logos = [
  { name: 'Modal', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/16c9842d2b39d485fb84a8de9abe594a-2.svg', width: 106, height: 28 },
  { name: 'Dagster', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/41e8b95ed79c5e293a670543b18979f7-3.svg', width: 113, height: 28 },
  { name: 'Statsig', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/1462e55f81ca0695150e3cf23b8d6f80-4.svg', width: 126, height: 28 },
  { name: 'SurrealDB', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/2af004a964397ea395548de850211b64-5.svg', width: 103, height: 28 },
  { name: 'Case Status', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/e510fb33ce897e477edc44deabf0798c-6.svg', width: 125, height: 28 },
  { name: 'Dig South', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/0c52c48b95a3d3229d36feaf487c4450-7.svg', width: 106, height: 28 },
  { name: 'Deno', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/f3c09ad6ed666042a06abdf1d54412de-8.svg', width: 122, height: 28 },
  { name: 'Common Room', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/266277405c38539027c979a0c3511938-9.svg', width: 166, height: 28 },
];

const LogoMarquee = () => (
    <ul className="flex animate-logos gap-[54px] pr-[54px] lg:gap-[52px] md:gap-12 sm:gap-7">
      {logos.map((logo) => (
        <li key={logo.name} className="flex flex-shrink-0 items-center justify-center">
          <img
            alt={logo.name}
            width={logo.width}
            height={logo.height}
            src={logo.src}
            className="h-7 w-auto max-w-none grayscale sm:h-[18px]"
          />
        </li>
      ))}
    </ul>
  );

const TrustedBy = () => {
    return (
        <div className="relative z-10 mt-16 flex max-w-full border-t border-border pt-6 lg:mt-[55px] md:mt-[49px] md:pt-4 sm:flex-col sm:gap-y-5 sm:border-none sm:pt-0">
            <h2 className="max-w-40 flex-shrink-0 text-sm font-medium uppercase leading-normal tracking-tight text-muted-foreground sm:max-w-none sm:text-xs">
                Trusted by teams leading the future
            </h2>
            <div className="flex w-full items-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                <LogoMarquee />
                <LogoMarquee />
            </div>
        </div>
    );
};

export default TrustedBy;