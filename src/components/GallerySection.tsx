import { ThemeMode } from "./ThemeToggle";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Language } from '../types';

interface GallerySectionProps {
  photos: string[];
  language: Language;
  primaryColor?: string;
  textColor?: string;
  theme?: ThemeMode;
  eventType?: string;
}

export default function GallerySection({
  photos,
  language,
  primaryColor = '#f5b80f',
  textColor = '#f5b80f',
  theme = 'dark',
  eventType = 'wedding',
}: GallerySectionProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const getBadgeTitle = () => {
    switch (eventType) {
      case 'birthday':
        return language === 'kh' ? 'កម្រងរូបភាពខួបកំណើត' : 'Birthday Gallery';
      case 'housewarming':
        return language === 'kh' ? 'កម្រងរូបភាពឡើងផ្ទះ' : 'Housewarming Gallery';
      case 'engagement':
        return language === 'kh' ? 'កម្រងរូបភាពភ្ជាប់ពាក្យ' : 'Engagement Gallery';
      case 'wedding':
      default:
        return language === 'kh' ? 'កម្រងរូបភាពអនុស្សាវរីយ៍' : 'Pre-Wedding Memories';
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') setSelectedIdx(null);
      if (e.key === 'ArrowRight') {
        setSelectedIdx(prev => (prev !== null ? (prev + 1) % photos.length : 0));
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIdx(prev => (prev !== null ? (prev - 1 + photos.length) % photos.length : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx, photos.length]);

  return (
    <section id="gallery-section" className="py-10 px-3 sm:px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl mx-auto"
      >
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${theme === 'light' ? 'bg-amber-100/70 border-amber-300/60 shadow-sm' : 'bg-amber-950/40 border-amber-500/30'} border text-xs font-khmer mb-2.5`}>
          <Camera className="w-4 h-4" style={{ color: primaryColor }} />
          <span className="font-bold" style={{ color: primaryColor }}>{getBadgeTitle()}</span>
        </div>

        <h2
          style={{ color: primaryColor }}
          className="text-xl sm:text-2xl font-moul mb-6 drop-shadow-sm"
        >
          {language === 'kh' ? 'កម្រងរូបភាព' : 'PHOTO GALLERY'}
        </h2>

        {/* Enlarged Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {photos.map((photo, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedIdx(idx)}
              className={`group relative aspect-[4/5] min-h-[280px] sm:min-h-[360px] rounded-2xl overflow-hidden ${
                theme === 'light'
                  ? 'border-2 border-amber-400/80 bg-amber-50/60 shadow-[0_8px_30px_rgba(217,119,6,0.15)] ring-1 ring-amber-300/40'
                  : 'border-2 border-amber-500/40 bg-neutral-950/80 shadow-[0_8px_30px_rgba(0,0,0,0.7)] ring-1 ring-amber-400/20'
              } cursor-pointer transition-all duration-300`}
            >
              <img
                src={photo}
                alt={`Pre-wedding photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Elegant golden gradient overlay at base */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

              {/* Photo Index Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md text-amber-300 border border-amber-400/30 text-xs font-mono font-bold shadow-md">
                #{idx + 1}
              </div>

              {/* Hover Zoom Indicator */}
              <div className={`absolute inset-0 ${theme === 'light' ? 'bg-amber-950/20' : 'bg-black/30'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center`}>
                <div className="w-12 h-12 rounded-2xl bg-amber-400/90 text-amber-950 backdrop-blur-sm flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 text-center">
          <p className={`text-xs ${theme === 'light' ? 'text-amber-900/80 font-medium' : 'text-neutral-400'} font-khmer`}>
            {language === 'kh' ? '🔍 ចុចលើរូបភាពដើម្បីមើលទំហំធំពេញអេក្រង់ (Click to view full size)' : '🔍 Click any photo to view full size'}
          </p>
        </div>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedIdx(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIdx(null)}
              className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Prev Button */}
            <button
              onClick={e => {
                e.stopPropagation();
                setSelectedIdx((selectedIdx - 1 + photos.length) % photos.length);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-amber-300 border border-amber-500/30 transition-colors"
              title="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image Container */}
            <motion.div
              key={selectedIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-lg max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={photos[selectedIdx]}
                alt={`Photo ${selectedIdx + 1}`}
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
              />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/70 text-amber-300 text-xs font-mono border border-amber-400/20">
                {selectedIdx + 1} / {photos.length}
              </div>
            </motion.div>

            {/* Right Next Button */}
            <button
              onClick={e => {
                e.stopPropagation();
                setSelectedIdx((selectedIdx + 1) % photos.length);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-amber-300 border border-amber-500/30 transition-colors"
              title="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
