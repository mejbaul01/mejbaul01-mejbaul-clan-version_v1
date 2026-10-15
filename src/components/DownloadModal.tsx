import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Smartphone,
  Check,
  Copy,
  ExternalLink,
  Terminal,
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react';
import { sound } from '../game/sound';

interface DownloadModalProps {
  onClose: () => void;
  deferredPrompt: any;
  onInstallPwa: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  onClose,
  deferredPrompt,
  onInstallPwa,
}) => {
  const [activeTab, setActiveTab] = useState<'install' | 'apk' | 'github'>('install');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const DEFAULT_REPO_URL = 'https://github.com/mejbaul01/mejbaul-clan-version-1.5.5.2';
  const gitRepoUrl = localStorage.getItem('mejba_github_repo') || DEFAULT_REPO_URL;
  const cleanGitUrl = gitRepoUrl.endsWith('.git') ? gitRepoUrl : `${gitRepoUrl}.git`;

  const gitPushCmds = `git init
git add .
git commit -m "Release v1.5.2.2 - Mejba Clan: Rest of Clans"
git branch -M main
git remote add origin ${cleanGitUrl}
git push -u origin main --force`;

  const apkBuildCmds = `npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android`;

  const copyToClipboard = (text: string, id: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
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

        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center mx-auto mb-2 shadow-lg">
          <Download className="w-6 h-6 text-white" />
        </div>

        <h2 className="text-base font-black text-amber-300 text-center tracking-wide">
          Download & Install Game
        </h2>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">
            Version 1.5.2.2
          </span>
          <span className="text-[10px] font-mono text-purple-300">
            Android & PWA
          </span>
        </div>

        {/* Tab navigation */}
        <div className="flex bg-[#130623] p-1 rounded-xl border border-purple-500/30 gap-1 mb-3">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('install');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'install'
                ? 'bg-purple-800 text-amber-300 shadow'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            Direct Install
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('apk');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'apk'
                ? 'bg-purple-800 text-amber-300 shadow'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            APK Build
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('github');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'github'
                ? 'bg-purple-800 text-amber-300 shadow'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            GitHub Push
          </button>
        </div>

        {/* Tab 1: Instant Install / WebAPK */}
        {activeTab === 'install' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left text-xs text-purple-100">
            <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30">
              <div className="flex items-center gap-2 mb-1.5">
                <Smartphone className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="font-extrabold text-amber-300">
                  Install on Android / iPhone
                </span>
              </div>
              <p className="text-[11px] text-purple-200 leading-relaxed mb-3">
                Install as a full-screen, offline-capable mobile app directly on your phone with zero APK download warnings!
              </p>

              {deferredPrompt ? (
                <button
                  onClick={() => {
                    sound.playVictory();
                    onInstallPwa();
                  }}
                  className="w-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-black text-xs py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform border border-amber-300"
                >
                  <Download className="w-4 h-4" />
                  <span>Click Here to Install App Now!</span>
                </button>
              ) : (
                <div className="space-y-2 bg-[#120521] p-2.5 rounded-xl border border-purple-500/20 text-[11px]">
                  <div className="font-bold text-amber-300">
                    📱 Manual 1-Step Install:
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-purple-800 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      1
                    </span>
                    <span>Tap your browser's Three-Dots Menu (⋮) or Share button.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-purple-800 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      2
                    </span>
                    <span>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-purple-800 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      3
                    </span>
                    <span>Mejba Clan app icon will appear on your phone screen!</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-2.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 space-y-1">
              <div className="font-bold text-purple-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Features Included:</span>
              </div>
              <ul className="text-[10px] text-purple-300 space-y-0.5 list-disc list-inside">
                <li>100% Offline gameplay (Cached with Service Worker)</li>
                <li>Full screen portrait native layout</li>
                <li>Version 1.5.2.2 pre-installed</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Android APK Build (Capacitor) */}
        {activeTab === 'apk' && (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-left text-xs text-purple-100">
            <div className="p-2.5 rounded-2xl bg-purple-950/50 border border-purple-500/30">
              <div className="font-extrabold text-amber-300 mb-1 flex items-center justify-between">
                <span>Capacitor Android APK</span>
                <span className="font-mono text-[9px] text-zinc-400">
                  com.mejbaclan.restofclans
                </span>
              </div>
              <p className="text-[10px] text-purple-300 leading-relaxed mb-2">
                This project includes complete Capacitor v8 configurations. Run these commands locally to build the release Android APK:
              </p>

              <div className="relative bg-[#120521] border border-purple-500/20 rounded-xl p-2 font-mono text-[10px] text-amber-200">
                <button
                  onClick={() => copyToClipboard(apkBuildCmds, 'apk')}
                  className="absolute top-2 right-2 p-1 bg-purple-900/60 hover:bg-purple-800 rounded text-amber-300 flex items-center gap-1 text-[9px]"
                >
                  {copiedCmd === 'apk' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedCmd === 'apk' ? 'Copied' : 'Copy'}
                </button>
                <pre className="overflow-x-auto whitespace-pre pr-12">
                  {apkBuildCmds}
                </pre>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-200">
              <div className="font-bold text-amber-300 mb-1">
                Output APK Location:
              </div>
              <div className="font-mono text-[10px] bg-black/40 p-1.5 rounded-lg text-emerald-300 break-all">
                android/app/build/outputs/apk/release/app-release-unsigned.apk
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Push to GitHub */}
        {activeTab === 'github' && (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-left text-xs text-purple-100">
            <div className="p-2.5 rounded-2xl bg-purple-950/50 border border-purple-500/30">
              <div className="font-extrabold text-amber-300 mb-1 flex items-center justify-between">
                <span>Git Push to Repository</span>
                <button
                  onClick={() => copyToClipboard(gitPushCmds, 'git')}
                  className="p-1 bg-purple-900/60 hover:bg-purple-800 rounded text-amber-300 flex items-center gap-1 text-[9px]"
                >
                  {copiedCmd === 'git' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedCmd === 'git' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-[10px] text-purple-300 leading-relaxed mb-2">
                Run these commands in your project terminal to push the complete updated version 1.5.2.2:
              </p>

              <div className="bg-[#120521] border border-purple-500/20 rounded-xl p-2 font-mono text-[10px] text-amber-200">
                <pre className="overflow-x-auto whitespace-pre">
                  {gitPushCmds}
                </pre>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-[10px] text-purple-300">
              Target repository:
              <br />
              <span className="font-mono text-amber-300 break-all">
                {cleanGitUrl}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full mt-2.5 bg-purple-800 hover:bg-purple-700 text-purple-100 font-black text-xs py-2 rounded-xl border border-purple-500/30 transition-transform active:scale-95"
        >
          Close
        </button>
      </div>
    </div>
  );
};
