import React, { useState, useEffect } from 'react';
import {
  Github,
  X,
  FileCode,
  Folder,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Code2,
  Cpu,
  Layers,
} from 'lucide-react';
import { GenerationConfig } from '../types';

interface RepoExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GenerationConfig;
}

export const RepoExplorerModal: React.FC<RepoExplorerModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [activeTab, setActiveTab] = useState<'wan21' | 'wan22' | 'cli' | 'install'>('wan21');
  const [repoData, setRepoData] = useState<any>(null);
  const [generatedCode, setGeneratedCode] = useState<{
    cliCommand: string;
    bashScript: string;
    diffusersPython: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Fetch repository data from backend
    fetch('/api/wan/repos')
      .then((res) => res.json())
      .then((data) => {
        if (data.repos) setRepoData(data.repos);
      })
      .catch((err) => console.error('Failed to load repo data:', err));

    // Generate code matching current configuration
    fetch('/api/wan/generate-cli', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.model === 'wan2.1' ? 'Wan2.1' : 'Wan2.2',
        task: config.task,
        prompt: config.prompt,
        size: config.resolution,
        sampleSteps: config.steps,
        sampleShift: config.sampleShift,
        guideScale: config.guidanceScale,
        frameNum: config.frameCount,
        seed: config.seed,
      }),
    })
      .then((res) => res.json())
      .then((data) => setGeneratedCode(data))
      .catch((err) => console.error('Failed to generate CLI code:', err));
  }, [isOpen, config]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-750 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl text-zinc-100 flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Cloned Repositories &amp; Open Source Hub</h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  Apache-2.0
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Direct integration with Alibaba Wan-Video/Wan2.1 and Wan-Video/Wan2.2
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 px-6 gap-2">
          <button
            onClick={() => setActiveTab('wan21')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'wan21'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            Wan-Video / Wan2.1
          </button>

          <button
            onClick={() => setActiveTab('wan22')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'wan22'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            Wan-Video / Wan2.2 (MoE)
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'cli'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            CLI &amp; Diffusers Code
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'install'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Local Install Guide
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Tab 1: Wan 2.1 Repo */}
          {activeTab === 'wan21' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between p-4 bg-zinc-950/70 border border-zinc-800 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                    <span>Wan-Video/Wan2.1</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Cloned to /repos/Wan2.1
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Suite of open video foundation models featuring 3D Causal VAE and Flow-Matching DiT (1.3B &amp; 14B scales).
                  </p>
                </div>
                <a
                  href="https://github.com/Wan-Video/Wan2.1"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  GitHub
                </a>
              </div>

              {/* Tasks & Files */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl space-y-2">
                  <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-400" />
                    Supported Tasks in Wan2.1
                  </h4>
                  <ul className="text-xs space-y-1.5 text-zinc-400">
                    <li>• <strong className="text-zinc-200">t2v-1.3B</strong>: Consumer GPU friendly text-to-video DiT</li>
                    <li>• <strong className="text-zinc-200">t2v-14B</strong>: High-fidelity cinematic 14B parameter foundation model</li>
                    <li>• <strong className="text-zinc-200">i2v-14B</strong>: Image-to-video with spatial cross-attention</li>
                    <li>• <strong className="text-zinc-200">flf2v-14B</strong>: First-and-Last frame conditioning for seamless morphing</li>
                    <li>• <strong className="text-zinc-200">vace-1.3B / vace-14B</strong>: Video animation and character editing</li>
                  </ul>
                </div>

                <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl space-y-2">
                  <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    Cloned Directory Structure
                  </h4>
                  <div className="font-mono text-[11px] text-zinc-400 bg-zinc-950 p-2.5 rounded border border-zinc-850 space-y-1 max-h-40 overflow-y-auto">
                    <div>├── generate.py (Main inference script)</div>
                    <div>├── wan/</div>
                    <div>│   ├── configs/ (wan_t2v_1_3B.py, wan_t2v_14B.py, ...)</div>
                    <div>│   ├── modules/ (model.py, vae.py, clip.py, t5.py)</div>
                    <div>│   ├── text2video.py</div>
                    <div>│   └── image2video.py</div>
                    <div>├── examples/ (i2v_input.JPG, girl.png, snake.png)</div>
                    <div>├── INSTALL.md &amp; requirements.txt</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Wan 2.2 Repo */}
          {activeTab === 'wan22' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between p-4 bg-zinc-950/70 border border-zinc-800 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                    <span>Wan-Video/Wan2.2 (Mixture-of-Experts)</span>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      Cloned to /repos/Wan2.2
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Advanced generative video model incorporating MoE architecture, high/low noise expert routing, and speech-to-video.
                  </p>
                </div>
                <a
                  href="https://github.com/Wan-Video/Wan2.2"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  GitHub
                </a>
              </div>

              {/* MoE Architecture Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl space-y-2">
                  <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-400" />
                    Key Architectural Upgrades
                  </h4>
                  <ul className="text-xs space-y-1.5 text-zinc-400">
                    <li>• <strong className="text-zinc-200">t2v-A14B MoE</strong>: Mixture-of-Experts with 5120 dimension, 40 layers, and 13824 FFN</li>
                    <li>• <strong className="text-zinc-200">Boundary Routing (0.875)</strong>: High-noise expert handles structural motion, low-noise expert perfects micro-textures</li>
                    <li>• <strong className="text-zinc-200">s2v-14B</strong>: Speech-to-Video with zero-shot audio prompt conditioning and lip-sync</li>
                    <li>• <strong className="text-zinc-200">animate-14B</strong>: Video conditioning with pose and mask guidance</li>
                    <li>• <strong className="text-zinc-200">ti2v-5B</strong>: Distilled 5B parameter fast motion generator</li>
                  </ul>
                </div>

                <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl space-y-2">
                  <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-purple-400" />
                    Wan2.2 Cloned Directory Structure
                  </h4>
                  <div className="font-mono text-[11px] text-zinc-400 bg-zinc-950 p-2.5 rounded border border-zinc-850 space-y-1 max-h-40 overflow-y-auto">
                    <div>├── generate.py (MoE multi-expert inference)</div>
                    <div>├── wan/</div>
                    <div>│   ├── configs/ (wan_t2v_A14B.py, wan_s2v_14B.py, ...)</div>
                    <div>│   ├── distributed/ (util.py)</div>
                    <div>│   ├── modules/ (moe_dit.py, causal_vae.py)</div>
                    <div>│   └── animate/ (pose_guider.py)</div>
                    <div>├── requirements_s2v.txt &amp; requirements_animate.txt</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Generated CLI & Code */}
          {activeTab === 'cli' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-sky-400" />
                    Exact CLI Terminal Command for Your Current Settings
                  </span>
                  <button
                    onClick={() =>
                      generatedCode?.cliCommand &&
                      copyToClipboard(generatedCode.cliCommand, 'cli')
                    }
                    className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300"
                  >
                    {copiedKey === 'cli' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'cli' ? 'Copied!' : 'Copy Command'}</span>
                  </button>
                </div>

                <pre className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre">
                  {generatedCode?.cliCommand || 'python generate.py --task t2v-1.3B ...'}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    Hugging Face Diffusers Python Pipeline
                  </span>
                  <button
                    onClick={() =>
                      generatedCode?.diffusersPython &&
                      copyToClipboard(generatedCode.diffusersPython, 'diffusers')
                    }
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    {copiedKey === 'diffusers' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'diffusers' ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <pre className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre max-h-48">
                  {generatedCode?.diffusersPython || 'from diffusers import WanPipeline...'}
                </pre>
              </div>
            </div>
          )}

          {/* Tab 4: Installation Guide */}
          {activeTab === 'install' && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs text-zinc-300">
              <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  Local Installation from Cloned Repository
                </h3>
                <p className="text-zinc-400">
                  You can run Wan 2.1 and Wan 2.2 either directly in your browser using our In-Browser Neural Engine (WebGPU/WebNN) or run the full 14B PyTorch pipeline locally on consumer NVIDIA GPUs.
                </p>

                <div className="space-y-2 pt-2">
                  <div className="font-semibold text-zinc-200">1. Setup Python Environment:</div>
                  <pre className="p-2.5 bg-zinc-950 border border-zinc-850 rounded font-mono text-[11px] text-zinc-300">
{`# Clone is already done in repos/Wan2.1 and repos/Wan2.2!
cd repos/Wan2.1
conda create -n wan python=3.10 -y
conda activate wan`}
                  </pre>
                </div>

                <div className="space-y-2">
                  <div className="font-semibold text-zinc-200">2. Install Dependencies with Flash Attention:</div>
                  <pre className="p-2.5 bg-zinc-950 border border-zinc-850 rounded font-mono text-[11px] text-zinc-300">
{`pip install -r requirements.txt
pip install flash-attn --no-build-isolation`}
                  </pre>
                </div>

                <div className="space-y-2">
                  <div className="font-semibold text-zinc-200">3. Execute Video Generation:</div>
                  <pre className="p-2.5 bg-zinc-950 border border-zinc-850 rounded font-mono text-[11px] text-zinc-300">
{`python generate.py --task t2v-1.3B --size "1280*720" --ckpt_dir ./Wan2.1-T2V-1.3B --prompt "Two boxing cats" --sample_steps 40`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-900/95">
          <div className="text-xs text-zinc-400">
            Open Source under Apache License 2.0 • Free for commercial &amp; research use
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-750 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
