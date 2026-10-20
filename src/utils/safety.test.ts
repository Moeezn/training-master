import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateSymptomSafety, validateTrainingSessionStart } from './safety';
import { 
  calculateLevelFromXP, 
  validateWorkoutCompletion, 
  logRestDay, 
  resetStreakGracefully,
  recommendWorkoutCategory 
} from './progression';
import { UserTrainingProfile, Exercise } from '../types';

const mockProfile: UserTrainingProfile = {
  name: 'Guest Athlete',
  level: 3,
  xp: 350,
  currentStreak: 5,
  highestStreak: 7,
  lastTrainedDate: '2026-10-19',
  restDaysTaken: 2,
  totalWorkoutsCompleted: 12,
  fatigueScore: 4,
  reportedPainIncidents: [],
  disclaimer: {
    acknowledged: false,
    version: '2026.1',
    reviewedCount: 0
  },
  cameraConsentGiven: false,
  preferredTrackingMode: 'manual'
};

const mockExercise: Exercise = {
  id: 'test_pushups',
  title: 'Test Pushup',
  category: 'calisthenics',
  difficulty: 'intermediate',
  targetReps: 10,
  demanding: true,
  safetyReminders: ['Keep core braced'],
  warmupRequired: 'Wrist circles',
  cooldownRecommended: 'Chest stretch',
  accessibleDescription: 'Pushup description',
  formCues: [],
  commonMistakes: [],
  hydrationTip: 'Drink water',
  iconName: 'Shield'
};

test('Safety: Disclaimer is strictly required before first training session', () => {
  const resultUnacknowledged = validateTrainingSessionStart(mockProfile.disclaimer, mockProfile.fatigueScore);
  assert.equal(resultUnacknowledged.allowed, false);
  assert.equal(resultUnacknowledged.requiresDisclaimer, true);

  const acknowledgedDisclaimer = { ...mockProfile.disclaimer, acknowledged: true, acknowledgedAt: '2026-10-20' };
  const resultAcknowledged = validateTrainingSessionStart(acknowledgedDisclaimer, 4);
  assert.equal(resultAcknowledged.allowed, true);
});

test('Safety: Excessive fatigue (9+) locks demanding workouts', () => {
  const acknowledgedDisclaimer = { ...mockProfile.disclaimer, acknowledged: true };
  const resultFatigued = validateTrainingSessionStart(acknowledgedDisclaimer, 9);
  assert.equal(resultFatigued.allowed, false);
  assert.match(resultFatigued.reason || '', /fatigue/i);
});

test('Safety: Red-flag symptoms trigger immediate critical medical stop', () => {
  const chestPainResult = evaluateSymptomSafety('I am feeling chest pain and pressure during sets');
  assert.equal(chestPainResult.isCriticalStop, true);
  assert.equal(chestPainResult.requiresMedicalAssistance, true);
  assert.equal(chestPainResult.recommendedAction, 'see_doctor');

  const dizzinessResult = evaluateSymptomSafety('I felt sudden dizziness after the last rep');
  assert.equal(dizzinessResult.isCriticalStop, true);
  assert.equal(dizzinessResult.requiresMedicalAssistance, true);
});

test('Safety: Moderate pain triggers safety halt without penalization', () => {
  const painResult = evaluateSymptomSafety('My wrist hurts when I press');
  assert.equal(painResult.isCriticalStop, true);
  assert.equal(painResult.recommendedAction, 'stop_now');
});

test('Progression: Missed days do NOT deduct earned levels', () => {
  // If user earned Level 3, logging rest or missing days NEVER lowers their level
  const afterRest = logRestDay(mockProfile);
  assert.equal(afterRest.level, 3);
  assert.equal(afterRest.xp, 350);
  assert.equal(afterRest.restDaysTaken, 3);
  assert.ok(afterRest.fatigueScore < mockProfile.fatigueScore);
});

test('Progression: Streak reset occurs without punitive exercise requirements', () => {
  const resetProfile = resetStreakGracefully(mockProfile);
  assert.equal(resetProfile.currentStreak, 0);
  assert.equal(resetProfile.level, 3); // Level preserved
  assert.equal(resetProfile.xp, 350);   // XP preserved
});

test('Progression: Workouts stopped due to pain award NO gamification points to avoid encouraging injury', () => {
  const result = validateWorkoutCompletion(
    mockProfile,
    mockExercise,
    5,
    true, // stoppedDueToPain = true
    45
  );
  assert.equal(result.valid, false);
  assert.equal(result.xpAwarded, 0);
  assert.match(result.message, /halted safely due to reported pain/i);
});

test('Progression: Valid workout rewards appropriate XP without overexertion', () => {
  const result = validateWorkoutCompletion(
    mockProfile,
    mockExercise,
    10,
    false,
    60
  );
  assert.equal(result.valid, true);
  assert.ok(result.xpAwarded > 0);
  assert.ok(result.newLevel >= mockProfile.level);
});

test('Progression: Recommends recovery when fatigue is high, regardless of level', () => {
  const highFatigueRec = recommendWorkoutCategory(8, 5); // Level 5 but fatigue 8
  assert.equal(highFatigueRec.recommendedCategory, 'active_recovery');
  assert.equal(highFatigueRec.intensityRecommendation, 'Gentle Recovery');
});
