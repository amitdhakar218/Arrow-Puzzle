import React from 'react';
import { Play, RotateCcw, ListFilter, Volume2, VolumeX, Smartphone, DollarSign, X } from 'lucide-react';
import { sound } from '../game/sound.ts';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onOpenLevelSelect: () => void;
  onOpenAdMobSettings: () => void;
  onOpenAndroidModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onOpenLevelSelect,
  onOpenAdMobSettings,
  onOpenAndroidModal,
  isMuted,
  onToggleMute,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 text-white shadow-2xl flex flex-col items-center">
        <h2 className="text-xl font-black text-white tracking-wide mb-6">GAME PAUSED</h2>

        <div className="w-full space-y-2.5">
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-transform cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Resume (Esc / P)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Restart Level</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenLevelSelect();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition-colors"
          >
            <ListFilter className="w-4 h-4 text-slate-400" />
            <span>Select Level (1 - 100)</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                onToggleMute();
              }}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? 'Unmute (M)' : 'Mute (M)'}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenAdMobSettings();
              }}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              <span>AdMob IDs</span>
            </button>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenAndroidModal();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 border border-cyan-800/60 cursor-pointer transition-colors mt-1"
          >
            <Smartphone className="w-4 h-4" />
            <span>Android C++ Engine &amp; APK Build</span>
          </button>
        </div>
      </div>
    </div>
  );
};
