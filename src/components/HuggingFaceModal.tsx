import React, { useState, useEffect } from 'react';
import {
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  User,
  Building,
  Crown,
  Eye,
  EyeOff,
  Server,
  RefreshCw,
  X,
} from 'lucide-react';
import { HFAuthStatus } from '../types';

interface HuggingFaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  hfStatus: HFAuthStatus;
  onTokenSaved: (token: string, status: HFAuthStatus) => void;
  onDisconnect: () => void;
}

export const HuggingFaceModal: React.FC<HuggingFaceModalProps> = ({
  isOpen,
  onClose,
  hfStatus,
  onTokenSaved,
  onDisconnect,
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load saved token from localStorage on open
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('wan_hf_token') || '';
      setTokenInput(saved);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyAndSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const token = tokenInput.trim();
    if (!token) {
      setErrorMessage('Please enter your Hugging Face User Access Token');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/hf/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to authenticate with Hugging Face');
      }

      const updatedStatus: HFAuthStatus = {
        connected: true,
        username: data.user.username,
        name: data.user.fullname,
        avatarUrl: data.user.avatarUrl,
        email: data.user.email,
        isPro: data.user.isPro,
        tokenPreview: data.user.tokenPreview,
      };

      // Store securely in client session
      localStorage.setItem('wan_hf_token', token);
      onTokenSaved(token, updatedStatus);
      setSuccessMessage(`Successfully connected to Hugging Face as @${data.user.username}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please check your token.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClearToken = () => {
    localStorage.removeItem('wan_hf_token');
    setTokenInput('');
    setSuccessMessage(null);
    setErrorMessage(null);
    onDisconnect();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">
              🤗
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Hugging Face API &amp; Token Configuration
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
                  Real Video Cloud API
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Connect your Hugging Face account to generate real Wan 2.1 &amp; Wan 2.2 videos
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Active Connection Status Banner */}
          {hfStatus.connected ? (
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {hfStatus.avatarUrl ? (
                  <img
                    src={hfStatus.avatarUrl}
                    alt={hfStatus.username}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full border border-emerald-500/40 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                    {hfStatus.username?.[0]?.toUpperCase() || 'HF'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">@{hfStatus.username}</span>
                    {hfStatus.isPro && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        <Crown className="w-3 h-3 text-amber-400" />
                        PRO
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Token: <span className="font-mono text-zinc-300">{hfStatus.tokenPreview || 'hf_••••••••'}</span>
                  </p>
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Ready to generate cloud videos via Hugging Face Serverless Inference &amp; Spaces.
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearToken}
                className="text-xs text-zinc-400 hover:text-red-400 px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-red-500/30 hover:bg-red-500/10 transition-all font-medium"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <Key className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-amber-200">
                  Enter Your Hugging Face User Access Token
                </h4>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  Your token authorizes this frontend to trigger real video synthesis jobs on Hugging Face Inference API and Spaces for Alibaba Wan 2.1 &amp; Wan 2.2 models.
                </p>
              </div>
            </div>
          )}

          {/* Token Input Form */}
          <form onSubmit={handleVerifyAndSave} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-sky-400" />
                  Hugging Face User Access Token
                </label>
                <a
                  href="https://huggingface.co/settings/tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 hover:underline"
                >
                  <span>Get Token from Hugging Face</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="relative">
                <input
                  id="hf-token-input"
                  type={showToken ? 'text' : 'password'}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all pr-24"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors text-xs flex items-center gap-1"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="text-[10px]">{showToken ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1.5">
                <span>Requires a token with <strong className="text-zinc-300 font-mono">read</strong> or <strong className="text-zinc-300 font-mono">inference</strong> permissions.</span>
              </div>
            </div>

            {/* Error or Success notification */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                id="btn-verify-hf-token"
                type="submit"
                disabled={isVerifying || !tokenInput.trim()}
                className="flex-1 py-2.5 px-4 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl font-medium text-xs transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying Token with Hugging Face...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{hfStatus.connected ? 'Update & Test Token' : 'Save & Verify Token'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Supported Hugging Face Wan Model Repositories */}
          <div className="border-t border-zinc-800 pt-4">
            <h4 className="text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-400" />
              Supported Hugging Face Model Endpoints
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl">
                <div className="font-semibold text-zinc-200">Wan-Video/Wan2.1-T2V-1.3B</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Flow-Matching DiT • 1.3B Parameters</div>
                <span className="inline-block mt-2 text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 font-mono">
                  Inference API Ready
                </span>
              </div>

              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl">
                <div className="font-semibold text-zinc-200">Wan-Video/Wan2.1-T2V-14B</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Master DiT • 14B Cinema Scale</div>
                <span className="inline-block mt-2 text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-mono">
                  High-Precision Mode
                </span>
              </div>

              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl">
                <div className="font-semibold text-zinc-200">Wan-Video/Wan2.1-I2V-14B-720P</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Image-to-Video HD conditioning</div>
                <span className="inline-block mt-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                  First Frame Keyframing
                </span>
              </div>

              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl">
                <div className="font-semibold text-zinc-200">Wan-Video/Wan2.2-T2V-A14B</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Mixture-of-Experts (MoE) Dual Experts</div>
                <span className="inline-block mt-2 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                  MoE Next-Gen Video
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Tokens are stored locally in your browser and used only to authorize HF requests.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
