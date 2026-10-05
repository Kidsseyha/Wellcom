import { Languages } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { ThemeMode } from './ThemeToggle';

interface LanguageToggleProps {
  currentLanguage: Language;
  onToggle: () => void;
  onSelectLanguage?: (lang: Language) => void;
  theme?: ThemeMode;
}

export default function LanguageToggle({
  currentLanguage,
  onToggle,
  onSelectLanguage,
  theme = 'dark',
}: LanguageToggleProps) {
  const handleSelect = (lang: Language) => {
    if (lang === currentLanguage) return;
    if (onSelectLanguage) {
      onSelectLanguage(lang);
    } else {
      onToggle();
    }
  };

  return (
    <div
      id="toggle-language-btn"
      className={`relative flex items-center gap-0.5 p-1 rounded-full border border-amber-400/40 ${
        theme === 'light' ? 'bg-white/80' : 'bg-black/75'
      } shadow-xl backdrop-blur-md transition-colors duration-300 select-none`}
    >
      <Languages className={`w-3.5 h-3.5 ml-1.5 mr-0.5 shrink-0 ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`} />

      <button
        type="button"
        onClick={() => handleSelect('kh')}
        className={`relative px-2.5 py-1 rounded-full text-xs font-semibold font-khmer z-10 transition-colors cursor-pointer ${
          currentLanguage === 'kh'
            ? 'text-neutral-950 font-bold'
            : theme === 'light'
            ? 'text-neutral-600 hover:text-neutral-900 hover:bg-black/5'
            : 'text-amber-200/70 hover:text-white hover:bg-white/10'
        }`}
        title="ភាសាខ្មែរ (Khmer)"
      >
        {currentLanguage === 'kh' && (
          <motion.div
            layoutId="lang-active-indicator"
            className="absolute inset-0 rounded-full bg-amber-400 shadow-md -z-10"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <span>ខ្មែរ</span>
      </button>

      <button
        type="button"
        onClick={() => handleSelect('en')}
        className={`relative px-2.5 py-1 rounded-full text-xs font-semibold font-sans z-10 transition-colors cursor-pointer ${
          currentLanguage === 'en'
            ? 'text-neutral-950 font-bold'
            : theme === 'light'
            ? 'text-neutral-600 hover:text-neutral-900 hover:bg-black/5'
            : 'text-amber-200/70 hover:text-white hover:bg-white/10'
        }`}
        title="English (EN)"
      >
        {currentLanguage === 'en' && (
          <motion.div
            layoutId="lang-active-indicator"
            className="absolute inset-0 rounded-full bg-amber-400 shadow-md -z-10"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <span>EN</span>
      </button>
    </div>
  );
}
