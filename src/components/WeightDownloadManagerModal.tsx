import React, { useState, useEffect } from 'react';
import {
  Download,
  HardDrive,
  Cpu,
  Pause,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  Server,
  X,
  RefreshCw,
  FolderDown,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { WeightDownloadItem, GPUWorkerStatus } from '../types';

interface WeightDownloadManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWeightsStatusChanged?: () => void;
}

export const WeightDownloadManagerModal: React.FC<WeightDownloadManagerModalProps> = ({
  isOpen,
  onClose,
  onWeightsStatusChanged,
}) => {
  const [items, setItems] = useState<WeightDownloadItem[]>([]);
  const [summary, setSummary] = useState({
    totalFiles: 0,
    completedFiles: 0,
    downloadingFiles: 0,
    totalBytes: 0,
    downloadedBytes: 0,
    progressPercent: 0,
    aggregateSpeedMb: 0,
  });
  const [gpuStatus, setGpuStatus] = useState<GPUWorkerStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Poll background weight download status every 1.5 seconds when open
  useEffect(() => {
    if (!isOpen) return;

    fetchWeights();
    fetchGpuStatus();

    const timer = setInterval(() => {
      fetchWeights();
      fetchGpuStatus();
    }, 1500);

    return () => clearInterval(timer);
  }, [isOpen]);

  const fetchWeights = async () => {
    try {
      const res = await fetch('/api/backend/weights');
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
        setSummary(data.summary);
        if (onWeightsStatusChanged) onWeightsStatusChanged();
      }
    } catch (err) {
      console.error('Failed to fetch weight download status:', err);
    }
  };

  const fetchGpuStatus = async () => {
    try {
      const res = await fetch('/api/backend/gpu/status');
      const data = await res.json();
      setGpuStatus(data);
    } catch (err) {
      console.error('Failed to fetch GPU status:', err);
    }
  };

  const handleStartAll = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/backend/weights/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ downloadAll: true }),
      });
      fetchWeights();
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseAll = async () => {
    try {
      await fetch('/api/backend/weights/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      fetchWeights();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartItem = async (id: string) => {
    try {
      await fetch('/api/backend/weights/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchWeights();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePauseItem = async (id: string) => {
    try {
      await fetch('/api/backend/weights/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchWeights();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
              <FolderDown className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Background Safetensors &amp; Weights Manager
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  Heavy GPU Background Worker
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Download model checkpoints in background while using the frontend for prompting and HF generation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Top GPU Worker Hardware Overview */}
          {gpuStatus && (
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-zinc-500">Worker Hardware</div>
                  <div className="font-semibold text-zinc-200">{gpuStatus.device}</div>
                  <div className="text-[10px] text-emerald-400">CUDA 12.4 • PyTorch {gpuStatus.torchVersion}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-zinc-500">VRAM Allocation</div>
                  <div className="font-semibold text-zinc-200">
                    {(gpuStatus.vramUsedMb / 1024).toFixed(1)} GB / {(gpuStatus.vramTotalMb / 1024).toFixed(0)} GB
                  </div>
                  <div className="w-28 bg-zinc-800 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all"
                      style={{ width: `${(gpuStatus.vramUsedMb / gpuStatus.vramTotalMb) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-zinc-500">Worker Status</div>
                  <div className="font-semibold text-zinc-200 capitalize">
                    {gpuStatus.status.replace('_', ' ')}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {gpuStatus.safetensorsCachedCount} Checkpoints cached in ./weights
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aggregate Download Progress & Master Controls */}
          <div className="bg-gradient-to-r from-sky-950/40 via-zinc-900 to-indigo-950/40 border border-sky-500/30 rounded-xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Background Weight Cache</span>
                  <span className="text-xs font-mono font-normal text-sky-300">
                    {formatBytes(summary.downloadedBytes)} / {formatBytes(summary.totalBytes)} ({summary.progressPercent}%)
                  </span>
                </div>
                <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-3">
                  <span>{summary.completedFiles} of {summary.totalFiles} files ready</span>
                  {summary.downloadingFiles > 0 && (
                    <span className="text-sky-400 font-mono flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      {summary.aggregateSpeedMb} MB/s background speed
                    </span>
                  )}
                </div>
              </div>

              {/* Master Control Buttons */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-download-all-weights"
                  onClick={handleStartAll}
                  disabled={isLoading}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-sky-600/20 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download All in Background</span>
                </button>

                {summary.downloadingFiles > 0 && (
                  <button
                    id="btn-pause-all-weights"
                    onClick={handlePauseAll}
                    className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </button>
                )}
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden p-0.5 border border-zinc-800">
              <div
                className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${summary.progressPercent}%` }}
              />
            </div>
          </div>

          {/* List of Model Weights & Safetensors */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-300" />
              Model Safetensors &amp; Checkpoint Files
            </h3>

            <div className="space-y-2">
              {items.map((item) => {
                const percent = Math.round((item.downloadedBytes / item.totalBytes) * 100);
                const isDownloading = item.status === 'downloading';
                const isCompleted = item.status === 'completed';

                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-zinc-950/90 border border-zinc-800/80 rounded-xl flex flex-col gap-2.5 transition-all hover:border-zinc-700"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 mt-0.5">
                          <HardDrive className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : isDownloading ? 'text-sky-400' : 'text-zinc-500'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-zinc-200 font-mono">
                              {item.filename}
                            </span>
                            <span className="px-2 py-0.5 text-[9px] uppercase font-semibold bg-zinc-800 text-zinc-400 rounded">
                              {item.fileType}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              ({item.modelId.toUpperCase()})
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{item.description}</p>
                          <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                            Repo: {item.repoId}
                          </div>
                        </div>
                      </div>

                      {/* Right Action / Status */}
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <div className="text-xs font-mono font-medium text-zinc-300">
                            {formatBytes(item.downloadedBytes)} / {formatBytes(item.totalBytes)}
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            {isCompleted && (
                              <span className="text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                                <CheckCircle2 className="w-3 h-3" /> Ready in ./weights
                              </span>
                            )}
                            {isDownloading && (
                              <span className="text-sky-400 font-mono">
                                {(item.speedBytesPerSec / (1024 * 1024)).toFixed(1)} MB/s • ETA {item.etaSeconds}s
                              </span>
                            )}
                            {item.status === 'paused' && <span className="text-amber-400">Paused</span>}
                            {item.status === 'idle' && <span className="text-zinc-400">Not Downloaded</span>}
                          </div>
                        </div>

                        {/* Button per item */}
                        {isCompleted ? (
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : isDownloading ? (
                          <button
                            onClick={() => handlePauseItem(item.id)}
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors text-xs"
                            title="Pause download"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartItem(item.id)}
                            className="p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors text-xs shadow-sm shadow-sky-600/30"
                            title="Download file"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar per item */}
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-emerald-500' : isDownloading ? 'bg-sky-500' : 'bg-zinc-700'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/70 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Downloads run in background. You can close this window without interrupting the GPU worker.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors"
          >
            Keep Running in Background
          </button>
        </div>
      </div>
    </div>
  );
};
