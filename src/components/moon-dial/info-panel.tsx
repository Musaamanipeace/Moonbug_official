"use client";

import React from 'react';
import { MoonData } from '@/lib/lunar-engine';
import { Badge } from '@/components/ui/badge';
import { Cloud, Compass, Wind } from 'lucide-react';

interface InfoPanelProps {
  data: MoonData;
  focusMode: boolean;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ data, focusMode }) => {
  if (focusMode) return null;

  return (
    <div className="flex flex-col items-center gap-6 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-headline font-light tracking-widest text-lunar uppercase">
          {data.phaseName.replace('-', ' ')}
        </h2>
        <p className="text-starlight text-sm tracking-widest uppercase font-medium">
          Illumination: {data.illumination}%
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8 w-full max-w-md px-6">
        <div className="flex flex-col items-center gap-2">
          <Badge variant="outline" className="border-starlight/30 text-starlight font-light">
            AGE
          </Badge>
          <span className="text-lunar font-mono text-xl">{data.age}d</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Badge variant="outline" className="border-starlight/30 text-starlight font-light">
            TRANSIT
          </Badge>
          <span className="text-lunar font-mono text-xl">{(data.rotation / 15).toFixed(1)}h</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Badge variant="outline" className="border-starlight/30 text-starlight font-light">
            CYCLE
          </Badge>
          <span className="text-lunar font-mono text-xl">29.5</span>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <div className="p-2 rounded-full bg-starlight/5 border border-starlight/10 text-starlight hover:text-lunar transition-colors cursor-help">
          <Compass className="w-5 h-5" />
        </div>
        <div className="p-2 rounded-full bg-starlight/5 border border-starlight/10 text-starlight hover:text-lunar transition-colors cursor-help">
          <Wind className="w-5 h-5" />
        </div>
        <div className="p-2 rounded-full bg-starlight/5 border border-starlight/10 text-starlight hover:text-lunar transition-colors cursor-help">
          <Cloud className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};