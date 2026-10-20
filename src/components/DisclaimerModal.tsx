import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, FileText, X } from 'lucide-react';
import { SAFETY_DISCLAIMER_CONTENT, DISCLAIMER_VERSION } from '../utils/safety';
import { DisclaimerState } from '../types';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  disclaimerState: DisclaimerState;
  onAcknowledge: (acknowledgedState: DisclaimerState) => void;
  isMandatoryFirstTime?: boolean;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose,
  disclaimerState,
  onAcknowledge,
  isMandatoryFirstTime = false
}) => {
  const [hasCheckedConsent, setHasCheckedConsent] = useState(disclaimerState.acknowledged);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!hasCheckedConsent) return;
    onAcknowledge({
      acknowledged: true,
      acknowledgedAt: new Date().toISOString(),
      version: DISCLAIMER_VERSION,
      reviewedCount: disclaimerState.reviewedCount + 1
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Shield className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2 id="disclaimer-title" className="text-xl font-bold text-slate-100">
                {SAFETY_DISCLAIMER_CONTENT.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Version {DISCLAIMER_VERSION} · Permanent accessibility in footer, dashboard & settings
              </p>
            </div>
          </div>
          {!isMandatoryFirstTime && (
            <button
              onClick={onClose}
              aria-label="Close disclaimer modal"
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-2 py-4 space-y-4 text-sm text-slate-300 leading-relaxed">
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs text-amber-200 space-y-1">
              <span className="font-semibold block text-amber-300">Crucial Legal & Health Notice</span>
              <p>
                Acknowledgement of this disclaimer does <strong>NOT</strong> constitute proof of medical fitness to exercise, and does <strong>NOT</strong> waive any statutory legal rights under consumer protection regulations.
              </p>
            </div>
          </div>

          {SAFETY_DISCLAIMER_CONTENT.keyPoints.map((point, index) => (
            <div key={index} className="space-y-1.5 bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/80">
              <h3 className="font-semibold text-slate-200 flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                {point.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-normal">
                {point.content}
              </p>
            </div>
          ))}

          <div className="p-3 bg-slate-950/60 rounded-lg text-xs text-slate-400 border border-slate-800">
            {SAFETY_DISCLAIMER_CONTENT.footerNote}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer group select-none">
            <input
              type="checkbox"
              id="disclaimer-consent-checkbox"
              checked={hasCheckedConsent}
              onChange={(e) => setHasCheckedConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-slate-900 bg-slate-800"
            />
            <span className="text-xs text-slate-300 group-hover:text-slate-200">
              I have thoroughly reviewed and understand the Safety & Medical Disclaimer. I agree to heed all emergency stop protocols and train within my personal physical limits.
            </span>
          </label>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            {!isMandatoryFirstTime && (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
              >
                Close Window
              </button>
            )}
            <button
              type="button"
              id="acknowledge-disclaimer-btn"
              disabled={!hasCheckedConsent}
              onClick={handleConfirm}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
                hasCheckedConsent
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {disclaimerState.acknowledged ? 'Save & Close Disclaimer' : 'Acknowledge & Enable Training'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
