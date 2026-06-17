"use client";

import React, { useState, useEffect } from 'react';
import { defaultSurveys, educationParties, resourceTypes } from '@/lib/surveys-data';
import { getOfflineSurveys, saveOfflineSurvey, getOfflineProfile, saveOfflineProfile } from '@/lib/offline-storage';
import { OfflineSurvey } from '@/lib/offline-storage';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ClipboardList, 
  Users, 
  Heart, 
  GraduationCap, 
  Building2, 
  HandCoins,
  CheckCircle2,
  Circle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<OfflineSurvey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<OfflineSurvey | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [rewardsBalance, setRewardsBalance] = useState(0);

  useEffect(() => {
    loadSurveys();
    loadProfile();
  }, []);

  const loadSurveys = async () => {
    const offlineSurveys = await getOfflineSurveys();
    if (offlineSurveys.length === 0) {
      // Initialize with default surveys
      for (const survey of defaultSurveys) {
        await saveOfflineSurvey(survey);
      }
      setSurveys(defaultSurveys);
    } else {
      setSurveys(offlineSurveys);
    }
  };

  const loadProfile = async () => {
    const profile = await getOfflineProfile();
    if (profile) {
      setRewardsBalance(profile.rewardsBalance);
    }
  };

  const handleSurveyComplete = async () => {
    if (!selectedSurvey) return;
    
    const updatedSurvey = {
      ...selectedSurvey,
      responses: Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer
      })),
      completed: true
    };
    
    await saveOfflineSurvey(updatedSurvey);
    
    // Update rewards
    const profile = await getOfflineProfile();
    if (profile) {
      const updatedProfile = {
        ...profile,
        rewardsBalance: profile.rewardsBalance + selectedSurvey.reward
      };
      await saveOfflineProfile(updatedProfile);
      setRewardsBalance(updatedProfile.rewardsBalance);
    }
    
    setSurveys(surveys.map(s => s.id === selectedSurvey.id ? updatedSurvey : s));
    setSelectedSurvey(null);
    setResponses({});
  };

  const getPartyIcon = (party: string) => {
    switch (party) {
      case 'ngos': return <Heart className="w-4 h-4" />;
      case 'anonymous': return <Users className="w-4 h-4" />;
      case 'government': return <Building2 className="w-4 h-4" />;
      case 'investors': return <HandCoins className="w-4 h-4" />;
      default: return <GraduationCap className="w-4 h-4" />;
    }
  };

  if (selectedSurvey) {
    return (
      <main className="p-6 md:p-12 max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSelectedSurvey(null)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-light tracking-tight text-lunar">
            {selectedSurvey.title}
          </h1>
        </div>

        <p className="text-muted-foreground font-light">
          {selectedSurvey.description}
        </p>

        <div className="space-y-6">
          {selectedSurvey.questions.map((question, index) => (
            <div key={question.id} className="p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs">
                  Q{index + 1}
                </Badge>
                <p className="text-lunar font-light">{question.question}</p>
              </div>

              {question.type === 'text' && (
                <textarea
                  className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-lunar font-light resize-none focus:outline-none focus:border-primary"
                  placeholder="Your answer..."
                  value={responses[question.id] || ''}
                  onChange={(e) => setResponses({...responses, [question.id]: e.target.value})}
                />
              )}

              {question.type === 'rating' && (
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setResponses({...responses, [question.id]: rating.toString()})}
                      className={`w-10 h-10 rounded-lg border transition-all ${
                        responses[question.id] === rating.toString()
                          ? 'bg-primary text-lunar border-primary'
                          : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              )}

              {question.type === 'multiple-choice' && question.options && (
                <div className="space-y-2">
                  {question.options.map(option => (
                    <label
                      key={option}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={responses[question.id] === option}
                        onChange={(e) => setResponses({...responses, [question.id]: e.target.value})}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-lunar font-light">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSurveyComplete}
            disabled={Object.keys(responses).length < selectedSurvey.questions.length}
            className="px-8 py-6 uppercase tracking-widest"
          >
            Complete Survey (+{selectedSurvey.reward} SAT)
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              Learning Hub Active
            </span>
          </div>
          <h1 className="text-4xl font-headline font-extralight tracking-tight text-lunar">
            Community Surveys
          </h1>
          <p className="text-muted-foreground font-light max-w-xl text-sm leading-relaxed">
            Participate in surveys to identify essential resources and earn SAT rewards.
            Your data helps NGOs, government projects, and investors allocate resources effectively.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-full border border-white/10">
          <div className="px-4 text-center border-r border-white/10">
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Balance</p>
            <p className="text-sm font-mono text-lunar">{rewardsBalance.toFixed(4)} SAT</p>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-full text-xs">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Parties Section */}
      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
          Parties Benefiting from Survey Data
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(educationParties).map(([key, party]) => (
            <Card key={key} className="bg-white/[0.02] border-white/5">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {getPartyIcon(key)}
                  <CardTitle className="text-sm font-light">{party.name}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {party.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {party.benefits.map((benefit, i) => (
                    <li key={i} className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Surveys List */}
      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
          Available Surveys
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map(survey => (
            <Card 
              key={survey.id} 
              className={`bg-white/[0.02] border transition-all cursor-pointer ${
                survey.completed ? 'border-green-500/20' : 'border-white/5 hover:border-primary/20'
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  {survey.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <CardTitle className="text-lg font-light">
                  {survey.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {survey.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-green-500">
                    +{survey.reward} SAT
                  </span>
                  <Button 
                    size="sm"
                    variant={survey.completed ? "outline" : "default"}
                    onClick={() => setSelectedSurvey(survey)}
                    disabled={survey.completed}
                  >
                    {survey.completed ? 'Completed' : 'Start'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}