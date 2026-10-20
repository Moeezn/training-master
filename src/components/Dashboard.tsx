import React from 'react';
import { 
  Shield, 
  Flame, 
  BatteryCharging, 
  Play, 
  Coffee, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Info, 
  Sparkles,
  ArrowRight,
  HeartHandshake
} from 'lucide-react';
import { UserTrainingProfile, Exercise } from '../types';
import { recommendWorkoutCategory } from '../utils/progression';
import { EXERCISES } from '../data/exercises';

interface DashboardProps {
  profile: UserTrainingProfile;
  onStartExercise: (exercise: Exercise) => void;
  onLogRestDay: () => void;
  onOpenDisclaimer: () => void;
  onNavigateToMissions: () => void;
  onNavigateToAICoach: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  onStartExercise,
  onLogRestDay,
  onOpenDisclaimer,
  onNavigateToMissions,
  onNavigateToAICoach
}) => {
  const recommendation = recommendWorkoutCategory(profile.fatigueScore, profile.level);
  const recommendedExercise = EXERCISES.find(e => e.category === recommendation.recommendedCategory) || EXERCISES[0];

  return (
    <div className="space-y-6">
      {/* 1. Safety Disclaimer Status Banner */}
      {!profile.disclaimer.acknowledged ? (
        <div className="p-4 sm:p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-200">
                Safety Disclaimer Acknowledgement Required
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Before your first session, you must review the medical guidance, non-waiver of legal rights, and emergency stop terms.
              </p>
            </div>
          </div>
          <button
            type="button"
            id="dashboard-open-disclaimer-btn"
            onClick={onOpenDisclaimer}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shrink-0 shadow-sm"
          >
            Review & Acknowledge
          </button>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>Safety Verified:</strong> Safety disclaimer acknowledged ({profile.disclaimer.reviewedCount} review{profile.disclaimer.reviewedCount === 1 ? '' : 's'}).
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenDisclaimer}
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4"
          >
            Re-read Disclaimer
          </button>
        </div>
      )}

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Non-Punitive Level & XP */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Progression Level</span>
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Permanent
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 flex items-baseline gap-2">
            <span>Level {profile.level}</span>
            <span className="text-xs font-normal text-slate-400">({profile.xp} XP total)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Missed days never deduct earned levels or XP. Your training progress is strictly preserved.
          </p>
        </div>

        {/* Card 2: Safe Streak & Rest Tracking */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Training Consistency</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 flex items-baseline gap-2">
            <span>{profile.currentStreak} Days</span>
            <span className="text-xs font-normal text-slate-400">(Best: {profile.highestStreak})</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            {profile.restDaysTaken} scheduled recovery day{profile.restDaysTaken === 1 ? '' : 's'} logged. Rest days protect muscle repair.
          </p>
        </div>

        {/* Card 3: Fatigue Index & Recovery Score */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Fatigue & Joint Readiness</span>
            <BatteryCharging className={`w-4 h-4 ${profile.fatigueScore >= 7 ? 'text-rose-400' : profile.fatigueScore >= 4 ? 'text-amber-400' : 'text-emerald-400'}`} />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 flex items-baseline gap-2">
            <span className={profile.fatigueScore >= 7 ? 'text-rose-400' : profile.fatigueScore >= 4 ? 'text-amber-400' : 'text-emerald-400'}>
              {profile.fatigueScore}/10
            </span>
            <span className="text-xs font-medium text-slate-300">
              {profile.fatigueScore >= 7 ? 'High Strain' : profile.fatigueScore >= 4 ? 'Moderate' : 'Optimal'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            {recommendation.intensityRecommendation} protocol recommended for optimal joint longevity.
          </p>
        </div>
      </div>

      {/* 3. Adaptive Today's Recommendation & Quick Rest Action */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 font-mono">
              Fatigue-Aware Adaptive Engine
            </span>
            <h3 className="text-base font-bold text-slate-100 mt-0.5">
              Today's Recommended Session
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="log-rest-day-btn"
              onClick={onLogRestDay}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition border border-slate-700"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              Log Rest Day (-3 Fatigue)
            </button>
          </div>
        </div>

        {/* Safety Note on Fatigue Adaptation */}
        <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start gap-3 text-xs">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-slate-300 leading-relaxed">
            {recommendation.safetyNote}
          </p>
        </div>

        {/* Recommended Exercise Card */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-base">
                {recommendedExercise.title}
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {recommendedExercise.category.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              {recommendedExercise.accessibleDescription}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
              <span>Warmup: {recommendedExercise.warmupRequired}</span>
              {recommendedExercise.easierAlternativeName && (
                <span className="text-emerald-400/90">· Regression available</span>
              )}
            </div>
          </div>

          <button
            type="button"
            id="start-recommended-session-btn"
            onClick={() => onStartExercise(recommendedExercise)}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 shrink-0"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            Start Session
          </button>
        </div>
      </div>

      {/* 4. Secondary Row: AI Coach Shortcut & Reported Pain History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI Safety Coach Shortcut */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <HeartHandshake className="w-5 h-5" />
              <h4 className="font-bold text-sm text-slate-200">AI Safety Coach</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask form questions, get personalized warm-up routines, or clarify joint discomfort. Automated red-flag symptom filters ensure immediate medical stop recommendations when needed.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToAICoach}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-between transition"
          >
            <span>Consult AI Coach</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Reported Pain Incidents History */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-200">Pain & Recovery Log</h4>
            <span className="text-xs text-slate-500">
              {profile.reportedPainIncidents.length} incident{profile.reportedPainIncidents.length === 1 ? '' : 's'}
            </span>
          </div>

          {profile.reportedPainIncidents.length === 0 ? (
            <p className="text-xs text-slate-400 py-3">
              No pain or injury halts reported. You are training safely within personal physical limits.
            </p>
          ) : (
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {profile.reportedPainIncidents.slice(0, 3).map((inc) => (
                <div key={inc.id} className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-300 font-medium">
                    <span>{inc.exerciseTitle} ({inc.location})</span>
                    <span className="text-rose-400 text-[10px] font-mono capitalize">
                      {inc.severity.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Logged at {new Date(inc.timestamp).toLocaleDateString()}. Demands halted safely.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
