import React, { useEffect } from 'react';
import { Trophy, Star, ArrowRight, RotateCcw, ListFilter, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../game/sound.ts';

interface VictoryModalProps {
  isOpen: boolean;
  levelNumber: number;
  chapterName: string;
  movesUsed: number;
  starsEarned: number;
  target3Stars: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onOpenLevelSelect: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  levelNumber,
  chapterName,
  movesUsed,
  starsEarned,
  target3Stars,
  onNextLevel,
  onReplay,
  onOpenLevelSelect,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playVictory();
      // Fire confetti bursts!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'],
        });
      } catch {
        // fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700 p-6 text-white shadow-2xl flex flex-col items-center text-center">
        {/* Glow backdrop ring */}
        <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-3 animate-bounce">
          <Trophy className="w-10 h-10 text-amber-400" />
        </div>

        <h2 className="text-2xl font-black text-white tracking-wide">
          LEVEL {levelNumber} CLEARED!
        </h2>
        <p className="text-xs text-cyan-400 font-medium mb-4">{chapterName}</p>

        {/* 3 Stars display */}
        <div className="flex items-center justify-center gap-3 mb-5">
          {[1, 2, 3].map(s => {
            const isEarned = s <= starsEarned;
            return (
              <div
                key={s}
                className={`relative transform transition-all duration-500 ${
                  isEarned ? 'scale-110' : 'opacity-40 scale-95'
                }`}
              >
                <Star
                  className={`w-10 h-10 ${
                    isEarned
                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                      : 'text-slate-600 fill-slate-800'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Stat metrics */}
        <div className="w-full grid grid-cols-2 gap-2 mb-5">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="text-[11px] text-slate-400 font-medium">Moves Used</div>
            <div className="text-2xl font-black font-mono text-cyan-300 tabular-nums">
              {movesUsed}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="text-[11px] text-slate-400 font-medium">3-Star Target</div>
            <div className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
              &le; {target3Stars}
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="w-full space-y-2.5">
          {levelNumber < 100 ? (
            <button
              data-start="true"
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 active:scale-95 transition-transform cursor-pointer"
            >
              <span>NEXT LEVEL {levelNumber + 1}</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-sm">
              🏆 ALL 100 LEVELS COMPLETED! MASTER OF ARROWS!
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 w-full pt-1">
            <button
              onClick={() => {
                sound.playClick();
                onReplay();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Replay</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenLevelSelect();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <ListFilter className="w-4 h-4 text-slate-400" />
              <span>All 100 Levels</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
