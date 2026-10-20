/**
 * Core type definitions for AI Training Master
 */

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseCategory = 
  | 'calisthenics' 
  | 'martial_arts' 
  | 'mobility_cooldown' 
  | 'active_recovery';

export interface ExerciseFormCue {
  phase: string;
  instruction: string;
  breathing: string;
}

export interface Exercise {
  id: string;
  title: string;
  category: ExerciseCategory;
  difficulty: DifficultyLevel;
  durationSeconds?: number;
  targetReps?: number;
  demanding: boolean; // Triggers contextual safety reminder
  contextualWarning?: string;
  safetyReminders: string[];
  easierAlternativeId?: string;
  easierAlternativeName?: string;
  warmupRequired: string;
  cooldownRecommended: string;
  accessibleDescription: string;
  formCues: ExerciseFormCue[];
  commonMistakes: string[];
  hydrationTip: string;
  iconName: string;
}

export interface DisclaimerState {
  acknowledged: boolean;
  acknowledgedAt?: string;
  version: string;
  reviewedCount: number;
}

export interface UserTrainingProfile {
  name: string;
  level: number;
  xp: number;
  currentStreak: number;
  highestStreak: number;
  lastTrainedDate?: string; // YYYY-MM-DD
  restDaysTaken: number;
  totalWorkoutsCompleted: number;
  fatigueScore: number; // 0 to 10
  reportedPainIncidents: PainReport[];
  disclaimer: DisclaimerState;
  cameraConsentGiven: boolean;
  preferredTrackingMode: 'manual' | 'camera';
}

export interface PainReport {
  id: string;
  timestamp: string;
  exerciseId: string;
  exerciseTitle: string;
  severity: 'mild_discomfort' | 'moderate_pain' | 'severe_or_acute';
  location: string;
  notes?: string;
  actionTaken: 'switched_alternative' | 'emergency_stopped' | 'rested';
}

export interface TrainingSessionState {
  exercise: Exercise;
  currentReps: number;
  targetReps: number;
  timeRemaining: number;
  isPaused: boolean;
  isResting: boolean;
  restTimeRemaining: number;
  safetyModalAcknowledged: boolean;
  completed: boolean;
  stoppedDueToPain: boolean;
  activeAlternative?: Exercise;
}

export interface AICoachMessage {
  id: string;
  sender: 'user' | 'coach' | 'system_alert';
  text: string;
  timestamp: string;
  isSafetyWarning?: boolean;
  recommendedAction?: 'stop_now' | 'see_doctor' | 'hydrate' | 'take_rest' | 'continue_mindfully';
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: ExerciseCategory;
  difficulty: DifficultyLevel;
  exercises: Exercise[];
  xpReward: number;
  recoveryCost: number; // 1 to 5 fatigue impact
  completed: boolean;
}
