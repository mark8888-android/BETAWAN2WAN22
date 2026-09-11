import React, { useState } from 'react';
import {
  Monitor,
  Download,
  Terminal,
  Check,
  Copy,
  ExternalLink,
  Layers,
  Server,
  Cpu,
  ShieldCheck,
  Sparkles,
  X,
  Smartphone,
  Globe,
} from 'lucide-react';

interface FrontendSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FrontendSetupModal: React.FC<FrontendSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'install' | 'remote_gpu' | 'architecture'>('install');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [remoteBackendUrl, setRemoteBackendUrl] = useState('http://localhost:3000');
  const [backendSaved, setBackendSaved] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSaveBackendUrl = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('wan_remote_backend', remoteBackendUrl);
    setBackendSaved(true);
    setTimeout(() => setBackendSaved(false), 2500);
  };

  const codeSnippets = {
    gitClone: `# 1. Clone the WanStudio Frontend & Backend repository
git clone https://github.com/Wan-Video/Wan2.1.git
cd Wan2.1

# 2. Install lightweight frontend dependencies
npm install

# 3. Start local development frontend server
npm run dev

# Frontend accessible at http://localhost:3000`,
    dockerRun: `# Run WanStudio Frontend in standalone Docker container
docker run -d -p 3000:3000 \\
  -e HF_TOKEN="your_huggingface_token_here" \\
  -v ./weights:/app/weights \\
  --name wan-studio-frontend \\
  wanstudio/frontend:latest`,
    remoteWorkerEnv: `# Configure custom remote PyTorch GPU worker endpoint
export WAN_GPU_WORKER_URL="http://192.168.1.100:8000"
export HF_TOKEN="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
npm run dev`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 p-[1.5px]">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Monitor className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Frontend Installation &amp; GPU Worker Integration
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
                  Architecture Setup
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Install as a standalone desktop frontend or connect to remote GPU backends
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

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/40 px-6">
          <button
            onClick={() => setActiveTab('install')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'install'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Install &amp; Run Frontend</span>
          </button>

          <button
            onClick={() => setActiveTab('remote_gpu')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'remote_gpu'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Connect GPU Backend</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'architecture'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Dual-Pipeline Architecture</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {activeTab === 'install' && (
            <div className="space-y-6">
              {/* Standalone Desktop PWA App Box */}
              <div className="bg-gradient-to-r from-sky-950/40 via-zinc-900 to-indigo-950/40 border border-sky-500/30 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Install as Standalone Desktop App (PWA)
                    </h3>
                    <p className="text-xs text-zinc-300 mt-1">
                      Run WanStudio in its own borderless window on Windows, macOS, or Linux with full WebGPU hardware acceleration and zero browser tabs.
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-sky-400">
                      <span>In Chrome/Edge: Click the &quot;Install app&quot; icon in the address bar (or Menu → Save and Share → Install page as app).</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Local Dev Run Commands */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-sky-400" />
                    Local Node.js / Vite CLI Commands
                  </h4>
                  <button
                    onClick={() => copyToClipboard(codeSnippets.gitClone, 1)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-800 hover:bg-zinc-750 px-2.5 py-1 rounded transition-colors"
                  >
                    {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === 1 ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300 overflow-x-auto">
                  {codeSnippets.gitClone}
                </pre>
              </div>

              {/* Docker Option */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    Run via Docker Container
                  </h4>
                  <button
                    onClick={() => copyToClipboard(codeSnippets.dockerRun, 2)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-800 hover:bg-zinc-750 px-2.5 py-1 rounded transition-colors"
                  >
                    {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === 2 ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300 overflow-x-auto">
                  {codeSnippets.dockerRun}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'remote_gpu' && (
            <div className="space-y-6">
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-300 space-y-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-sky-400" />
                  Connect Frontend to a Dedicated Heavy GPU Server
                </h3>
                <p className="text-zinc-400">
                  If you have an external GPU rig (e.g. RTX 4090, A100, RunPod, or Vast.ai) downloading weights or executing PyTorch DiT pipelines, you can point this frontend directly to that host URL.
                </p>
              </div>

              {/* Configuration Form */}
              <form onSubmit={handleSaveBackendUrl} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Remote GPU Backend Host URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={remoteBackendUrl}
                      onChange={(e) => setRemoteBackendUrl(e.target.value)}
                      placeholder="http://localhost:3000 or http://192.168.1.100:8000"
                      className="flex-1 px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      Save &amp; Connect
                    </button>
                  </div>
                  {backendSaved && (
                    <p className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Backend URL saved to client configuration!
                    </p>
                  )}
                </div>
              </form>

              {/* Python Flask/FastAPI worker code snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-sky-400" />
                    Launch PyTorch Heavy GPU Worker
                  </h4>
                  <button
                    onClick={() => copyToClipboard(codeSnippets.remoteWorkerEnv, 3)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-800 hover:bg-zinc-750 px-2.5 py-1 rounded transition-colors"
                  >
                    {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === 3 ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300 overflow-x-auto">
                  {codeSnippets.remoteWorkerEnv}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    🤗
                  </div>
                  <h4 className="font-bold text-white">1. Hugging Face Cloud API</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Uses your Hugging Face User Access Token to dispatch video synthesis jobs to official Wan 2.1 &amp; Wan 2.2 Inference API &amp; Spaces. Zero local GPU load.
                  </p>
                </div>

                <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Server className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white">2. Heavy GPU Worker</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Runs background downloads of `.safetensors` and weights into <code className="text-indigo-300">./weights</code>. Executes PyTorch DiT / MoE pipelines on local RTX GPU or remote rig.
                  </p>
                </div>

                <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white">3. In-Browser WebGPU</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Runs client-side in the browser using WebGPU compute shaders and WebNN API. Completely private, offline-ready, zero token required.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/70 flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Fully open-source Apache-2.0 licensed frontend.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
