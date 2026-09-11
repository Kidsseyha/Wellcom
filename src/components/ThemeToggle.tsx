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

  return (
    <div className={`flex items-center gap-1 p-1 rounded-full border border-amber-400/40 ${currentTheme === 'light' ? 'bg-white/80' : 'bg-black/75'} shadow-xl backdrop-blur-md`}>
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = currentTheme === t.id;
        return (
          <motion.button
            key={t.id}
            id={`theme-${t.id}-btn`}
            onClick={() => onChangeTheme(t.id)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all font-khmer ${
              isActive
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                : currentTheme === 'light'
                ? 'text-neutral-600 hover:text-neutral-900 hover:bg-black/5'
                : 'text-amber-200/80 hover:text-white hover:bg-white/10'
            }`}
            title={`${t.labelKh} / ${t.labelEn}`}
          >
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
