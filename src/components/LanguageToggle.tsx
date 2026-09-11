import { Languages } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';

interface LanguageToggleProps {
  currentLanguage: Language;
  onToggle: () => void;
}

export default function LanguageToggle({ currentLanguage, onToggle }: LanguageToggleProps) {
  return (
    <motion.button
      id="toggle-language-btn"
      onClick={onToggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-amber-400/40 bg-black/70 text-amber-200 shadow-xl backdrop-blur-md hover:bg-amber-950/80 hover:border-amber-400 transition-all duration-300"
      title={currentLanguage === 'kh' ? 'ប្តូរភាសា / Switch Language' : 'Switch Language'}
    >
      <Languages className="w-4 h-4 text-amber-400" />
      <span className="text-xs font-semibold tracking-wider font-khmer">
        {currentLanguage === 'kh' ? 'ខ្មែរ | EN' : 'EN | ខ្មែរ'}
      </span>
    </motion.button>
  );
}
