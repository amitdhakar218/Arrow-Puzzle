import React from 'react';
import {
  Pause,
  RotateCcw,
  Sparkles,
  ListFilter,
  Volume2,
  VolumeX,
  Smartphone,
  Flame,
  Star,
  DollarSign,
  Gift,
} from 'lucide-react';
import { sound } from '../game/sound.ts';

interface GameHUDProps {
  levelNumber: number;
  chapterName: string;
  movesCount: number;
  remainingArrows: number;
  combo: number;
  starsTarget: [number, number, number]; // [3-star, 2-star, 1-star]
  hintsCount: number;
  undoCount: number;
  isMuted: boolean;
  isMobileFrame: boolean;
  onPause: () => void;
  onUndo: () => void;
  onHint: () => void;
  onOpenLevelSelect: () => void;
  onToggleMute: () => void;
  onToggleMobileFrame: () => void;
  onOpenAndroidModal: () => void;
  onOpenAdMobSettings: () => void;
  onWatchRewardAd: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  levelNumber,
  chapterName,
  movesCount,
  remainingArrows,
  combo,
  starsTarget,
  hintsCount,
  undoCount,
  isMuted,
  isMobileFrame,
  onPause,
  onUndo,
  onHint,
  onOpenLevelSelect,
  onToggleMute,
  onToggleMobileFrame,
  onOpenAndroidModal,
  onOpenAdMobSettings,
  onWatchRewardAd,
}) => {
  // Current star status based on moves
  const is3Star = movesCount <= starsTarget[0];
  const is2Star = movesCount <= starsTarget[1];
  const currentStars = is3Star ? 3 : is2Star ? 2 : 1;

  return (
    <header className="w-full flex flex-col items-center gap-2 px-3 pt-3 pointer-events-none select-none shrink-0 z-30">
      {/* Top perimeter bar */}
      <div className="w-full max-w-lg flex items-center justify-between pointer-events-auto">
        {/* Left: Level badge & Chapter */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onOpenLevelSelect();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 text-white transition-all cursor-pointer shadow-md group"
            title="Browse all 100 levels"
          >
            <ListFilter className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="font-black text-sm tracking-tight font-mono">
              LVL {levelNumber}
            </span>
          </button>

          <div className="hidden sm:flex flex-col text-[11px] text-slate-400 leading-tight">
            <span className="font-semibold text-slate-300">{chapterName}</span>
            <span className="text-[10px] text-slate-400">{remainingArrows} arrows left</span>
          </div>
        </div>

        {/* Center: Moves counter & 3-Star pip indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-md">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 uppercase text-[10px] font-bold">Moves:</span>
            <span className="font-black text-base text-cyan-300 font-mono tabular-nums">
              {movesCount}
            </span>
          </div>

          <div className="flex items-center gap-0.5 ml-1">
            {[1, 2, 3].map(s => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${
                  s <= currentStars
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-600 fill-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right utility buttons: Sound, Pause */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shadow-md"
            title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onPause();
            }}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shadow-md"
            title="Pause Game (Esc / P)"
          >
            <Pause className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Secondary Action strip: Hint, Undo, Watch Ad for Free Hints, Combo, Android APK */}
      <div className="w-full max-w-lg flex items-center justify-between text-xs pointer-events-auto px-1">
        {/* Left: Combo badge if active */}
        <div className="flex items-center gap-1.5">
          {combo > 1 ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 font-black animate-pulse shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-mono text-[11px]">COMBO x{combo}!</span>
            </div>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onOpenAndroidModal();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-700/70 text-cyan-300 text-[11px] font-medium cursor-pointer transition-colors"
            >
              <Smartphone className="w-3 h-3 text-cyan-400" />
              <span>C++ &amp; APK</span>
            </button>
          )}
        </div>

        {/* Right action tools: Undo, Hint, Reward Ad */}
        <div className="flex items-center gap-2">
          {/* Undo */}
          <button
            onClick={() => {
              sound.playClick();
              onUndo();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors cursor-pointer shadow-sm text-xs font-semibold"
            title="Undo move (U)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Undo</span>
            {undoCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono text-cyan-300 border border-slate-700">
                {undoCount}
              </span>
            )}
          </button>

          {/* Hint */}
          <button
            onClick={() => {
              sound.playClick();
              onHint();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold transition-colors cursor-pointer shadow-sm text-xs"
            title="Get Hint (H)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Hint</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-[10px] font-mono text-amber-200 border border-amber-500/30">
              {hintsCount}
            </span>
          </button>

          {/* Watch Ad for +3 Hints */}
          <button
            onClick={() => {
              sound.playClick();
              onWatchRewardAd();
            }}
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold transition-colors cursor-pointer"
            title="Watch Ad for +3 Hints"
          >
            <Gift className="w-3 h-3 text-emerald-400" />
            <span>+3 Hints (Ad)</span>
          </button>

          {/* Frame toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleMobileFrame();
            }}
            className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isMobileFrame ? 'Exit Mobile Frame' : 'Preview in Mobile Phone Frame'}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
