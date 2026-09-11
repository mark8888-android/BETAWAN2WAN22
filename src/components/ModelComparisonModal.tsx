import React from 'react';
import { X, Sliders, Check, Zap, Layers, Cpu, ShieldCheck } from 'lucide-react';

interface ModelComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel: (model: 'wan2.1' | 'wan2.2') => void;
}

export const ModelComparisonModal: React.FC<ModelComparisonModalProps> = ({
  isOpen,
  onClose,
  onSelectModel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-750 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl text-zinc-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Alibaba Wan 2.1 vs Wan 2.2 Comparison</h2>
              <p className="text-xs text-zinc-400">
                Dense DiT Foundation Suite vs. Mixture-of-Experts (MoE) Architecture
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

        {/* Comparison Table */}
        <div className="p-6 space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="py-3 px-4 text-zinc-400 font-semibold w-1/4">Specification</th>
                  <th className="py-3 px-4 font-bold text-sky-400 bg-sky-500/5 rounded-t-xl w-3/8">
                    Wan 2.1 (Open Video Foundation)
                  </th>
                  <th className="py-3 px-4 font-bold text-indigo-400 bg-indigo-500/5 rounded-t-xl w-3/8">
                    Wan 2.2 (Mixture-of-Experts)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-300">Core Architecture</td>
                  <td className="py-3 px-4 text-zinc-300 bg-sky-500/5">
                    Dense Flow-Matching Diffusion Transformer (DiT) with 3D Causal VAE
                  </td>
                  <td className="py-3 px-4 text-zinc-300 bg-indigo-500/5">
                    Mixture-of-Experts (MoE) DiT with High &amp; Low Noise Boundary Scheduling
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-300">Active Parameters</td>
                  <td className="py-3 px-4 text-zinc-300 bg-sky-500/5">
                    1.3B (Ultra-fast) &amp; 14B (Cinema Grade)
                  </td>
                  <td className="py-3 px-4 text-zinc-300 bg-indigo-500/5">
                    A14B MoE (40 Layers, 40 Heads, 5120 Dim, 13824 FFN), 5B TI2V
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-300">In-Browser Neural Engine</td>
                  <td className="py-3 px-4 text-emerald-400 font-medium bg-sky-500/5">
                    WebGPU W4A16 Quantized • Instant 0-Latency on Consumer Laptops
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-medium bg-indigo-500/5">
                    WebGPU &amp; WebNN Multi-Expert Pipeline • Accelerated on NPU &amp; Modern GPUs
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-300">Primary Tasks</td>
                  <td className="py-3 px-4 text-zinc-300 bg-sky-500/5">
                    T2V (1.3B / 14B), I2V (480P / 720P), FLF2V (First &amp; Last Frame), VACE Editing
                  </td>
                  <td className="py-3 px-4 text-zinc-300 bg-indigo-500/5">
                    T2V-A14B MoE, I2V-A14B MoE, S2V (Speech-to-Video), Animate-14B (Pose Transfer)
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-300">Motion &amp; Camera Aesthetics</td>
                  <td className="py-3 px-4 text-zinc-300 bg-sky-500/5">
                    High physical realism, natural flow matching trajectories
                  </td>
                  <td className="py-3 px-4 text-zinc-300 bg-indigo-500/5">
                    Trained on extensive cinematic aesthetic dataset with dynamic camera physics
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-300">Speech &amp; Audio</td>
                  <td className="py-3 px-4 text-zinc-300 bg-sky-500/5">
                    Video-to-Audio (V2A) generation
                  </td>
                  <td className="py-3 px-4 text-zinc-300 bg-indigo-500/5">
                    Zero-shot Speech-to-Video (S2V) with lip-synchronization
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-300">Sampling Speed</td>
                  <td className="py-3 px-4 text-zinc-300 bg-sky-500/5">
                    40-50 steps (8-step turbo preview)
                  </td>
                  <td className="py-3 px-4 text-zinc-300 bg-indigo-500/5">
                    40 steps with boundary=0.875 expert handoff
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-300">License</td>
                  <td className="py-3 px-4 text-emerald-400 font-mono bg-sky-500/5">
                    Apache-2.0 (Open Source)
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-mono bg-indigo-500/5">
                    Apache-2.0 (Open Source)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Quick Selection Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-xl space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sky-300 text-sm">Select Wan 2.1 DiT</h4>
                <p className="text-xs text-zinc-300 mt-1">
                  Ideal for consumer hardware, First-and-Last frame morphing, and fast in-browser WebGPU generation with the 1.3B model.
                </p>
              </div>
              <button
                onClick={() => {
                  onSelectModel('wan2.1');
                  onClose();
                }}
                className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Switch to Wan 2.1
              </button>
            </div>

            <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-indigo-300 text-sm">Select Wan 2.2 MoE</h4>
                <p className="text-xs text-zinc-300 mt-1">
                  Ideal for next-gen cinematic video, Mixture-of-Experts routing, Speech-to-Video lip-sync, and pose-guided animations.
                </p>
              </div>
              <button
                onClick={() => {
                  onSelectModel('wan2.2');
                  onClose();
                }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Switch to Wan 2.2
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
