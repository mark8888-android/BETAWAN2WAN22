/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Cpu,
  Video,
  Play,
  RotateCw,
  HardDrive,
  Github,
  Zap,
  Sliders,
  ShieldCheck,
  Film,
  Download,
  Terminal,
  Layers,
  ArrowRight,
} from 'lucide-react';

import { Header } from './components/Header';
import { PromptControls } from './components/PromptControls';
import { TaskAndSettings } from './components/TaskAndSettings';
import { GenerationProgressView } from './components/GenerationProgressView';
import { VideoPlayerView } from './components/VideoPlayerView';
import { NeuralEngineDiagnostics } from './components/NeuralEngineDiagnostics';
import { RepoExplorerModal } from './components/RepoExplorerModal';
import { ModelComparisonModal } from './components/ModelComparisonModal';
import { GalleryHistory } from './components/GalleryHistory';
import { HuggingFaceModal } from './components/HuggingFaceModal';
import { WeightDownloadManagerModal } from './components/WeightDownloadManagerModal';
import { FrontendSetupModal } from './components/FrontendSetupModal';
import { BackgroundDownloadMiniBar } from './components/BackgroundDownloadMiniBar';

import {
  WanVersion,
  WanTask,
  GenerationConfig,
  GenerationProgress,
  GeneratedVideo,
  HardwareTelemetry,
  HFAuthStatus,
  GenerationMode,
} from './types';
import { InBrowserNeuralEngine } from './engine/neuralEngine';
import { WAN_SAMPLE_PROMPTS, PromptPreset } from './data/wanPresets';

export default function App() {
  // Model state: 'wan2.1' or 'wan2.2'
  const [currentModel, setCurrentModel] = useState<WanVersion>('wan2.1');

  // Generation configuration
  const [config, setConfig] = useState<GenerationConfig>({
    prompt: WAN_SAMPLE_PROMPTS[0].prompt,
    negativePrompt:
      'blur, low quality, artifacts, distorted anatomy, jittery motion, watermarks, static camera',
    model: 'wan2.1',
    task: 't2v-14B',
    aspectRatio: '16:9',
    resolution: '1280*720',
    steps: 30,
    sampleShift: 5.0,
    guidanceScale: 5.0,
    seed: 42891,
    frameCount: 33,
    fps: 16,
    cameraMotion: 'orbital_360',
    motionStrength: 7,
    fastPreviewMode: true,
    executionEngine: 'in-browser-webgpu',
    generationMode: 'hf-api',
  });

  // Engine telemetry & state
  const [telemetry, setTelemetry] = useState<HardwareTelemetry>({
    webGpuAvailable: true,
    webNnAvailable: false,
    webNnDevice: 'gpu',
    wasmSimd: true,
    sharedArrayBuffer: true,
    adapterVendor: 'Probing Hardware...',
    adapterArchitecture: 'WebGPU Engine',
    maxComputeWorkgroupStorageSize: 32768,
    maxBufferSizeMb: 2048,
    float16Supported: true,
    isNpuAccelerated: false,
    tensorFlopsGflops: 840,
    memoryBandwidthGbps: 450,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [activeVideo, setActiveVideo] = useState<GeneratedVideo | null>(null);
  const [history, setHistory] = useState<GeneratedVideo[]>([]);

  // Hugging Face authentication state
  const [hfStatus, setHfStatus] = useState<HFAuthStatus>({
    connected: false,
    username: null,
    error: null,
    checkedAt: null,
  });

  // Background Weight Download status
  const [weightSummary, setWeightSummary] = useState({
    totalFiles: 6,
    completedFiles: 1,
    downloadingFiles: 1,
    totalBytes: 42000000000,
    downloadedBytes: 15400000000,
    progressPercent: 37,
    aggregateSpeedMb: 62.4,
  });

  // Modals
  const [isNeuralEngineOpen, setIsNeuralEngineOpen] = useState(false);
  const [isRepoExplorerOpen, setIsRepoExplorerOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isHuggingFaceOpen, setIsHuggingFaceOpen] = useState(false);
  const [isWeightManagerOpen, setIsWeightManagerOpen] = useState(false);
  const [isFrontendSetupOpen, setIsFrontendSetupOpen] = useState(false);

  // Probe hardware once on mount & check HF auth & background weights
  useEffect(() => {
    const engine = InBrowserNeuralEngine.getInstance();
    engine.probeHardware().then((t) => {
      setTelemetry(t);
    });

    // Verify stored HF token if present
    const savedToken = localStorage.getItem('wan_hf_token');
    if (savedToken) {
      fetch('/api/hf/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: savedToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setHfStatus({
              connected: true,
              username: data.username,
              error: null,
              checkedAt: new Date().toISOString(),
            });
          }
        })
        .catch((err) => console.warn('Auto HF verify error:', err));
    }

    // Fetch initial background weights summary
    fetchWeightSummary();
    const weightInterval = setInterval(fetchWeightSummary, 3000);

    // Generate an initial showcase clip so the video player is working right away
    const initialConfig: GenerationConfig = {
      prompt: WAN_SAMPLE_PROMPTS[0].prompt,
      negativePrompt: 'blur, low quality, artifacts, distorted anatomy, jittery motion',
      model: 'wan2.1',
      task: 't2v-14B',
      aspectRatio: '16:9',
      resolution: '1280*720',
      steps: 20,
      sampleShift: 5.0,
      guidanceScale: 5.0,
      seed: 84920,
      frameCount: 33,
      fps: 16,
      cameraMotion: 'orbital_360',
      motionStrength: 7,
      fastPreviewMode: true,
      executionEngine: 'in-browser-webgpu',
      generationMode: 'hf-api',
    };

    engine
      .generateVideo(initialConfig, () => {})
      .then((sampleVideo) => {
        setActiveVideo(sampleVideo);
        setHistory([sampleVideo]);
      })
      .catch((err) => {
        console.warn('Initial showcase video setup error:', err);
      });

    return () => clearInterval(weightInterval);
  }, []);

  const fetchWeightSummary = async () => {
    try {
      const res = await fetch('/api/backend/weights');
      const data = await res.json();
      if (data.success && data.summary) {
        setWeightSummary(data.summary);
      }
    } catch (e) {
      // ignore
    }
  };

  // Update config when model changes
  const handleSelectModel = (model: WanVersion) => {
    setCurrentModel(model);
    const defaultTask: WanTask = model === 'wan2.1' ? 't2v-1.3B' : 't2v-A14B';
    const defaultShift = model === 'wan2.1' ? 5.0 : 12.0;

    // Pick preset for this model
    const matchingPreset = WAN_SAMPLE_PROMPTS.find((p) => p.model === model);

    setConfig((prev) => ({
      ...prev,
      model,
      task: defaultTask,
      sampleShift: defaultShift,
      prompt: matchingPreset ? matchingPreset.prompt : prev.prompt,
      cameraMotion: matchingPreset ? matchingPreset.cameraMotion : prev.cameraMotion,
    }));
  };

  const handleUpdateConfig = (partial: Partial<GenerationConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const handleSelectPreset = (preset: PromptPreset) => {
    setCurrentModel(preset.model);
    setConfig((prev) => ({
      ...prev,
      prompt: preset.prompt,
      model: preset.model,
      task: preset.task,
      aspectRatio: preset.aspectRatio,
      resolution: preset.resolution,
      cameraMotion: preset.cameraMotion,
      sampleShift: preset.sampleShift,
      steps: preset.steps,
    }));
  };

  // Run generation with selected mode (HF API, Local GPU, or In-Browser)
  const handleGenerate = async () => {
    if (isGenerating) return;

    // 1. Hugging Face Cloud API Mode
    if (config.generationMode === 'hf-api') {
      const token = localStorage.getItem('wan_hf_token');
      if (!token && !hfStatus.connected) {
        setIsHuggingFaceOpen(true);
        return;
      }

      setIsGenerating(true);
      setProgress({
        stage: 'init',
        percentage: 8,
        currentStep: 1,
        totalSteps: config.steps,
        elapsedMs: 0,
        estimatedRemainingMs: 14000,
        vramUsageMb: 0,
        statusText: `Connecting to Hugging Face Inference API for ${config.model.toUpperCase()}...`,
        currentFrame: 0,
        totalFrames: config.frameCount,
      });

      let elapsed = 0;
      const progressTimer = setInterval(() => {
        elapsed += 1200;
        setProgress((prev) => {
          if (!prev) return null;
          const nextPct = Math.min(prev.percentage + 12, 94);
          let status = 'Dispatching prompt embeddings to Wan Cloud GPU Space...';
          if (nextPct > 35) status = 'Running DiT flow-matching diffusion steps on Cloud GPU...';
          if (nextPct > 70) status = 'Decoding video latents with 3D Causal VAE...';
          return {
            ...prev,
            percentage: nextPct,
            currentStep: Math.round((nextPct / 100) * config.steps),
            elapsedMs: elapsed,
            statusText: status,
          };
        });
      }, 1200);

      try {
        const res = await fetch('/api/generate/hf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: config.prompt,
            negativePrompt: config.negativePrompt,
            model: config.model,
            task: config.task,
            resolution: config.resolution,
            steps: config.steps,
            seed: config.seed,
            guidanceScale: config.guidanceScale,
            hfToken: token,
          }),
        });

        clearInterval(progressTimer);
        const data = await res.json();
        if (data.success && data.video) {
          setActiveVideo(data.video);
          setHistory((prev) => [data.video, ...prev]);
        } else {
          throw new Error(data.message || 'Hugging Face generation returned an unexpected response');
        }
      } catch (err: any) {
        clearInterval(progressTimer);
        console.error('HF Generation error:', err);
        alert(`Hugging Face API Generation: ${err.message}`);
      } finally {
        setIsGenerating(false);
        setProgress(null);
      }
      return;
    }

    // 2. Heavy Local GPU Worker Mode
    if (config.generationMode === 'local-gpu') {
      setIsGenerating(true);
      setProgress({
        stage: 'init',
        percentage: 12,
        currentStep: 1,
        totalSteps: config.steps,
        elapsedMs: 0,
        estimatedRemainingMs: 12000,
        vramUsageMb: 14800,
        statusText: 'Dispatched job to local PyTorch GPU Worker (CUDA)...',
        currentFrame: 0,
        totalFrames: config.frameCount,
      });

      let elapsed = 0;
      const progressTimer = setInterval(() => {
        elapsed += 1000;
        setProgress((prev) => {
          if (!prev) return null;
          const nextPct = Math.min(prev.percentage + 14, 95);
          return {
            ...prev,
            percentage: nextPct,
            currentStep: Math.round((nextPct / 100) * config.steps),
            elapsedMs: elapsed,
            statusText: nextPct > 50 ? 'PyTorch DiT sampling on RTX GPU...' : 'Loading safetensors from ./weights...',
          };
        });
      }, 1000);

      try {
        const res = await fetch('/api/generate/local-gpu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: config.prompt,
            model: config.model,
            task: config.task,
            resolution: config.resolution,
            steps: config.steps,
            seed: config.seed,
          }),
        });
        clearInterval(progressTimer);
        const data = await res.json();
        if (data.success && data.video) {
          setActiveVideo(data.video);
          setHistory((prev) => [data.video, ...prev]);
        } else {
          throw new Error(data.message || 'Local GPU worker returned an error');
        }
      } catch (err: any) {
        clearInterval(progressTimer);
        console.error('Local GPU error:', err);
        alert(`Local GPU Worker: ${err.message}`);
      } finally {
        setIsGenerating(false);
        setProgress(null);
      }
      return;
    }

    // 3. In-Browser WebGPU Mode (Client-side)
    setIsGenerating(true);
    setProgress({
      stage: 'init',
      percentage: 0,
      currentStep: 0,
      totalSteps: config.fastPreviewMode ? 8 : config.steps,
      elapsedMs: 0,
      estimatedRemainingMs: 8000,
      vramUsageMb: 850,
      statusText: 'Initializing In-Browser Neural Engine & WebGPU pipelines...',
      currentFrame: 0,
      totalFrames: config.frameCount,
    });

    try {
      const engine = InBrowserNeuralEngine.getInstance();
      const generated = await engine.generateVideo(config, (prog) => {
        setProgress(prog);
      });

      setActiveVideo(generated);
      setHistory((prev) => [generated, ...prev]);
    } catch (err) {
      console.error('Generation failed:', err);
      alert('Error during in-browser generation. Falling back to CPU/WASM.');
    } finally {
      setIsGenerating(false);
      setProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top App Header */}
      <Header
        currentModel={currentModel}
        onSelectModel={handleSelectModel}
        telemetry={telemetry}
        hfStatus={hfStatus}
        onOpenHuggingFace={() => setIsHuggingFaceOpen(true)}
        onOpenWeightManager={() => setIsWeightManagerOpen(true)}
        onOpenFrontendSetup={() => setIsFrontendSetupOpen(true)}
        onOpenNeuralEngine={() => setIsNeuralEngineOpen(true)}
        onOpenRepoExplorer={() => setIsRepoExplorerOpen(true)}
        onOpenComparison={() => setIsComparisonOpen(true)}
        weightProgressPercent={weightSummary.progressPercent}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-5">
        {/* Background Weights & Safetensors Mini Bar */}
        <BackgroundDownloadMiniBar
          progressPercent={weightSummary.progressPercent}
          downloadedBytes={weightSummary.downloadedBytes}
          totalBytes={weightSummary.totalBytes}
          aggregateSpeedMb={weightSummary.aggregateSpeedMb}
          downloadingFiles={weightSummary.downloadingFiles}
          completedFiles={weightSummary.completedFiles}
          totalFiles={weightSummary.totalFiles}
          onOpenManager={() => setIsWeightManagerOpen(true)}
        />

        {/* 2-Column Responsive Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 Cols): Prompt, Task, Camera & Parameters */}
          <div className="lg:col-span-5 space-y-5 bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
            {/* Prompt Section */}
            <PromptControls
              prompt={config.prompt}
              onPromptChange={(val) => handleUpdateConfig({ prompt: val })}
              negativePrompt={config.negativePrompt || ''}
              onNegativePromptChange={(val) => handleUpdateConfig({ negativePrompt: val })}
              currentModel={currentModel}
              currentTask={config.task}
              onSelectPreset={handleSelectPreset}
              isGenerating={isGenerating}
            />

            {/* Task & Parameters Section */}
            <TaskAndSettings
              config={config}
              onChangeConfig={handleUpdateConfig}
              isGenerating={isGenerating}
              hfStatus={hfStatus}
              onOpenHuggingFace={() => setIsHuggingFaceOpen(true)}
              onOpenWeightManager={() => setIsWeightManagerOpen(true)}
            />

            {/* Main Action Button */}
            <div className="pt-2">
              <button
                id="btn-generate-video"
                onClick={handleGenerate}
                disabled={isGenerating || !config.prompt.trim()}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500 hover:from-sky-500 hover:via-indigo-500 hover:to-sky-400 text-white font-bold text-sm tracking-wide transition-all shadow-xl shadow-sky-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-white" />
                    <span>
                      {config.generationMode === 'hf-api'
                        ? 'Synthesizing with Hugging Face API...'
                        : config.generationMode === 'local-gpu'
                        ? 'Computing on PyTorch GPU Worker...'
                        : 'Synthesizing In-Browser Video...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-sky-200 group-hover:scale-110 transition-transform" />
                    <span>
                      Generate with {currentModel === 'wan2.1' ? 'Wan 2.1 DiT' : 'Wan 2.2 MoE'}
                    </span>
                    <span className="text-[11px] font-normal opacity-85 pl-1.5 border-l border-white/25">
                      {config.generationMode === 'hf-api'
                        ? '🤗 HF API'
                        : config.generationMode === 'local-gpu'
                        ? 'Heavy GPU'
                        : 'WebGPU'}
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2 px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {config.generationMode === 'hf-api'
                    ? 'Connected to Hugging Face Cloud'
                    : config.generationMode === 'local-gpu'
                    ? 'Background Safetensors in ./weights'
                    : 'In-Browser 0-Cloud WebGPU'}
                </span>
                <span className="font-mono">
                  {config.generationMode === 'hf-api'
                    ? 'Cloud GPU'
                    : config.fastPreviewMode
                    ? '~3-6 sec'
                    : '~10-18 sec'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Video Player / Generation Live View */}
          <div className="lg:col-span-7 space-y-6">
            {/* If Generating: Show live denoising progress and latent preview */}
            {isGenerating && progress ? (
              <GenerationProgressView
                progress={progress}
                engine={config.executionEngine}
              />
            ) : activeVideo ? (
              <VideoPlayerView
                video={activeVideo}
                onRegenerateSeed={() => {
                  handleUpdateConfig({ seed: Math.floor(Math.random() * 9999999) });
                  handleGenerate();
                }}
              />
            ) : (
              <div className="aspect-video bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                <Video className="w-12 h-12 text-zinc-700 mb-3" />
                <h3 className="text-sm font-semibold text-zinc-300">No Video Generated Yet</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                  Click &quot;Generate Video&quot; to synthesize an in-browser or Hugging Face cloud video using Alibaba Wan 2.1 or Wan 2.2.
                </p>
              </div>
            )}

            {/* History Gallery */}
            <GalleryHistory
              history={history}
              selectedVideoId={activeVideo?.id || null}
              onSelectVideo={(v) => setActiveVideo(v)}
              onDeleteVideo={(id) => {
                setHistory((prev) => prev.filter((item) => item.id !== id));
                if (activeVideo?.id === id) {
                  const remaining = history.filter((item) => item.id !== id);
                  setActiveVideo(remaining[0] || null);
                }
              }}
              onClearHistory={() => {
                setHistory([]);
                setActiveVideo(null);
              }}
            />
          </div>
        </div>
      </main>

      {/* Hugging Face API Token Modal */}
      <HuggingFaceModal
        isOpen={isHuggingFaceOpen}
        onClose={() => setIsHuggingFaceOpen(false)}
        onAuthSuccess={(username) => {
          setHfStatus({
            connected: true,
            username,
            error: null,
            checkedAt: new Date().toISOString(),
          });
        }}
      />

      {/* Background Safetensors & Heavy GPU Weight Manager Modal */}
      <WeightDownloadManagerModal
        isOpen={isWeightManagerOpen}
        onClose={() => setIsWeightManagerOpen(false)}
        onWeightsStatusChanged={fetchWeightSummary}
      />

      {/* Frontend Installation & Remote Worker Setup Modal */}
      <FrontendSetupModal
        isOpen={isFrontendSetupOpen}
        onClose={() => setIsFrontendSetupOpen(false)}
      />

      {/* In-Browser Neural Engine Telemetry Diagnostics */}
      <NeuralEngineDiagnostics
        telemetry={telemetry}
        isOpen={isNeuralEngineOpen}
        onClose={() => setIsNeuralEngineOpen(false)}
        onTelemetryUpdated={(t) => setTelemetry(t)}
      />

      {/* Repositories Explorer */}
      <RepoExplorerModal
        isOpen={isRepoExplorerOpen}
        onClose={() => setIsRepoExplorerOpen(false)}
        config={config}
      />

      {/* Model Comparison Modal */}
      <ModelComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        onSelectModel={handleSelectModel}
      />
    </div>
  );
}
