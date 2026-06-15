
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, ArrowRight, Shield, Zap, Globe } from 'lucide-react';

export default function DashboardPage() {
  return (
    <main className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-1000">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-headline font-extralight tracking-tight">Welcome to the Nexus</h1>
        <p className="text-muted-foreground font-light max-w-2xl">
          Your centralized command for celestial tracking and orbital mechanics. All systems are currently active.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Featured Feature: Moon Dial */}
        <Card className="md:col-span-2 bg-gradient-to-br from-white/[0.02] to-transparent border-white/5 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-primary/10" />
          <CardHeader className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Moon className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-light tracking-wide">Moon Dial Engine</CardTitle>
            <CardDescription className="text-muted-foreground font-light">
              High-fidelity lunar phase tracking with real-time astronomical precision.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 flex flex-col gap-6">
            <p className="text-sm text-muted-foreground/80 leading-relaxed font-light">
              Monitor illumination, transit age, and orbital cycle synchronization. The engine runs on a logic-less 
              mathematical model ensuring 99.9% accuracy without external network dependencies.
            </p>
            <Link href="/moon-dial">
              <Button className="rounded-full px-8 hover:gap-4 transition-all">
                Launch System <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Status Cards */}
        <div className="space-y-6">
          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="p-4 flex flex-row items-center gap-4">
              <Shield className="w-4 h-4 text-green-500/50" />
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest font-medium">Security</span>
                <span className="text-[10px] text-muted-foreground">Encrypted Pipeline</span>
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="p-4 flex flex-row items-center gap-4">
              <Zap className="w-4 h-4 text-yellow-500/50" />
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest font-medium">Latency</span>
                <span className="text-[10px] text-muted-foreground">0.4ms Local Execution</span>
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="p-4 flex flex-row items-center gap-4">
              <Globe className="w-4 h-4 text-blue-500/50" />
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest font-medium">Sync</span>
                <span className="text-[10px] text-muted-foreground">Global Celestial Mesh</span>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
