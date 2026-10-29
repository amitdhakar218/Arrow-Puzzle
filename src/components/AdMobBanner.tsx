import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

interface AdMobBannerProps {
  bannerId?: string;
  onOpenSettings: () => void;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({
  bannerId = 'ca-app-pub-4896944310343088/1574563740',
  onOpenSettings,
}) => {
  return (
    <div className="w-full max-w-md mx-auto my-1 px-2 pointer-events-auto">
      <div className="relative overflow-hidden rounded-lg border border-slate-700/60 bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 shadow-md p-1.5 flex items-center justify-between text-xs backdrop-blur-none">
        {/* AdMob label badge */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center justify-center px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px] tracking-tight font-bold border border-blue-500/30">
            AdMob
          </div>
          <div className="truncate text-slate-300">
            <span className="font-semibold text-white">Google Mobile Ads</span>
            <span className="hidden sm:inline text-slate-400 text-[11px] ml-1.5">
              Banner Active · ID: {bannerId.slice(-10)}
            </span>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px] shrink-0 font-medium"
          title="Configure AdMob IDs"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Config</span>
        </button>
      </div>
    </div>
  );
};
