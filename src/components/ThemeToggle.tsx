import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';

export type ThemeMode = 'dark' | 'light' | 'gray'; // Kept 'gray' in type to avoid TS errors in other files, but removed the button

interface ThemeToggleProps {
  currentTheme: ThemeMode;
  onChangeTheme: (theme: ThemeMode) => void;
  language: Language;
}

export default function ThemeToggle({ currentTheme, onChangeTheme, language }: ThemeToggleProps) {
  const themes: { id: ThemeMode; labelKh: string; labelEn: string; icon: any }[] = [
    { id: 'dark', labelKh: 'ងងឹត', labelEn: 'Dark', icon: Moon },
    { id: 'light', labelKh: 'ស', labelEn: 'White', icon: Sun },
  ];

  const handleSelectTheme = (newTheme: ThemeMode) => {
    if (newTheme === currentTheme) return;

    // Use native View Transition API for instant GPU-accelerated full-page cross-fade if supported
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        onChangeTheme(newTheme);
      });
    } else {
      onChangeTheme(newTheme);
    }
  };

  return (
    <div
      id="theme-toggle-container"
      className={`relative flex items-center gap-1 p-1 rounded-full border border-amber-400/40 ${
        currentTheme === 'light' ? 'bg-white/80' : 'bg-black/75'
      } shadow-xl backdrop-blur-md transition-colors duration-500`}
    >
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = currentTheme === t.id;
        return (
          <motion.button
            key={t.id}
            id={`theme-${t.id}-btn`}
            onClick={() => handleSelectTheme(t.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold font-khmer z-10 transition-colors duration-300 ${
              isActive
                ? 'text-neutral-950 font-bold'
                : currentTheme === 'light'
                ? 'text-neutral-600 hover:text-neutral-900 hover:bg-black/5'
                : 'text-amber-200/80 hover:text-white hover:bg-white/10'
            }`}
            title={`${t.labelKh} / ${t.labelEn}`}
          >
            {isActive && (
              <motion.div
                layoutId="theme-active-indicator"
                className="absolute inset-0 rounded-full bg-amber-400 shadow-md -z-10"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {language === 'kh' ? t.labelKh : t.labelEn}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
