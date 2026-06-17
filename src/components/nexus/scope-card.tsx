
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FolderKanban, ListTodo, Calendar, Clock } from 'lucide-react';

interface ScopeCardProps {
  scope: any;
}

export function ScopeCard({ scope }: ScopeCardProps) {
  const completedTasks = scope.tasks?.filter((t: any) => t.completed).length || 0;
  const totalTasks = scope.tasks?.length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="bg-white/[0.02] border-white/5 group hover:border-primary/20 transition-all cursor-pointer overflow-hidden relative">
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
      
      <CardHeader className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-end gap-1">
             <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Scope Alpha</span>
             {scope.deadline && (
               <div className="flex items-center gap-1 text-[9px] text-orange-400">
                 <Clock className="w-2 h-2" /> 2d left
               </div>
             )}
          </div>
        </div>
        <CardTitle className="text-xl font-light tracking-wide group-hover:text-primary transition-colors">
          {scope.name}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground font-light mt-2 line-clamp-2 leading-relaxed">
          {scope.description || "Container class for project-specific insights and targets."}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-0 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span>Progressive Sync</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest border-t border-white/5 pt-4">
          <span className="flex items-center gap-2">
            <ListTodo className="w-3 h-3" /> {totalTasks} Tasks
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-3 h-3" /> {new Date(scope.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
