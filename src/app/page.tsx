
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FolderKanban, StickyNote, Mic, Search, ListTodo } from 'lucide-react';
import { useUser } from '@/firebase';

export default function MoonbugDashboard() {
  const { user } = useUser();

  return (
    <main className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-1000">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-headline font-extralight tracking-tight">Moonbug Control</h1>
          <p className="text-muted-foreground font-light max-w-2xl">
            {user ? `Welcome back, ${user.displayName}. System active.` : 'Please sign in to access your scopes and notes.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 transition-all">
            <Search className="w-4 h-4 mr-2" /> Quick Search
          </Button>
          <Button className="rounded-full px-6 bg-lunar text-obsidian hover:bg-white transition-all shadow-lg shadow-white/5">
            <Plus className="w-4 h-4 mr-2" /> New Scope
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Scopes Sidebar/List */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Recent Scopes</h3>
            <FolderKanban className="w-3 h-3 text-muted-foreground/50" />
          </div>
          <div className="space-y-2">
            {['Development', 'Personal', 'Archives'].map((scope) => (
              <Button key={scope} variant="ghost" className="w-full justify-start text-sm font-light tracking-wide text-muted-foreground hover:text-lunar hover:bg-white/5 py-6">
                <div className="w-2 h-2 rounded-full bg-primary/40 mr-3" />
                {scope}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-white/[0.02] border-white/5 group hover:border-primary/20 transition-all cursor-pointer">
              <CardHeader className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                    <StickyNote className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">ID: 0x82...</span>
                </div>
                <CardTitle className="text-lg font-light tracking-wide">Celestial OS Logic</CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-light mt-1">
                  Drafting the transposition requirements for the lunar engine...
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0 flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Modified 2m ago</span>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border border-white/10 bg-starlight" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border-white/5 group hover:border-primary/20 transition-all cursor-pointer">
              <CardHeader className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                    <ListTodo className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">ID: 0x41...</span>
                </div>
                <CardTitle className="text-lg font-light tracking-wide">Sync Orbit Controls</CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-light mt-1">
                  [ ] Verify clock rotation logic<br/>
                  [x] Implement focus mode toggle
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0 flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">67% Complete</span>
              </CardContent>
            </Card>
          </div>

          {/* Voice Input Action */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Button variant="outline" className="w-full py-12 border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-all rounded-2xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-light tracking-widest uppercase">Start Voice Capture</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-1">Offline Whisper Processing Active</p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
