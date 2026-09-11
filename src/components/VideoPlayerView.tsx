import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  FastForward,
  SkipBack,
  SkipForward,
  Info,
  Layers,
  Sparkles,
  Share2,
} from 'lucide-react';
import { GeneratedVideo } from '../types';

interface VideoPlayerViewProps {
  video: GeneratedVideo;
  onRegenerateSeed?: () => void;
}

export const VideoPlayerView: React.FC<VideoPlayerViewProps> = ({
  video,
  onRegenerateSeed,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.durationSec || 5);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [selectedFrameIdx, setSelectedFrameIdx] = useState<number | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => setCurrentTime(v.currentTime);
    const onLoadedMetadata = () => {
      if (v.duration && !isNaN(v.duration) && v.duration !== Infinity) {
        setDuration(v.duration);
      }
    };
    const onEnded = () => {
      if (!isLooping) setIsPlaying(false);
    };

    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('loadedmetadata', onLoadedMetadata);
    v.addEventListener('ended', onEnded);

    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('loadedmetadata', onLoadedMetadata);
      v.removeEventListener('ended', onEnded);
    };
  }, [isLooping]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
      setIsPlaying(false);
    } else {
      v.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = Number(e.target.value);
    const v = videoRef.current;
    if (v) {
      v.currentTime = target;
      setCurrentTime(target);
    }
  };

  const stepFrame = (forward: boolean) => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setIsPlaying(false);
    const frameDuration = 1 / (video.fps || 16);
    v.currentTime = Math.max(0, Math.min(duration, v.currentTime + (forward ? frameDuration : -frameDuration)));
  };

  const changeSpeed = () => {
    const speeds = [0.5, 1.0, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackRate(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = video.videoUrl;
    a.download = `wan_${video.model}_${video.task}_seed${video.seed}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadFrame = (frameUrl: string, idx: number) => {
    const a = document.createElement('a');
    a.href = frameUrl;
    a.download = `wan_frame_${idx + 1}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-750 rounded-2xl overflow-hidden shadow-2xl space-y-0 text-zinc-100">
      {/* Video Stage Container */}
      <div
        ref={containerRef}
        className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group select-none"
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          loop={isLooping}
          playsInline
          autoPlay
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-contain cursor-pointer"
          onClick={togglePlay}
        />

        {/* Center Play Overlay when paused */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-opacity"
          >
            <div className="w-16 h-16 rounded-2xl bg-sky-500/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
              <Play className="w-8 h-8 fill-current translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-black/60 backdrop-blur text-white border border-white/10 shadow">
            {video.model.toUpperCase()} • {video.task}
          </span>
          <span className="px-2 py-1 text-[10px] font-mono rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur">
            {video.resolution} @ {video.fps}fps
          </span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur text-zinc-300 hover:text-white transition-colors border border-white/10"
            title="Toggle Metadata Details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Control Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 flex flex-col gap-2 opacity-95 group-hover:opacity-100 transition-opacity">
          {/* Timeline Scrubber */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-300 w-9 text-right">
              {currentTime.toFixed(1)}s
            </span>
            <input
              type="range"
              min={0}
              max={duration || 5}
              step={0.05}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-zinc-700/80 accent-sky-400 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] font-mono text-zinc-400 w-9">
              {duration.toFixed(1)}s
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={() => stepFrame(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                title="Previous Frame"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => stepFrame(true)}
                className="p-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                title="Next Frame"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`p-2 rounded-lg text-xs transition-colors ${
                  isLooping ? 'text-sky-400 bg-sky-500/10' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Toggle Loop"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={changeSpeed}
                className="px-2 py-1 rounded-lg hover:bg-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
                title="Change Playback Speed"
              >
                {playbackRate}x
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-download-video"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-all shadow-md shadow-sky-600/20"
                title="Download WebM/MP4 Video"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Video</span>
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata & Frame Strip Drawer */}
      <div className="p-4 space-y-4">
        {/* Prompt Card */}
        <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300">Prompt</span>
            <span className="text-[10px] text-zinc-400 font-mono">
              Seed: {video.seed} • Latency: {(video.latencyMs / 1000).toFixed(1)}s
            </span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed italic">
            &quot;{video.prompt}&quot;
          </p>
        </div>

        {/* Technical Specification Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 bg-zinc-950/60 border border-zinc-800/80 rounded-lg">
            <span className="text-[10px] text-zinc-400 uppercase block">Model Core</span>
            <span className="font-mono text-zinc-200 font-semibold">{video.model.toUpperCase()} ({video.task})</span>
          </div>

          <div className="p-2 bg-zinc-950/60 border border-zinc-800/80 rounded-lg">
            <span className="text-[10px] text-zinc-400 uppercase block">Denoising Steps</span>
            <span className="font-mono text-sky-400 font-semibold">{video.steps} Steps</span>
          </div>

          <div className="p-2 bg-zinc-950/60 border border-zinc-800/80 rounded-lg">
            <span className="text-[10px] text-zinc-400 uppercase block">Flow Shift (σ)</span>
            <span className="font-mono text-indigo-400 font-semibold">{video.sampleShift?.toFixed(1) || '5.0'}</span>
          </div>

          <div className="p-2 bg-zinc-950/60 border border-zinc-800/80 rounded-lg">
            <span className="text-[10px] text-zinc-400 uppercase block">Neural Engine</span>
            <span className="font-mono text-emerald-400 font-semibold">Client WebGPU</span>
          </div>
        </div>

        {/* Frame-by-Frame Filmstrip Preview */}
        {video.frames && video.frames.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1 font-medium">
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                Causal Frame Filmstrip ({video.frames.length} frames)
              </span>
              <span className="text-[10px]">Click frame to inspect &amp; download</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {video.frames.map((frameUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedFrameIdx(idx)}
                  className="relative flex-shrink-0 w-24 aspect-video rounded-lg overflow-hidden border border-zinc-800 hover:border-sky-500 cursor-pointer group"
                >
                  <img src={frameUrl} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-black/70 text-[9px] font-mono text-zinc-300 rounded">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Single Frame Modal view if clicked */}
        {selectedFrameIdx !== null && (
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={video.frames[selectedFrameIdx]}
                alt="Selected Frame"
                className="w-16 h-10 object-cover rounded-lg border border-zinc-700"
              />
              <div className="text-xs">
                <div className="font-semibold text-zinc-200">Frame #{selectedFrameIdx + 1} of {video.frames.length}</div>
                <div className="text-zinc-400 text-[10px]">{video.resolution} • Causal VAE Decoded</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownloadFrame(video.frames[selectedFrameIdx], selectedFrameIdx)}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium rounded-lg text-white transition-colors"
              >
                Download Frame
              </button>
              <button
                onClick={() => setSelectedFrameIdx(null)}
                className="text-xs text-zinc-400 hover:text-zinc-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
