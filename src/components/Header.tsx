import React from 'react';
import { 
  Shield, 
  Flame, 
  BatteryCharging, 
  Sparkles, 
  HeartHandshake, 
  Sliders, 
  TestTube2, 
  BookOpen,
  Dumbbell
} from 'lucide-react';
import { UserTrainingProfile } from '../types';

interface HeaderProps {
  profile: UserTrainingProfile;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenDisclaimer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  currentTab,
  onSelectTab,
  onOpenDisclaimer
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with Branding, Stats, and Permanent Safety Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-3.5 gap-3 border-b border-slate-800/60">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                <Shield className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  AI Training Master
                  <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Safe Adaptive
                  </span>
                </span>
                <span className="text-xs text-slate-400 block">
                  Non-Punitive Conditioning & Martial Arts
                </span>
              </div>
            </div>

            {/* Permanent Safety & Disclaimer button (Mobile accessible) */}
            <button
              onClick={onOpenDisclaimer}
              id="header-disclaimer-btn"
              className="sm:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 text-emerald-400 hover:bg-slate-800 transition"
              aria-label="View Safety and Disclaimer"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Safety
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs text-slate-300 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto pb-1 sm:pb-0">
            {/* Level & XP */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Level</span>
              <span className="font-bold text-slate-100 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                {profile.level}
              </span>
              <span className="text-slate-500 font-mono text-[11px]">({profile.xp} XP)</span>
            </div>

            {/* Non-punitive Streak */}
            <div className="flex items-center gap-1.5" title="Missed days never deduct your level. Rest days maintain recovery!">
              <Flame className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span className="font-semibold text-slate-200">{profile.currentStreak} Day Streak</span>
              <span className="text-[10px] text-emerald-400 hidden md:inline">· Protected</span>
            </div>

            {/* Fatigue / Recovery Index */}
            <div className="flex items-center gap-1.5" title={`Fatigue Level: ${profile.fatigueScore}/10`}>
              <BatteryCharging className={`w-4 h-4 ${profile.fatigueScore >= 7 ? 'text-rose-400' : profile.fatigueScore >= 4 ? 'text-amber-400' : 'text-emerald-400'}`} aria-hidden="true" />
              <span className="text-slate-400">Fatigue:</span>
              <span className={`font-mono font-bold ${profile.fatigueScore >= 7 ? 'text-rose-400' : profile.fatigueScore >= 4 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {profile.fatigueScore}/10
              </span>
            </div>

            {/* Permanent Safety & Disclaimer Header Action (Desktop) */}
            <button
              onClick={onOpenDisclaimer}
              id="header-disclaimer-desktop-btn"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 text-emerald-400 hover:bg-slate-800 transition shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Safety & Disclaimer
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 py-2 overflow-x-auto no-scrollbar text-xs font-medium" aria-label="Main Navigation">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'dashboard'
                ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => onSelectTab('missions')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'missions'
                ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            Training Missions
          </button>

          <button
            onClick={() => onSelectTab('aicoach')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'aicoach'
                ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            AI Safety Coach
          </button>

          <button
            onClick={() => onSelectTab('audit')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'audit'
                ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <TestTube2 className="w-3.5 h-3.5" />
            Safety Audit & Verification
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'settings'
                ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Settings & Privacy
          </button>
        </nav>
      </div>
    </header>
  );
};
