
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, Type, Sparkles, Book, Search, Radio, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { toast } from '@/hooks/use-toast';

export function QuickInput() {
  const { user } = useUser();
  const db = useFirestore();
  
  const [inputType, setInputType] = useState<'text' | 'voice'>('text');
  const [outputMode, setOutputMode] = useState<'ai' | 'dictionary' | 'search'>('ai');
  const [isRecording, setIsRecording] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [selectedScope, setSelectedScope] = useState('general');
  const [selectedType, setSelectedType] = useState('note');
  const [isSyncing, setIsSyncing] = useState(false);

  // Speech Recognition Setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setQueryText(prev => prev + finalTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        toast({
          variant: "destructive",
          title: "Microphone Error",
          description: `Could not access microphone: ${event.error}`
        });
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Your browser does not support Speech Recognition."
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setQueryText('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSubmission = async () => {
    if (!queryText || !user || !db) return;
    
    setIsSyncing(true);
    
    const noteData = {
      content: queryText,
      scopeId: selectedScope,
      type: selectedType,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      ownerId: user.uid
    };

    try {
      const notesRef = collection(db, 'users', user.uid, 'notes');
      addDoc(notesRef, noteData)
        .catch(async (err) => {
          const permissionError = new FirestorePermissionError({
            path: notesRef.path,
            operation: 'create',
            requestResourceData: noteData
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      setQueryText('');
      toast({
        title: "Insight Captured",
        description: `Synced to ${selectedScope} as ${selectedType}.`,
      });
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSyncing(false);
      if (isRecording) {
        recognitionRef.current.stop();
        setIsRecording(false);
      }
    }
  };

  // Fetch user scopes for the dropdown
  const scopesQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'scopes'), orderBy('createdAt', 'desc'));
  }, [db, user]);
  
  const { data: scopes } = useCollection(scopesQuery);

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-sm transition-all shadow-2xl relative overflow-hidden">
      {isSyncing && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Syncing to Node...</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        
        {/* Mode Toggles */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => {
                if (isRecording) recognitionRef.current.stop();
                setInputType('text');
              }}
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
          <Input 
            placeholder={isRecording ? "Listening to your voice..." : (outputMode === 'ai' ? "What's on your mind?" : "Term to define...")}
            className={cn(
              "bg-transparent border-none text-xl md:text-2xl font-light placeholder:text-muted-foreground/30 h-16 px-0 focus-visible:ring-0",
              isRecording && "text-blue-400"
            )}
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            disabled={isRecording}
          />
          
          <div className="flex gap-2">
            {inputType === 'voice' && (
              <Button 
                onClick={toggleRecording}
                className={cn(
                  "w-16 h-16 rounded-2xl transition-all shadow-lg",
                  isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-white/5 border border-white/10 text-lunar"
                )}
              >
                <Mic className={cn("w-6 h-6", isRecording && "scale-110")} />
              </Button>
            )}
            
            <Button 
              disabled={!queryText || isSyncing}
              onClick={handleSubmission}
              className="w-16 h-16 rounded-2xl bg-primary text-secondary hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
              <Send className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Dynamic Context Selectors */}
        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Scope:</span>
            <select 
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="bg-transparent border-none text-[10px] uppercase tracking-widest text-lunar outline-none cursor-pointer hover:text-primary transition-colors appearance-none"
            >
              <option value="general" className="bg-background">General</option>
              {scopes?.map(s => (
                <option key={s.id} value={s.id} className="bg-background">{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
             <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Type:</span>
             <div className="flex flex-wrap gap-2">
               {['note', 'todo', 'idea', 'event', 'reminder', 'deadline'].map(type => (
                 <Button 
                   key={type} 
                   variant="ghost" 
                   onClick={() => setSelectedType(type)}
                   className={cn(
                     "h-6 px-3 text-[9px] uppercase tracking-widest border transition-all",
                     selectedType === type 
                       ? "bg-primary/10 border-primary text-primary" 
                       : "bg-white/5 border-white/10 hover:bg-white/10"
                   )}
                 >
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
