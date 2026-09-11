import React from 'react';
import { Cpu, Activity, Zap, CheckCircle2, RotateCw, Layers, HardDrive } from 'lucide-react';
import { GenerationProgress, ExecutionEngine } from '../types';

interface GenerationProgressViewProps {
  progress: GenerationProgress;
  engine: ExecutionEngine;
  onCancel?: () => void;
}

export const GenerationProgressView: React.FC<GenerationProgressViewProps> = ({
  progress,
  engine,
}) => {
  const isWebGpu = engine === 'in-browser-webgpu';

  return (
    <div className="bg-zinc-900 border border-zinc-750 rounded-2xl p-5 space-y-4 shadow-xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-sky-400 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <span>In-Browser Neural Denoising Active</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
                {isWebGpu ? 'WebGPU WGSL' : 'WASM Vectorized'}
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">{progress.statusText}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xl font-bold font-mono text-sky-400">{progress.percentage}%</span>
          <div className="text-[10px] text-zinc-400">
            Step {progress.currentStep}/{progress.totalSteps}
          </div>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800 p-[1px]">
        <div
          className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-150 relative"
          style={{ width: `${Math.max(4, progress.percentage)}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-[shimmer_1.5s_infinite]"></div>
        </div>
      </div>

      {/* Middle Stage: Live Preview Frame & Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Live Canvas / Latent Visualizer Frame */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-inner">
          {progress.currentPreviewFrame ? (
            <img
              src={progress.currentPreviewFrame}
              alt="Denoising Frame Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-3">
              <RotateCw className="w-6 h-6 mx-auto text-sky-400/60 animate-spin" />
              <span className="text-[11px] text-zinc-400 mt-2 block font-mono">
                Initializing Latent Tensors...
              </span>
            </div>
          )}

          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur text-[9px] font-mono text-emerald-400 border border-emerald-500/30">
            LIVE LATENT VIEW
          </div>
        </div>

        {/* Real-Time Telemetry Stats */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 bg-zinc-950/70 border border-zinc-800/80 rounded-xl">
            <span className="text-[10px] text-zinc-400 block uppercase">Elapsed Time</span>
            <span className="font-mono text-zinc-200 text-sm font-semibold mt-0.5 block">
              {(progress.elapsedMs / 1000).toFixed(1)}s
            </span>
          </div>

          <div className="p-2.5 bg-zinc-950/70 border border-zinc-800/80 rounded-xl">
            <span className="text-[10px] text-zinc-400 block uppercase">Est. Remaining</span>
            <span className="font-mono text-sky-400 text-sm font-semibold mt-0.5 block">
              {(progress.estimatedRemainingMs / 1000).toFixed(1)}s
            </span>
          </div>

          <div className="p-2.5 bg-zinc-950/70 border border-zinc-800/80 rounded-xl">
            <span className="text-[10px] text-zinc-400 block uppercase">Local VRAM Buffer</span>
            <span className="font-mono text-indigo-300 text-sm font-semibold mt-0.5 block">
              {progress.vramUsageMb} MB
            </span>
          </div>

          <div className="p-2.5 bg-zinc-950/70 border border-zinc-800/80 rounded-xl">
            <span className="text-[10px] text-zinc-400 block uppercase">Causal Frames</span>
            <span className="font-mono text-zinc-200 text-sm font-semibold mt-0.5 block">
              {progress.currentFrame}/{progress.totalFrames}
            </span>
          </div>

          <div className="p-2.5 bg-zinc-950/70 border border-zinc-800/80 rounded-xl">
            <span className="text-[10px] text-zinc-400 block uppercase">Network Roundtrips</span>
            <span className="font-mono text-emerald-400 text-sm font-semibold mt-0.5 block">
              0 (100% Client-Side)
            </span>
          </div>

          <div className="p-2.5 bg-zinc-950/70 border border-zinc-800/80 rounded-xl">
            <span className="text-[10px] text-zinc-400 block uppercase">Flow Matching</span>
            <span className="font-mono text-amber-300 text-sm font-semibold mt-0.5 block">
              Euler ODE Solver
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
