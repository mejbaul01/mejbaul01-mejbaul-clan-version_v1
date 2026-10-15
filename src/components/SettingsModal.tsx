import React, { useState } from 'react';
import {
  X,
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Music,
  RotateCcw,
  ShieldCheck,
  User,
  Info,
} from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { PlayerProfile } from '../types';
import { sound } from '../game/sound';

interface SettingsModalProps {
  profile: PlayerProfile;
  onUpdateSound: (sfx: boolean, music: boolean) => void;
  onUpdateName: (name: string) => void;
  onResetProgress: () => void;
  onOpenPrivacy: () => void;
  onOpenOpenSource: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  onUpdateSound,
  onUpdateName,
  onResetProgress,
  onOpenPrivacy,
  onOpenOpenSource,
  onClose,
}) => {
  const [nameInput, setNameInput] = useState(profile.name);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleToggleSfx = () => {
    const nextVal = !profile.soundEnabled;
    sound.setSfxEnabled(nextVal);
    if (nextVal) sound.playClick();
    onUpdateSound(nextVal, profile.musicEnabled);
  };

  const handleToggleMusic = () => {
    const nextVal = !profile.musicEnabled;
    sound.setMusicEnabled(nextVal);
    if (nextVal) sound.playClick();
    onUpdateSound(profile.soundEnabled, nextVal);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      sound.playClick();
      onUpdateName(nameInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 z-50 select-none">
      <div className="bg-gradient-to-b from-[#250d3a] via-[#1a082b] to-[#11031d] border border-purple-500/40 rounded-3xl w-full max-w-sm p-4 shadow-2xl relative text-center">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-purple-900/50 hover:bg-purple-800 text-purple-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-2 shadow-lg">
          <SettingsIcon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-base font-black text-amber-300 tracking-wide">
          Settings & Preferences
        </h2>
        <p className="text-[11px] text-purple-200 mb-3">
          Configure audio, clan alias, and storage.
        </p>

        <div className="space-y-2.5 text-left mb-4">
          {/* Warrior Alias Form */}
          <form onSubmit={handleSaveName} className="p-2.5 rounded-2xl bg-purple-950/40 border border-purple-500/20">
            <label className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block mb-1">
              Warrior Name
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={20}
                className="flex-1 bg-[#120521] border border-purple-500/40 rounded-xl px-2.5 py-1 text-xs font-bold text-purple-100 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="bg-purple-800 hover:bg-purple-700 text-purple-200 font-bold text-xs px-3 rounded-xl border border-purple-500/30"
              >
                Save
              </button>
            </div>
          </form>

          {/* Audio Controls */}
          <div className="p-2.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 space-y-2">
            <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">
              Audio Settings
            </div>

            {/* Sound FX Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-100 flex items-center gap-2">
                {profile.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-amber-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-zinc-500" />
                )}
                Sound Effects (SFX)
              </span>
              <button
                onClick={handleToggleSfx}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  profile.soundEnabled ? 'bg-amber-500' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    profile.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Ambient Music Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-100 flex items-center gap-2">
                <Music className={`w-4 h-4 ${profile.musicEnabled ? 'text-purple-400' : 'text-zinc-500'}`} />
                Ambient Fantasy Music
              </span>
              <button
                onClick={handleToggleMusic}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  profile.musicEnabled ? 'bg-purple-600' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    profile.musicEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Open Source on GitHub */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenOpenSource();
            }}
            className="w-full p-2.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/40 border border-amber-400/30 flex items-center justify-between text-xs font-bold text-amber-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <GithubIcon className="w-4 h-4 text-amber-400" />
              Open Source (MIT License & Repo)
            </span>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
              GitHub
            </span>
          </button>

          {/* Privacy & Policy */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenPrivacy();
            }}
            className="w-full p-2.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/20 flex items-center justify-between text-xs font-bold text-purple-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Privacy Policy & Store Notice
            </span>
            <Info className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        {/* Reset Progress Section */}
        <div className="pt-2 border-t border-purple-500/20">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-[11px] font-bold text-rose-400/80 hover:text-rose-300 flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Clan Progress
            </button>
          ) : (
            <div className="bg-rose-950/60 border border-rose-500/40 rounded-2xl p-2.5 text-center">
              <p className="text-xs font-bold text-rose-200 mb-2">
                Erase all stages, coins, and boosters?
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-bold px-3 py-1 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    sound.playExplosion();
                    onResetProgress();
                    setConfirmReset(false);
                    onClose();
                  }}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-xl shadow"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
