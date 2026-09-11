import React from 'react';
import { Cpu, Github, Sparkles, Layers, Sliders, HardDrive, ShieldCheck, Zap } from 'lucide-react';
import { WanVersion, HardwareTelemetry } from '../types';

interface HeaderProps {
  currentModel: WanVersion;
  onSelectModel: (model: WanVersion) => void;
  telemetry: HardwareTelemetry;
  onOpenNeuralEngine: () => void;
  onOpenRepoExplorer: () => void;
  onOpenComparison: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModel,
  onSelectModel,
  telemetry,
  onOpenNeuralEngine,
  onOpenRepoExplorer,
  onOpenComparison,
}) => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 p-[1.5px] shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-sky-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                WanStudio
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                Open Source
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Wan 2.1 &amp; Wan 2.2 • In-Browser Neural Engine
            </p>
          </div>
        </div>

        {/* Model Selector Pill */}
        <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-xl p-1 shadow-inner">
          <button
            id="model-toggle-wan21"
            onClick={() => onSelectModel('wan2.1')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentModel === 'wan2.1'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-300"></span>
            <span>Wan 2.1</span>
            <span className="text-[10px] opacity-75 hidden md:inline">DiT 1.3B/14B</span>
          </button>

          <button
            id="model-toggle-wan22"
            onClick={() => onSelectModel('wan2.2')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentModel === 'wan2.2'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-300"></span>
            <span>Wan 2.2</span>
            <span className="text-[10px] opacity-75 hidden md:inline">MoE A14B</span>
          </button>
        </div>

        {/* In-Browser Neural Engine Pill & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Neural Engine Telemetry Pill */}
          <button
            id="btn-neural-engine-telemetry"
            onClick={onOpenNeuralEngine}
            className="group flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-sky-500/40 rounded-xl transition-all text-xs"
            title="In-Browser Neural Engine Telemetry & WebGPU/WebNN Status"
          >
            <div className="relative flex items-center justify-center">
              <Cpu className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-[10px] font-semibold text-zinc-300 flex items-center gap-1">
                In-Browser Neural Engine
              </div>
              <div className="text-[9px] text-zinc-400">
                {telemetry.webGpuAvailable ? 'WebGPU Active' : 'WASM Vectorized'}
                {telemetry.isNpuAccelerated && ' • NPU Accel'}
              </div>
            </div>
            <span className="px-1.5 py-0.5 text-[9px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">
              0-Latency
            </span>
          </button>

          {/* Model Comparison Button */}
          <button
            id="btn-open-comparison"
            onClick={onOpenComparison}
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 rounded-xl transition-colors hidden sm:flex items-center gap-1.5 text-xs"
            title="Compare Wan 2.1 DiT vs Wan 2.2 MoE Architectures"
          >
            <Sliders className="w-4 h-4 text-zinc-300" />
            <span className="hidden md:inline">Compare</span>
          </button>

          {/* Cloned Repositories Explorer */}
          <button
            id="btn-open-repo-explorer"
            onClick={onOpenRepoExplorer}
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 rounded-xl transition-colors flex items-center gap-1.5 text-xs"
            title="Inspect Cloned Wan 2.1 & Wan 2.2 Repositories"
          >
            <Github className="w-4 h-4 text-zinc-200" />
            <span className="hidden sm:inline font-medium">Repos</span>
          </button>
        </div>
      </div>
    </header>
  );
};
