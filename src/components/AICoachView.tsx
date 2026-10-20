import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Send, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Info, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { AICoachMessage, UserTrainingProfile } from '../types';
import { getCoachResponse } from '../utils/aiCoach';

interface AICoachViewProps {
  profile: UserTrainingProfile;
  onOpenDisclaimer: () => void;
}

export const AICoachView: React.FC<AICoachViewProps> = ({
  profile,
  onOpenDisclaimer
}) => {
  const [messages, setMessages] = useState<AICoachMessage[]>([
    {
      id: 'welcome_coach',
      sender: 'coach',
      text: `Hello, Athlete! I am your AI Safety Coach. I provide real-time technique guidance, safe regression alternatives, and joint protection cues. 

CRITICAL SAFETY DIRECTIVE: I am an automated program, not a doctor. If you experience chest pain, severe dizziness, shortness of breath, or acute joint popping, immediately stop all training and seek urgent medical care. How can I assist your safe training today?`,
      timestamp: 'Now',
      isSafetyWarning: false
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isProcessing) return;

    const userMsg: AICoachMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    try {
      const response = await getCoachResponse(text, profile.level, profile.fatigueScore);
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `fallback_${Date.now()}`,
          sender: 'coach',
          text: 'Safety Fallback: Prioritize proper hydration, joint alignment, and rest. If you are experiencing pain or fatigue, halt exercise and consult a medical professional.',
          timestamp: 'Now',
          isSafetyWarning: true,
          recommendedAction: 'stop_now'
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const samplePrompts = [
    { label: 'Chest tightness test (Emergency Triage)', text: 'I am having chest tightness and trouble breathing during sets.' },
    { label: 'Shoulder form & regression', text: 'My shoulder hurts when doing standard pushups.' },
    { label: 'Knee safety in martial arts', text: 'How do I protect my knee during martial arts kicks?' },
    { label: 'Fatigue & rest advice', text: 'I feel exhausted and fatigued today.' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Safety Mandate Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                AI Coach Safeguards & Protocol
              </h2>
              <span className="text-xs text-slate-400">
                Grounded in user safety guidelines · No medical diagnosis or prescriptions
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenDisclaimer}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 hidden sm:block"
          >
            Review Disclaimer
          </button>
        </div>

        <div className="p-3 bg-slate-950/70 rounded-lg text-xs text-slate-300 border border-slate-800/80 leading-relaxed">
          <strong>Safeguard Notice:</strong> This coach enforces strict red-flag symptom detection. Statements indicating chest pain, dizziness, or acute joint injuries trigger an immediate, uncompromised emergency stop recommendation.
        </div>
      </div>

      {/* 2. Interactive Sample Safety Prompts */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-slate-400 block">
          Test Safety Responses & Questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(p.text)}
              className="px-3 py-1.5 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition text-left"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Chat Window */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                <span>{msg.sender === 'user' ? 'You' : 'AI Safety Coach'}</span>
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-slate-950 font-medium'
                    : msg.isSafetyWarning
                    ? 'bg-rose-950/60 border border-rose-500/50 text-rose-100 shadow-lg shadow-rose-950/40'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200'
                }`}
              >
                {msg.isSafetyWarning && (
                  <div className="flex items-center gap-2 text-rose-400 font-bold mb-2 pb-2 border-b border-rose-500/30">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>CRITICAL HEALTH SAFEGUARD TRIGGERED</span>
                  </div>
                )}
                <div className="whitespace-pre-line">{msg.text}</div>
                
                {msg.recommendedAction === 'see_doctor' && (
                  <div className="mt-3 p-2.5 rounded bg-rose-500/20 border border-rose-500/40 text-xs font-semibold text-rose-200">
                    Action Required: Stop exercise now. Contact emergency medical services or your physician.
                  </div>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-lg w-fit border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Checking safety guidelines and generating response...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              id="ai-coach-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about form, warm-ups, or report physical sensations..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              id="ai-coach-send-btn"
              disabled={!inputText.trim() || isProcessing}
              className={`p-2.5 rounded-lg transition shrink-0 ${
                inputText.trim() && !isProcessing
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              aria-label="Send message to AI Coach"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
