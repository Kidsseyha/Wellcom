import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ArrowUp, ChevronDown, ChevronsDown, Settings2, Gauge, Zap, FastForward } from 'lucide-react';
import { Language } from '../types';
import { ThemeMode } from './ThemeToggle';

interface AutoScrollControllerProps {
  language: Language;
  theme: ThemeMode;
  hasOpenedEnvelope: boolean;
  primaryColor?: string;
  initialSpeed?: number; // pixels per second
  autoStartOnOpen?: boolean;
}

export default function AutoScrollController({
  language,
  theme,
  hasOpenedEnvelope,
  primaryColor = '#f5b80f',
  initialSpeed = 110,
  autoStartOnOpen = true,
}: AutoScrollControllerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0); // Default to 1X
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const isUserTouchingRef = useRef<boolean>(false);
  const touchTimeoutRef = useRef<number | null>(null);

  // Sync ref with state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Base speed in px/s
  const baseSpeed = initialSpeed;
  const currentSpeed = baseSpeed * speedMultiplier;

  // Speed level cycle with 1X, 1.5X, 2X, 3X
  const speedLevels = [
    { mult: 1.0, labelKh: '1X (ធម្មតា)', labelEn: '1X Normal', badge: '1X' },
    { mult: 1.5, labelKh: '1.5X (លឿន)', labelEn: '1.5X Fast', badge: '1.5X' },
    { mult: 2.0, labelKh: '2X (លឿនខ្លាំង)', labelEn: '2X Turbo', badge: '2X' },
    { mult: 3.0, labelKh: '3X (អតិបរមា)', labelEn: '3X Max', badge: '3X' },
  ];

  const cycleNextSpeed = () => {
    const currentIndex = speedLevels.findIndex(s => s.mult === speedMultiplier);
    const nextIndex = (currentIndex + 1) % speedLevels.length;
    setSpeedMultiplier(speedLevels[nextIndex].mult);
    if (!isPlaying) startAutoScroll();
  };

  // Calculate scroll progress and bottom detection
  const updateScrollProgress = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) {
      setScrollProgress(0);
      setIsAtBottom(false);
      return;
    }
    const progress = Math.min(100, Math.max(0, (window.scrollY / scrollHeight) * 100));
    setScrollProgress(Math.round(progress));
    setIsAtBottom(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 25);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, [updateScrollProgress]);

  // Main smooth auto-scroll loop
  const scrollStep = useCallback(
    (timestamp: number) => {
      if (!isPlayingRef.current || isUserTouchingRef.current) {
        lastTimestampRef.current = null;
        return;
      }

      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaSeconds = Math.min((timestamp - lastTimestampRef.current) / 1000, 0.1); // cap at 100ms
      lastTimestampRef.current = timestamp;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentY = window.scrollY;

      if (currentY >= maxScroll - 2) {
        // Reached the bottom
        setIsPlaying(false);
        setIsAtBottom(true);
        lastTimestampRef.current = null;
        return;
      }

      const nextY = Math.min(currentY + currentSpeed * deltaSeconds, maxScroll);
      window.scrollTo(0, nextY);

      animationFrameRef.current = requestAnimationFrame(scrollStep);
    },
    [currentSpeed]
  );

  const startAutoScroll = useCallback(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= maxScroll - 10) {
      // If already at bottom, jump to top first
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        setIsPlaying(true);
        setIsAtBottom(false);
        lastTimestampRef.current = null;
        animationFrameRef.current = requestAnimationFrame(scrollStep);
      }, 500);
      return;
    }

    setIsPlaying(true);
    setIsAtBottom(false);
    lastTimestampRef.current = null;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(scrollStep);
  }, [scrollStep]);

  const pauseAutoScroll = useCallback(() => {
    setIsPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    lastTimestampRef.current = null;
  }, []);

  const toggleAutoScroll = () => {
    if (isPlaying) {
      pauseAutoScroll();
    } else {
      startAutoScroll();
    }
  };

  const scrollToTop = () => {
    pauseAutoScroll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Detect user touch or manual scroll interruption
  useEffect(() => {
    const handleUserTouchStart = () => {
      if (isPlayingRef.current) {
        isUserTouchingRef.current = true;
      }
    };

    const handleUserTouchEnd = () => {
      if (isUserTouchingRef.current) {
        if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
        // Resume gently after 1.2s of no touch
        touchTimeoutRef.current = window.setTimeout(() => {
          isUserTouchingRef.current = false;
          if (isPlayingRef.current) {
            lastTimestampRef.current = null;
            animationFrameRef.current = requestAnimationFrame(scrollStep);
          }
        }, 1200);
      }
    };

    window.addEventListener('touchstart', handleUserTouchStart, { passive: true });
    window.addEventListener('touchend', handleUserTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleUserTouchStart);
      window.removeEventListener('touchend', handleUserTouchEnd);
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    };
  }, [scrollStep]);

  // Trigger auto scroll once on envelope open if configured
  useEffect(() => {
    if (hasOpenedEnvelope && autoStartOnOpen) {
      const timer = setTimeout(() => {
        startAutoScroll();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [hasOpenedEnvelope, autoStartOnOpen, startAutoScroll]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!hasOpenedEnvelope) {
    return null;
  }

  const isLight = theme === 'light';

  return (
    <div
      id="auto-scroll-controller"
      className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto select-none"
    >
      {/* Speed Selector Popup Menu */}
      <AnimatePresence>
        {showSpeedMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`p-3 rounded-2xl border backdrop-blur-xl shadow-2xl mb-2 min-w-[240px] ${
              isLight
                ? 'bg-white/95 border-amber-300/80 text-amber-950 shadow-amber-900/20'
                : 'bg-black/95 border-amber-500/40 text-amber-100 shadow-black/80'
            }`}
          >
            <div className="flex items-center justify-between gap-1.5 px-1 py-1 text-[11px] font-bold opacity-85 font-khmer border-b border-amber-500/20 mb-2">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'kh' ? 'ល្បឿនរំកិលស្វ័យប្រវត្តិ (Speed)' : 'Auto-Scroll Speed'}</span>
              </div>
              <span className="text-[10px] text-amber-400 font-mono">
                {Math.round(currentSpeed)} px/s
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {speedLevels.map((opt, idx) => {
                const isSelected = speedMultiplier === opt.mult;
                return (
                  <button
                    key={opt.mult}
                    type="button"
                    onClick={() => {
                      setSpeedMultiplier(opt.mult);
                      setShowSpeedMenu(false);
                      if (!isPlaying) startAutoScroll();
                    }}
                    className={`px-3 py-2.5 rounded-xl font-khmer text-xs flex items-center justify-between gap-1.5 transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 font-extrabold shadow-md ring-2 ring-amber-400/50'
                        : isLight
                        ? 'hover:bg-amber-100 text-neutral-800 bg-amber-50/70 border border-amber-200/80 hover:border-amber-400'
                        : 'hover:bg-white/15 text-neutral-200 bg-white/5 border border-white/10 hover:border-amber-400/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {isSelected && <span className="text-amber-950 font-bold text-[10px]">✓</span>}
                      <span className="font-semibold">{language === 'kh' ? opt.labelKh : opt.labelEn}</span>
                    </div>
                    {opt.mult >= 1.5 && (
                      <Zap className={`w-3 h-3 shrink-0 ${isSelected ? 'fill-amber-950 text-amber-950' : 'text-amber-500 fill-amber-500/50'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Capsule Button */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="flex items-center gap-1.5"
      >
        {/* Scroll To Top Button */}
        {scrollProgress > 15 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={scrollToTop}
            title={language === 'kh' ? 'ឡើងលើវិញ (Scroll to Top)' : 'Scroll to top'}
            className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-lg backdrop-blur-md transition-all ${
              isLight
                ? 'bg-white/90 border-amber-300 text-amber-900 hover:bg-amber-100 shadow-amber-900/15'
                : 'bg-black/85 border-amber-500/40 text-amber-300 hover:bg-black/95 hover:border-amber-400 shadow-black/60'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}

        {/* Play / Pause / Auto Scroll Capsule */}
        <div
          className={`flex items-center rounded-full border shadow-xl backdrop-blur-md transition-all ${
            isLight
              ? 'bg-white/95 border-amber-400/90 shadow-amber-900/20'
              : 'bg-black/90 border-amber-400/60 shadow-black/80 ring-1 ring-amber-400/20'
          }`}
        >
          {/* Main Action: Play / Pause */}
          <button
            id="auto-scroll-toggle-btn"
            type="button"
            onClick={toggleAutoScroll}
            className={`flex items-center gap-2 pl-3.5 pr-2 py-2 rounded-l-full font-khmer text-xs transition-all ${
              isPlaying
                ? 'text-amber-900 dark:text-amber-300 font-bold'
                : isLight
                ? 'text-neutral-800 hover:text-amber-900 font-semibold'
                : 'text-neutral-200 hover:text-amber-200 font-semibold'
            }`}
            title={
              isPlaying
                ? language === 'kh'
                  ? 'ចុចដើម្បីផ្អាកការរំកិល (Pause)'
                  : 'Click to pause auto-scroll'
                : language === 'kh'
                ? 'ចុចដើម្បីរំកិលស្វ័យប្រវត្តិ (Play Auto-Scroll)'
                : 'Click to start auto-scroll'
            }
          >
            {/* Animated Pulse or Icon */}
            <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 shadow-md">
              {isPlaying ? (
                <>
                  <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-60 pointer-events-none" />
                  <Pause className="w-3.5 h-3.5 relative z-10 fill-amber-950" />
                </>
              ) : (
                <Play className="w-3.5 h-3.5 relative z-10 ml-0.5 fill-amber-950" />
              )}
            </div>

            {/* Label */}
            <span className="whitespace-nowrap font-khmer text-[12px]">
              {isPlaying
                ? language === 'kh'
                  ? 'កំពុងរំកិល...'
                  : 'Auto-Scrolling...'
                : isAtBottom
                ? language === 'kh'
                  ? 'រំកិលឡើងវិញ'
                  : 'Scroll Again'
                : language === 'kh'
                ? 'រំកិលស្វ័យប្រវត្តិ'
                : 'Auto Scroll'}
            </span>

            {/* Progress Badge */}
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                isLight ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-amber-950/60 text-amber-300'
              }`}
            >
              {scrollProgress}%
            </span>
          </button>

          {/* Direct Speed Switch Button (More Speed Quick-Toggle) */}
          <button
            type="button"
            onClick={cycleNextSpeed}
            title={language === 'kh' ? `ល្បឿនបច្ចុប្បន្ន ៖ ${speedMultiplier === 1 ? '1X' : `${speedMultiplier}X`} (ចុចដើម្បីបង្កើនល្បឿន)` : `Current speed: ${speedMultiplier === 1 ? '1X' : `${speedMultiplier}X`} (Click to speed up)`}
            className={`px-2 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1 active:scale-95 ${
              speedMultiplier >= 2.0
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : isLight
                ? 'bg-amber-100 text-amber-950 hover:bg-amber-200'
                : 'bg-white/10 text-amber-300 hover:bg-white/20'
            }`}
          >
            <Zap className={`w-3 h-3 ${speedMultiplier >= 2.0 ? 'fill-amber-950 text-amber-950' : 'text-amber-400'}`} />
            <span>{speedMultiplier === 1 ? '1X' : `${speedMultiplier}X`}</span>
          </button>

          {/* Speed Gear / Setting Button */}
          <button
            type="button"
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            title={language === 'kh' ? 'កែសម្រួលល្បឿនរំកិល' : 'Change speed'}
            className={`p-2 pr-3 rounded-r-full text-xs transition-colors border-l ${
              isLight
                ? 'border-amber-200 text-amber-800 hover:text-amber-950 hover:bg-amber-100/60'
                : 'border-amber-500/20 text-amber-300 hover:text-amber-100 hover:bg-white/5'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
