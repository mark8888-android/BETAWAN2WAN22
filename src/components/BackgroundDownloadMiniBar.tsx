import React from 'react';
import { Download, RefreshCw, HardDrive, ArrowRight, CheckCircle2 } from 'lucide-react';

interface BackgroundDownloadMiniBarProps {
  progressPercent: number;
  downloadedBytes: number;
  totalBytes: number;
  aggregateSpeedMb: number;
  downloadingFiles: number;
  completedFiles: number;
  totalFiles: number;
  onOpenManager: () => void;
}

export const BackgroundDownloadMiniBar: React.FC<BackgroundDownloadMiniBarProps> = ({
  progressPercent,
  downloadedBytes,
  totalBytes,
  aggregateSpeedMb,
  downloadingFiles,
  completedFiles,
  totalFiles,
  onOpenManager,
}) => {
  const isDownloading = downloadingFiles > 0;

  const formatGb = (bytes: number) => {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/80 rounded-xl p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md transition-all">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center flex-shrink-0 text-sky-400">
          {isDownloading ? (
            <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
          ) : completedFiles === totalFiles ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <HardDrive className="w-4 h-4 text-zinc-400" />
          )}
        </div>

        <div>
          <div className="text-xs font-semibold text-white flex items-center gap-2">
            <span>Background Weights &amp; Safetensors</span>
            {isDownloading && (
              <span className="text-[10px] font-mono px-2 py-0.2 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full animate-pulse">
                {aggregateSpeedMb} MB/s
              </span>
            )}
            {completedFiles === totalFiles && (
              <span className="text-[10px] font-mono px-2 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                All Cached in ./weights
              </span>
            )}
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
            <span>
              {formatGb(downloadedBytes)} of {formatGb(totalBytes)} ({progressPercent}%)
            </span>
            <span>•</span>
            <span>{completedFiles}/{totalFiles} checkpoints ready</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        {/* Mini progress bar */}
        <div className="w-24 sm:w-36 bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isDownloading ? 'bg-sky-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <button
          onClick={onOpenManager}
          className="text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1 hover:underline whitespace-nowrap"
        >
          <span>Manage Weights</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
