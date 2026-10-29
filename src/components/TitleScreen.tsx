import React from 'react';
import { Play, ListFilter, Smartphone, DollarSign, Volume2, VolumeX, Sparkles, Trophy } from 'lucide-react';
import { sound } from '../game/sound.ts';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenAndroidModal: () => void;
  onOpenAdMobSettings: () => void;
  highestUnlockedLevel: number;
  totalStars: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenLevelSelect,
  onOpenAndroidModal,
  onOpenAdMobSettings,
  highestUnlockedLevel,
  totalStars,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-between p-6 overflow-hidden select-none bg-slate-950 text-white">
      {/* Background Animated Ambient Grid and drifting glowing arrows */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Subtle top floating decorative arrows */}
      <div className="absolute top-12 left-10 w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center -rotate-12 animate-pulse pointer-events-none">
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-cyan-400 stroke-[2.5] fill-none stroke-current">
          <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="absolute top-20 right-12 w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center rotate-45 animate-pulse pointer-events-none">
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-rose-400 stroke-[2.5] fill-none stroke-current">
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Top utility row */}
      <div className="w-full max-w-md flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-amber-300 font-mono">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>{totalStars}★ · Lvl {highestUnlockedLevel}/100</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Central Hero & Title Lockup (30-40% Negative space composition) */}
      <div className="w-full max-w-md flex flex-col items-center justify-center z-10 my-auto text-center px-4">
        {/* Bespoke SVG Logo Badge */}
        <div className="relative mb-5 group">
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-35 group-hover:opacity-50 transition duration-700 animate-pulse" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-cyan-400/50 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
            <svg viewBox="0 0 80 80" className="w-20 h-20 text-cyan-400">
              <defs>
                <linearGradient id="titleArrowGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <filter id="glow">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.7" />
                </filter>
              </defs>
              <rect x="12" y="12" width="56" height="56" rx="14" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
              {/* Upward dynamic arrow */}
              <path
                d="M40 54V26M28 38L40 26L52 38"
                fill="none"
                stroke="url(#titleArrowGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />
            </svg>
          </div>
        </div>

        {/* Title Lockup */}
        <div className="space-y-1 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold tracking-widest uppercase">
            <span>C++ Engine · 100 Levels</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
            ARROW PUZZLE
          </h1>
          <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            TAP AWAY
          </div>
        </div>

        <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
          Unravel the tangled arrows in correct order. High-octane tactical puzzles with progressive difficulty!
        </p>

        {/* Primary Start CTA Button */}
        <div className="w-full space-y-3">
          <button
            data-start="true"
            onClick={() => {
              sound.playClick();
              onStartGame();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer group"
          >
            <Play className="w-6 h-6 fill-slate-950 group-hover:scale-110 transition-transform" />
            <span>PLAY GAME (LEVEL {highestUnlockedLevel})</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                sound.playClick();
                onOpenLevelSelect();
              }}
              className="py-3 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <ListFilter className="w-4 h-4 text-amber-400" />
              <span>100 Levels</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenAndroidModal();
              }}
              className="py-3 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>APK Build &amp; C++</span>
            </button>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenAdMobSettings();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-amber-300 text-[11px] font-medium flex items-center justify-center gap-1.5 border border-slate-800/80 transition-colors cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>Configure Google AdMob Account</span>
          </button>
        </div>
      </div>

      {/* Flat control-hint line in the bottom safe margin */}
      <div className="w-full text-center text-[11px] text-slate-500 font-mono tracking-wide py-1 z-10">
        Enter / Space Start · Tap Arrows to Fly · U Undo · H Hint · Esc Pause
      </div>
    </div>
  );
};
