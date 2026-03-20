import { useEffect, useRef, useState } from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({ score, size = 120, strokeWidth = 8 }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 85) return 'hsl(152, 60%, 36%)';
    if (s >= 70) return 'hsl(38, 92%, 50%)';
    if (s >= 50) return 'hsl(25, 90%, 50%)';
    return 'hsl(0, 72%, 51%)';
  };

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1200;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(220, 14%, 94%)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(animatedScore)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold tabular-nums" style={{ color: getColor(animatedScore) }}>
          {animatedScore}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">/ 100</span>
      </div>
    </div>
  );
}
