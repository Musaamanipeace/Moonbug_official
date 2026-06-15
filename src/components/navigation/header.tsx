
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Moon, LayoutDashboard, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-between px-8">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Compass className="w-4 h-4 text-primary" />
          </div>
          <span className="font-headline font-light tracking-widest uppercase text-sm">Celestial OS</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "text-xs tracking-widest uppercase font-light",
                pathname === "/" ? "bg-white/5 text-primary" : "text-muted-foreground"
              )}
            >
              <LayoutDashboard className="w-3 h-3 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/moon-dial">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "text-xs tracking-widest uppercase font-light",
                pathname === "/moon-dial" ? "bg-white/5 text-primary" : "text-muted-foreground"
              )}
            >
              <Moon className="w-3 h-3 mr-2" />
              Moon Dial
            </Button>
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-4 w-[1px] bg-white/10 mx-2" />
        <span className="text-[10px] font-mono text-muted-foreground tracking-tighter uppercase">
          System Status: Nominal
        </span>
      </div>
    </header>
  );
}
