/**
 * Arrow Puzzle: Tap - Main Application Component
 * 100 Levels Mobile Puzzle Game with C++ Android NDK Engine & AdMob Integration
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  generate100Levels,
  tapTile,
  findFreeArrow,
  LevelConfig,
  ArrowTile,
} from './game/rules.ts';
import { sound } from './game/sound.ts';
import { TitleScreen } from './components/TitleScreen.tsx';
import { GameHUD } from './components/GameHUD.tsx';
import { GameBoard } from './components/GameBoard.tsx';
import { VictoryModal } from './components/VictoryModal.tsx';
import { PauseModal } from './components/PauseModal.tsx';
import { LevelSelectModal } from './components/LevelSelectModal.tsx';
import { AdMobBanner } from './components/AdMobBanner.tsx';
import { AdMobInterstitialModal } from './components/AdMobInterstitialModal.tsx';
import { AdMobSettingsModal } from './components/AdMobSettingsModal.tsx';
import { AndroidBuildModal } from './components/AndroidBuildModal.tsx';

type GameState = 'title' | 'playing' | 'paused' | 'victory';

export default function App() {
  // Generate all 100 deterministic levels
  const allLevels = useMemo(() => generate100Levels(), []);

  // Saved progression in localStorage
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arrow_current_level');
      if (saved) return Math.min(100, Math.max(1, parseInt(saved, 10)));
    }
    return 1;
  });

  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arrow_highest_unlocked');
      if (saved) return Math.min(100, Math.max(1, parseInt(saved, 10)));
    }
    return 1;
  });

  const [levelStars, setLevelStars] = useState<Record<number, number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('arrow_level_stars');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {};
  });

  // AdMob configuration state (can be edited by user in UI)
  const [admobConfig, setAdmobConfig] = useState(() => {
    const defaultConfig = {
      appId: 'ca-app-pub-4896944310343088~1574563740',
      bannerId: 'ca-app-pub-4896944310343088/1574563740',
      interstitialId: 'ca-app-pub-4896944310343088/7766447903',
      rewardedId: 'ca-app-pub-4896944310343088/7766447903',
    };
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('arrow_admob_config');
        if (saved) return { ...defaultConfig, ...JSON.parse(saved) };
      } catch {
        // fallback
      }
    }
    return defaultConfig;
  });

  // Game state machine
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return 'playing';
      }
    }
    return 'title';
  });

  // Current Level state
  const currentLevelConfig = useMemo(() => {
    return allLevels[currentLevelNumber - 1] || allLevels[0];
  }, [allLevels, currentLevelNumber]);

  const [arrows, setArrows] = useState<ArrowTile[]>(() => [
    ...currentLevelConfig.arrows.map(a => ({ ...a })),
  ]);
  const [moveCount, setMoveCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [undoHistory, setUndoHistory] = useState<ArrowTile[][]>([]);
  const [hintsCount, setHintsCount] = useState(5);
  const [activeHintId, setActiveHintId] = useState<number | null>(null);

  // Animation triggers
  const [wigglingArrowId, setWigglingArrowId] = useState<number | null>(null);
  const [exitingArrowId, setExitingArrowId] = useState<number | null>(null);
  const [collisionBlockerId, setCollisionBlockerId] = useState<number | null>(null);

  // Modals
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);
  const [isAdMobSettingsOpen, setIsAdMobSettingsOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isInterstitialOpen, setIsInterstitialOpen] = useState(false);
  const [isRewardAdOpen, setIsRewardAdOpen] = useState(false);

  // Frame toggle (mobile phone frame vs full viewport)
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  // Detect if running inside Android Native APK WebView
  const isNativeAndroid = typeof window !== 'undefined' && Boolean((window as unknown as { AndroidNative?: { isNative?: () => boolean } }).AndroidNative?.isNative?.());

  // Check if current board is in a deadlock state (no free arrow or rotator exists)
  const isDeadlocked = useMemo(() => {
    if (gameState !== 'playing') return false;
    const remaining = arrows.filter(a => !a.isCleared && a.type !== 'OBSTACLE').length;
    if (remaining === 0) return false;
    const free = findFreeArrow(arrows, currentLevelConfig.gridRows, currentLevelConfig.gridCols);
    const hasRotator = arrows.some(a => !a.isCleared && a.type === 'ROTATOR');
    return !free && !hasRotator;
  }, [arrows, gameState, currentLevelConfig]);

  // Listen for native Android rewarded ad callbacks
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { onNativeRewardGranted?: () => void }).onNativeRewardGranted = () => {
        setHintsCount(prev => prev + 3);
        sound.playVictory();
      };
    }
  }, []);

  // Sync document body dataset state for ultra-mode & automated inspection
  useEffect(() => {
    document.body.dataset.state = gameState === 'victory' ? 'gameover' : gameState;
  }, [gameState]);

  // Load level handler
  const loadLevel = useCallback(
    (lvlNum: number) => {
      const targetConfig = allLevels[lvlNum - 1] || allLevels[0];
      setCurrentLevelNumber(targetConfig.levelNumber);
      setArrows(targetConfig.arrows.map(a => ({ ...a })));
      setMoveCount(0);
      setCombo(0);
      setUndoHistory([]);
      setActiveHintId(null);
      setWigglingArrowId(null);
      setExitingArrowId(null);
      setCollisionBlockerId(null);
      setGameState('playing');

      if (typeof window !== 'undefined') {
        localStorage.setItem('arrow_current_level', String(targetConfig.levelNumber));
      }
    },
    [allLevels]
  );

  // When currentLevelNumber changes externally
  useEffect(() => {
    const targetConfig = allLevels[currentLevelNumber - 1] || allLevels[0];
    setArrows(targetConfig.arrows.map(a => ({ ...a })));
    setMoveCount(0);
    setCombo(0);
    setUndoHistory([]);
    setActiveHintId(null);
  }, [currentLevelNumber, allLevels]);

  // Save AdMob configuration
  const handleSaveAdMob = (newConfig: typeof admobConfig) => {
    setAdmobConfig(newConfig);
    if (typeof window !== 'undefined') {
      localStorage.setItem('arrow_admob_config', JSON.stringify(newConfig));
    }
  };

  // Sound toggle
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Tap Arrow Tile Logic
  const handleTapArrow = (tileId: number) => {
    if (gameState !== 'playing') return;
    if (exitingArrowId !== null) return;

    // Save history for undo
    setUndoHistory(prev => [...prev, arrows.map(a => ({ ...a }))]);
    setMoveCount(prev => prev + 1);

    // Clear previous hint if matched
    if (activeHintId === tileId) {
      setActiveHintId(null);
    }

    const { newArrows, result, isLevelCleared } = tapTile(
      tileId,
      arrows,
      currentLevelConfig.gridRows,
      currentLevelConfig.gridCols
    );

    if (result.canExit) {
      // Exiting arrow animation
      setExitingArrowId(tileId);
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      sound.playFlyAway(nextCombo);

      // Brief animation timeout to allow smooth slide out before updating board state
      setTimeout(() => {
        setArrows(newArrows);
        setExitingArrowId(null);

        if (isLevelCleared) {
          // Calculate stars (3-star, 2-star, 1-star)
          const moves = moveCount + 1;
          const starsEarned =
            moves <= currentLevelConfig.targetStarsMoves[0]
              ? 3
              : moves <= currentLevelConfig.targetStarsMoves[1]
              ? 2
              : 1;

          // Update progression
          const updatedStars = {
            ...levelStars,
            [currentLevelNumber]: Math.max(levelStars[currentLevelNumber] || 0, starsEarned),
          };
          setLevelStars(updatedStars);
          localStorage.setItem('arrow_level_stars', JSON.stringify(updatedStars));

          const nextLvl = Math.min(100, currentLevelNumber + 1);
          if (nextLvl > highestUnlockedLevel) {
            setHighestUnlockedLevel(nextLvl);
            localStorage.setItem('arrow_highest_unlocked', String(nextLvl));
          }

          setGameState('victory');

          // Check if AdMob Interstitial should show (every 3 levels)
          if (currentLevelNumber % 3 === 0) {
            if (isNativeAndroid) {
              (window as unknown as { AndroidNative?: { showInterstitialAd?: (lvl: number) => void } }).AndroidNative?.showInterstitialAd?.(currentLevelNumber);
            } else {
              setTimeout(() => {
                setIsInterstitialOpen(true);
              }, 600);
            }
          }
        }
      }, 260);
    } else {
      // Blocked / Wiggle
      setCombo(0);
      if (result.rotatedTo) {
        sound.playRotate();
        setArrows(newArrows);
      } else {
        sound.playBlocked();
      }

      setWigglingArrowId(tileId);
      if (result.blockedByArrowId) {
        setCollisionBlockerId(result.blockedByArrowId);
      }

      setTimeout(() => {
        setWigglingArrowId(null);
        setCollisionBlockerId(null);
      }, 400);
    }
  };

  // Undo Move
  const handleUndo = () => {
    if (undoHistory.length === 0) return;
    const previous = undoHistory[undoHistory.length - 1];
    setArrows(previous);
    setUndoHistory(prev => prev.slice(0, -1));
    setMoveCount(prev => Math.max(0, prev - 1));
    setCombo(0);
    sound.playClick();
  };

  // Hint
  const handleHint = () => {
    if (hintsCount <= 0) {
      // Suggest watching ad for more hints
      setIsRewardAdOpen(true);
      return;
    }

    const freeArrow = findFreeArrow(
      arrows,
      currentLevelConfig.gridRows,
      currentLevelConfig.gridCols
    );
    if (freeArrow) {
      setActiveHintId(freeArrow.id);
      setHintsCount(prev => prev - 1);
      sound.playClick();
    }
  };

  // Reward Ad Claimed
  const handleRewardClaimed = () => {
    setHintsCount(prev => prev + 3);
  };

  // Watch Reward Ad (Native or Web Simulation)
  const handleWatchRewardAd = () => {
    if (isNativeAndroid) {
      (window as unknown as { AndroidNative?: { showRewardedAd?: () => void } }).AndroidNative?.showRewardedAd?.();
    } else {
      setIsRewardAdOpen(true);
    }
  };

  // Smart Nudge to unblock player when deadlocked so they never get stuck
  const handleSmartNudge = () => {
    const active = arrows.filter(a => !a.isCleared && a.type !== 'OBSTACLE');
    if (active.length === 0) return;

    // Pick a candidate arrow and rotate it to an open outward direction
    const outerArrows = active.filter(
      a =>
        a.row === 0 ||
        a.row === currentLevelConfig.gridRows - 1 ||
        a.col === 0 ||
        a.col === currentLevelConfig.gridCols - 1
    );
    const target = outerArrows.length > 0 ? outerArrows[0] : active[0];

    let outwardDir: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT' = 'UP';
    if (target.row === 0) outwardDir = 'UP';
    else if (target.row === currentLevelConfig.gridRows - 1) outwardDir = 'DOWN';
    else if (target.col === 0) outwardDir = 'LEFT';
    else outwardDir = 'RIGHT';

    setUndoHistory(prev => [...prev, arrows.map(a => ({ ...a }))]);
    setArrows(prev =>
      prev.map(a => (a.id === target.id ? { ...a, direction: outwardDir } : a))
    );
    sound.playRotate();
  };

  // Next level
  const handleNextLevel = () => {
    if (currentLevelNumber < 100) {
      loadLevel(currentLevelNumber + 1);
    }
  };

  // Replay
  const handleReplay = () => {
    loadLevel(currentLevelNumber);
  };

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Enter' || e.key === ' ') {
        if (gameState === 'title') {
          e.preventDefault();
          loadLevel(highestUnlockedLevel);
        } else if (gameState === 'victory') {
          e.preventDefault();
          handleNextLevel();
        }
      } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setGameState('playing');
        }
      } else if (e.key === 'u' || e.key === 'U') {
        if (gameState === 'playing') handleUndo();
      } else if (e.key === 'h' || e.key === 'H') {
        if (gameState === 'playing') handleHint();
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, highestUnlockedLevel, currentLevelNumber, undoHistory, hintsCount, arrows]);

  const remainingArrows = arrows.filter(a => !a.isCleared && a.type !== 'OBSTACLE').length;
  const totalStars = Object.values(levelStars).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 text-white flex items-center justify-center font-sans antialiased">
      {/* Container wrapper: either full viewport or mobile phone frame */}
      <div
        className={`relative flex flex-col justify-between overflow-hidden transition-all duration-300 ${
          isMobileFrame
            ? 'w-[390px] h-[844px] max-h-[96vh] rounded-[48px] border-4 border-slate-700/80 shadow-[0_0_60px_rgba(0,0,0,0.9)] bg-slate-950 ring-1 ring-slate-600/40'
            : 'w-full h-full'
        }`}
      >
        {/* Mobile Phone Top Notch if frame is active */}
        {isMobileFrame && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-slate-900 border border-slate-800 z-40 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-700 mr-2" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
          </div>
        )}

        {/* VIEW 1: TITLE SCREEN */}
        {gameState === 'title' && (
          <TitleScreen
            onStartGame={() => loadLevel(highestUnlockedLevel)}
            onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
            onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
            onOpenAdMobSettings={() => setIsAdMobSettingsOpen(true)}
            highestUnlockedLevel={highestUnlockedLevel}
            totalStars={totalStars}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        {/* VIEW 2: PLAYING GAMEPLAY SCREEN */}
        {gameState !== 'title' && (
          <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden">
            {/* Top HUD */}
            <GameHUD
              levelNumber={currentLevelConfig.levelNumber}
              chapterName={currentLevelConfig.chapterName}
              movesCount={moveCount}
              remainingArrows={remainingArrows}
              combo={combo}
              starsTarget={currentLevelConfig.targetStarsMoves}
              hintsCount={hintsCount}
              undoCount={undoHistory.length}
              isMuted={isMuted}
              isMobileFrame={isMobileFrame}
              onPause={() => setGameState('paused')}
              onUndo={handleUndo}
              onHint={handleHint}
              onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
              onToggleMute={handleToggleMute}
              onToggleMobileFrame={() => setIsMobileFrame(prev => !prev)}
              onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
              onOpenAdMobSettings={() => setIsAdMobSettingsOpen(true)}
              onWatchRewardAd={handleWatchRewardAd}
            />

            {/* Central Playfield: GameBoard */}
            <main className="relative flex-1 w-full flex items-center justify-center p-2 z-10">
              <GameBoard
                level={currentLevelConfig}
                arrows={arrows}
                hintArrowId={activeHintId}
                onTapArrow={handleTapArrow}
                wigglingArrowId={wigglingArrowId}
                exitingArrowId={exitingArrowId}
                collisionBlockerId={collisionBlockerId}
              />

              {/* Deadlock Helper Bar - Appears if all paths are blocked so player is never stuck */}
              {isDeadlocked && (
                <div className="absolute bottom-2 z-30 px-3 py-2 rounded-2xl bg-amber-500/95 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xl shadow-amber-500/30 border border-amber-300">
                  <span>⚠️ Path blocked!</span>
                  <button
                    onClick={handleUndo}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold cursor-pointer transition-colors"
                  >
                    Undo (U)
                  </button>
                  <button
                    onClick={handleSmartNudge}
                    className="px-2.5 py-1 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-[11px] font-semibold cursor-pointer transition-colors"
                  >
                    Smart Unblock ✨
                  </button>
                </div>
              )}
            </main>

            {/* Bottom AdMob Banner (Simulated on Web, Native AdView handles it in Android APK) */}
            {!isNativeAndroid && (
              <footer className="w-full shrink-0 pb-2 z-20">
                <AdMobBanner
                  bannerId={admobConfig.bannerId}
                  onOpenSettings={() => setIsAdMobSettingsOpen(true)}
                />
              </footer>
            )}
          </div>
        )}

        {/* MODAL 1: PAUSE MODAL */}
        <PauseModal
          isOpen={gameState === 'paused'}
          onResume={() => setGameState('playing')}
          onRestart={handleReplay}
          onOpenLevelSelect={() => {
            setGameState('playing');
            setIsLevelSelectOpen(true);
          }}
          onOpenAdMobSettings={() => setIsAdMobSettingsOpen(true)}
          onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />

        {/* MODAL 2: VICTORY MODAL */}
        <VictoryModal
          isOpen={gameState === 'victory'}
          levelNumber={currentLevelNumber}
          chapterName={currentLevelConfig.chapterName}
          movesUsed={moveCount}
          starsEarned={levelStars[currentLevelNumber] || 1}
          target3Stars={currentLevelConfig.targetStarsMoves[0]}
          onNextLevel={handleNextLevel}
          onReplay={handleReplay}
          onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
        />

        {/* MODAL 3: 100 LEVELS SELECT MODAL */}
        <LevelSelectModal
          isOpen={isLevelSelectOpen}
          onClose={() => setIsLevelSelectOpen(false)}
          levels={allLevels}
          currentLevelNumber={currentLevelNumber}
          highestUnlockedLevel={highestUnlockedLevel}
          levelStars={levelStars}
          onSelectLevel={loadLevel}
        />

        {/* MODAL 4: ADMOB SETTINGS MODAL */}
        <AdMobSettingsModal
          isOpen={isAdMobSettingsOpen}
          onClose={() => setIsAdMobSettingsOpen(false)}
          appId={admobConfig.appId}
          bannerId={admobConfig.bannerId}
          interstitialId={admobConfig.interstitialId}
          rewardedId={admobConfig.rewardedId}
          onSave={handleSaveAdMob}
        />

        {/* MODAL 5: ANDROID C++ ENGINE & APK BUILD MODAL */}
        <AndroidBuildModal
          isOpen={isAndroidModalOpen}
          onClose={() => setIsAndroidModalOpen(false)}
        />

        {/* MODAL 6: ADMOB INTERSTITIAL / REWARD MODAL */}
        <AdMobInterstitialModal
          isOpen={isInterstitialOpen || isRewardAdOpen}
          onClose={() => {
            setIsInterstitialOpen(false);
            setIsRewardAdOpen(false);
          }}
          interstitialId={
            isRewardAdOpen ? admobConfig.rewardedId : admobConfig.interstitialId
          }
          isRewardAd={isRewardAdOpen}
          onRewardClaimed={handleRewardClaimed}
        />
      </div>
    </div>
  );
}
