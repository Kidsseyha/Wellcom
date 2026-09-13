import { ThemeMode } from "./ThemeToggle";
import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Copy, Check, ExternalLink } from 'lucide-react';
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
          style={{ color: textColor, fontSize: '20px' }}
          className={`text-[20px] font-khmer leading-relaxed px-2 mb-6 ${theme === 'light' ? 'opacity-80' : 'opacity-90'}`}
        >
          {displayLocation}
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.a
            id="view-google-map-btn"
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`w-full sm:flex-1 py-3 px-5 rounded-xl font-moul text-xs sm:text-sm text-amber-950 font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 border border-amber-200 shadow-lg ${theme === 'light' ? 'shadow-[0_4px_15px_rgba(245,184,15,0.3)]' : 'shadow-amber-950/40'} flex items-center justify-center gap-2`}
          >
            <Navigation className="w-4 h-4 fill-amber-950" />
            <span>{language === 'kh' ? 'មើលក្នុង Google Map' : 'View in Google Maps'}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </motion.a>

          <button
            id="copy-address-btn"
            onClick={handleCopyAddress}
            className={`w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-semibold font-khmer ${theme === 'light' ? 'bg-white hover:bg-amber-50 text-amber-700 border-amber-300' : 'bg-amber-950/40 hover:bg-amber-900/40 text-amber-200 border-amber-500/30'} border flex items-center justify-center gap-2 transition-all`}
          >
            {copied ? (
              <>
                <Check className={`w-4 h-4 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                <span className={theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'}>{language === 'kh' ? 'បានចម្លង!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className={`w-4 h-4 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                <span>{language === 'kh' ? 'ចម្លងតំណភ្ជាប់' : 'Copy Map Link'}</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
