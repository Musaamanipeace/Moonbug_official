"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { MoonData } from '@/lib/lunar-engine';

interface MoonVisualProps {
  data: MoonData;
  size?: number;
  className?: string;
}

export const MoonVisual: React.FC<MoonVisualProps> = ({ data, size = 200, className }) => {
  const { phase } = data;
  
  // Phase logic: 
  // 0 is New Moon, 0.5 is Full Moon
  // We represent the shadow by an SVG ellipse that changes width and color
  
  const isWaxing = phase < 0.5;
  const absOffset = Math.abs(0.5 - phase) * 2; // 1 at new/full, 0 at quarters
  
  // SVG drawing logic for accurate phase rendering
  return (
    <div 
      className={cn("relative rounded-full overflow-hidden bg-obsidian moon-glow", className)}
      style={{ width: size, height: size }}
    >
      {/* Texture Layer */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url('https://picsum.photos/seed/moon-texture/400/400')`,
          backgroundSize: 'cover',
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Base Light (Full Moon) */}
      <div className="absolute inset-0 rounded-full bg-lunar opacity-90 shadow-inner" />

      {/* Shadow Layer - SVG to draw the crescent/gibbous shadow */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <defs>
          <mask id="moonMask">
            <rect x="0" y="0" width="100" height="100" fill="white" />
            {phase < 0.5 ? (
              // Waxing: Shadow moves from right to left
              <path 
                d={`M 50 0 A 50 50 0 1 1 50 100 A ${Math.abs(50 - phase * 200)} 50 0 1 ${phase < 0.25 ? '0' : '1'} 50 0`} 
                fill="black"
              />
            ) : (
              // Waning: Shadow moves from left to right
              <path 
                d={`M 50 0 A 50 50 0 1 0 50 100 A ${Math.abs(50 - (phase - 0.5) * 200)} 50 0 1 ${phase < 0.75 ? '1' : '0'} 50 0`} 
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect 
          x="0" y="0" width="100" height="100" 
          fill="rgba(10, 10, 11, 0.95)" 
          mask="url(#moonMask)" 
        />
      </svg>
      
      {/* Subtle Rim Light */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]" />
    </div>
  );
};