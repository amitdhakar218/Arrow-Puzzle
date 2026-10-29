import React, { useState } from 'react';
import { ArrowTile, Direction, LevelConfig, DIRECTION_VECTORS } from '../game/rules.ts';
import { Lock, RotateCw, Sparkles } from 'lucide-react';

interface GameBoardProps {
  level: LevelConfig;
  arrows: ArrowTile[];
  hintArrowId: number | null;
  onTapArrow: (arrowId: number) => void;
  wigglingArrowId: number | null;
  exitingArrowId: number | null;
  collisionBlockerId: number | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  level,
  arrows,
  hintArrowId,
  onTapArrow,
  wigglingArrowId,
  exitingArrowId,
  collisionBlockerId,
}) => {
  const { gridRows, gridCols } = level;

  // Render Direction Arrow SVG
  const renderArrowGlyph = (dir: Direction, color: string, isSecondary = false) => {
    let rotation = 'rotate-0';
    if (dir === 'RIGHT') rotation = 'rotate-90';
    if (dir === 'DOWN') rotation = 'rotate-180';
    if (dir === 'LEFT') rotation = '-rotate-90';

    return (
      <svg
        viewBox="0 0 24 24"
        className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-200 ${rotation} ${
          isSecondary ? 'opacity-80 scale-75' : ''
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    );
  };

  // Determine grid cell size based on rows/cols for optimal mobile layout
  const maxDim = Math.max(gridRows, gridCols);
  let cellClass = 'w-14 h-14 text-sm sm:w-16 sm:h-16';
  if (maxDim <= 4) cellClass = 'w-16 h-16 sm:w-20 sm:h-20';
  else if (maxDim === 5) cellClass = 'w-14 h-14 sm:w-16 sm:h-16';
  else if (maxDim === 6) cellClass = 'w-12 h-12 sm:w-14 sm:h-14';
  else if (maxDim >= 7) cellClass = 'w-10 h-10 sm:w-12 sm:h-12';

  // Build grid matrix
  const matrix: (ArrowTile | null)[][] = Array.from({ length: gridRows }, () =>
    Array.from({ length: gridCols }, () => null)
  );

  arrows.forEach(a => {
    if (!a.isCleared && a.row < gridRows && a.col < gridCols) {
      matrix[a.row][a.col] = a;
    }
  });

  return (
    <div className="relative flex items-center justify-center p-2 sm:p-4 w-full max-w-lg select-none">
      {/* Background board tray */}
      <div
        className="relative p-3 sm:p-4 rounded-3xl bg-slate-900/95 border-2 border-slate-800 shadow-2xl shadow-black/80 flex flex-col items-center justify-center gap-1.5 sm:gap-2.5"
        style={{
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.08)',
        }}
      >
        {/* Subtle grid lines background */}
        <div className="grid gap-1.5 sm:gap-2" style={{ gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))` }}>
          {matrix.map((rowArr, rIdx) => (
            <div
              key={rIdx}
              className="flex items-center gap-1.5 sm:gap-2"
              style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
            >
              {rowArr.map((tile, cIdx) => {
                if (!tile) {
                  // Empty slot placeholder
                  return (
                    <div
                      key={`empty-${rIdx}-${cIdx}`}
                      className={`${cellClass} rounded-2xl bg-slate-950/60 border border-slate-800/40 flex items-center justify-center`}
                    />
                  );
                }

                const isHint = hintArrowId === tile.id;
                const isWiggling = wigglingArrowId === tile.id;
                const isExiting = exitingArrowId === tile.id;
                const isBlockerHit = collisionBlockerId === tile.id;

                // Fly away exit translation styles
                let exitStyle: React.CSSProperties = {};
                if (isExiting) {
                  const { dr, dc } = DIRECTION_VECTORS[tile.direction];
                  exitStyle = {
                    transform: `translate(${dc * 350}px, ${dr * 350}px) scale(0.6)`,
                    opacity: 0,
                    transition: 'all 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
                  };
                }

                // Wiggle animation class
                let animClass = '';
                if (isWiggling) {
                  animClass = 'animate-bounce text-rose-400 ring-2 ring-rose-500 scale-95';
                } else if (isBlockerHit) {
                  animClass = 'ring-2 ring-amber-400 bg-amber-500/20';
                } else if (isHint) {
                  animClass = 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 animate-pulse';
                }

                return (
                  <button
                    key={tile.id}
                    aria-label={`Arrow at row ${tile.row + 1}, column ${tile.col + 1}, pointing ${tile.direction}${tile.isLocked ? ' (Locked)' : ''}`}
                    onClick={() => onTapArrow(tile.id)}
                    style={{
                      backgroundColor: tile.color,
                      ...exitStyle,
                    }}
                    className={`relative ${cellClass} rounded-2xl font-bold flex flex-col items-center justify-center text-slate-950 shadow-lg shadow-black/40 transition-transform active:scale-90 cursor-pointer overflow-hidden ${animClass}`}
                  >
                    {/* Inner highlight bevel */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-black/20 pointer-events-none" />

                    {/* Locked badge */}
                    {tile.isLocked ? (
                      <div className="flex flex-col items-center justify-center text-slate-900 z-10">
                        <Lock className="w-5 h-5 text-slate-950" />
                        <span className="text-[9px] font-mono font-black">
                          {tile.requiredKeys ?? 1}
                        </span>
                      </div>
                    ) : (
                      <div className="relative flex items-center justify-center z-10">
                        {renderArrowGlyph(tile.direction, tile.color)}
                        {tile.type === 'DOUBLE' && tile.secondaryDirection && (
                          <div className="absolute -bottom-1 -right-1 text-slate-950">
                            {renderArrowGlyph(tile.secondaryDirection, tile.color, true)}
                          </div>
                        )}
                        {tile.type === 'ROTATOR' && (
                          <div className="absolute top-1 right-1">
                            <RotateCw className="w-3 h-3 text-slate-900" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Hint Sparkle indicator */}
                    {isHint && (
                      <div className="absolute -top-1 -right-1 p-0.5 rounded-full bg-amber-400 text-slate-950 shadow-md">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
