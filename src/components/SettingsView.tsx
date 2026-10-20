import React, { useState } from 'react';
import { 
  Sliders, 
  Shield, 
  Camera, 
  Flame, 
  Download, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  HeartPulse,
  Info
} from 'lucide-react';
import { UserTrainingProfile } from '../types';
import { resetStreakGracefully } from '../utils/progression';

interface SettingsViewProps {
  profile: UserTrainingProfile;
  onUpdateProfile: (updatedProfile: UserTrainingProfile) => void;
  onOpenDisclaimer: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onOpenDisclaimer
}) => {
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleResetStreak = () => {
    const updated = resetStreakGracefully(profile);
    onUpdateProfile(updated);
    setFeedbackMsg('Streak reset cleanly. Level and XP are strictly preserved without punitive requirements.');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleToggleTrackingDefault = () => {
    const updated: UserTrainingProfile = {
      ...profile,
      preferredTrackingMode: profile.preferredTrackingMode === 'manual' ? 'camera' : 'manual'
    };
    onUpdateProfile(updated);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ai_training_master_profile_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-emerald-400" />
          Safety Settings, Privacy & Controls
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Review legal acknowledgements, manage on-device vision privacy, and non-punitive progression
        </p>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* 1. Permanent Safety & Disclaimer Section */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">User Safety & Legal Disclaimer</h3>
              <p className="text-xs text-slate-400">
                {profile.disclaimer.acknowledged
                  ? `Acknowledged on ${new Date(profile.disclaimer.acknowledgedAt || '').toLocaleDateString()} (Version ${profile.disclaimer.version})`
                  : 'Pending acknowledgement before first training session'}
              </p>
            </div>
          </div>
          <button
            type="button"
            id="settings-reopen-disclaimer-btn"
            onClick={onOpenDisclaimer}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition"
          >
            Re-read & Review Full Disclaimer
          </button>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-lg text-xs text-slate-400 border border-slate-800 space-y-1">
          <span className="font-semibold text-slate-300 block">Permanent Access Guarantee:</span>
          <p>
            You can reopen the complete disclaimer at any time. Acknowledgement does not waive statutory legal rights or prove medical fitness.
          </p>
        </div>
      </div>

      {/* 2. Privacy & Camera Features */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Camera Vision & Data Privacy</h3>
            <p className="text-xs text-slate-400">
              100% Client-side processing · Zero video uploads · Manual tracking alternative
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            <strong>How camera vision works:</strong> Computer vision runs entirely in the browser sandbox. Video frames are analyzed in memory for posture angles and immediately discarded. No images or biometric records are sent to any remote server.
          </p>
          <p className="text-slate-400">
            Manual tracking is an equal first-class option. You can train with full capabilities without ever enabling a camera.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-300 font-medium">Default Tracking Mode:</span>
          <button
            type="button"
            onClick={handleToggleTrackingDefault}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition"
          >
            {profile.preferredTrackingMode === 'manual' ? 'Manual Tap Tracking' : 'Camera Vision Guide'}
          </button>
        </div>
      </div>

      {/* 3. Non-Punitive Progression Controls */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Non-Punitive Streak & Level Rules</h3>
            <p className="text-xs text-slate-400">
              Freedom from punitive gamification · Safe recovery without demotion
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-lg text-xs text-slate-400 space-y-1 border border-slate-800">
          <p>
            <strong>Our Philosophy:</strong> We do not deduct earned levels when you miss workouts. If you wish to reset your streak count (e.g. following a vacation or illness), you can do so cleanly with zero penalty workouts.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-300">
            Current streak: <strong className="text-slate-100">{profile.currentStreak} days</strong> (Level {profile.level} preserved)
          </div>
          <button
            type="button"
            id="reset-streak-btn"
            onClick={handleResetStreak}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition"
          >
            Reset Streak Gracefully
          </button>
        </div>
      </div>

      {/* 4. Guest Mode & Data Export */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
        <h3 className="text-sm font-bold text-slate-100">Guest Data Management</h3>
        <p className="text-xs text-slate-400">
          Your training data is stored safely in your browser local storage. No registration or personal email required.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportData}
            className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export Training Record (JSON)
          </button>
        </div>
      </div>
    </div>
  );
};
