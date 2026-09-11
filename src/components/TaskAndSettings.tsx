import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sliders,
  Video,
  Camera,
  Layers,
  Sparkles,
  Zap,
  Gauge,
  Shuffle,
  Volume2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  WanVersion,
  WanTask,
  GenerationConfig,
  CameraMotion,
  ExecutionEngine,
} from '../types';

interface TaskAndSettingsProps {
  config: GenerationConfig;
  onChangeConfig: (newConfig: Partial<GenerationConfig>) => void;
  isGenerating: boolean;
}

const WAN21_TASKS: { id: WanTask; name: string; desc: string; isNew?: boolean }[] = [
  { id: 't2v-1.3B', name: 'T2V 1.3B (Turbo)', desc: 'Optimized for consumer WebGPU & zero-latency client synthesis' },
  { id: 't2v-14B', name: 'T2V 14B (DiT)', desc: 'High-fidelity cinematic foundation model with 3D causal VAE' },
  { id: 'i2v-14B', name: 'I2V 14B', desc: 'Condition motion from a starting reference photograph' },
  { id: 'flf2v-14B', name: 'FLF2V 14B', desc: 'First-and-Last frame conditioning for seamless causal morphing' },
];

const WAN22_TASKS: { id: WanTask; name: string; desc: string; isNew?: boolean }[] = [
  { id: 't2v-A14B', name: 'T2V A14B (MoE)', desc: 'Mixture-of-Experts DiT with high/low noise expert routing', isNew: true },
  { id: 'i2v-A14B', name: 'I2V A14B (MoE)', desc: 'Image-to-Video with MoE architecture & dynamic camera aesthetics', isNew: true },
  { id: 'ti2v-5B', name: 'TI2V 5B (Fast)', desc: 'Lightweight distilled 5B model for rapid preview rendering' },
  { id: 's2v-14B', name: 'S2V 14B (Speech)', desc: 'Speech-to-Video driving character facial motion from audio', isNew: true },
  { id: 'animate-14B', name: 'Animate 14B', desc: 'Video-to-Video pose, motion, and mask transfer' },
];

const CAMERA_MOTIONS: { id: CameraMotion; label: string }[] = [
  { id: 'none', label: 'Static Camera' },
  { id: 'orbital_360', label: 'Orbital 360°' },
  { id: 'drone_flythrough', label: 'FPV Drone Dive' },
  { id: 'pan_left', label: 'Pan Left' },
  { id: 'pan_right', label: 'Pan Right' },
  { id: 'tilt_up', label: 'Tilt Up' },
  { id: 'tilt_down', label: 'Tilt Down' },
  { id: 'zoom_in', label: 'Slow Dolly In' },
  { id: 'zoom_out', label: 'Dolly Out' },
  { id: 'handheld_subtle', label: 'Handheld Cinematic' },
];

const SAMPLE_REFERENCE_IMAGES = [
  {
    name: 'Surfing Cat',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cyberpunk Street',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Snowy Peaks',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Astronaut Helmet',
    url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80',
  },
];

export const TaskAndSettings: React.FC<TaskAndSettingsProps> = ({
  config,
  onChangeConfig,
  isGenerating,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const tasks = config.model === 'wan2.1' ? WAN21_TASKS : WAN22_TASKS;
  const isImageConditioned = config.task.includes('i2v') || config.task.includes('flf2v');
  const isAudioConditioned = config.task.includes('s2v');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'referenceImage' | 'endFrameImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChangeConfig({ [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const randomizeSeed = () => {
    onChangeConfig({ seed: Math.floor(Math.random() * 9999999) });
  };

  return (
    <div className="space-y-4">
      {/* Task Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
          <span>Task Architecture ({config.model.toUpperCase()})</span>
          <span className="text-[10px] text-zinc-400 font-normal">
            {config.model === 'wan2.2' ? 'MoE Multi-Noise Routing' : '3D Causal Flow Matching'}
          </span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {tasks.map((t) => {
            const isSelected = config.task === t.id;
            return (
              <button
                key={t.id}
                id={`task-btn-${t.id}`}
                onClick={() => onChangeConfig({ task: t.id })}
                disabled={isGenerating}
                className={`p-2.5 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-sky-500/15 border-sky-500/50 text-sky-200 shadow-md shadow-sky-500/10'
                    : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {t.isNew && (
                  <span className="absolute top-1.5 right-1.5 px-1 py-0.2 text-[8px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded uppercase">
                    MoE
                  </span>
                )}
                <div className="font-semibold text-xs text-zinc-200">{t.name}</div>
                <div className="text-[10px] text-zinc-400 line-clamp-2 mt-0.5 leading-tight">
                  {t.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Image Conditioning for I2V & FLF2V */}
      {isImageConditioned && (
        <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
              Reference Conditioning Image {config.task === 'flf2v-14B' && '(First Frame)'}
            </span>
            <span className="text-[10px] text-zinc-400">Drag &amp; drop or choose sample</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Image Preview / Drop Area */}
            <label className="w-full sm:w-44 h-28 border-2 border-dashed border-zinc-750 hover:border-sky-500 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden bg-zinc-900/60 group">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'referenceImage')}
                className="hidden"
                disabled={isGenerating}
              />
              {config.referenceImage ? (
                <img
                  src={config.referenceImage}
                  alt="Reference"
                  className="w-full h-full object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                />
              ) : (
                <div className="text-center p-2">
                  <Upload className="w-5 h-5 mx-auto text-zinc-400 group-hover:text-sky-400 transition-colors" />
                  <span className="text-[11px] text-zinc-400 mt-1 block">Upload Source Image</span>
                </div>
              )}
            </label>

            {/* Quick Sample Image Pills */}
            <div className="flex-1 space-y-1.5">
              <div className="text-[10px] text-zinc-400">Quick Samples from Wan Repository:</div>
              <div className="grid grid-cols-2 gap-1.5">
                {SAMPLE_REFERENCE_IMAGES.map((sample) => (
                  <button
                    key={sample.name}
                    onClick={() => onChangeConfig({ referenceImage: sample.url })}
                    disabled={isGenerating}
                    className="flex items-center gap-2 p-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-left transition-colors"
                  >
                    <img src={sample.url} alt={sample.name} className="w-8 h-8 rounded object-cover" />
                    <span className="text-[11px] text-zinc-300 truncate">{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audio Conditioning for S2V (Speech-to-Video) */}
      {isAudioConditioned && (
        <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              Wan 2.2 S2V Speech Conditioning
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Audio Lip-Sync Ready</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Wan 2.2 Speech-to-Video synchronizes lip movements and expressive facial micro-gestures to match the audio cadence.
          </p>
        </div>
      )}

      {/* Camera Motion & Motion Intensity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Camera Trajectory */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            Camera Motion Dynamics
          </label>
          <select
            id="camera-motion-select"
            value={config.cameraMotion}
            onChange={(e) => onChangeConfig({ cameraMotion: e.target.value as CameraMotion })}
            disabled={isGenerating}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none focus:border-sky-500"
          >
            {CAMERA_MOTIONS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Motion Strength Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Temporal Motion Strength
            </label>
            <span className="text-xs font-mono text-zinc-300">{config.motionStrength}/10</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={config.motionStrength}
            onChange={(e) => onChangeConfig({ motionStrength: Number(e.target.value) })}
            disabled={isGenerating}
            className="w-full accent-sky-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Aspect Ratio & Resolution Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Aspect Ratio */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-200">Aspect Ratio</label>
          <div className="grid grid-cols-3 gap-1">
            {(['16:9', '9:16', '1:1'] as const).map((ratio) => (
              <button
                key={ratio}
                onClick={() => {
                  const defaultRes =
                    ratio === '16:9' ? '1280*720' : ratio === '9:16' ? '480*832' : '1024*1024';
                  onChangeConfig({ aspectRatio: ratio, resolution: defaultRes });
                }}
                disabled={isGenerating}
                className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  config.aspectRatio === ratio
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-200">Resolution</label>
          <select
            value={config.resolution}
            onChange={(e) => onChangeConfig({ resolution: e.target.value })}
            disabled={isGenerating}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-sky-500"
          >
            {config.aspectRatio === '16:9' && (
              <>
                <option value="1280*720">1280x720 (720P HD - Recommended)</option>
                <option value="832*480">832x480 (480P - Fast In-Browser)</option>
                <option value="1920*1080">1920x1080 (1080P Cinema Upscale)</option>
              </>
            )}
            {config.aspectRatio === '9:16' && (
              <>
                <option value="720*1280">720x1280 (Vertical 720P)</option>
                <option value="480*832">480x832 (Vertical 480P Fast)</option>
              </>
            )}
            {config.aspectRatio === '1:1' && (
              <>
                <option value="1024*1024">1024x1024 (Square 1K)</option>
                <option value="768*768">768x768 (Square Standard)</option>
              </>
            )}
          </select>
        </div>

        {/* Turbo 8-Step Preview Mode Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            Fast Preview Mode
          </label>
          <button
            id="toggle-fast-preview"
            onClick={() => onChangeConfig({ fastPreviewMode: !config.fastPreviewMode })}
            disabled={isGenerating}
            className={`w-full py-1.5 px-3 rounded-lg border text-xs font-medium flex items-center justify-between transition-all ${
              config.fastPreviewMode
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
          >
            <span>{config.fastPreviewMode ? 'Turbo 8-Step Active' : 'Full Sampling'}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                config.fastPreviewMode ? 'bg-emerald-400' : 'bg-zinc-600'
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Advanced Settings Accordion */}
      <div className="border-t border-zinc-850 pt-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs text-zinc-400 hover:text-zinc-200 py-1 transition-colors"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <Sliders className="w-3.5 h-3.5" />
            Advanced Diffusion Parameters (Sampling Steps, Flow Shift, Guidance Scale, Seed)
          </span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="mt-3 p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
            {/* Sampling Steps */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">Sampling Steps</span>
                <span className="font-mono text-zinc-200">{config.steps}</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={config.steps}
                onChange={(e) => onChangeConfig({ steps: Number(e.target.value) })}
                disabled={isGenerating || config.fastPreviewMode}
                className="w-full accent-sky-500"
              />
            </div>

            {/* Flow Matching Shift */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">Flow Shift (sample_shift)</span>
                <span className="font-mono text-zinc-200">{config.sampleShift.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={16.0}
                step={0.5}
                value={config.sampleShift}
                onChange={(e) => onChangeConfig({ sampleShift: Number(e.target.value) })}
                disabled={isGenerating}
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Guidance Scale (CFG) */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">Guidance Scale (CFG)</span>
                <span className="font-mono text-zinc-200">{config.guidanceScale.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={2.0}
                max={12.0}
                step={0.5}
                value={config.guidanceScale}
                onChange={(e) => onChangeConfig({ guidanceScale: Number(e.target.value) })}
                disabled={isGenerating}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Seed Randomizer */}
            <div className="space-y-1">
              <span className="text-zinc-400 block">Random Seed</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={config.seed}
                  onChange={(e) => onChangeConfig({ seed: Number(e.target.value) })}
                  disabled={isGenerating}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 font-mono text-xs text-zinc-200 outline-none"
                />
                <button
                  onClick={randomizeSeed}
                  disabled={isGenerating}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300"
                  title="Randomize Seed"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
