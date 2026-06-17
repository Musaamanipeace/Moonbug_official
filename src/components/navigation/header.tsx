"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Moon, LayoutDashboard, Compass, User, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, useUser } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

export function Header() {
  const pathname = usePathname();
  const { auth } = useAuth();
  const { user } = useUser();

  const handleAuth = () => {
    if (user) {
      signOut(auth!);
    } else {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth!, provider);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-between px-8">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Compass className="w-4 h-4 text-primary" />
          </div>
          <span className="font-headline font-light tracking-widest uppercase text-sm">Moonbug</span>
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
          <Link href="/surveys">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "text-xs tracking-widest uppercase font-light",
                pathname === "/surveys" ? "bg-white/5 text-primary" : "text-muted-foreground"
              )}
            >
              <ClipboardList className="w-3 h-3 mr-2" />
              Surveys
            </Button>
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] font-mono text-muted-foreground tracking-tighter uppercase">
            Moon Node: Ready
          </span>
          <span className="text-[10px] font-mono text-green-500/60 tracking-tighter uppercase">
            Sync: Nominal
          </span>
        </div>
        <div className="h-6 w-[1px] bg-white/10" />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleAuth}
          className="text-xs tracking-widest uppercase font-light text-muted-foreground hover:text-lunar"
        >
          {user ? (
            <div className="flex items-center gap-2">
              <span className="max-w-[100px] truncate">{user.displayName}</span>
              <User className="w-3 h-3" />
            </div>
          ) : (
            'Authenticate'
          )}
        </Button>
      </div>
    </header>
  );
}
