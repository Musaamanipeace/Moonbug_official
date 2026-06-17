"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { useSchoolAuth, SchoolAuthData } from '@/firebase/auth/school-auth';
import { QuickInput } from '@/components/nexus/quick-input';
import { ScopeCard } from '@/components/nexus/scope-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Trophy, 
  Zap,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import { collection, query, orderBy, doc, addDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { getOfflineProfile, OfflineProfile, getOfflineScopes, createOfflineScope } from '@/lib/offline-storage';

export default function LuminousDashboard() {
  // Try school auth first, fallback to Firebase auth
  const { user: schoolUser, loading: schoolLoading, loginWithSchool } = useSchoolAuth();
  const { user: firebaseUser, loading: userLoading } = useUser();
  const db = useFirestore();
  
  const user = schoolUser || firebaseUser;
  const loading = schoolLoading || userLoading;
  
  const [activeTab, setActiveTab] = useState<'scopes' | 'hub'>('scopes');
  const [schoolData, setSchoolData] = useState<SchoolAuthData>({
    schoolName: '',
    schoolId: '',
    studentName: '',
    studentEmail: '',
    nickname: '',
  });
  const [isSettingUp, setIsSettingUp] = useState(false);

  // Scope Creation State
  const [newScopeName, setNewScopeName] = useState('');
  const [newScopeDesc, setNewScopeDesc] = useState('');
  const [isCreatingScope, setIsCreatingScope] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState<OfflineProfile | null>(null);
  const [scopes, setScopes] = useState<any[]>([]);

  // Load profile and scopes from offline storage
  useEffect(() => {
    const loadLocalData = async () => {
      const localProfile = await getOfflineProfile();
      setProfile(localProfile || null);
      
      if (user?.uid) {
        const localScopes = await getOfflineScopes(user.uid);
        setScopes(localScopes);
      }
    };
    loadLocalData();
  }, [user]);

  const handleCreateProfile = async () => {
    if (!schoolData.schoolName || !schoolData.schoolId || !schoolData.studentName || !schoolData.studentEmail || !schoolData.nickname) {
      return;
    }
    setIsSettingUp(true);
    
    // Use school auth
    const result = await loginWithSchool(schoolData);
    
    if (result.success) {
      setProfile({
        id: 'current',
        nickname: schoolData.nickname,
        email: schoolData.studentEmail,
        studentId: result.studentId,
        rewardsBalance: 0,
        hasPaid: false,
        createdAt: new Date().toISOString(),
        synced: false,
      });
    }
    setIsSettingUp(false);
  };

  const handleCreateScope = async () => {
    if (!db || !user || !newScopeName) return;
    setIsCreatingScope(true);

    const scopeData = {
      id: `scope-${Date.now()}`,
      name: newScopeName,
      description: newScopeDesc,
      createdAt: new Date().toISOString(),
      tasks: [],
      color: 'blue',
      synced: false,
    };

    // Save to offline storage first
    await createOfflineScope(scopeData);
    
    // Try to sync to Firebase
    try {
      const scopesRef = collection(db, 'users', user.uid, 'scopes');
      await addDoc(scopesRef, scopeData);
    } catch (err) {
      const permissionError = new FirestorePermissionError({
        path: `users/${user.uid}/scopes`,
        operation: 'create',
        requestResourceData: scopeData
      });
      errorEmitter.emit('permission-error', permissionError);
    }
    
    setScopes([...scopes, scopeData]);
    setIsCreatingScope(false);
    setIsDialogOpen(false);
    setNewScopeName('');
    setNewScopeDesc('');
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Initial Onboarding / Profile Setup
  if (user && !profile) {
    return (
      <main className="max-w-md mx-auto mt-20 p-8 bg-white/[0.02] border border-white/5 rounded-2xl space-y-6">
        <div className="space-y-2 text-center">
          <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-light tracking-tight text-lunar">Moonbug Activation</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">School Registration</p>
        </div>
        
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="schoolName" className="text-[10px] uppercase tracking-widest text-muted-foreground">School Name</Label>
            <Input 
              id="schoolName"
              placeholder="e.g. Lincoln High"
              value={schoolData.schoolName}
              onChange={(e) => setSchoolData({...schoolData, schoolName: e.target.value})}
              className="bg-white/5 border-white/10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="schoolId" className="text-[10px] uppercase tracking-widest text-muted-foreground">School ID</Label>
            <Input 
              id="schoolId"
              placeholder="e.g. LINC-001"
              value={schoolData.schoolId}
              onChange={(e) => setSchoolData({...schoolData, schoolId: e.target.value})}
              className="bg-white/5 border-white/10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="studentName" className="text-[10px] uppercase tracking-widest text-muted-foreground">Student Name</Label>
            <Input 
              id="studentName"
              placeholder="e.g. Alex Johnson"
              value={schoolData.studentName}
              onChange={(e) => setSchoolData({...schoolData, studentName: e.target.value})}
              className="bg-white/5 border-white/10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="studentEmail" className="text-[10px] uppercase tracking-widest text-muted-foreground">Student Email</Label>
            <Input 
              id="studentEmail"
              placeholder="e.g. alex@school.edu"
              value={schoolData.studentEmail}
              onChange={(e) => setSchoolData({...schoolData, studentEmail: e.target.value})}
              className="bg-white/5 border-white/10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-[10px] uppercase tracking-widest text-muted-foreground">Nickname (Permanent)</Label>
            <Input 
              id="nickname"
              placeholder="e.g. Explorer_01"
              value={schoolData.nickname}
              onChange={(e) => setSchoolData({...schoolData, nickname: e.target.value})}
              className="bg-white/5 border-white/10"
            />
          </div>
          
          <Button 
            disabled={!schoolData.schoolName || !schoolData.schoolId || !schoolData.studentName || !schoolData.studentEmail || !schoolData.nickname || isSettingUp} 
            onClick={handleCreateProfile}
            className="w-full py-6 uppercase tracking-widest text-xs"
          >
            {isSettingUp ? 'Provisioning...' : 'Initialize Identity'}
          </Button>
          <p className="text-[9px] text-center text-muted-foreground leading-relaxed">
            Note: Identity changes require system credits after initial node setup.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 md:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* System Status / Branding */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Moonbug Node Alpha-01 Active</span>
          </div>
          <h1 className="text-4xl font-headline font-extralight tracking-tight text-lunar">
            Welcome, <span className="font-normal">{profile?.nickname || user?.displayName || 'Seeker'}</span>
          </h1>
          <p className="text-muted-foreground font-light max-w-xl text-sm leading-relaxed">
            Offline Productivity & Learning Interface. Syncing insight with global pedagogy.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-full border border-white/10">
          <div className="px-4 text-center border-r border-white/10">
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Balance</p>
            <p className="text-sm font-mono text-lunar">{profile?.rewardsBalance?.toFixed(4) || '0.0000'} SAT</p>
          </div>
          <Button variant="ghost" size="sm" className="rounded-full text-xs">
            Redeem <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

      {/* The Central Input Nexus */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000" />
        <QuickInput />
      </section>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-white/5">
        <button 
          onClick={() => setActiveTab('scopes')}
          className={`pb-4 px-6 text-xs uppercase tracking-[0.2em] font-medium transition-all ${activeTab === 'scopes' ? 'border-b-2 border-primary text-lunar' : 'text-muted-foreground'}`}
        >
          My Scopes
        </button>
        <button 
          onClick={() => setActiveTab('hub')}
          className={`pb-4 px-6 text-xs uppercase tracking-[0.2em] font-medium transition-all ${activeTab === 'hub' ? 'border-b-2 border-primary text-lunar' : 'text-muted-foreground'}`}
        >
          Learning Hub
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'scopes' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {scopes?.map((scope) => (
                <ScopeCard key={scope.id} scope={scope} />
              ))}
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-full min-h-[200px] border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-all rounded-xl flex flex-col gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">New Scope</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-obsidian border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-light tracking-tight text-lunar">Provision New Scope</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Scope Name</Label>
                      <Input 
                        placeholder="e.g. Physics 101" 
                        value={newScopeName}
                        onChange={(e) => setNewScopeName(e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Description</Label>
                      <Textarea 
                        placeholder="Focus area details..." 
                        value={newScopeDesc}
                        onChange={(e) => setNewScopeDesc(e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      disabled={!newScopeName || isCreatingScope} 
                      onClick={handleCreateScope}
                      className="w-full"
                    >
                      {isCreatingScope ? 'Syncing...' : 'Initialize Scope'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-blue-400" /> AI Insights
                </h3>
                <p className="text-xs text-muted-foreground font-light mb-4 leading-relaxed">
                  {scopes && scopes.length > 0 
                    ? `Node check: You have ${scopes.length} active Scopes. Your latest activity in "${scopes[0].name}" suggests a high focus period is optimal now.`
                    : "No active Scopes detected. Create a Scope to begin pedagogical tracking."}
                </p>
                <Button variant="link" className="p-0 h-auto text-[10px] uppercase text-blue-400">Expand Strategy</Button>
              </div>
              
              <div className="p-6 rounded-xl bg-purple-500/5 border border-purple-500/10">
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Trophy className="w-3 h-3 text-purple-400" /> Achievements
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-lunar/70">Note Streak</span>
                    <span className="text-[10px] font-mono text-purple-400">3 Days</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-purple-500/50" />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white/[0.01] border border-white/5">
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-3 h-3" /> System Logs
                </h3>
                <div className="space-y-2">
                  <p className="text-[9px] font-mono text-muted-foreground">12:00:01 - Sync initiated</p>
                  <p className="text-[9px] font-mono text-muted-foreground">12:05:44 - STT Model Ready</p>
                  <p className="text-[9px] font-mono text-green-500/50">12:10:12 - Local Node Secured</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all cursor-pointer group space-y-6">
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-lg bg-orange-500/10 text-orange-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-green-500 block">+0.0050 SAT</span>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest">Priority: High</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-light text-lunar group-hover:text-primary transition-colors">Community Resource Survey</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Identify essential survival and learning resources needed in your local zone. Your data helps NGOs allocate inventory.
                </p>
              </div>
              <div className="pt-4">
                <Button className="w-full text-xs uppercase tracking-widest py-6">Begin Participation</Button>
              </div>
            </div>

            <div className="p-8 rounded-xl bg-white/[0.01] border border-white/5 border-dashed flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground/30">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-light text-muted-foreground">More surveys provisioning...</p>
                <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]">ETA: 14:00 UTC</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <footer className="pt-12 border-t border-white/5 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">
            Moonbug OS v1.0.4-Alpha • Peer-to-Peer Pedagogy
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] text-muted-foreground hover:text-lunar cursor-pointer transition-colors uppercase tracking-widest">Docs</span>
            <span className="text-[10px] text-muted-foreground hover:text-lunar cursor-pointer transition-colors uppercase tracking-widest">Terms</span>
            <span className="text-[10px] text-muted-foreground hover:text-lunar cursor-pointer transition-colors uppercase tracking-widest">Privacy</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
