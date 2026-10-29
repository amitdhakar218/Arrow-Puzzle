import React, { useState } from 'react';
import { X, Check, Copy, DollarSign, HelpCircle, Save } from 'lucide-react';
import { sound } from '../game/sound.ts';

interface AdMobSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appId: string;
  bannerId: string;
  interstitialId: string;
  rewardedId: string;
  onSave: (config: {
    appId: string;
    bannerId: string;
    interstitialId: string;
    rewardedId: string;
  }) => void;
}

export const AdMobSettingsModal: React.FC<AdMobSettingsModalProps> = ({
  isOpen,
  onClose,
  appId: initialAppId,
  bannerId: initialBannerId,
  interstitialId: initialInterstitialId,
  rewardedId: initialRewardedId,
  onSave,
}) => {
  const [appId, setAppId] = useState(initialAppId);
  const [bannerId, setBannerId] = useState(initialBannerId);
  const [interstitialId, setInterstitialId] = useState(initialInterstitialId);
  const [rewardedId, setRewardedId] = useState(initialRewardedId);
  const [copied, setCopied] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    onSave({ appId, bannerId, interstitialId, rewardedId });
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Google AdMob Setup</h2>
              <p className="text-xs text-slate-400">Add your AdMob account to monetize this game</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              AdMob App ID (ca-app-pub-...)
            </label>
            <input
              type="text"
              value={appId}
              onChange={e => setAppId(e.target.value)}
              placeholder="ca-app-pub-3940256099942544~3347511713"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm font-mono text-emerald-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Banner Ad Unit ID
            </label>
            <input
              type="text"
              value={bannerId}
              onChange={e => setBannerId(e.target.value)}
              placeholder="ca-app-pub-3940256099942544/6300978111"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Interstitial Ad Unit ID (Shows every 3 levels)
            </label>
            <input
              type="text"
              value={interstitialId}
              onChange={e => setInterstitialId(e.target.value)}
              placeholder="ca-app-pub-3940256099942544/1033173712"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm font-mono text-purple-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Rewarded Ad Unit ID (Watch ad for +3 free hints)
            </label>
            <input
              type="text"
              value={rewardedId}
              onChange={e => setRewardedId(e.target.value)}
              placeholder="ca-app-pub-3940256099942544/5224354917"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm font-mono text-amber-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Hindi/English Helper Callout */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-cyan-400">
              <HelpCircle className="w-4 h-4" />
              <span>Dost ye IDs kahan dalni hai? (Where to apply)</span>
            </div>
            <p className="leading-relaxed">
              1. <strong>Web Game:</strong> Yahan &quot;Save Configuration&quot; dabayein to is browser me aapki IDs active ho jayengi.
            </p>
            <p className="leading-relaxed">
              2. <strong>Android C++ APK:</strong> Ye same IDs project ki file{' '}
              <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">
                android/app/src/main/res/values/strings.xml
              </code>{' '}
              or <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">android/admob_config.json</code> me bhi add hai.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 cursor-pointer transition-transform active:scale-95 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>{savedToast ? 'Saved!' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
