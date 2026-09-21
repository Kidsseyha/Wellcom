import { ThemeMode } from "./ThemeToggle";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2, Grid, LayoutGrid, Layers, RefreshCw } from 'lucide-react';
import { Language } from '../types';

interface GallerySectionProps {
  photos: string[];
  gallery_photo_captions?: string[];
  language: Language;
  primaryColor?: string;
  textColor?: string;
  theme?: ThemeMode;
  eventType?: string;
  defaultLayoutStyle?: 'bento' | 'grid' | 'alternating' | 'carousel' | 'masonry' | 'polaroid-grid' | 'circular' | 'filmstrip';
}

export default function GallerySection({
  photos,
  gallery_photo_captions = [],
  language,
  primaryColor = '#f5b80f',
  textColor = '#f5b80f',
  theme = 'dark',
  eventType = 'wedding',
  defaultLayoutStyle = 'bento',
}: GallerySectionProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [layoutStyle, setLayoutStyle] = useState<'bento' | 'grid' | 'alternating' | 'carousel' | 'masonry' | 'polaroid-grid' | 'circular' | 'filmstrip'>(defaultLayoutStyle);

  useEffect(() => {
    if (defaultLayoutStyle) {
      setLayoutStyle(defaultLayoutStyle);
    }
  }, [defaultLayoutStyle]);

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
        className="w-full max-w-5xl mx-auto px-2"
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

        {/* 1. Bento Collage Layout */}
        {layoutStyle === 'bento' && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {photos.map((photo, idx) => {
              // Pattern: Row 1 has Big (#1) + Small (#2); Row 2 has Small (#3) + Big (#4)
              const isBig = Math.floor(idx / 2) % 2 === 0 ? (idx % 2 === 0) : (idx % 2 !== 0);
              const colSpanClass = isBig ? 'col-span-2' : 'col-span-1';
              const aspectClass = isBig ? 'aspect-[8/5]' : 'aspect-[4/5]';

              return (
                <motion.div
                  key={idx}
                  layoutId={`gallery-photo-bento-${idx}`}
                  whileHover={{ scale: 1.025, y: -3 }}
                  whileTap={{ scale: 0.975 }}
                  onClick={() => setSelectedIdx(idx)}
                  className={`${colSpanClass} ${aspectClass} group relative rounded-2xl overflow-hidden ${
                    theme === 'light'
                      ? 'border-2 border-amber-400/80 bg-amber-50/60 shadow-[0_8px_30px_rgba(217,119,6,0.15)] ring-1 ring-amber-300/40'
                      : 'border border-amber-500/30 bg-neutral-950/80 shadow-[0_8px_30px_rgba(0,0,0,0.7)] ring-1 ring-amber-400/10'
                  } cursor-pointer transition-all duration-300`}
                >
                  <img
                    src={photo}
                    alt={`Pre-wedding photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Elegant golden gradient overlay at base */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-300" />

                  {/* Elegant Caption Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/20 shadow">
                    <span className="font-moul text-[9px] sm:text-xs text-amber-300 tracking-wide text-center line-clamp-1">
                      {gallery_photo_captions[idx] || (language === 'kh' ? `រូបភាពអនុស្សាវរីយ៍ទី ${idx + 1}` : `Memory Frame #${idx + 1}`)}
                    </span>
                  </div>

                  {/* Photo Index Badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/20 text-[10px] sm:text-xs font-mono font-bold shadow">
                    #{idx + 1}
                  </div>

                  {/* Hover Zoom Indicator */}
                  <div className={`absolute inset-0 ${theme === 'light' ? 'bg-amber-950/20' : 'bg-black/35'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center`}>
                    <div className="w-10 h-10 rounded-xl bg-amber-400/90 text-amber-950 backdrop-blur-sm flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* 2. Elegant Symmetrical Grid */}
        {layoutStyle === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {photos.map((photo, idx) => (
              <motion.div
                key={idx}
                layoutId={`gallery-photo-grid-${idx}`}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedIdx(idx)}
                className={`group relative aspect-square rounded-2xl overflow-hidden ${
                  theme === 'light'
                    ? 'border-2 border-amber-400/80 bg-amber-50/60 shadow-[0_8px_30px_rgba(217,119,6,0.15)] ring-1 ring-amber-300/40'
                    : 'border border-amber-500/30 bg-neutral-950/80 shadow-[0_8px_30px_rgba(0,0,0,0.7)] ring-1 ring-amber-400/10'
                } cursor-pointer transition-all duration-300`}
              >
                <img
                  src={photo}
                  alt={`Pre-wedding photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Elegant golden gradient overlay at base */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-300" />

                {/* Elegant Caption Overlay */}
                <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/20 shadow">
                  <span className="font-moul text-[9px] sm:text-xs text-amber-300 tracking-wide text-center line-clamp-1">
                    {gallery_photo_captions[idx] || (language === 'kh' ? `រូបភាពអនុស្សាវរីយ៍ទី ${idx + 1}` : `Memory Frame #${idx + 1}`)}
                  </span>
                </div>

                {/* Photo Index Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/20 text-[10px] sm:text-xs font-mono font-bold shadow">
                  #{idx + 1}
                </div>

                {/* Hover Zoom Indicator */}
                <div className={`absolute inset-0 ${theme === 'light' ? 'bg-amber-950/20' : 'bg-black/35'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center`}>
                  <div className="w-10 h-10 rounded-xl bg-amber-400/90 text-amber-950 backdrop-blur-sm flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 3. Alternating Flow Layout */}
        {layoutStyle === 'alternating' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {photos.map((photo, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={idx}
                  layoutId={`gallery-photo-alt-${idx}`}
                  whileHover={{ scale: 1.02, rotate: isEven ? 1 : -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedIdx(idx)}
                  className={`group cursor-pointer p-4 rounded-3xl transition-all duration-500 ${
                    theme === 'light'
                      ? 'bg-gradient-to-b from-amber-50 to-white border-2 border-amber-200 shadow-xl'
                      : 'bg-gradient-to-b from-neutral-900 to-neutral-950 border border-amber-500/20 shadow-[0_15px_40px_rgba(0,0,0,0.6)]'
                  } ${isEven ? 'md:translate-y-4' : 'md:-translate-y-4'}`}
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <img
                      src={photo}
                      alt={`Pre-wedding photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/20 text-[10px] sm:text-xs font-mono font-bold shadow">
                      #{idx + 1}
                    </div>
                  </div>
                  
                  {/* Styled Footer for Alternative Style */}
                  <div className="mt-3 text-center">
                    <span className="font-moul text-xs sm:text-sm tracking-wide" style={{ color: primaryColor }}>
                      {gallery_photo_captions[idx] || (language === 'kh' ? `រូបភាពអនុស្សាវរីយ៍ទី ${idx + 1}` : `Memory Frame #${idx + 1}`)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* 4. Interactive Slide-Show Carousel */}
        {layoutStyle === 'carousel' && (
          <div className="relative max-w-2xl mx-auto px-4 py-2">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  const current = selectedIdx !== null ? selectedIdx : 0;
                  setSelectedIdx((current - 1 + photos.length) % photos.length);
                }}
                className={`p-3 rounded-full border shadow-lg transition-all duration-300 ${
                  theme === 'light' 
                    ? 'bg-white hover:bg-amber-100 text-amber-900 border-amber-300' 
                    : 'bg-neutral-900 hover:bg-neutral-800 text-amber-400 border-amber-500/30'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="relative w-full max-w-sm aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl border-2 border-amber-500/30 bg-neutral-950">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedIdx ?? 0}
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => setSelectedIdx(selectedIdx ?? 0)}
                  >
                    <img
                      src={photos[selectedIdx ?? 0]}
                      alt="Carousel memory"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    
                    {/* Indicator Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 text-amber-300 font-mono text-xs border border-amber-500/30">
                      {language === 'kh' ? 'រូបថតទី ' : 'Photo '} {(selectedIdx ?? 0) + 1} / {photos.length}
                    </div>
                    
                    {/* Elegant Caption Overlay */}
                    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center justify-center w-5/6 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/20 shadow">
                      <span className="font-moul text-[9px] sm:text-xs text-amber-300 tracking-wide text-center line-clamp-1">
                        {gallery_photo_captions[selectedIdx ?? 0] || (language === 'kh' ? `រូបភាពអនុស្សាវរីយ៍ទី ${(selectedIdx ?? 0) + 1}` : `Memory Frame #${(selectedIdx ?? 0) + 1}`)}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                      <Maximize2 className="w-3 text-amber-300 animate-pulse" />
                      <span className="text-[10px] text-white font-khmer">{language === 'kh' ? 'ចុចពង្រីកធំ' : 'Click to Zoom'}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <button
                onClick={() => {
                  const current = selectedIdx !== null ? selectedIdx : 0;
                  setSelectedIdx((current + 1) % photos.length);
                }}
                className={`p-3 rounded-full border shadow-lg transition-all duration-300 ${
                  theme === 'light' 
                    ? 'bg-white hover:bg-amber-100 text-amber-900 border-amber-300' 
                    : 'bg-neutral-900 hover:bg-neutral-800 text-amber-400 border-amber-500/30'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Carousel Dot Indicators */}
            <div className="flex justify-center gap-1.5 mt-5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIdx(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    (selectedIdx ?? 0) === i 
                      ? 'bg-amber-500 w-6' 
                      : theme === 'light' ? 'bg-amber-200' : 'bg-neutral-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* 5. Classic Masonry Column Flow */}
        {layoutStyle === 'masonry' && (
          <div className="columns-2 md:columns-3 gap-3 sm:gap-4 md:gap-5 space-y-3 sm:space-y-4 md:space-y-5 max-w-5xl mx-auto">
            {photos.map((photo, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.025, y: -2 }}
                whileTap={{ scale: 0.975 }}
                onClick={() => setSelectedIdx(idx)}
                className={`break-inside-avoid relative rounded-2xl overflow-hidden cursor-pointer ${
                  theme === 'light'
                    ? 'border-2 border-amber-400/80 bg-amber-50/60 shadow-lg'
                    : 'border border-amber-500/20 bg-neutral-950/80 shadow-2xl'
                }`}
              >
                <img
                  src={photo}
                  alt={`Masonry photo ${idx + 1}`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-65" />
                <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-amber-500/20 shadow">
                  <span className="font-moul text-[9px] sm:text-xs text-amber-300 text-center line-clamp-1">
                    {gallery_photo_captions[idx] || (language === 'kh' ? `រូបភាពអនុស្សាវរីយ៍ទី ${idx + 1}` : `Memory Frame #${idx + 1}`)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 6. Physical Polaroid Grid style */}
        {layoutStyle === 'polaroid-grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {photos.map((photo, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03, rotate: idx % 2 === 0 ? 1 : -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedIdx(idx)}
                className={`p-3 pb-8 rounded-lg shadow-2xl border transition-all duration-300 cursor-pointer text-center ${
                  theme === 'light'
                    ? 'bg-amber-50/40 border-amber-200 shadow-amber-900/10'
                    : 'bg-neutral-900 border-amber-500/20 shadow-black shadow-[0_15px_30px_rgba(0,0,0,0.6)]'
                }`}
              >
                <div className="aspect-square rounded overflow-hidden relative">
                  <img
                    src={photo}
                    alt={`Polaroid photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/5" />
                </div>
                <div className="mt-4 px-1.5">
                  <p className="font-moul text-xs text-amber-400 font-bold tracking-wide break-words line-clamp-2">
                    {gallery_photo_captions[idx] || (language === 'kh' ? `រូបភាពអនុស្សាវរីយ៍ទី ${idx + 1}` : `Memory Frame #${idx + 1}`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 7. Circular / Oval Frame Layout with golden borders */}
        {layoutStyle === 'circular' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {photos.map((photo, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedIdx(idx)}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className={`relative aspect-[3/4] w-full rounded-[100px] overflow-hidden border-4 ${
                  theme === 'light' ? 'border-amber-400 shadow-xl' : 'border-amber-500/40 shadow-2xl'
                } bg-neutral-950`}>
                  <img
                    src={photo}
                    alt={`Circular frame photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50" />
                </div>
                <p className="mt-3 font-moul text-xs text-amber-400 text-center px-1 line-clamp-1 max-w-[90%]">
                  {gallery_photo_captions[idx] || (language === 'kh' ? `រូបភាពអនុស្សាវរីយ៍ទី ${idx + 1}` : `Memory Frame #${idx + 1}`)}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* 8. Retro Filmstrip Layout */}
        {layoutStyle === 'filmstrip' && (
          <div className="relative w-full overflow-x-auto py-4 scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-transparent">
            <div className="flex gap-4 px-4 min-w-max">
              {photos.map((photo, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.025, y: -3 }}
                  whileTap={{ scale: 0.975 }}
                  onClick={() => setSelectedIdx(idx)}
                  className="relative w-64 aspect-[4/3] bg-neutral-950 p-2 border-y-8 border-black border-dashed flex flex-col justify-between cursor-pointer rounded-md shadow-2xl"
                >
                  <div className="w-full h-full overflow-hidden rounded relative">
                    <img
                      src={photo}
                      alt={`Filmstrip photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col items-center bg-black/70 px-2 py-1 rounded-lg border border-amber-500/20">
                    <span className="font-moul text-[9px] text-amber-300 tracking-wide text-center line-clamp-1">
                      {gallery_photo_captions[idx] || (language === 'kh' ? `រូបភាពអនុស្សាវរីយ៍ទី ${idx + 1}` : `Memory Frame #${idx + 1}`)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

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
              className="relative max-w-4xl w-full max-h-[90vh] md:max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 bg-black/40"
              onClick={e => e.stopPropagation()}
            >
               {/* Small Close Icon Button near the picture */}
               <button
                 onClick={() => setSelectedIdx(null)}
                 className="absolute top-3 right-3 z-50 p-2 rounded-full bg-black/70 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 border border-amber-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                 title="Close"
               >
                 <X className="w-5 h-5" />
               </button>

               <img
                 src={photos[selectedIdx]}
                 alt={`Photo ${selectedIdx + 1}`}
                 className="w-full h-auto max-h-[90vh] md:max-h-[85vh] object-contain rounded-2xl mx-auto"
                 referrerPolicy="no-referrer"
               />
               {/* Elegant Lightbox Caption */}
               <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-xl bg-black/80 text-amber-300 text-xs font-moul border border-amber-400/20 shadow-lg text-center max-w-[85%] line-clamp-1">
                 {gallery_photo_captions[selectedIdx] || (language === 'kh' ? `រូបភាពអនុស្សាវរីយ៍ទី ${selectedIdx + 1}` : `Memory Frame #${selectedIdx + 1}`)}
               </div>

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
