import React, { useRef } from 'react';

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.10)' // softer, closer to navbar glow
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={divRef}
      className={`relative rounded-xl bg-white/30 dark:bg-zinc-950/30 backdrop-blur-xl overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 35%, ${spotlightColor}, transparent 65%)`
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;

