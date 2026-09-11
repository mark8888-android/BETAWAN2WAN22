export type WanVersion = 'wan2.1' | 'wan2.2';

export type Wan21Task =
  | 't2v-1.3B'
  | 't2v-14B'
  | 'i2v-14B'
  | 'flf2v-14B'
  | 't2i-14B'
  | 'vace-1.3B';

export type Wan22Task =
  | 't2v-A14B'
  | 'i2v-A14B'
  | 'ti2v-5B'
  | 'animate-14B'
  | 's2v-14B';

export type WanTask = Wan21Task | Wan22Task;

export type ExecutionEngine = 'in-browser-webgpu' | 'in-browser-webnn' | 'in-browser-wasm' | 'local-bridge';

export interface HardwareTelemetry {
  webGpuAvailable: boolean;
  adapterVendor: string;
  adapterArchitecture: string;
  adapterDescription: string;
  webNnAvailable: boolean;
  webNnDevice: 'npu' | 'gpu' | 'cpu' | 'unsupported';
  wasmSimd: boolean;
  sharedArrayBuffer: boolean;
  float16Supported: boolean;
  maxComputeWorkgroupStorageSize: number;
  maxBufferSizeMb: number;
  allocatedVramMb: number;
  tensorFlopsGflops: number;
  memoryBandwidthGbps: number;
  latencyPerStepMs: number;
  offlineReady: boolean;
  cachedWeightsBytes: number;
  isNpuAccelerated: boolean;
}

export type CameraMotion =
  | 'none'
  | 'pan_left'
  | 'pan_right'
  | 'tilt_up'
  | 'tilt_down'
  | 'zoom_in'
  | 'zoom_out'
  | 'orbital_360'
  | 'drone_flythrough'
  | 'handheld_subtle';

export type GenerationMode = 'hf-api' | 'local-gpu' | 'in-browser-webgpu';

export interface HFAuthStatus {
  connected: boolean;
  username?: string;
  name?: string;
  avatarUrl?: string;
  email?: string;
  tokenPreview?: string;
  isPro?: boolean;
  rateLimitRemaining?: number;
  error?: string;
}

export interface WeightDownloadItem {
  id: string;
  modelId: WanVersion;
  task: WanTask;
  repoId: string;
  filename: string;
  fileType: 'safetensors' | 'pth' | 'json' | 'bin';
  totalBytes: number;
  downloadedBytes: number;
  status: 'idle' | 'downloading' | 'paused' | 'completed' | 'error';
  speedBytesPerSec: number;
  etaSeconds: number;
  path: string;
  description: string;
  error?: string;
}

export interface GPUWorkerStatus {
  status: 'idle' | 'busy' | 'downloading_weights' | 'offline';
  device: string;
  vramTotalMb: number;
  vramUsedMb: number;
  activeModel: string | null;
  queueLength: number;
  readyForInference: boolean;
  cudaAvailable: boolean;
  torchVersion: string;
  safetensorsCachedCount: number;
}

export interface GenerationConfig {
  model: WanVersion;
  task: WanTask;
  prompt: string;
  negativePrompt: string;
  resolution: string; // e.g. "832*480", "1280*720"
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3' | '21:9';
  frameCount: number; // 17, 33, 49, 81
  fps: number; // 16, 24, 30
  steps: number; // 8 (preview), 20, 30, 40, 50
  guidanceScale: number; // 3.0 to 12.0
  sampleShift: number; // 3.0 to 16.0
  seed: number;
  cameraMotion: CameraMotion;
  motionStrength: number; // 1 to 10
  referenceImage?: string; // base64 or url for i2v
  endFrameImage?: string; // base64 or url for flf2v
  audioTrack?: string; // base64 or url for s2v
  executionEngine: ExecutionEngine;
  generationMode: GenerationMode;
  fastPreviewMode: boolean;
  hfToken?: string;
  hfModelRepo?: string;
}

export type GenerationStage =
  | 'idle'
  | 'init_engine'
  | 'compiling_shaders'
  | 't5_encoding'
  | 'flow_matching_dit'
  | 'vae_decode'
  | 'video_muxing'
  | 'completed'
  | 'error';

export interface GenerationProgress {
  stage: GenerationStage;
  currentStep: number;
  totalSteps: number;
  currentFrame: number;
  totalFrames: number;
  percentage: number;
  statusText: string;
  elapsedMs: number;
  estimatedRemainingMs: number;
  currentPreviewFrame?: string;
  vramUsageMb: number;
}

export interface GeneratedVideo {
  id: string;
  title: string;
  prompt: string;
  negativePrompt?: string;
  model: WanVersion;
  task: WanTask;
  videoUrl: string;
  thumbnailUrl: string;
  frames: string[];
  durationSec: number;
  fps: number;
  resolution: string;
  seed: number;
  timestamp: number;
  computeEngine: ExecutionEngine;
  latencyMs: number;
  steps: number;
  guidanceScale: number;
  sampleShift: number;
}

export interface ClonedRepoInfo {
  name: string;
  url: string;
  cloned: boolean;
  files: string[];
  readmeSnippet: string;
  license: string;
  tasks: string[];
  keyFeatures: string[];
}
