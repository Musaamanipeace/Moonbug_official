"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { MoonData } from '@/lib/lunar-engine';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface MoonVisualProps {
  data: MoonData;
  size?: number;
  className?: string;
}

export const MoonVisual: React.FC<MoonVisualProps> = ({ data, size = 200, className }) => {
  const { phase } = data;
  
  // Phase logic: 
  // 0 is New Moon, 0.5 is Full Moon, 1 is New Moon again.
  // We render the illuminated portion in light color over a dark moon body.
  
  const isWaxing = phase <= 0.5;
  
  // Outer arc sweep: 1 for right semi-circle (waxing), 0 for left semi-circle (waning)
  const sweepOuter = isWaxing ? 1 : 0;
  
  // Normalized position within the half-cycle (0 to 1)
  const p = isWaxing ? phase * 2 : (phase - 0.5) * 2;
  
  // Inner arc horizontal radius: 50 (New/Full) -> 0 (Quarter) -> 50 (Full/New)
  const radiusInner = Math.abs(50 - p * 100);
  
  // Inner arc sweep: determines if the terminator bulges out (gibbous) or indents (crescent)
  const isGibbous = phase > 0.25 && phase < 0.75;
  const sweepInner = isGibbous ? sweepOuter : (1 - sweepOuter);

  const textureUrl = PlaceHolderImages.find(img => img.id === 'moon-texture')?.imageUrl || '';

  return (
    <div 
      className={cn("relative rounded-full overflow-hidden bg-obsidian moon-glow", className)}
      style={{ width: size, height: size }}
    >
      {/* Texture Layer */}
      {textureUrl && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none z-10"
          style={{
            backgroundImage: `url('${textureUrl}')`,
            backgroundSize: 'cover',
            mixBlendMode: 'overlay'
          }}
          data-ai-hint="moon surface"
        />
      )}
      
      {/* Moon Body (The un-illuminated dark surface) */}
      <div className="absolute inset-0 rounded-full bg-starlight/30 shadow-inner" />

      {/* The Illuminated Portion */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_15px_rgba(245,245,245,0.2)]"
      >
        <path 
          // M 50 0 : Start at the top center
          // A 50 50 0 0 [sweepOuter] 50 100 : Outer semi-circle to bottom center
          // A [radiusInner] 50 0 0 [sweepInner] 50 0 : Inner terminator curve back to top
          d={`M 50 0 A 50 50 0 0 ${sweepOuter} 50 100 A ${radiusInner} 50 0 0 ${sweepInner} 50 0`} 
          fill="rgba(245, 245, 245, 0.95)" 
        />
      </svg>
      
      {/* Subtle Rim Light and Depth */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] ring-1 ring-white/10" />
    </div>
  );
};
