
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, Type, Sparkles, Book, Search, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export function QuickInput() {
  const [inputType, setInputType] = useState<'text' | 'voice'>('text');
  const [outputMode, setOutputMode] = useState<'ai' | 'dictionary' | 'search'>('ai');
  const [isRecording, setIsRecording] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-sm transition-all shadow-2xl">
      <div className="flex flex-col gap-6">
        
        {/* Mode Toggles */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setInputType('text')}
              className={cn("h-8 text-[10px] uppercase tracking-widest rounded-md", inputType === 'text' ? "bg-white/10 text-lunar" : "text-muted-foreground")}
            >
              <Type className="w-3 h-3 mr-2" /> Text
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setInputType('voice')}
              className={cn("h-8 text-[10px] uppercase tracking-widest rounded-md", inputType === 'voice' ? "bg-white/10 text-lunar" : "text-muted-foreground")}
            >
              <Mic className="w-3 h-3 mr-2" /> Voice
            </Button>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setOutputMode('ai')}
              className={cn("flex items-center gap-2 text-[10px] uppercase tracking-widest transition-colors", outputMode === 'ai' ? "text-blue-400" : "text-muted-foreground hover:text-lunar")}
            >
              <Sparkles className="w-3 h-3" /> Strategy
            </button>
            <button 
              onClick={() => setOutputMode('dictionary')}
              className={cn("flex items-center gap-2 text-[10px] uppercase tracking-widest transition-colors", outputMode === 'dictionary' ? "text-green-400" : "text-muted-foreground hover:text-lunar")}
            >
              <Book className="w-3 h-3" /> Glossary
            </button>
            <button 
              onClick={() => setOutputMode('search')}
              className={cn("flex items-center gap-2 text-[10px] uppercase tracking-widest transition-colors", outputMode === 'search' ? "text-orange-400" : "text-muted-foreground hover:text-lunar")}
            >
              <Search className="w-3 h-3" /> Archive
            </button>
          </div>
        </div>

        {/* Input Field Area */}
        <div className="relative flex items-center gap-4">
          {inputType === 'text' ? (
            <Input 
              placeholder={outputMode === 'ai' ? "What's on your mind?" : "Term to define..."}
              className="bg-transparent border-none text-xl md:text-2xl font-light placeholder:text-muted-foreground/30 h-16 px-0 focus-visible:ring-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          ) : (
            <div className="flex-1 flex items-center h-16">
              {isRecording ? (
                <div className="flex items-center gap-3">
                  <div className="flex gap-1 h-4 items-center">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-1 bg-blue-400 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%` }} />
                    ))}
                  </div>
                  <span className="text-blue-400 text-sm font-mono animate-pulse">Listening...</span>
                </div>
              ) : (
                <span className="text-muted-foreground/30 text-2xl font-light">Tap mic to record offline input</span>
              )}
            </div>
          )}
          
          <Button 
            onClick={() => inputType === 'voice' ? setIsRecording(!isRecording) : console.log('Send')}
            className={cn(
              "w-16 h-16 rounded-2xl transition-all shadow-lg",
              inputType === 'voice' && isRecording ? "bg-red-500 hover:bg-red-600 scale-95" : "bg-primary text-secondary hover:scale-105"
            )}
          >
            {inputType === 'text' ? <Send className="w-6 h-6" /> : <Mic className={cn("w-6 h-6", isRecording && "animate-pulse")} />}
          </Button>
        </div>

        {/* Dynamic Context Selectors */}
        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Scope:</span>
            <select className="bg-transparent border-none text-[10px] uppercase tracking-widest text-lunar outline-none cursor-pointer hover:text-primary transition-colors">
              <option>General</option>
              <option>Software Dev</option>
              <option>Personal</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
             <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Type:</span>
             <div className="flex gap-2">
               {['Idea', 'Task', 'Event'].map(type => (
                 <Button key={type} variant="ghost" className="h-6 px-3 text-[9px] uppercase tracking-widest bg-white/5 border border-white/10 hover:bg-white/10">
                   {type}
                 </Button>
               ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
