
"use client";

import React, { useState, useEffect } from 'react';
import { getMoonData, getMoonClockPosition, MoonData } from '@/lib/lunar-engine';
import { MoonVisual } from '@/components/moon-dial/moon-visual';
import { ClockDial } from '@/components/moon-dial/clock-dial';
import { InfoPanel } from '@/components/moon-dial/info-panel';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, RefreshCcw } from 'lucide-react';

export default function MoonDialPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [moonData, setMoonData] = useState<MoonData | null>(null);
  const [clockRotation, setClockRotation] = useState(0);
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    const now = new Date();
    setCurrentTime(now);
    setMoonData(getMoonData(now));
    setClockRotation(getMoonClockPosition(now));

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setMoonData(getMoonData(now));
      setClockRotation(getMoonClockPosition(now));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!currentTime || !moonData) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-obsidian">
        <RefreshCcw className="w-8 h-8 text-starlight animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-starlight/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-starlight/10 rounded-full blur-[150px]" />
      </div>

      {/* Top Header Information - Subtle and integrated */}
      {!isFocusMode && (
        <div className="absolute top-8 w-full flex justify-between px-12 z-10 animate-in fade-in duration-1000 pointer-events-none">
          <div className="flex flex-col">
            <span className="text-lunar/40 font-mono text-[10px] tracking-[0.3em] uppercase">
              Orbital Module 01
            </span>
          </div>
          <div className="text-right flex flex-col items-end">
             <span className="text-lunar/60 font-mono text-sm tracking-wider">
              {currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      )}

      {/* Center Layout */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-4xl z-10">
        <ClockDial rotation={clockRotation}>
          <MoonVisual data={moonData} size={isFocusMode ? 140 : 100} />
        </ClockDial>

        <InfoPanel data={moonData} focusMode={isFocusMode} />
      </div>

      {/* Focus Mode Overlay */}
      {isFocusMode && (
        <div className="fixed bottom-12 text-center animate-in fade-in slide-in-from-bottom-2 duration-700 z-10">
          <p className="text-lunar/40 font-mono tracking-[0.5em] text-[10px] uppercase">
            {moonData.phaseName.replace('-', ' ')} • {moonData.illumination}%
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="fixed bottom-8 right-8 flex gap-2 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-starlight/10 text-starlight hover:bg-starlight hover:text-lunar transition-all duration-500"
          onClick={() => setIsFocusMode(!isFocusMode)}
        >
          {isFocusMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </Button>
      </div>
    </main>
  );
}
