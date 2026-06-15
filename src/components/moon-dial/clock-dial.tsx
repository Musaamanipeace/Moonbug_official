"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ClockDialProps {
  rotation: number;
  children: React.ReactNode;
}

export const ClockDial: React.FC<ClockDialProps> = ({ rotation, children }) => {
  const markings = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="relative flex items-center justify-center w-[85vw] h-[85vw] max-w-[600px] max-h-[600px] rounded-full dial-shadow border border-starlight/20">
      {/* Hour Markings */}
      {markings.map((h) => {
        const isMajor = h % 6 === 0;
        const angle = h * 15; // 360 / 24
        return (
          <div
            key={h}
            className="absolute inset-0 flex items-start justify-center"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <div className="flex flex-col items-center mt-4">
              <div 
                className={cn(
                  "w-0.5 rounded-full",
                  isMajor ? "h-6 bg-lunar" : "h-3 bg-starlight"
                )} 
              />
              {isMajor && (
                <span className="text-[10px] mt-2 font-body text-starlight tracking-tighter opacity-80" style={{ transform: `rotate(${-angle}deg)` }}>
                  {h === 0 ? '24' : h}H
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Orbit Track */}
      <div className="absolute w-[80%] h-[80%] rounded-full border border-starlight/10 border-dashed" />

      {/* The Moon Indicator Carrier */}
      <div 
        className="absolute w-full h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 animate-float">
          {children}
        </div>
      </div>

      {/* Horizon Line (Minimalist Focus Mode uses this) */}
      <div className="absolute w-full h-[1px] bg-starlight/10 top-1/2 left-0 pointer-events-none" />
      
      {/* Center Point */}
      <div className="z-10 w-2 h-2 rounded-full bg-starlight shadow-lg" />
    </div>
  );
};