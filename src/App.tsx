/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DisclaimerModal } from './components/DisclaimerModal';
import { Dashboard } from './components/Dashboard';
import { MissionsView } from './components/MissionsView';
import { AICoachView } from './components/AICoachView';
import { SettingsView } from './components/SettingsView';
import { SafetyAuditView } from './components/SafetyAuditView';
import { TrainingSession } from './components/TrainingSession';
import { UserTrainingProfile, Exercise, DisclaimerState } from './types';
import { logRestDay } from './utils/progression';
import { DISCLAIMER_VERSION } from './utils/safety';
import { CheckCircle, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'ai_training_master_profile_v1';

const INITIAL_PROFILE: UserTrainingProfile = {
  name: 'Guest Athlete',
  level: 1,
  xp: 45,
  currentStreak: 1,
  highestStreak: 3,
  lastTrainedDate: new Date().toISOString().split('T')[0],
  restDaysTaken: 1,
  totalWorkoutsCompleted: 2,
  fatigueScore: 2,
  reportedPainIncidents: [],
  disclaimer: {
    acknowledged: false,
    version: DISCLAIMER_VERSION,
    reviewedCount: 0
  },
  cameraConsentGiven: false,
  preferredTrackingMode: 'manual'
};

export default function App() {
  const [profile, setProfile] = useState<UserTrainingProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback if local storage restricted
    }
    return INITIAL_PROFILE;
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);
  const [isMandatoryDisclaimer, setIsMandatoryDisclaimer] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore storage errors in sandbox
    }
  }, [profile]);

  const showNotification = (message: string, type: 'success' | 'alert' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleOpenDisclaimer = (mandatory = false) => {
    setIsMandatoryDisclaimer(mandatory);
    setIsDisclaimerOpen(true);
  };

  const handleAcknowledgeDisclaimer = (newState: DisclaimerState) => {
    setProfile((prev) => ({
      ...prev,
      disclaimer: newState
    }));
    showNotification('Safety Disclaimer acknowledged. Training access enabled.', 'success');
  };

  const handleStartExercise = (exercise: Exercise) => {
    if (!profile.disclaimer.acknowledged) {
      handleOpenDisclaimer(true);
      return;
    }
    setActiveExercise(exercise);
    setCurrentTab('training');
  };

  const handleFinishWorkout = (updatedProfile: UserTrainingProfile, summaryMsg: string) => {
    setProfile(updatedProfile);
    setActiveExercise(null);
    setCurrentTab('dashboard');
    showNotification(summaryMsg, summaryMsg.includes('EMERGENCY') ? 'alert' : 'success');
  };

  const handleCancelWorkout = () => {
    setActiveExercise(null);
    setCurrentTab('dashboard');
    showNotification('Workout ended safely. No penalties applied.', 'success');
  };

  const handleLogRestDay = () => {
    const updated = logRestDay(profile);
    setProfile(updated);
    showNotification('Rest day recorded! Fatigue reduced by 3 points. Streak & Level preserved.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Permanent Header */}
      <Header
        profile={profile}
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveExercise(null);
          setCurrentTab(tab);
        }}
        onOpenDisclaimer={() => handleOpenDisclaimer(false)}
      />

      {/* Global Toast Notification */}
      {notification && (
        <div 
          className="fixed bottom-6 right-6 z-50 max-w-md animate-slide-up"
          role="status"
          aria-live="polite"
        >
          <div className={`p-4 rounded-xl border shadow-2xl flex items-start gap-3 backdrop-blur-md ${
            notification.type === 'alert'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
          }`}>
            {notification.type === 'alert' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <p className="text-xs leading-relaxed font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'training' && activeExercise ? (
          <TrainingSession
            exercise={activeExercise}
            profile={profile}
            onFinishWorkout={handleFinishWorkout}
            onCancel={handleCancelWorkout}
            onOpenDisclaimer={() => handleOpenDisclaimer(false)}
          />
        ) : currentTab === 'missions' ? (
          <MissionsView
            profile={profile}
            onSelectExercise={handleStartExercise}
            onOpenDisclaimer={() => handleOpenDisclaimer(true)}
          />
        ) : currentTab === 'aicoach' ? (
          <AICoachView
            profile={profile}
            onOpenDisclaimer={() => handleOpenDisclaimer(false)}
          />
        ) : currentTab === 'audit' ? (
          <SafetyAuditView
            profile={profile}
            onOpenDisclaimer={() => handleOpenDisclaimer(false)}
            onSimulateWorkout={() => handleStartExercise(activeExercise || undefined!)}
          />
        ) : currentTab === 'settings' ? (
          <SettingsView
            profile={profile}
            onUpdateProfile={setProfile}
            onOpenDisclaimer={() => handleOpenDisclaimer(false)}
          />
        ) : (
          <Dashboard
            profile={profile}
            onStartExercise={handleStartExercise}
            onLogRestDay={handleLogRestDay}
            onOpenDisclaimer={() => handleOpenDisclaimer(false)}
            onNavigateToMissions={() => setCurrentTab('missions')}
            onNavigateToAICoach={() => setCurrentTab('aicoach')}
          />
        )}
      </main>

      {/* Permanent Footer with persistent Safety & Disclaimer link */}
      <Footer onOpenDisclaimer={() => handleOpenDisclaimer(false)} />

      {/* Accessible Safety & Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
        disclaimerState={profile.disclaimer}
        onAcknowledge={handleAcknowledgeDisclaimer}
        isMandatoryFirstTime={isMandatoryDisclaimer && !profile.disclaimer.acknowledged}
      />
    </div>
  );
}
