import { WanVersion, WanTask, CameraMotion } from '../types';

export interface PromptPreset {
  id: string;
  title: string;
  prompt: string;
  model: WanVersion;
  task: WanTask;
  aspectRatio: '16:9' | '9:16' | '1:1';
  resolution: string;
  cameraMotion: CameraMotion;
  style: string;
  sampleShift: number;
  steps: number;
}

export const WAN_SAMPLE_PROMPTS: PromptPreset[] = [
  {
    id: 'boxing_cats',
    title: 'Wan Official: Anthropomorphic Boxing Cats',
    prompt:
      'Two anthropomorphic cats in comfy boxing gear and bright gloves fight intensely on a spotlighted stage, sweat droplets glistening under dramatic arena lights, audience cheering in blurred background, dynamic camera tracking shot.',
    model: 'wan2.1',
    task: 't2v-14B',
    aspectRatio: '16:9',
    resolution: '1280*720',
    cameraMotion: 'orbital_360',
    style: 'Cinematic Hyper-Realistic',
    sampleShift: 5.0,
    steps: 40,
  },
  {
    id: 'surf_cat',
    title: 'Wan Official: Surfing Cat on Beach (I2V)',
    prompt:
      'Summer beach vacation style, a white cat wearing sunglasses sits on a surfboard. The fluffy-furred feline gazes directly at the camera with a relaxed expression. Blurred beach scenery forms the background featuring crystal-clear turquoise waters and distant green hills under warm sunlight.',
    model: 'wan2.1',
    task: 'i2v-14B',
    aspectRatio: '16:9',
    resolution: '832*480',
    cameraMotion: 'handheld_subtle',
    style: 'Summer Cinematic 4K',
    sampleShift: 3.0,
    steps: 40,
  },
  {
    id: 'moe_cyber_drone',
    title: 'Wan 2.2 MoE: Neon Cyberpunk Flythrough',
    prompt:
      'High-speed FPV drone dive through dense rain-soaked futuristic Neo-Tokyo alleys, neon holographic advertisements flickering on glass skyscrapers, flying autonomous vehicles passing by with volumetric light trails, 8k anamorphic lens flare.',
    model: 'wan2.2',
    task: 't2v-A14B',
    aspectRatio: '16:9',
    resolution: '1280*720',
    cameraMotion: 'drone_flythrough',
    style: 'Sci-Fi Cyberpunk',
    sampleShift: 12.0,
    steps: 40,
  },
  {
    id: 'water_lotus',
    title: 'Macro Water Droplet Blooming Lotus',
    prompt:
      'Extreme macro 100mm lens shot of a crystal-clear dew drop resting on a soft pink lotus petal. In slow motion 120fps, a tiny ripple spreads through the water bead reflecting a golden dawn sky with morning mist.',
    model: 'wan2.1',
    task: 't2v-1.3B',
    aspectRatio: '16:9',
    resolution: '832*480',
    cameraMotion: 'zoom_in',
    style: 'Macro Nature Documentary',
    sampleShift: 5.0,
    steps: 30,
  },
  {
    id: 'bird_takeoff',
    title: 'Wan Official: CG Bird Flight (FLF2V)',
    prompt:
      'CG animation style, a vibrant blue hummingbird takes off from mossy ground, flapping wings in rapid bursts. Fine iridescent feathers, warm bright sunlight filtering through forest canopy. Camera tracks upward following the bird into wide open sky.',
    model: 'wan2.1',
    task: 'flf2v-14B',
    aspectRatio: '9:16',
    resolution: '480*832',
    cameraMotion: 'tilt_up',
    style: 'Animation CG',
    sampleShift: 16.0,
    steps: 40,
  },
  {
    id: 'audio_portrait',
    title: 'Wan 2.2 MoE: S2V Speech-to-Video Portrait',
    prompt:
      'Cinematic close-up portrait of an astronaut inside a dimly lit spacecraft cockpit, speaking into the helmet comms with subtle facial lip movements, emergency amber lights reflecting on the gold-tinted visor.',
    model: 'wan2.2',
    task: 's2v-14B',
    aspectRatio: '1:1',
    resolution: '1024*1024',
    cameraMotion: 'handheld_subtle',
    style: 'Sci-Fi Film Still',
    sampleShift: 8.0,
    steps: 40,
  },
];

export const MODEL_SPECS = {
  wan21: {
    version: 'Wan 2.1',
    author: 'Alibaba Wan-Video Team',
    license: 'Apache-2.0',
    architecture: 'Flow-Matching Diffusion Transformer (DiT) with 3D Causal VAE',
    parameterScales: ['1.3B (Consumer GPU & WebGPU)', '14B (High Fidelity)', 'VAE 16x'],
    strengths: [
      'Zero cloud roundtrips with In-Browser WebGPU/WebNN',
      'Native Chinese & English bilingual text generation',
      'Wan-VAE 3D temporal compression (4x temporal, 8x8 spatial)',
      'First-and-Last frame conditioning (FLF2V)',
      'Runs efficiently on RTX 4090/3090 and Apple Silicon',
    ],
    githubRepo: 'https://github.com/Wan-Video/Wan2.1',
  },
  wan22: {
    version: 'Wan 2.2',
    author: 'Alibaba Wan-Video Team',
    license: 'Apache-2.0',
    architecture: 'Mixture-of-Experts (MoE) DiT with Multi-Noise Boundary Routing',
    parameterScales: ['A14B (MoE Active 14B)', '5B (TI2V Turbo)', '14B (Animate & S2V)'],
    strengths: [
      'Dual-stage expert routing (High-Noise Expert + Low-Noise Expert)',
      'Sound-to-Video (S2V) with voice/audio lip-sync conditioning',
      'Animate-14B with pose & mask transfer',
      'Substantially expanded motion aesthetic training data',
      'Faster convergence with boundary-guided step scheduling',
    ],
    githubRepo: 'https://github.com/Wan-Video/Wan2.2',
  },
};
