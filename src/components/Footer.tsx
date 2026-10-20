import React from 'react';
import { Shield, Heart, ExternalLink, Activity } from 'lucide-react';
import { DISCLAIMER_VERSION } from '../utils/safety';

interface FooterProps {
  onOpenDisclaimer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDisclaimer }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 mt-16 py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>AI Training Master</span>
              <span className="text-[10px] font-mono text-slate-500">v{DISCLAIMER_VERSION}</span>
            </div>
            <p className="text-slate-500 text-[11px] max-w-md">
              Adaptive conditioning with non-punitive progression, automated safety red-flag interception, and on-device privacy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* Permanent Safety & Disclaimer Footer Link */}
            <button
              type="button"
              id="footer-disclaimer-btn"
              onClick={onOpenDisclaimer}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition underline underline-offset-4"
            >
              <Shield className="w-3.5 h-3.5" />
              Safety & Disclaimer
            </button>
            <span className="text-slate-700">·</span>
            <span className="text-slate-400">Guest Mode (No Forced Login)</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-400">WCAG AA Compliant</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-900 text-[11px] text-slate-400 leading-relaxed">
          <p>
            <strong>Medical Notice:</strong> AI Training Master is for educational and fitness informational purposes only and does not provide medical diagnosis, treatment, or clinical rehabilitation. If you experience severe pain, chest tightness, or dizziness, cease exercise and consult a qualified healthcare provider immediately.
          </p>
        </div>
      </div>
    </footer>
  );
};
