import React from 'react';
import {
  Cpu,
  Github,
  Sparkles,
  Layers,
  Sliders,
  HardDrive,
  ShieldCheck,
  Zap,
  FolderDown,
  Monitor,
  CheckCircle2,
} from 'lucide-react';
import { WanVersion, HardwareTelemetry, HFAuthStatus } from '../types';

interface HeaderProps {
  currentModel: WanVersion;
  onSelectModel: (model: WanVersion) => void;
  telemetry: HardwareTelemetry;
  hfStatus: HFAuthStatus;
  onOpenHuggingFace: () => void;
  onOpenWeightManager: () => void;
  onOpenFrontendSetup: () => void;
  onOpenNeuralEngine: () => void;
  onOpenRepoExplorer: () => void;
  onOpenComparison: () => void;
  weightProgressPercent: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentModel,
  onSelectModel,
  telemetry,
  hfStatus,
  onOpenHuggingFace,
  onOpenWeightManager,
  onOpenFrontendSetup,
  onOpenNeuralEngine,
  onOpenRepoExplorer,
  onOpenComparison,
  weightProgressPercent,
}) => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 p-[1.5px] shadow-lg shadow-sky-500/20 flex-shrink-0">
            <div className="w-full h-full bg-zinc-950 rounded-[9px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                WanStudio
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full hidden sm:inline-block">
                Frontend + Worker
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden md:block">
              Wan 2.1 &amp; Wan 2.2 • In-Browser + HF API + GPU Worker
            </p>
          </div>
        </div>

        {/* Model Selector Pill */}
        <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-xl p-1 shadow-inner">
          <button
            id="model-toggle-wan21"
            onClick={() => onSelectModel('wan2.1')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentModel === 'wan2.1'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-300"></span>
            <span>Wan 2.1</span>
            <span className="text-[10px] opacity-75 hidden lg:inline">DiT</span>
          </button>

          <button
            id="model-toggle-wan22"
            onClick={() => onSelectModel('wan2.2')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentModel === 'wan2.2'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-300"></span>
            <span>Wan 2.2</span>
            <span className="text-[10px] opacity-75 hidden lg:inline">MoE</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Hugging Face API Button with explicit indication */}
          <button
            id="btn-open-huggingface-token"
            onClick={onOpenHuggingFace}
            className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              hfStatus.connected
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 shadow-sm shadow-amber-500/10'
            }`}
            title="Connect Hugging Face Token for real video generation"
          >
            <span className="text-sm">🤗</span>
            <div className="text-left">
              <span className="hidden sm:inline">
                {hfStatus.connected ? `@${hfStatus.username}` : 'HF Token'}
              </span>
              <span className="sm:hidden">{hfStatus.connected ? 'HF ✓' : 'HF Token'}</span>
            </div>
            {hfStatus.connected ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            ) : (
              <span className="px-1 py-0.2 text-[9px] bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                Connect
              </span>
            )}
          </button>

          {/* Background Weights & Heavy GPU Manager Button */}
          <button
            id="btn-open-weight-manager"
            onClick={onOpenWeightManager}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all text-xs font-medium text-zinc-300"
            title="Manage Background Safetensors & GPU Worker"
          >
            <FolderDown className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Weights</span>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.2 rounded border border-sky-500/20">
              {weightProgressPercent}%
            </span>
          </button>

          {/* Frontend Setup / Install Button */}
          <button
            id="btn-open-frontend-setup"
            onClick={onOpenFrontendSetup}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all text-xs font-medium text-zinc-300 flex items-center gap-1.5"
            title="Install & Setup Frontend"
          >
            <Monitor className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline">Frontend Setup</span>
          </button>

          {/* In-Browser Neural Engine Diagnostics Pill */}
          <button
            id="btn-neural-engine-telemetry"
            onClick={onOpenNeuralEngine}
            className="group p-1.5 sm:px-2.5 sm:py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-sky-500/40 rounded-xl transition-all text-xs flex items-center gap-1.5"
            title="In-Browser Neural Engine Telemetry"
          >
            <Cpu className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
            <span className="hidden xl:inline text-zinc-300">WebGPU Engine</span>
          </button>

          {/* Cloned Repositories Explorer */}
          <button
            id="btn-open-repo-explorer"
            onClick={onOpenRepoExplorer}
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 rounded-xl transition-colors flex items-center gap-1.5 text-xs"
            title="Inspect Cloned Wan 2.1 & Wan 2.2 Repositories"
          >
            <Github className="w-4 h-4 text-zinc-200" />
          </button>
        </div>
      </div>
    </header>
  );
};
