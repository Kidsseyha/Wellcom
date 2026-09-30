import { ThemeMode } from "./ThemeToggle";
import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Copy, Check, ExternalLink, Edit3 } from 'lucide-react';
import { Language } from '../types';

interface LocationSectionProps {
  locationNameKh: string;
  locationNameEn: string;
  mapImageUrl: string;
  mapUrl: string;
  language: Language;
  primaryColor?: string;
  textColor?: string;
  theme?: ThemeMode;
  onEditLocation?: () => void;
}

export default function LocationSection({
  locationNameKh,
  locationNameEn,
  mapImageUrl,
  mapUrl,
  language,
  primaryColor = '#f5b80f',
  textColor = '#f5b80f',
  theme = 'dark',
  onEditLocation,
}: LocationSectionProps) {
  const [copied, setCopied] = useState(false);

  const displayLocation = language === 'kh' ? locationNameKh : locationNameEn;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(mapUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="location-section" className="py-8 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme === 'light' ? 'bg-amber-100/60 border-amber-300/50' : 'bg-amber-950/40 border-amber-500/30'} border text-xs font-khmer mb-2`}>
          <MapPin className="w-3.5 h-3.5" style={{ color: primaryColor }} />
          <span style={{ color: primaryColor }}>{language === 'kh' ? 'ទីតាំងរៀបចំពិធី' : 'Wedding Venue'}</span>
        </div>

        <h2
          style={{ color: primaryColor }}
          className="text-xl font-moul mb-2"
        >
          {language === 'kh' ? 'ទីតាំងកម្មវិធី' : 'EVENT LOCATION'}
        </h2>

        <p
          onClick={onEditLocation}
          style={{ color: textColor, fontSize: '20px' }}
          className={`text-[20px] font-khmer leading-relaxed px-3 py-1 mb-6 inline-flex items-center justify-center gap-2 rounded-xl transition-all ${
            onEditLocation
              ? 'cursor-pointer hover:bg-amber-400/10 active:scale-95 group'
              : ''
          } ${theme === 'light' ? 'opacity-80 hover:opacity-100' : 'opacity-90 hover:opacity-100'}`}
          title={onEditLocation ? (language === 'kh' ? 'ចុចដើម្បីកែប្រែទីតាំង / Click to edit location' : 'Click to edit location') : undefined}
        >
          <span>{displayLocation}</span>
          {onEditLocation && (
            <Edit3 className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          )}
        </p>

        {/* Venue Image / Map Preview with interactive frame */}
        <div className={`relative rounded-2xl overflow-hidden border-2 ${theme === 'light' ? 'border-amber-300 shadow-[0_8px_30px_rgba(0,0,0,0.1)] bg-amber-50' : 'border-amber-500/40 shadow-xl shadow-black/40 bg-black/40'} group mb-6`}>
          <img
            src={mapImageUrl}
            alt="Venue Map"
            className="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
            <div className="text-left">
              <span className="text-xs font-bold text-amber-300 font-khmer block">
                {displayLocation}
              </span>
              <span className="text-[11px] text-neutral-300">
                {language === 'kh' ? 'ចុចប៊ូតុងខាងក្រោមដើម្បីបើកផែនទី' : 'Tap below to open Google Maps'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons with Authentic Kbach Khmer Label Styling */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.a
            id="view-google-map-btn"
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            className="group relative w-full sm:flex-1 py-3 px-5 rounded-2xl text-sm sm:text-base text-amber-950 font-bold bg-gradient-to-r from-[#ffeaa7] via-[#f5b80f] to-[#e6a100] border-2 border-amber-200/90 shadow-[0_6px_20px_rgba(245,184,15,0.4)] flex items-center justify-center gap-2.5 overflow-hidden transition-all duration-300 select-none cursor-pointer"
            style={{ fontFamily: "'Bokor', 'Khmer OS Bokor', cursive" }}
          >
            {/* Shimmer sweep */}
            <div className="pointer-events-none absolute inset-0 z-[1] -translate-x-[100%] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />

            <Navigation className="relative z-[2] w-4 h-4 fill-amber-950 text-amber-950 shrink-0" />
            <span
              className="relative z-[2] tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]"
              style={{ fontFamily: "'Bokor', 'Khmer OS Bokor', cursive" }}
            >
              {language === 'kh' ? 'មើលក្នុង Google Map' : 'View in Google Maps'}
            </span>
            <ExternalLink className="relative z-[2] w-3.5 h-3.5 opacity-85 shrink-0" />
          </motion.a>

          {/* Kbach Khmer Label Button */}
          <motion.button
            id="copy-address-btn"
            type="button"
            onClick={handleCopyAddress}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            className={`group relative w-full sm:w-auto py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold font-khmer border-2 flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer select-none overflow-hidden ${
              copied
                ? 'bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-emerald-200 border-emerald-400 shadow-[0_4px_16px_rgba(16,185,129,0.35)]'
                : theme === 'light'
                ? 'bg-gradient-to-r from-amber-50 via-white to-amber-50 text-amber-950 border-amber-400/80 shadow-[0_4px_16px_rgba(245,184,15,0.2)] hover:border-amber-500'
                : 'bg-gradient-to-r from-[#1c140a] via-[#2d1e0f] to-[#1c140a] text-amber-200 border-amber-400/70 shadow-[0_4px_18px_rgba(0,0,0,0.5)] hover:border-amber-300'
            }`}
          >
            {/* Shimmer sweep */}
            <div className="pointer-events-none absolute inset-0 z-[1] -translate-x-[100%] bg-gradient-to-r from-transparent via-amber-200/30 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />

            {/* Left Micro Kbach Scroll */}
            <svg
              viewBox="0 0 24 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-[2] w-4 h-auto text-amber-500/80 shrink-0"
            >
              <path
                d="M 20 8 C 12 8, 8 2, 4 4 C 1 6, 2 12, 6 13 C 12 14, 14 8, 22 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            {copied ? (
              <span className="relative z-[2] flex items-center gap-1.5 font-bold text-emerald-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{language === 'kh' ? 'បានចម្លង!' : 'Copied!'}</span>
              </span>
            ) : (
              <span className="relative z-[2] flex items-center gap-1.5 font-bold tracking-wide">
                <Copy className={`w-4 h-4 ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'} group-hover:scale-110 transition-transform`} />
                <span>{language === 'kh' ? 'ចម្លងតំណភ្ជាប់' : 'Copy Map Link'}</span>
              </span>
            )}

            {/* Right Micro Kbach Scroll (Mirrored) */}
            <svg
              viewBox="0 0 24 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-[2] w-4 h-auto text-amber-500/80 shrink-0 scale-x-[-1]"
            >
              <path
                d="M 20 8 C 12 8, 8 2, 4 4 C 1 6, 2 12, 6 13 C 12 14, 14 8, 22 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
