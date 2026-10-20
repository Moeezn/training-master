import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight, 
  Check, 
  Heart, 
  Camera, 
  VideoOff, 
  Zap, 
  RefreshCw, 
  ChevronRight, 
  X, 
  Droplet,
  Info
} from 'lucide-react';
import { Exercise, PainReport, UserTrainingProfile } from '../types';
import { EXERCISES } from '../data/exercises';
import { validateWorkoutCompletion } from '../utils/progression';

interface TrainingSessionProps {
  exercise: Exercise;
  profile: UserTrainingProfile;
  onFinishWorkout: (updatedProfile: UserTrainingProfile, summaryMessage: string) => void;
  onCancel: () => void;
  onOpenDisclaimer: () => void;
}

export const TrainingSession: React.FC<TrainingSessionProps> = ({
  exercise: initialExercise,
  profile,
  onFinishWorkout,
  onCancel,
  onOpenDisclaimer
}) => {
  const [currentExercise, setCurrentExercise] = useState<Exercise>(initialExercise);
  const [currentReps, setCurrentReps] = useState<number>(0);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number>(0);

  // Pre-flight contextual safety modal state (demanding exercises)
  const [showPreflightSafety, setShowPreflightSafety] = useState<boolean>(initialExercise.demanding);
  const [hasAcknowledgedSafetyCheck, setHasAcknowledgedSafetyCheck] = useState<boolean>(!initialExercise.demanding);

  // Pain / Symptom Emergency Modal
  const [showPainModal, setShowPainModal] = useState<boolean>(false);
  const [painSeverity, setPainSeverity] = useState<PainReport['severity']>('moderate_pain');
  const [painLocation, setPainLocation] = useState<string>('Shoulder');
  const [painNotes, setPainNotes] = useState<string>('');

  // Camera tracking & Privacy Consent
  const [trackingMode, setTrackingMode] = useState<'manual' | 'camera'>(profile.preferredTrackingMode);
  const [showCameraConsentModal, setShowCameraConsentModal] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Timer loop
  useEffect(() => {
    if (showPreflightSafety || showPainModal || isPaused) return;

    const timer = setInterval(() => {
      if (isResting) {
        setRestSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setSecondsElapsed((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [showPreflightSafety, showPainModal, isPaused, isResting]);

  // Camera stream handler
  useEffect(() => {
    if (cameraActive && trackingMode === 'camera') {
      navigator.mediaDevices?.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setCameraActive(false);
          setTrackingMode('manual');
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive, trackingMode]);

  // Handle switching to easier regression
  const handleSwitchToEasier = () => {
    if (!currentExercise.easierAlternativeId) return;
    const alternative = EXERCISES.find((e) => e.id === currentExercise.easierAlternativeId);
    if (alternative) {
      setCurrentExercise(alternative);
      setShowPreflightSafety(false);
      setHasAcknowledgedSafetyCheck(true);
    }
  };

  // Add Rest period
  const handleTriggerRest = (seconds: number) => {
    setIsResting(true);
    setRestSecondsRemaining(seconds);
  };

  // Complete workout safely
  const handleCompleteWorkout = () => {
    const result = validateWorkoutCompletion(
      profile,
      currentExercise,
      currentReps,
      false,
      secondsElapsed
    );

    const updatedProfile: UserTrainingProfile = {
      ...profile,
      xp: profile.xp + result.xpAwarded,
      level: result.newLevel,
      currentStreak: result.newStreak,
      highestStreak: Math.max(profile.highestStreak, result.newStreak),
      lastTrainedDate: new Date().toISOString().split('T')[0],
      totalWorkoutsCompleted: profile.totalWorkoutsCompleted + 1,
      fatigueScore: result.newFatigueScore
    };

    onFinishWorkout(updatedProfile, result.message);
  };

  // Handle Pain / Emergency Stop submission
  const handleReportPainAndHalt = () => {
    setIsPaused(true);
    const incident: PainReport = {
      id: `pain_${Date.now()}`,
      timestamp: new Date().toISOString(),
      exerciseId: currentExercise.id,
      exerciseTitle: currentExercise.title,
      severity: painSeverity,
      location: painLocation,
      notes: painNotes,
      actionTaken: 'emergency_stopped'
    };

    const updatedProfile: UserTrainingProfile = {
      ...profile,
      reportedPainIncidents: [incident, ...profile.reportedPainIncidents],
      // Safety rule: lowers fatigue and never penalizes level
      fatigueScore: Math.max(0, profile.fatigueScore - 2)
    };

    const isUrgent = painSeverity === 'severe_or_acute' || painLocation.toLowerCase().includes('chest');
    const summaryMsg = isUrgent
      ? 'EMERGENCY SAFETY HALT: Workout terminated immediately due to acute symptoms. Please seek urgent medical evaluation. No level penalties applied.'
      : 'Workout halted safely due to reported discomfort. Health and joint recovery come first. Great choice to listen to your body.';

    setShowPainModal(false);
    onFinishWorkout(updatedProfile, summaryMsg);
  };

  const isChestOrSevere = painSeverity === 'severe_or_acute' || painLocation === 'Chest';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 1. Contextual Safety Reminder Modal (demanding exercises) */}
      {showPreflightSafety && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="safety-check-title"
        >
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 id="safety-check-title" className="text-lg font-bold text-slate-100">
                  Pre-Exercise Safety Check
                </h3>
                <span className="text-xs text-amber-300 font-medium">
                  {currentExercise.title} · Demanding Movement
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs sm:text-sm text-amber-200 leading-relaxed">
              <strong>Contextual Safety Warning:</strong>
              <p className="mt-1 text-slate-300">{currentExercise.contextualWarning}</p>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <span className="font-semibold text-slate-200 block">Required Warm-up:</span>
              <p className="text-slate-400 bg-slate-950/60 p-2.5 rounded border border-slate-800">
                {currentExercise.warmupRequired}
              </p>
            </div>

            {currentExercise.easierAlternativeName && (
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Not ready for high intensity?</span>
                  <span className="font-semibold text-emerald-400">
                    Switch to: {currentExercise.easierAlternativeName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSwitchToEasier}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 font-medium transition"
                >
                  Use Alternative
                </button>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                Back to Dashboard
              </button>
              <button
                type="button"
                id="preflight-acknowledge-btn"
                onClick={() => {
                  setShowPreflightSafety(false);
                  setHasAcknowledgedSafetyCheck(true);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                I Understand Form & Risks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Pain & Emergency Triage Modal */}
      {showPainModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pain-modal-title"
        >
          <div className="w-full max-w-lg bg-slate-900 border border-rose-500/40 rounded-xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 id="pain-modal-title" className="text-lg font-bold text-slate-100">
                  Pain & Discomfort Report
                </h3>
                <span className="text-xs text-rose-300">
                  Immediate safety triage · Zero level penalties
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Never train through pain. Tell us what you are feeling so we can log your recovery and halt current demands safely.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Severity of Pain or Discomfort
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['mild_discomfort', 'moderate_pain', 'severe_or_acute'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setPainSeverity(sev)}
                      className={`p-2.5 rounded-lg text-xs font-medium border text-center transition ${
                        painSeverity === sev
                          ? 'border-rose-500 bg-rose-500/20 text-rose-200'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {sev === 'mild_discomfort' && 'Mild Discomfort'}
                      {sev === 'moderate_pain' && 'Moderate Pain'}
                      {sev === 'severe_or_acute' && 'Severe / Acute'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="pain-location-select" className="text-xs font-semibold text-slate-300 block mb-1">
                  Location
                </label>
                <select
                  id="pain-location-select"
                  value={painLocation}
                  onChange={(e) => setPainLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="Shoulder">Shoulder / Rotator Cuff</option>
                  <option value="Knee">Knee / Joint Ligament</option>
                  <option value="Lower Back">Lower Back / Lumbar</option>
                  <option value="Wrist">Wrist / Forearm</option>
                  <option value="Chest">Chest / Cardiovascular (Urgent)</option>
                  <option value="Head/Neck">Head / Neck / Dizziness</option>
                  <option value="Other">Other / General Fatigue</option>
                </select>
              </div>

              {isChestOrSevere && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-lg text-xs text-rose-200 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-rose-300">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    EMERGENCY MEDICAL WARNING
                  </span>
                  <p>
                    Chest symptoms or acute severe joint tears require urgent medical attention. Do not resume exercise. Contact your local emergency medical service (e.g. 911 or 112) or go to an urgent care clinic immediately.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowPainModal(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                Resume (False Alarm)
              </button>
              <button
                type="button"
                id="confirm-pain-halt-btn"
                onClick={handleReportPainAndHalt}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                Stop Exercise & Prioritize Recovery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Camera Privacy & Consent Modal */}
      {showCameraConsentModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="camera-consent-title"
        >
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 id="camera-consent-title" className="text-base font-bold text-slate-100">
                  On-Device Camera Privacy Consent
                </h3>
                <span className="text-xs text-emerald-400 font-medium">100% Client-Side Processing</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <p>
                <strong>Privacy Guarantee:</strong> Camera posture analysis runs exclusively in your browser memory via on-device JavaScript. 
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>No video or images are ever uploaded to any cloud server</li>
                <li>No footage is recorded or saved to storage</li>
                <li>Camera permission is completely optional</li>
                <li>Manual tap tracking is always available as a full alternative</li>
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowCameraConsentModal(false);
                  setTrackingMode('manual');
                  setCameraActive(false);
                }}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
              >
                Decline (Use Manual)
              </button>
              <button
                type="button"
                id="grant-camera-consent-btn"
                onClick={() => {
                  setShowCameraConsentModal(false);
                  setCameraActive(true);
                  setTrackingMode('camera');
                }}
                className="px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition shadow-md"
              >
                Accept & Enable Vision Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Training Session View */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* Top Control Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">{currentExercise.title}</h2>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                currentExercise.difficulty === 'beginner'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                  : currentExercise.difficulty === 'intermediate'
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
              }`}>
                {currentExercise.difficulty}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target: {currentExercise.targetReps ? `${currentExercise.targetReps} Reps` : `${currentExercise.durationSeconds}s Duration`}
            </p>
          </div>

          {/* Quick Tracking Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setTrackingMode('manual');
                setCameraActive(false);
              }}
              className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                trackingMode === 'manual'
                  ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Manual Tracking
            </button>
            <button
              type="button"
              id="toggle-camera-mode-btn"
              onClick={() => {
                if (!cameraActive) {
                  setShowCameraConsentModal(true);
                } else {
                  setCameraActive(false);
                  setTrackingMode('manual');
                }
              }}
              className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                trackingMode === 'camera'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              Vision Mode
            </button>
          </div>
        </div>

        {/* Live Active Content Area */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Visual Guide & Rep Counter */}
          <div className="md:col-span-7 space-y-4">
            {/* Visual Guide or Camera Preview */}
            <div className="relative aspect-video bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
              {trackingMode === 'camera' && cameraActive ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-slate-950/80 backdrop-blur rounded text-[10px] text-emerald-400 font-mono border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    On-Device Vision Active · Private
                  </div>
                </div>
              ) : (
                /* Original Visual SVG Vector Demonstration */
                <div className="text-center p-6 space-y-3">
                  <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse">
                    <Zap className="w-10 h-10" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-mono text-slate-400 block">
                      Exercise Form Guide
                    </span>
                    <span className="text-sm font-semibold text-slate-200">
                      {currentExercise.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {currentExercise.accessibleDescription}
                  </p>
                </div>
              )}

              {/* Rest Mode Overlay */}
              {isResting && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                  <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Droplet className="w-8 h-8 animate-bounce" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                      Active Rest & Hydration
                    </span>
                    <div className="text-4xl font-mono font-bold text-emerald-400 my-1">
                      {restSecondsRemaining}s
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 max-w-xs">
                    {currentExercise.hydrationTip}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsResting(false)}
                    className="px-4 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
                  >
                    Resume Training Early
                  </button>
                </div>
              )}
            </div>

            {/* Media Disclaimer Notice */}
            <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded border border-slate-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Demonstration Notice:</strong> Media and visual cues provide reference only. Watching a demonstration does not guarantee safe execution. Work strictly within your comfortable range of motion.
              </span>
            </div>

            {/* Rep Counter / Time HUD */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                  Completed Reps
                </span>
                <div className="text-3xl font-mono font-bold text-slate-100 flex items-baseline gap-2">
                  <span id="rep-counter-display">{currentReps}</span>
                  <span className="text-sm font-normal text-slate-500">
                    / {currentExercise.targetReps || '∞'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                  Workout Time
                </span>
                <span className="text-xl font-mono text-slate-200">
                  {Math.floor(secondsElapsed / 60)}:{(secondsElapsed % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Manual Rep Tapper Button (accessible & primary) */}
            <div className="flex gap-2">
              <button
                type="button"
                id="manual-rep-tap-btn"
                onClick={() => setCurrentReps((r) => r + 1)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm transition border border-slate-700 active:scale-[0.98] shadow-sm"
              >
                +1 Rep Count
              </button>
              <button
                type="button"
                onClick={() => setCurrentReps((r) => Math.max(0, r - 1))}
                className="px-4 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition border border-slate-800"
                aria-label="Decrease rep"
              >
                -1
              </button>
            </div>
          </div>

          {/* Right Column: Safety Controls & Form Cues */}
          <div className="md:col-span-5 space-y-4">
            {/* Primary Safety Controls Panel */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block border-b border-slate-800/80 pb-2">
                Real-Time Safety Controls
              </span>

              {/* Pause & Rest Controls */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="pause-workout-btn"
                  onClick={() => setIsPaused(!isPaused)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    isPaused 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </button>

                <button
                  type="button"
                  id="rest-period-btn"
                  onClick={() => handleTriggerRest(45)}
                  className="py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  +45s Rest
                </button>
              </div>

              {/* Easier Regression & Skip */}
              <div className="space-y-2 pt-1">
                {currentExercise.easierAlternativeId && (
                  <button
                    type="button"
                    id="switch-easier-alternative-btn"
                    onClick={handleSwitchToEasier}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-between transition"
                  >
                    <span>Switch to Easier Alternative</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  id="skip-exercise-btn"
                  onClick={onCancel}
                  className="w-full py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition text-center"
                >
                  Skip Exercise (No Penalty)
                </button>
              </div>

              {/* EMERGENCY HALT BUTTON */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  id="emergency-pain-halt-btn"
                  onClick={() => {
                    setIsPaused(true);
                    setShowPainModal(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg text-xs font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 flex items-center justify-center gap-2 transition"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  I Feel Pain or Unwell (Halt Now)
                </button>
              </div>
            </div>

            {/* Form Cues & Breathing Instructions */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
              <span className="font-bold text-slate-300 block">Step-by-Step Form & Breathing</span>
              {currentExercise.formCues.map((cue, i) => (
                <div key={i} className="p-2.5 rounded bg-slate-900 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-slate-200 font-semibold text-[11px]">
                    <span>{cue.phase}</span>
                    <span className="text-emerald-400 font-mono text-[10px]">{cue.breathing}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {cue.instruction}
                  </p>
                </div>
              ))}
            </div>

            {/* Complete Workout Button */}
            <button
              type="button"
              id="complete-workout-btn"
              onClick={handleCompleteWorkout}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Complete Workout Safely
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
