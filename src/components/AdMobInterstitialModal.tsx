import React, { useState, useEffect } from 'react';
import { X, PlayCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { sound } from '../game/sound.ts';

interface AdMobInterstitialModalProps {
  isOpen: boolean;
  onClose: () => void;
  interstitialId: string;
  isRewardAd?: boolean;
  onRewardClaimed?: () => void;
}

export const AdMobInterstitialModal: React.FC<AdMobInterstitialModalProps> = ({
  isOpen,
  onClose,
  interstitialId,
  isRewardAd = false,
  onRewardClaimed,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(5);
      setCanSkip(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    sound.playClick();
    if (isRewardAd && onRewardClaimed) {
      onRewardClaimed();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 border border-slate-700 p-6 text-white shadow-2xl flex flex-col items-center">
        {/* Top bar with AdMob indicator & Skip countdown */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Google AdMob {isRewardAd ? 'Rewarded Ad' : 'Interstitial'}</span>
          </div>

          <div>
            {canSkip ? (
              <button
                onClick={handleClose}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-medium transition-all cursor-pointer border border-emerald-500/40"
              >
                <span>Skip Ad</span>
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-slate-400 tabular-nums text-[12px] bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                Reward in {secondsRemaining}s
              </span>
            )}
          </div>
        </div>

        {/* Ad Body Simulation */}
        <div className="my-5 w-full flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-indigo-950/70 to-slate-900/90 border border-indigo-500/20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-3 animate-pulse">
            <PlayCircle className="w-9 h-9 text-white" />
          </div>

          <h3 className="font-bold text-lg text-white mb-1">
            {isRewardAd ? 'Watch to Earn +3 Free Hints!' : 'Arrow Puzzle: Tap Pro'}
          </h3>
          <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
            {isRewardAd
              ? 'Thank you for supporting Arrow Puzzle! You unlocked +3 smart moves and hints.'
              : 'Master all 100 tactical unblocking puzzles. Native C++ 60 FPS performance!'}
          </p>

          <div className="mt-4 px-3 py-1 rounded bg-black/40 text-[10px] text-slate-400 font-mono">
            Unit: {interstitialId.slice(0, 18)}...
          </div>
        </div>

        {/* Action Button */}
        {canSkip ? (
          <button
            onClick={handleClose}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-transform active:scale-95 cursor-pointer text-sm"
          >
            <span>{isRewardAd ? 'Claim +3 Hints & Continue' : 'Continue Game'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-full text-center text-xs text-slate-500 py-2">
            Ad playback in progress...
          </div>
        )}
      </div>
    </div>
  );
};
