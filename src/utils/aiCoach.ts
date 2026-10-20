/**
 * AI Coach Safeguard Engine
 * Implements strict automated safeguards:
 * - Red-flag symptom interception and emergency triage
 * - Anti-diagnosis and anti-prescription enforcement
 * - Safe deterministic fallbacks when offline or API is unconfigured
 */

import { AICoachMessage } from '../types';
import { evaluateSymptomSafety } from './safety';

export const AI_COACH_SYSTEM_PROMPT = `
You are the AI Training Master Safety Coach.
CRITICAL SAFETY & ETHICAL DIRECTIVES:
1. DISCLAIMER & SCOPE: You are an automated fitness coaching assistant, NOT a physician, physical therapist, or medical professional. Never diagnose conditions, prescribe medications or treatments, or interpret clinical pathology.
2. CONCERNING SYMPTOMS: If the user mentions chest pain, severe dizziness, syncope/fainting, heart palpitations, numbness, severe joint popping, vomiting, or acute sharp pain, you MUST IMMEDIATELY command them to STOP exercising and recommend seeking qualified medical evaluation.
3. PAIN & RECOVERY: Never encourage anyone to "push through pain" or "no pain no gain". Pain is a warning signal to halt or regress the exercise.
4. FORM & ACCESSIBILITY: Emphasize joint protection (e.g., knee tracking over toes, pivoting supporting foot during kicks, keeping elbows at 45° on pushups, never locking joints out).
5. NO OUTCOME GUARANTEES: Never promise specific weight loss, muscle gain, or rapid fight skills.
6. VALIDATION & FALLBACK: All outputs must prioritize human health, joint longevity, and adequate hydration and rest.
`;

// Deterministic response library for offline resilience and fast safety answers
const INTENT_RESPONSES: Record<string, { text: string; action: AICoachMessage['recommendedAction']; isWarning: boolean }> = {
  shoulder: {
    text: "Shoulder tightness or anterior discomfort often stems from flared elbows or anterior cuff fatigue. For pushups, keep your elbows tucked at roughly 45° like an arrow. If you feel any sharp pain, immediately switch to the Incline Wall Pushup regression or rest.",
    action: 'continue_mindfully',
    isWarning: false
  },
  knee: {
    text: "Knee protection priority: during squats, make sure your knees track directly over your middle toes and keep your heels planted. During martial arts kicks, you MUST pivot your supporting foot outward by 90°+ to prevent rotational torque on your knee ligaments. If joint ache persists, stop today's leg work.",
    action: 'continue_mindfully',
    isWarning: false
  },
  warmup: {
    text: "Safe Warm-up Protocol: Spend 3-5 minutes on dynamic mobility before demanding sets. Recommended: wrist circles (30s), arm openers (30s), hip 90/90 flow or gentle leg swings (60s), and deep diaphragmatic breathing. Never stretch cold muscles with ballistic bouncing.",
    action: 'continue_mindfully',
    isWarning: false
  },
  fatigue: {
    text: "Fatigue Recognition: Training while excessively fatigued significantly degrades joint stabilizing reflexes, raising injury risk. We recommend taking an active recovery day: gentle Cat-Cow spinal flows, hydration, and 8+ hours of sleep. Missed days do NOT reduce your earned level.",
    action: 'take_rest',
    isWarning: false
  },
  water: {
    text: "Hydration Guidelines: Drink 150-200ml of ambient water every 10-15 minutes of moderate exertion. Avoid chugging icy water during heavy exertion. Notice your sweat rate and hydrate thoroughly post-workout to support muscle recovery.",
    action: 'hydrate',
    isWarning: false
  },
  recovery: {
    text: "Active Recovery Rules: Rest is where adaptation and strength actually occur. High fatigue scores automatically trigger mobility recommendations. Try our 4-second box breathing routine to activate the parasympathetic nervous system.",
    action: 'take_rest',
    isWarning: false
  }
};

/**
 * Process user message through safety layers before answering
 */
export async function getCoachResponse(
  userMessage: string,
  userLevel: number,
  fatigueScore: number
): Promise<AICoachMessage> {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. HARD SAFETY INTERCEPTOR: Red-flag and symptom evaluation
  const symptomEval = evaluateSymptomSafety(userMessage);
  if (symptomEval.isCriticalStop) {
    return {
      id: `coach_${Date.now()}`,
      sender: 'coach',
      text: symptomEval.message,
      timestamp,
      isSafetyWarning: true,
      recommendedAction: symptomEval.recommendedAction
    };
  }

  // 2. Offline / deterministic fallback matching for instantaneous and reliable responses
  const lowerMsg = userMessage.toLowerCase();
  for (const [key, resp] of Object.entries(INTENT_RESPONSES)) {
    if (lowerMsg.includes(key)) {
      return {
        id: `coach_${Date.now()}`,
        sender: 'coach',
        text: resp.text,
        timestamp,
        isSafetyWarning: resp.isWarning,
        recommendedAction: resp.action
      };
    }
  }

  // 3. Fallback standard advice if no explicit intent or if API isn't available
  return {
    id: `coach_${Date.now()}`,
    sender: 'coach',
    text: `Safety Reminder: Move with controlled form and tempo. Your current fatigue index is ${fatigueScore}/10. Keep your joints soft, maintain core bracing, and remember you can pause or switch to an easier regression at any time without penalty.`,
    timestamp,
    isSafetyWarning: false,
    recommendedAction: 'continue_mindfully'
  };
}
