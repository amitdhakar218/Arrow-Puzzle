import React, { useState } from 'react';
import { X, Star, Lock, Trophy, ChevronRight, Sparkles } from 'lucide-react';
import { LevelConfig } from '../game/rules.ts';
import { sound } from '../game/sound.ts';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  levels: LevelConfig[];
  currentLevelNumber: number;
  highestUnlockedLevel: number;
  levelStars: Record<number, number>; // levelNum -> stars (1..3)
  onSelectLevel: (levelNum: number) => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  levels,
  currentLevelNumber,
  highestUnlockedLevel,
  levelStars,
  onSelectLevel,
}) => {
  const [selectedChapter, setSelectedChapter] = useState(
    Math.min(5, Math.ceil(currentLevelNumber / 20))
  );

  if (!isOpen) return null;

  const chapters = [
    { id: 1, name: 'Rookie Outpost', range: '1 - 20', color: 'from-sky-500 to-blue-600' },
    { id: 2, name: 'Tangled Crossroads', range: '21 - 40', color: 'from-emerald-500 to-teal-600' },
    { id: 3, name: 'Rotator & Switch Core', range: '41 - 60', color: 'from-amber-500 to-orange-600' },
    { id: 4, name: 'Chamber of Knots', range: '61 - 80', color: 'from-purple-500 to-violet-600' },
    { id: 5, name: 'Grandmaster Labyrinth', range: '81 - 100', color: 'from-rose-500 to-red-600' },
  ];

  const chapterLevels = levels.filter(l => l.chapter === selectedChapter);

  // Total stars calculated
  const totalStars = Object.values(levelStars).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-5 sm:p-6 text-white shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Select Level (1 - 100)</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-amber-400 font-semibold tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {totalStars} / 300 Stars
                </span>
                <span>•</span>
                <span>Unlocked: {highestUnlockedLevel}/100</span>
              </div>
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

        {/* Chapter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 shrink-0 scrollbar-none">
          {chapters.map(ch => {
            const isSelected = selectedChapter === ch.id;
            const isChapterUnlocked = highestUnlockedLevel >= (ch.id - 1) * 20 + 1;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedChapter(ch.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-800 text-white border border-slate-600 shadow-md shadow-black/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {!isChapterUnlocked && <Lock className="w-3 h-3 text-slate-500" />}
                <span>Ch.{ch.id}</span>
                <span className="text-[10px] text-slate-500 font-mono">({ch.range})</span>
              </button>
            );
          })}
        </div>

        {/* Chapter Title Badge */}
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/60 border border-slate-700/50 mb-3 text-xs shrink-0">
          <span className="font-semibold text-slate-200">
            Chapter {selectedChapter}: {chapters[selectedChapter - 1].name}
          </span>
          <span className="text-slate-400 text-[11px]">
            Difficulty: {selectedChapter === 1 ? 'Approachable' : selectedChapter === 5 ? 'Extreme Master' : 'Challenging'}
          </span>
        </div>

        {/* Levels Grid (20 levels in selected chapter) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-4 sm:grid-cols-5 gap-2.5 p-1 pr-1.5">
          {chapterLevels.map(lvl => {
            const isUnlocked = lvl.levelNumber <= highestUnlockedLevel;
            const isCurrent = lvl.levelNumber === currentLevelNumber;
            const stars = levelStars[lvl.levelNumber] || 0;

            return (
              <button
                key={lvl.levelNumber}
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked) {
                    sound.playClick();
                    onSelectLevel(lvl.levelNumber);
                    onClose();
                  }
                }}
                className={`relative p-3 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/25 scale-[1.03]'
                    : isUnlocked
                    ? 'bg-slate-800 hover:bg-slate-750 text-slate-150 border border-slate-700 hover:border-slate-600 hover:scale-[1.02]'
                    : 'bg-slate-900/60 text-slate-600 border border-slate-800/80 cursor-not-allowed opacity-60'
                }`}
              >
                {/* Level number */}
                <div className="text-base sm:text-lg font-black font-mono tracking-tight tabular-nums">
                  {lvl.levelNumber}
                </div>

                {/* Stars display */}
                {isUnlocked ? (
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3].map(s => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600 fill-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <Lock className="w-3.5 h-3.5 mt-1 text-slate-600" />
                )}

                {/* Arrows count clue */}
                <span className="text-[10px] text-slate-400/80 font-mono mt-0.5">
                  {lvl.arrows.length} arrows
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0 text-xs text-slate-400">
          <span>Levels unlock progressively as you clear each one.</span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
