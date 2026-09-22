import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { ThemeMode } from './ThemeToggle';

interface AudioPlayerProps {
  audioUrl: string;
  hasOpenedEnvelope: boolean;
  language: Language;
  theme?: ThemeMode;
}

export default function AudioPlayer({ audioUrl, hasOpenedEnvelope, language, theme = 'dark' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (hasOpenedEnvelope) {
      audio.muted = false;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setShowPrompt(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setShowPrompt(true);
        });
    }
  }, [hasOpenedEnvelope]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setShowPrompt(false);
    } else {
      audio.muted = false;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setShowPrompt(false);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        id="wedding-audio"
        src={audioUrl}
        loop
        preload="auto"
        playsInline
      />

      {/* Floating Audio Control Pill */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        <motion.button
          id="toggle-music-btn"
          onClick={togglePlay}
          onTap={togglePlay}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300 ${
            isPlaying
              ? 'bg-amber-950/80 border-amber-400/60 text-amber-200 ring-2 ring-amber-400/40'
              : theme === 'light'
              ? 'bg-white/80 border-amber-200 text-amber-700 hover:text-amber-900 hover:bg-white hover:border-amber-400 ring-1 ring-amber-200/50 shadow-lg'
              : 'bg-black/70 border-white/20 text-neutral-300 hover:text-white hover:bg-black/80 ring-1 ring-white/10 shadow-lg'
          }`}
          title={isPlaying ? (language === 'kh' ? 'ផ្អាកតន្ត្រី / Mute Music' : 'Mute Music') : (language === 'kh' ? 'ចាក់តន្ត្រី / Play Music' : 'Play Music')}
        >
          <div className="relative flex items-center justify-center">
            {isPlaying ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="text-amber-400"
              >
                <Music className="w-4 h-4" />
              </motion.div>
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-400" />
            )}
            {isPlaying && (
              <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5 shadow-[0_0_8px_rgba(245,158,11,0.6)]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 ring-1 ring-amber-400/50"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border border-amber-300/50 shadow-sm"></span>
              </span>
            )}
          </div>

          <span className="text-[14px] font-khmer font-medium tracking-wide">
            {isPlaying ? (
              <span className="flex items-center gap-1">
                <span>{language === 'kh' ? 'កំពុងចាក់' : 'Playing'}</span>
                <span className="inline-block animate-pulse text-amber-400">♫</span>
              </span>
            ) : (
              <span>{language === 'kh' ? 'តន្ត្រី' : 'Music'}</span>
            )}
          </span>
        </motion.button>

        {showPrompt && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-amber-950/90 text-amber-200 border border-amber-500/40 text-xs px-3 py-1.5 rounded-lg shadow-lg font-khmer flex items-center gap-2"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>{language === 'kh' ? 'ចុចដើម្បីបើកសំឡេងតន្ត្រី' : 'Click to unmute music'}</span>
          </motion.div>
        )}
      </div>
    </>
  );
}
