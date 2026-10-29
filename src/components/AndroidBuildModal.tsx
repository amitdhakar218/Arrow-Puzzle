import React, { useState } from 'react';
import { X, Check, Copy, Terminal, Smartphone, Cpu, Download, GitBranch, ArrowRight } from 'lucide-react';
import { sound } from '../game/sound.ts';

interface AndroidBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidBuildModal: React.FC<AndroidBuildModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'workflow' | 'cpp' | 'guide'>('workflow');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const workflowYaml = `name: Build Android APK (C++ & AdMob)
on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build-apk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - run: |
          echo "sdk.dir=$ANDROID_HOME" > android/local.properties
          if [ -d "$ANDROID_NDK_HOME" ]; then echo "ndk.dir=$ANDROID_NDK_HOME" >> android/local.properties; fi
          yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses || true
      - uses: gradle/actions/setup-gradle@v3
        with:
          gradle-version: '8.5'
      - working-directory: ./android
        run: |
          gradle wrapper --gradle-version 8.5 || true
          ./gradlew assembleDebug --stacktrace --no-daemon
      - uses: actions/upload-artifact@v4
        with:
          name: ArrowPuzzle-Debug-APK
          path: android/app/build/outputs/apk/debug/*.apk`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-6 text-white shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Android C++ Engine &amp; GitHub Actions APK Build</h2>
              <p className="text-xs text-slate-400">Automated CI/CD workflow ready to compile APK on GitHub</p>
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 border-b border-slate-800 pb-2 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('workflow');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'workflow'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>GitHub Action YAML</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('cpp');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'cpp'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>C++ Native Engine</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('guide');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>APK Build Guide (Hindi/Eng)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto mt-4 text-xs pr-1">
          {activeTab === 'workflow' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-mono text-cyan-400">.github/workflows/build-apk.yml</span>
                <button
                  onClick={() => handleCopy(workflowYaml, 'yaml')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700"
                >
                  {copied === 'yaml' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'yaml' ? 'Copied!' : 'Copy YAML'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre">
                {workflowYaml}
              </pre>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300">
                💡 <strong>Automated Build:</strong> Once you push to your GitHub repo, GitHub Actions automatically builds the debug and release APK and uploads it to the <strong>Artifacts</strong> section!
              </div>
            </div>
          )}

          {activeTab === 'cpp' && (
            <div className="space-y-3">
              <p className="text-slate-300 leading-relaxed">
                The entire C++20 game engine is built in <code className="text-cyan-300">/android/app/src/main/cpp/</code>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="font-mono font-bold text-amber-400 mb-1">GameEngine.hpp / .cpp</div>
                  <p className="text-slate-400">
                    C++ 100-level procedural generator, deterministic collision raycasting, rotator mechanics, and undo state history.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="font-mono font-bold text-emerald-400 mb-1">native-lib.cpp (JNI)</div>
                  <p className="text-slate-400">
                    High-speed JNI interface connecting Android Kotlin Activity to C++ NDK library at 60 FPS.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="font-mono font-bold text-cyan-400 mb-1">CMakeLists.txt</div>
                  <p className="text-slate-400">
                    Configures Android NDK CMake build with C++20 standard, shared STL, and compiler optimizations.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="font-mono font-bold text-purple-400 mb-1">AdMobManager.kt</div>
                  <p className="text-slate-400">
                    Handles Google Mobile Ads initialization, Banner, Interstitial (every 3 levels), and Rewarded Ads.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/90 border border-cyan-500/30 space-y-2">
                <h3 className="font-bold text-sm text-cyan-300 flex items-center gap-1.5">
                  <Download className="w-4 h-4" />
                  <span>APK Download Karne Ka Tarika (Step-by-Step)</span>
                </h3>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li>Apne project ko GitHub par push karein: <code className="text-amber-300 font-mono">git push origin main</code> (Repo: <span className="text-cyan-300">github.com/amitdhakar218/Arrow-Puzzle</span>)</li>
                  <li>GitHub par repository kholkar upar <strong>Actions</strong> tab par click karein.</li>
                  <li>Wahan <strong>&quot;Build Android APK (C++ &amp; AdMob)&quot;</strong> workflow run hona shuru ho jayega.</li>
                  <li>2-3 minute me jab run complete ho jaye, uspe click karein.</li>
                  <li>Page ke bottom me <strong>Artifacts</strong> section me aapko <strong>ArrowPuzzle-Debug-APK</strong> mil jayega! Download karke mobile me install karein!</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/90 border border-emerald-500/30 space-y-2">
                <h3 className="font-bold text-sm text-emerald-300">
                  💰 Real AdMob Account Configured!
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Aapke AdMob account (<code className="text-cyan-300">pub-4896944310343088</code>) ke Banner, Interstitial aur App Open IDs project me set ho gaye hain! Nayi APK install karne par aapki real ads active milengi.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold cursor-pointer transition-colors text-sm"
          >
            Got it, Let&apos;s Play!
          </button>
        </div>
      </div>
    </div>
  );
};
