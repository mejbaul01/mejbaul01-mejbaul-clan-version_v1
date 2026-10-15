import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Code2,
  Heart,
  ExternalLink,
  ShieldCheck,
  Edit2,
  Save,
  RotateCcw,
} from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { sound } from '../game/sound';

interface OpenSourceModalProps {
  onClose: () => void;
}

const DEFAULT_REPO_URL = 'https://github.com/mejbaul01/mejbaul-clan-version-1.5.5.2';

export const OpenSourceModal: React.FC<OpenSourceModalProps> = ({ onClose }) => {
  const [repoUrl, setRepoUrl] = useState<string>(() => {
    const saved = localStorage.getItem('mejba_github_repo');
    if (saved && (saved.includes('Created-by-mejba') || saved.endsWith('/Game') || saved.endsWith('/Game.git'))) {
      localStorage.setItem('mejba_github_repo', DEFAULT_REPO_URL);
      return DEFAULT_REPO_URL;
    }
    return saved || DEFAULT_REPO_URL;
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newUrlInput, setNewUrlInput] = useState<string>(repoUrl);
  const [copied, setCopied] = useState<boolean>(false);

  // Formatted clone command
  const cleanCloneUrl = repoUrl.endsWith('.git') ? repoUrl : `${repoUrl}.git`;
  const repoName = repoUrl.split('/').filter(Boolean).pop()?.replace('.git', '') || 'Game';
  const cloneCmd = `git clone ${cleanCloneUrl}\ncd ${repoName}\nnpm install\nnpm run dev`;

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(cloneCmd).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNewUrl = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    let trimmed = newUrlInput.trim();
    if (!trimmed) {
      trimmed = DEFAULT_REPO_URL;
    }
    // Ensure https protocol
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      trimmed = `https://${trimmed}`;
    }
    setRepoUrl(trimmed);
    localStorage.setItem('mejba_github_repo', trimmed);
    setIsEditing(false);
  };

  const handleResetDefault = () => {
    sound.playClick();
    setRepoUrl(DEFAULT_REPO_URL);
    setNewUrlInput(DEFAULT_REPO_URL);
    localStorage.removeItem('mejba_github_repo');
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 z-50 select-none animate-gem-spawn">
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

        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-amber-500 to-rose-600 flex items-center justify-center mx-auto mb-2 shadow-lg">
          <GithubIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-base font-black text-amber-300 text-center tracking-wide">
          Open Source Project
        </h2>
        <p className="text-[11px] text-purple-200 text-center mb-1">
          Mejba Clan: Rest of Clans is 100% Free & Open Source under the MIT License!
        </p>
        <div className="flex justify-center mb-3">
          <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
            Version 1.5.2.2
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-left text-xs">
          {/* GitHub Repo Card */}
          <div className="p-3 rounded-2xl bg-purple-950/50 border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-amber-400" /> GitHub Repository
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/40">
                  MIT
                </span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsEditing(!isEditing);
                    setNewUrlInput(repoUrl);
                  }}
                  className="text-[9px] bg-purple-900/60 hover:bg-purple-800 text-amber-300 px-1.5 py-0.5 rounded border border-purple-500/30 flex items-center gap-0.5"
                  title="Change Repository Link"
                >
                  <Edit2 className="w-2.5 h-2.5" />
                  <span>{isEditing ? 'Cancel' : 'Change'}</span>
                </button>
              </div>
            </div>

            {/* If Editing Mode: Input new link */}
            {isEditing ? (
              <form onSubmit={handleSaveNewUrl} className="space-y-1.5 pt-1">
                <label className="text-[10px] text-zinc-400 block font-bold">
                  Enter new GitHub repository link:
                </label>
                <input
                  type="text"
                  value={newUrlInput}
                  onChange={(e) => setNewUrlInput(e.target.value)}
                  placeholder="https://github.com/your-username/your-repo"
                  className="w-full bg-[#120521] border border-purple-500/50 rounded-xl px-2.5 py-1.5 text-[11px] font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                />
                <div className="flex gap-1.5 pt-0.5">
                  <button
                    type="submit"
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-purple-950 font-extrabold text-[10px] py-1 rounded-lg flex items-center justify-center gap-1 shadow"
                  >
                    <Save className="w-3 h-3" /> Save New Link
                  </button>
                  <button
                    type="button"
                    onClick={handleResetDefault}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-[10px] px-2 py-1 rounded-lg flex items-center gap-1"
                    title="Reset to default"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between bg-[#120521] p-2 rounded-xl border border-purple-500/20">
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-amber-300 hover:text-white font-mono break-all flex items-center gap-1 underline underline-offset-2 flex-1"
                >
                  <span>{repoUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            )}
          </div>

          {/* Quick Clone Snippet */}
          <div className="p-2.5 rounded-2xl bg-[#120521] border border-purple-500/25">
            <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Clone & Run Locally</span>
              <button
                onClick={handleCopy}
                className="text-[10px] text-amber-300 hover:text-white flex items-center gap-1 bg-purple-900/40 px-2 py-0.5 rounded-md border border-purple-500/30"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-[10px] font-mono text-purple-200 bg-purple-950/60 p-2 rounded-xl overflow-x-auto whitespace-pre">
              {cloneCmd}
            </pre>
          </div>

          {/* Open Source Principles */}
          <div className="p-2.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-1">
            <div className="font-bold text-purple-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Free Forever</span>
            </div>
            <p className="text-[11px] text-purple-300 leading-relaxed">
              Anyone can inspect the code, fork it, create new puzzle stages, translate to other languages, or deploy their own version.
            </p>
          </div>

          {/* Author & Credits */}
          <div className="p-2.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-1">
            <div className="font-bold text-purple-100 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>Created with Passion</span>
            </div>
            <p className="text-[11px] text-purple-300">
              Lead Author: <span className="text-amber-300 font-bold">Mejbaul Karim Mazumder</span>
              <br />
              Contact: <span className="font-mono text-purple-200">mejbaulkm@gmail.com</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full mt-2.5 bg-gradient-to-r from-purple-800 to-purple-900 hover:from-purple-700 hover:to-purple-800 text-purple-100 font-black text-xs py-2 rounded-xl border border-purple-500/30 transition-transform active:scale-95"
        >
          Close
        </button>
      </div>
    </div>
  );
};
