import React, { useState } from 'react';
import { Sparkles, Wand2, ChevronDown, ChevronUp, RotateCw, Lightbulb, Copy, Check } from 'lucide-react';
import { PromptPreset, WAN_SAMPLE_PROMPTS } from '../data/wanPresets';
import { WanVersion, WanTask } from '../types';

interface PromptControlsProps {
  prompt: string;
  onPromptChange: (val: string) => void;
  negativePrompt: string;
  onNegativePromptChange: (val: string) => void;
  currentModel: WanVersion;
  currentTask: WanTask;
  onSelectPreset: (preset: PromptPreset) => void;
  isGenerating: boolean;
}

export const PromptControls: React.FC<PromptControlsProps> = ({
  prompt,
  onPromptChange,
  negativePrompt,
  onNegativePromptChange,
  currentModel,
  currentTask,
  onSelectPreset,
  isGenerating,
}) => {
  const [showNegative, setShowNegative] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);

  // AI Prompt Director Enhancement using Gemini
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setEnhancing(true);
    try {
      const res = await fetch('/api/gemini/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          modelType: currentModel === 'wan2.1' ? 'Wan 2.1 DiT' : 'Wan 2.2 MoE',
          task: currentTask,
          style: 'Cinematic High-Motion 4K',
        }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        onPromptChange(data.enhancedPrompt);
      }
    } catch (err) {
      console.error('Enhance prompt failed:', err);
      // Fallback
      onPromptChange(
        `${prompt.trim()}, cinematic 8k, photorealistic natural lighting, dynamic camera motion, atmospheric depth, high temporal consistency, 24fps motion blur`
      );
    } finally {
      setEnhancing(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-3">
      {/* Label and Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="video-prompt-input" className="text-xs font-semibold text-zinc-200">
            Prompt / Director Direction
          </label>
          <span className="text-[10px] text-zinc-400">
            ({prompt.length} chars)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-ai-enhance-prompt"
            onClick={handleEnhancePrompt}
            disabled={enhancing || isGenerating || !prompt.trim()}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-500/30 text-sky-300 hover:text-white hover:border-sky-400 hover:bg-sky-500/20 transition-all disabled:opacity-40 shadow-sm"
            title="Use Gemini AI Director to expand cinematic camera movement and lighting"
          >
            <Sparkles className={`w-3.5 h-3.5 ${enhancing ? 'animate-spin text-sky-400' : 'text-sky-400'}`} />
            <span>{enhancing ? 'Directing...' : 'AI Enhance Prompt'}</span>
          </button>

          {prompt && (
            <button
              onClick={handleCopyPrompt}
              className="p-1 text-zinc-400 hover:text-zinc-200 rounded transition-colors"
              title="Copy prompt"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          id="video-prompt-input"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          disabled={isGenerating}
          rows={3}
          placeholder="Describe the scene, subject motion, camera trajectory (e.g. 'Two anthropomorphic cats in boxing gear fighting on spotlighted stage, slow-motion camera orbit, dramatic stadium rim lighting')..."
          className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-400 resize-none transition-all outline-none font-normal leading-relaxed"
        />
      </div>

      {/* Presets Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <Lightbulb className="w-3 h-3 text-amber-400" />
          <span>Official Wan Repo Showcase Prompts:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {WAN_SAMPLE_PROMPTS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              disabled={isGenerating}
              className={`text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg border transition-all text-left ${
                prompt === preset.prompt
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-medium'
                  : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <span className="font-semibold text-zinc-300 mr-1">
                [{preset.model === 'wan2.1' ? '2.1' : '2.2'}]
              </span>
              {preset.title.split(':')[1] || preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Collapsible Negative Prompt */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowNegative(!showNegative)}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
        >
          {showNegative ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{showNegative ? 'Hide Negative Prompt' : 'Add Negative Prompt'}</span>
        </button>

        {showNegative && (
          <div className="mt-2 space-y-1 animate-in fade-in duration-150">
            <textarea
              id="negative-prompt-input"
              value={negativePrompt}
              onChange={(e) => onNegativePromptChange(e.target.value)}
              disabled={isGenerating}
              rows={2}
              placeholder="e.g. blur, deformed limbs, static motion, low quality, artifacts, watermark, jittery frames"
              className="w-full bg-zinc-950/60 border border-zinc-800/80 focus:border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-300 placeholder:text-zinc-400 resize-none outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};
