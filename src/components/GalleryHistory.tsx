import React from 'react';
import { Film, Play, Download, Trash2, RotateCcw, Clock, Sparkles } from 'lucide-react';
import { GeneratedVideo } from '../types';

interface GalleryHistoryProps {
  history: GeneratedVideo[];
  selectedVideoId: string | null;
  onSelectVideo: (video: GeneratedVideo) => void;
  onDeleteVideo: (id: string) => void;
  onClearHistory: () => void;
}

export const GalleryHistory: React.FC<GalleryHistoryProps> = ({
  history,
  selectedVideoId,
  onSelectVideo,
  onDeleteVideo,
  onClearHistory,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-zinc-100">
            Generation History ({history.length})
          </h3>
        </div>
        <button
          onClick={onClearHistory}
          className="text-[11px] text-zinc-400 hover:text-rose-400 transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {history.map((item) => {
          const isSelected = item.id === selectedVideoId;
          return (
            <div
              key={item.id}
              onClick={() => onSelectVideo(item)}
              className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all bg-zinc-950 flex flex-col ${
                isSelected
                  ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-lg'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.prompt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-zinc-500 text-xs">Video Preview</div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-sky-500/90 text-white flex items-center justify-center">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </div>

                <div className="absolute top-2 left-2 flex gap-1">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider backdrop-blur ${
                      item.model === 'wan2.1'
                        ? 'bg-sky-600/80 text-white'
                        : 'bg-indigo-600/80 text-white'
                    }`}
                  >
                    {item.model}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/60 text-zinc-300 backdrop-blur">
                    {item.task}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteVideo(item.id);
                  }}
                  className="absolute top-2 right-2 p-1 rounded bg-black/60 hover:bg-rose-600/90 text-zinc-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Video"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card Meta */}
              <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1.5 text-xs">
                <p className="text-zinc-300 text-[11px] line-clamp-2 leading-snug font-normal">
                  {item.prompt}
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-850">
                  <span>{item.resolution}</span>
                  <span>Seed: {item.seed}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
