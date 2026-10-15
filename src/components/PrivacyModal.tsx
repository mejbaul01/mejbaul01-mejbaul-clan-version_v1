import React from 'react';
import { X, ShieldCheck, Mail, Smartphone, Database, Check } from 'lucide-react';
import { sound } from '../game/sound';

interface PrivacyModalProps {
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 z-50 select-none">
      <div className="bg-gradient-to-b from-[#240c3a] via-[#1a082b] to-[#120420] border border-purple-500/40 rounded-3xl w-full max-w-sm p-4 shadow-2xl relative flex flex-col max-h-[92vh]">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-purple-900/50 hover:bg-purple-800 text-purple-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-2 shadow-lg">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-base font-black text-amber-300 text-center tracking-wide">
          Privacy Policy & Store Notice
        </h2>
        <p className="text-[11px] text-purple-200 text-center mb-3">
          Google Play Families Policy & COPPA Compliant
        </p>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left text-xs text-purple-100">
          {/* Identity & Metadata */}
          <div className="p-2.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Application Details</span>
            </div>
            <div className="text-[11px] text-purple-200 space-y-0.5 font-mono">
              <div>Title: Mejba Clan: Rest of Clans</div>
              <div>Package: com.mejbaclan.restofclans</div>
              <div>Version: 1.5.2.2</div>
              <div>Category: Puzzle / Match-3 / Casual</div>
            </div>
          </div>

          {/* Data collection policy */}
          <div className="p-2.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Zero Personal Data Collected</span>
            </div>
            <p className="text-[11px] text-purple-300 leading-relaxed">
              Mejba Clan does not collect, transmit, or share any personally identifiable information (PII). All level unlocks, scores, coins, and preferences are stored exclusively on your device via standard browser localStorage.
            </p>
          </div>

          {/* Child Safety / COPPA */}
          <div className="p-2.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Check className="w-4 h-4 text-cyan-400" />
              <span>Family & Child Safe</span>
            </div>
            <p className="text-[11px] text-purple-300 leading-relaxed">
              This game contains no violence, no gambling, and no sensitive content. It is certified for players of all ages under the COPPA and Google Play Family Guidelines.
            </p>
          </div>

          {/* Developer Contact */}
          <div className="p-2.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Developer Contact</span>
            </div>
            <div className="text-[11px] text-purple-200 font-mono">
              Email: mejbaulkm@gmail.com
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full mt-3 bg-purple-800 hover:bg-purple-700 text-purple-100 font-black text-xs py-2 rounded-xl border border-purple-500/30 transition-transform active:scale-95"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
