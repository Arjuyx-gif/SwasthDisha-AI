'use client';

import { useEffect, useState } from 'react';

interface RingDatum {
  name:   string;
  value:  number;   // 0-100 percentage
  color:  string;
  actual: number;
  unit:   string;
}

interface NutrientRingsProps {
  rings: RingDatum[];
  caloriesConsumed: number;
  caloriesTarget:   number;
}

// SVG layout constants
const CX = 130;
const CY = 130;
const STROKE = 13;
const GAP    = 7;   // gap between rings
const RADII  = [108, 108 - STROKE - GAP, 108 - 2*(STROKE+GAP), 108 - 3*(STROKE+GAP), 108 - 4*(STROKE+GAP)];
// → 108, 88, 68, 48, 28

function polarArc(r: number, pct: number) {
  const circumference = 2 * Math.PI * r;
  const dashOffset    = circumference * (1 - Math.min(pct, 100) / 100);
  return { circumference, dashOffset };
}

export default function NutrientRings({ rings, caloriesConsumed, caloriesTarget }: NutrientRingsProps) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 w-full select-none">
      {/* ── SVG Rings ── */}
      <svg
        viewBox="0 0 260 260"
        width="260"
        height="260"
        className="overflow-visible"
        aria-label="Nutrient intake rings"
      >
        <defs>
          {rings.map((ring, i) => (
            <filter key={`glow-${i}`} id={`glow-${i}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Track circles + filled arcs */}
        {rings.map((ring, i) => {
          const r = RADII[i];
          const { circumference, dashOffset } = polarArc(r, ring.value);
          return (
            <g key={ring.name} transform={`rotate(-90 ${CX} ${CY})`}>
              {/* Dark track */}
              <circle
                cx={CX} cy={CY} r={r}
                fill="none"
                stroke="#1a2030"
                strokeWidth={STROKE}
              />
              {/* Coloured arc */}
              <circle
                cx={CX} cy={CY} r={r}
                fill="none"
                stroke={ring.color}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={animated ? dashOffset : circumference}
                filter={`url(#glow-${i})`}
                style={{
                  transition: `stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1) ${i * 120}ms`,
                  willChange: 'stroke-dashoffset',
                }}
              />
            </g>
          );
        })}

        {/* Center text */}
        <text x={CX} y={CY - 10} textAnchor="middle" fill="white" fontSize="22" fontWeight="700" fontFamily="Space Grotesk, sans-serif">
          {Math.round(caloriesConsumed)}
        </text>
        <text x={CX} y={CY + 8} textAnchor="middle" fill="#5a677d" fontSize="9.5" fontWeight="600" fontFamily="Space Grotesk, sans-serif" letterSpacing="1.5">
          KCAL
        </text>
        <text x={CX} y={CY + 24} textAnchor="middle" fill="#3d4f63" fontSize="9" fontFamily="Space Grotesk, sans-serif">
          of {caloriesTarget}
        </text>
      </svg>

      {/* ── Legend row ── */}
      <div className="grid grid-cols-5 gap-x-4 gap-y-2 w-full max-w-xs">
        {rings.map((ring) => (
          <div key={ring.name} className="flex flex-col items-center gap-1">
            {/* Percentage arc mini-indicator */}
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: ring.color, boxShadow: `0 0 6px ${ring.color}` }}
            />
            <span className="text-[9px] font-bold text-white leading-none">
              {Math.round(ring.value)}%
            </span>
            <span className="text-[8px] text-[#5a677d] text-center leading-tight">
              {ring.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
