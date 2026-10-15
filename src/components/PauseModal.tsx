import React from 'react';
import { Play, RotateCcw, Map, Volume2, VolumeX, Music, X } from 'lucide-react';
import { PlayerProfile } from '../types';
import { sound } from '../game/sound';

interface PauseModalProps {
  profile: PlayerProfile;
  onResume: () => void;
  onRestart: () => void;
  onGoToMap: () => void;
  onToggleSound: (sfx: boolean, music: boolean) => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  profile,
  onResume,
  onRestart,
  onGoToMap,
  onToggleSound,
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 z-50 select-none animate-gem-spawn">
      <div className="bg-gradient-to-b from-[#250d3a] via-[#1a082b] to-[#11031d] border border-purple-500/40 rounded-3xl w-full max-w-sm p-5 shadow-2xl text-center relative">
        <h2 className="text-xl font-black text-amber-300 tracking-wide uppercase mb-1">
          Game Paused
        </h2>
        <p className="text-xs text-purple-200 mb-4">Take a breath, Warrior.</p>

        {/* Audio Quick Toggles */}
        <div className="bg-[#120521] border border-purple-500/25 rounded-2xl p-3 mb-4 flex justify-around">
          <button
            onClick={() => {
              const next = !profile.soundEnabled;
              sound.setSfxEnabled(next);
              if (next) sound.playClick();
              onToggleSound(next, profile.musicEnabled);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              profile.soundEnabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}
          >
            {profile.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            SFX
          </button>

          <button
            onClick={() => {
              const next = !profile.musicEnabled;
              sound.setMusicEnabled(next);
              if (next) sound.playClick();
              onToggleSound(profile.soundEnabled, next);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              profile.musicEnabled
                ? 'bg-purple-600/30 text-purple-200 border-purple-500/40'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}
          >
            <Music className="w-4 h-4" />
            Music
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 text-purple-950 font-black text-sm py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Play className="w-4 h-4 fill-purple-950" />
            <span>Resume Game</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full bg-purple-900/60 hover:bg-purple-800 text-purple-200 font-bold text-xs py-2 rounded-xl border border-purple-500/30 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Stage</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onGoToMap();
            }}
            className="w-full bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 font-bold text-xs py-2 rounded-xl border border-zinc-700 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Exit to Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
