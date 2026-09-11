import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Language } from '../types';

interface GallerySectionProps {
  photos: string[];
  language: Language;
  primaryColor?: string;
  textColor?: string;
}

export default function GallerySection({
  photos,
  language,
  primaryColor = '#f5b80f',
  textColor = '#f5b80f',
}: GallerySectionProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

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
    <section id="gallery-section" className="py-8 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-xs font-khmer mb-2">
          <Camera className="w-3.5 h-3.5" style={{ color: primaryColor }} />
          <span style={{ color: primaryColor }}>{language === 'kh' ? 'កម្រងរូបភាពអនុស្សាវរីយ៍' : 'Pre-Wedding Memories'}</span>
        </div>

        <h2
          style={{ color: primaryColor }}
          className="text-xl font-moul mb-6"
        >
          {language === 'kh' ? 'កម្រងរូបភាព' : 'PHOTO GALLERY'}
        </h2>

        {/* 2x2 Photo Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {photos.map((photo, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedIdx(idx)}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-amber-500/30 bg-black/50 shadow-md cursor-pointer"
            >
              <img
                src={photo}
                alt={`Pre-wedding photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-amber-400/80 text-amber-950 flex items-center justify-center shadow-lg">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-neutral-400 font-khmer">
            {language === 'kh' ? 'ចុចលើរូបភាពដើម្បីមើលទំហំធំ' : 'Click any photo to view full size'}
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
