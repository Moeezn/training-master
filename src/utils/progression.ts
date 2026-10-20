/**
 * Non-punitive Progression & Reward Engine
 * Enforces safety over gamification:
 * - Never penalizes users by demoting levels for missed days
 * - Streak resets cleanly without demanding double workout penalties
 * - Rest days preserve health and lower fatigue
 * - Prohibits rewards when exercises were dangerously rushed or pain was ignored
 */

import { UserTrainingProfile, Mission, Exercise } from '../types';

export const XP_PER_LEVEL = 150;

/**
 * Calculates current level from total earned XP.
 * Earned levels are permanent and NEVER deducted for missed training days.
 */
export function calculateLevelFromXP(totalXP: number): number {
  if (totalXP < 0) return 1;
  return Math.floor(totalXP / XP_PER_LEVEL) + 1;
}

export interface CompletionValidationResult {
  valid: boolean;
  xpAwarded: number;
  newStreak: number;
  newLevel: number;
  newFatigueScore: number;
  message: string;
  isRecoverySession: boolean;
}

/**
 * Validates mission completion securely.
 * Rejects completion claims if the workout was stopped due to pain,
 * or if safety requirements were bypassed.
 */
export function validateWorkoutCompletion(
  profile: UserTrainingProfile,
  exercise: Exercise,
  actualReps: number,
  stoppedDueToPain: boolean,
  durationSecondsWorked: number
): CompletionValidationResult {
  // Rule: Never reward users for ignoring pain or completing exercises while in acute pain
  if (stoppedDueToPain) {
    return {
      valid: false,
      xpAwarded: 0,
      newStreak: profile.currentStreak,
      newLevel: profile.level,
      newFatigueScore: Math.max(0, profile.fatigueScore - 1),
      message: 'Session halted safely due to reported pain. Health and safety come first; no gamification pressure applied.',
      isRecoverySession: false
    };
  }

  // Minimum effort check to prevent accidental zero-rep submissions
  const minRequiredReps = Math.max(1, Math.floor((exercise.targetReps || 5) * 0.4));
  if (actualReps < minRequiredReps && durationSecondsWorked < 15) {
    return {
      valid: false,
      xpAwarded: 0,
      newStreak: profile.currentStreak,
      newLevel: profile.level,
      newFatigueScore: profile.fatigueScore,
      message: 'Workout was too brief to validate completion. Try practicing at a gentle pace or using an easier alternative.',
      isRecoverySession: false
    };
  }

  // Base XP calculation based on difficulty
  const baseXP = exercise.difficulty === 'advanced' ? 50 : exercise.difficulty === 'intermediate' ? 35 : 20;
  const newXP = profile.xp + baseXP;
  const newLevel = calculateLevelFromXP(newXP);

  // Non-punitive streak logic
  const today = new Date().toISOString().split('T')[0];
  let newStreak = profile.currentStreak;

  if (profile.lastTrainedDate !== today) {
    newStreak += 1;
  }

  const isRecoverySession = exercise.category === 'active_recovery' || exercise.category === 'mobility_cooldown';
  // Recovery reduces fatigue, demanding workouts add fatigue
  const fatigueDelta = isRecoverySession ? -2 : (exercise.demanding ? 2 : 1);
  const newFatigue = Math.max(0, Math.min(10, profile.fatigueScore + fatigueDelta));

  return {
    valid: true,
    xpAwarded: baseXP,
    newStreak,
    newLevel: Math.max(profile.level, newLevel), // Level can never decrease
    newFatigueScore: newFatigue,
    message: `Session completed safely! +${baseXP} XP earned. Great form awareness.`,
    isRecoverySession
  };
}

/**
 * Handles missed days or intentional rest day logging.
 * CRITICAL RULE: Missed days do NOT delete or deduct earned levels!
 * Rest days can be taken freely without punitive exercise demands.
 */
export function logRestDay(profile: UserTrainingProfile): UserTrainingProfile {
  return {
    ...profile,
    restDaysTaken: profile.restDaysTaken + 1,
    // Rest day lowers fatigue substantially
    fatigueScore: Math.max(0, profile.fatigueScore - 3),
    // Level is strictly preserved!
    level: profile.level,
    xp: profile.xp
  };
}

/**
 * Resets user streak cleanly if requested, with ZERO punitive exercise requirements.
 */
export function resetStreakGracefully(profile: UserTrainingProfile): UserTrainingProfile {
  return {
    ...profile,
    currentStreak: 0,
    // Level and XP remain untouched
    level: profile.level,
    xp: profile.xp
  };
}

/**
 * Recommends appropriate workouts based on fatigue, not level alone.
 * Avoids recommending demanding exercises to exhausted users.
 */
export function recommendWorkoutCategory(fatigueScore: number, userLevel: number): {
  recommendedCategory: Exercise.category;
  intensityRecommendation: 'Gentle Recovery' | 'Balanced Technique' | 'High Intensity';
  safetyNote: string;
} {
  if (fatigueScore >= 7) {
    return {
      recommendedCategory: 'active_recovery',
      intensityRecommendation: 'Gentle Recovery',
      safetyNote: 'Your fatigue index is high (7+/10). Even at advanced levels, high-intensity workouts increase injury risk. Prioritize mobility, hydration, and joint care today.'
    };
  }

  if (fatigueScore >= 4) {
    return {
      recommendedCategory: 'calisthenics',
      intensityRecommendation: 'Balanced Technique',
      safetyNote: 'Moderate fatigue detected. Focus on precise form, controlled tempo, and adequate rest intervals.'
    };
  }

  return {
    recommendedCategory: userLevel >= 3 ? 'martial_arts' : 'calisthenics',
    intensityRecommendation: 'Balanced Technique',
    safetyNote: 'Well rested. Remember to warm up thoroughly before demanding sets.'
  };
}
