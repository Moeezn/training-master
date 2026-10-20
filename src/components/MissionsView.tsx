import React, { useState } from 'react';
import { 
  Dumbbell, 
  Flame, 
  ShieldAlert, 
  ArrowRight, 
  Filter, 
  Play, 
  AlertTriangle,
  Heart,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Exercise, ExerciseCategory, DifficultyLevel, UserTrainingProfile } from '../types';
import { EXERCISES, MISSIONS_LIST } from '../data/exercises';

interface MissionsViewProps {
  profile: UserTrainingProfile;
  onSelectExercise: (exercise: Exercise) => void;
  onOpenDisclaimer: () => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  profile,
  onSelectExercise,
  onOpenDisclaimer
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredExercises = EXERCISES.filter((ex) => {
    if (selectedCategory !== 'all' && ex.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && ex.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const handleStart = (exercise: Exercise) => {
    if (!profile.disclaimer.acknowledged) {
      onOpenDisclaimer();
      return;
    }
    onSelectExercise(exercise);
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
            Training Missions & Curriculum
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Progressive conditioning and martial arts mechanics with verified safety regressions
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
            {(['all', 'calisthenics', 'martial_arts', 'active_recovery'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'all' && 'All'}
                {cat === 'calisthenics' && 'Calisthenics'}
                {cat === 'martial_arts' && 'Martial Arts'}
                {cat === 'active_recovery' && 'Recovery'}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  selectedDifficulty === diff
                    ? 'bg-slate-800 text-slate-100 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff === 'all' && 'Any Level'}
                {diff === 'beginner' && 'Beginner'}
                {diff === 'intermediate' && 'Intermediate'}
                {diff === 'advanced' && 'Advanced'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Notice regarding high difficulty */}
      {profile.fatigueScore >= 7 && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Recovery Advisory:</strong> Your current fatigue score is {profile.fatigueScore}/10. Demanding martial arts kicks or high-rep calisthenics should be postponed in favor of gentle recovery or slow mechanics.
          </span>
        </div>
      )}

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExercises.map((exercise) => (
          <div 
            key={exercise.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition space-y-4"
          >
            <div className="space-y-3">
              {/* Category, Difficulty & Demanding Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono uppercase text-slate-400">
                  {exercise.category.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                    exercise.difficulty === 'beginner'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : exercise.difficulty === 'intermediate'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                  }`}>
                    {exercise.difficulty}
                  </span>
                  {exercise.demanding && (
                    <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Demanding
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-bold text-slate-100">{exercise.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {exercise.accessibleDescription}
                </p>
              </div>

              {/* Contextual Warning / Safety Notes */}
              {exercise.contextualWarning ? (
                <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                  <strong>Joint Safety Notice:</strong> {exercise.contextualWarning}
                </div>
              ) : (
                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                  {exercise.safetyReminders[0]}
                </div>
              )}

              {/* Warmup & Regression info */}
              <div className="space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Target: {exercise.targetReps ? `${exercise.targetReps} Reps` : `${exercise.durationSeconds}s`}</span>
                  {exercise.easierAlternativeName && (
                    <span className="text-emerald-400/90 font-medium">
                      Easier: {exercise.easierAlternativeName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              type="button"
              onClick={() => handleStart(exercise)}
              className="w-full py-2.5 px-4 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              {profile.disclaimer.acknowledged ? 'Start Exercise' : 'Acknowledge Disclaimer & Start'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
