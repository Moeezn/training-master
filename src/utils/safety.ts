/**
 * Safety & Disclaimer Utility Functions
 * Implements strict user-safety guidelines, legal disclosures, and medical symptom triage.
 */

import { DisclaimerState, UserTrainingProfile } from '../types';

export const DISCLAIMER_VERSION = '2026.1';

export const SAFETY_DISCLAIMER_CONTENT = {
  title: 'User Safety, Medical Guidance & Legal Disclaimer',
  subtitle: 'Please review and acknowledge these essential safety terms before your first workout.',
  keyPoints: [
    {
      title: 'Not Medical Advice',
      content: 'AI Training Master and its automated coaching algorithms do not provide medical diagnosis, clinical treatment, or physical therapy prescriptions. All guidance, routines, and form cues are for educational and fitness informational purposes only.'
    },
    {
      title: 'Consult Your Physician First',
      content: 'Physical exercise and martial arts training carry inherent risks of injury, cardiovascular strain, and musculoskeletal stress. You should consult a qualified physician or healthcare provider before initiating any new exercise regimen, especially if you have pre-existing cardiovascular conditions, joint disorders, or chronic injuries.'
    },
    {
      title: 'Crucial Legal Clarification',
      content: 'Your acknowledgement of this disclaimer does NOT constitute proof of your medical fitness to exercise, and it does NOT waive any non-waivable statutory or legal consumer rights under applicable laws.'
    },
    {
      title: 'Immediate Stop & Emergency Protocols',
      content: 'Never train through sharp, acute, or radiating pain. Stop exercising immediately and seek emergency medical attention if you experience: chest pain, pressure or squeezing sensations, severe shortness of breath, unexplained dizziness or syncope (fainting), heart palpitations, numbness, or joint pop/tear sounds.'
    },
    {
      title: 'No Guaranteed Fitness Outcomes',
      content: 'Individual physiological responses to training vary widely. AI Training Master makes no guarantees of specific athletic performance, muscle hypertrophy, or weight loss results.'
    },
    {
      title: 'Media & Visual Demonstration Notice',
      content: 'Watching an exercise or martial arts video or demonstration does not guarantee safe execution. You must always honor your personal mobility limits and use regression alternatives when needed.'
    }
  ],
  footerNote: 'You may revisit and re-read this complete safety disclaimer at any time via the Safety & Disclaimer link in the footer, settings, or dashboard.'
};

export const RED_FLAG_SYMPTOMS = [
  'chest pain',
  'chest pressure',
  'chest tightness',
  'chest discomfort',
  'tightness',
  'shortness of breath',
  'trouble breathing',
  'difficulty breathing',
  'cannot breathe',
  "can't breathe",
  'dizziness',
  'dizzy',
  'lightheaded',
  'faint',
  'fainted',
  'syncope',
  'numbness',
  'radiating pain',
  'sharp joint pain',
  'joint popping',
  'popping sound',
  'heart palpitations',
  'irregular heartbeat',
  'vomiting',
  'blurred vision'
];

export interface SymptomEvaluation {
  isCriticalStop: boolean;
  requiresMedicalAssistance: boolean;
  message: string;
  recommendedAction: 'stop_now' | 'see_doctor' | 'hydrate' | 'take_rest' | 'continue_mindfully';
}

/**
 * Checks text or symptom report for critical emergency warning indicators
 */
export function evaluateSymptomSafety(input: string): SymptomEvaluation {
  const normalized = input.toLowerCase();

  for (const symptom of RED_FLAG_SYMPTOMS) {
    if (normalized.includes(symptom)) {
      return {
        isCriticalStop: true,
        requiresMedicalAssistance: true,
        message: `EMERGENCY SAFETY STOP: You reported "${symptom}". Exercise must stop immediately. Do not attempt to finish reps. If this symptom is severe, sudden, or persistent, contact emergency services (such as 911 / 112) or seek urgent medical evaluation right away.`,
        recommendedAction: 'see_doctor'
      };
    }
  }

  // Moderate pain/strain check
  const moderatePainKeywords = ['pain', 'hurts', 'injured', 'sprain', 'cramp', 'pulled muscle', 'unwell', 'sick', 'fever'];
  for (const kw of moderatePainKeywords) {
    if (normalized.includes(kw)) {
      return {
        isCriticalStop: true,
        requiresMedicalAssistance: false,
        message: `Safety Halt: You mentioned feeling ${kw}. Never push through pain or sickness. Stop your current session, hydrate, rest, and apply gentle recovery protocols. If symptoms persist beyond 24 hours, consult a healthcare professional.`,
        recommendedAction: 'stop_now'
      };
    }
  }

  // Fatigue or tiredness
  const fatigueKeywords = ['exhausted', 'tired', 'fatigued', 'heavy legs', 'no energy'];
  for (const kw of fatigueKeywords) {
    if (normalized.includes(kw)) {
      return {
        isCriticalStop: false,
        requiresMedicalAssistance: false,
        message: 'High fatigue detected. Consider switching to active recovery, gentle mobility work, or taking an scheduled rest day to prevent overtraining.',
        recommendedAction: 'take_rest'
      };
    }
  }

  return {
    isCriticalStop: false,
    requiresMedicalAssistance: false,
    message: 'Maintain controlled breathing, stabilize your core, and respect your body limits.',
    recommendedAction: 'continue_mindfully'
  };
}

/**
 * Validates whether the user can safely start a training session
 */
export function validateTrainingSessionStart(
  disclaimerState: DisclaimerState,
  fatigueScore: number
): { allowed: boolean; reason?: string; requiresDisclaimer: boolean } {
  if (!disclaimerState.acknowledged) {
    return {
      allowed: false,
      requiresDisclaimer: true,
      reason: 'Safety compliance: You must read and acknowledge the User Safety & Medical Disclaimer before your first training session.'
    };
  }

  if (fatigueScore >= 9) {
    return {
      allowed: false,
      requiresDisclaimer: false,
      reason: 'Excessive fatigue detected (9/10+). Demanding exercises are locked for your safety. Please take an active rest or mobility recovery session.'
    };
  }

  return { allowed: true, requiresDisclaimer: false };
}
