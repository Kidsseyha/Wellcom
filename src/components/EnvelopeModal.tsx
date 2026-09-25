import { ThemeMode } from "./ThemeToggle";
import { useState, useEffect, useRef, type FormEvent, type ChangeEvent, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Sparkles,
  MailOpen,
  Edit3,
  Check,
  X,
  User,
  UserPlus,
  ChevronDown,
  Users,
  Bookmark,
  Music,
  Volume2,
  VolumeX,
  Camera,
  Trash2,
  Globe,
} from 'lucide-react';
import { Language } from '../types';
import { getSavedGuests, GuestPreset } from '../data/guests';
import RoyalGoldRibbonBanner from './RoyalGoldRibbonBanner';
import IntertwinedRibbonHearts from './IntertwinedRibbonHearts';
import RingIcon from './RingIcon';
import BeautifulButterflies from './BeautifulButterflies';
import FloatingEngagementRingsAndSparkles from './FloatingEngagementRingsAndSparkles';
import FloatingBalloonsAndGifts from './FloatingBalloonsAndGifts';

interface EnvelopeModalProps {
  isOpen: boolean;
  onOpen: () => void;
  guestName: string;
  onUpdateGuestName?: (newName: string) => void;
  onOpenAddGuestModal?: () => void;
  groom: string;
  bride: string;
  groomEn?: string;
  brideEn?: string;
  singlePerson?: boolean;
  id?: string;
  eventType?: string;
  name?: string;
  language: Language;
  isAdmin?: boolean;
  coverBackground?: string;
  primaryColor?: string;
  textColor?: string;
  envelopeFrame?: string;
  envelopeHeaderImage?: string;
  onUpdateEnvelopeHeaderImage?: (url: string) => void;
  mainTitleKh?: string;
  mainTitleEn?: string;
  coverSubtitleKh?: string;
  coverSubtitleEn?: string;
  coverEnNameColor?: string;
  coverEnFontFamily?: string;
  guestNameColor?: string;
  guestNameFontFamily?: string;
  guestNameFontSize?: string;
  theme?: ThemeMode;
}

import { compressImageFile } from '../utils/imageCompressor';

// Compress image via canvas to prevent database quota errors
function compressImage(file: File, maxWidth = 800, maxHeight = 800, quality = 0.68): Promise<string> {
  return compressImageFile(file, { maxWidth, maxHeight, quality });
}

export default function EnvelopeModal({
  isOpen,
  onOpen,
  guestName,
  onUpdateGuestName,
  onOpenAddGuestModal,
  groom,
  bride,
  groomEn,
  brideEn,
  singlePerson,
  id,
  eventType,
  name,
  language,
  isAdmin = false,
  coverBackground,
  primaryColor = '#f5b80f',
  textColor = '#f5b80f',
  envelopeFrame,
  envelopeHeaderImage,
  onUpdateEnvelopeHeaderImage,
  mainTitleKh,
  mainTitleEn,
  coverSubtitleKh,
  coverSubtitleEn,
  coverEnNameColor,
  coverEnFontFamily,
  guestNameColor = '#364153',
  guestNameFontFamily,
  guestNameFontSize,
  theme = 'dark',
}: EnvelopeModalProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isEditingGuest, setIsEditingGuest] = useState(false);
  const [tempGuestName, setTempGuestName] = useState(guestName);
  const [savedGuestsList, setSavedGuestsList] = useState<GuestPreset[]>([]);
  const [currentGuestInfo, setCurrentGuestInfo] = useState<GuestPreset | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const eventTypeLower = (eventType || '').toLowerCase();
  const idLower = (id || '').toLowerCase();
  const nameLower = (name || '').toLowerCase();

  const isBirthday = eventTypeLower === 'birthday' || idLower.includes('birthday') || nameLower.includes('ខួប') || nameLower.includes('birthday');
  const isEngagement = eventTypeLower === 'engagement' || idLower.includes('engagement') || nameLower.includes('ភ្ជាប់ពាក្យ') || nameLower.includes('engage');
  const isHousewarming = eventTypeLower === 'housewarming' || idLower.includes('housewarming') || nameLower.includes('ឡើងផ្ទះ') || nameLower.includes('house');

  // Directly pull from ចំណងជើងធំ (Main Title) first, then coverSubtitleKh, with contextual fallbacks
  let subtitleKh = mainTitleKh?.trim() || coverSubtitleKh?.trim();
  if (!subtitleKh || (isBirthday && (subtitleKh === 'សូមគោរពអញ្ជើញ' || subtitleKh === 'សិរីសួស្តី អាពាហ៍ពិពាហ៍' || subtitleKh === 'រីករាយថ្ងៃកំណើត'))) {
    subtitleKh = isBirthday
      ? 'រីករាយពិធីខួបកំណើត'
      : isEngagement
      ? 'ពិធីភ្ជាប់ពាក្យ'
      : isHousewarming
      ? 'ពិធីឡើងគេហដ្ឋានថ្មី'
      : 'សិរីសួស្តី អាពាហ៍ពិពាហ៍';
  }

  if (subtitleKh === 'រីករាយថ្ងៃកំណើត') {
    subtitleKh = 'រីករាយពិធីខួបកំណើត';
  }

  const subtitleEn = mainTitleEn?.trim() || coverSubtitleEn?.trim() || (isBirthday
    ? 'HAPPY BIRTHDAY INVITATION'
    : isEngagement
    ? 'ENGAGEMENT INVITATION'
    : isHousewarming
    ? 'HOUSEWARMING INVITATION'
    : 'ROYAL WEDDING INVITATION');

  const headerImageInputRef = useRef<HTMLInputElement>(null);

  const handleHeaderImageClick = () => {
    if (isAdmin && onUpdateEnvelopeHeaderImage) {
      headerImageInputRef.current?.click();
    }
  };

  const handleHeaderImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onUpdateEnvelopeHeaderImage) {
      try {
        const compressedBase64 = await compressImage(files[0]);
        onUpdateEnvelopeHeaderImage(compressedBase64);
      } catch (err) {
        console.error('Error uploading envelope header image:', err);
      }
    }
  };

  const handleResetHeaderImage = (e: MouseEvent) => {
    e.stopPropagation();
    if (onUpdateEnvelopeHeaderImage) {
      onUpdateEnvelopeHeaderImage('none');
    }
  };

  useEffect(() => {
    const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
    if (audio) {
      setIsPlayingMusic(!audio.paused);
      const handlePlay = () => setIsPlayingMusic(true);
      const handlePause = () => setIsPlayingMusic(false);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, [isOpen]);

  const toggleMusicPlay = () => {
    const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
    if (!audio) return;
    if (audio.paused) {
      audio.muted = false;
      audio.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(err => {
        console.error('Audio play error:', err);
      });
    } else {
      audio.pause();
      setIsPlayingMusic(false);
    }
  };

  useEffect(() => {
    setTempGuestName(guestName);
    const guests = getSavedGuests();
    setSavedGuestsList(guests);
    const match = guests.find(g => g.name.toLowerCase() === (guestName || '').toLowerCase());
    setCurrentGuestInfo(match || null);
  }, [guestName, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const triggerAutoPlayMusic = () => {
    const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
    if (audio && audio.paused) {
      audio.muted = false;
      audio.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(() => {
        // autoplay restriction fallback
      });
    }
  };

  const handleSelectFromDropbox = (selectedName: string) => {
    if (!selectedName) return;
    if (selectedName === '__ADD_NEW__') {
      if (onOpenAddGuestModal) {
        onOpenAddGuestModal();
      } else {
        setIsEditingGuest(true);
      }
      return;
    }

    if (onUpdateGuestName) {
      onUpdateGuestName(selectedName);
    }
    const match = savedGuestsList.find(g => g.name === selectedName);
    setCurrentGuestInfo(match || null);
    setTempGuestName(selectedName);
  };

  const handleOpenInvitation = () => {
    const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
    if (audio) {
      audio.currentTime = 0;
      audio.muted = false;
      audio.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(err => {
        console.error('Audio play error:', err);
      });
    } else {
      triggerAutoPlayMusic();
    }
    setIsOpening(true);

    // Trigger golden celebratory confetti burst
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        colors: ['#f5b80f', '#d97706', '#fbbf24', '#fef3c7', '#f43f5e', '#ffffff'],
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } catch {
      // ignore
    }

    setTimeout(() => {
      onOpen();
    }, 800);
  };

  const handleSaveGuestName = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = tempGuestName.trim();
    if (trimmed) {
      if (onUpdateGuestName) {
        onUpdateGuestName(trimmed);
      }
    }
    setIsEditingGuest(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="envelope-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className={`fixed inset-0 z-40 overflow-y-auto scroll-smooth touch-auto ${theme === 'light' ? 'bg-gradient-to-b from-white via-amber-50 to-white' : theme === 'gray' ? 'bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950' : 'bg-gradient-to-b from-black via-black to-black'}`}
        >
          {/* Subtle Background Image Wallpaper with Blur */}
          {coverBackground && (
            <div
              className={`fixed inset-0 z-0 bg-cover bg-center ${theme === 'light' ? 'opacity-35' : 'opacity-45'} filter blur-[8px] pointer-events-none scale-110 transition-all duration-700`}
              style={{ backgroundImage: `url(${coverBackground})` }}
            />
          )}

          {/* Subtle Golden Particles Background */}
          <div className={`fixed inset-0 z-0 ${theme === 'light' ? 'opacity-10' : 'opacity-20'} pointer-events-none bg-[radial-gradient(#f5b80f_1px,transparent_1px)] [background-size:24px_24px]`} />

          <div className="min-h-screen w-full flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 md:p-8 py-8 sm:py-12 relative z-10">
            {/* Envelope Card Container */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={
                isOpening
                  ? { scale: [1, 1.04, 0.94], y: -50, opacity: [1, 1, 0] }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              transition={{
                duration: isOpening ? 0.75 : 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto my-auto rounded-3xl p-0.5 transition-shadow duration-500 ${
                theme === 'light'
                  ? 'bg-gradient-to-b from-amber-200 via-amber-400 to-amber-500 shadow-[0_20px_60px_rgba(245,184,15,0.25),0_8px_25px_rgba(0,0,0,0.08)]'
                  : 'bg-gradient-to-b from-amber-300/80 via-amber-500/60 to-amber-900/80 shadow-[0_30px_80px_rgba(0,0,0,0.7),0_0_40px_rgba(245,184,15,0.2)]'
              }`}
            >
              {/* Modern Invitation Card Body */}
              <div
                className={`relative rounded-3xl overflow-hidden py-10 sm:py-14 md:py-16 px-6 sm:px-10 md:px-14 min-h-[580px] sm:min-h-[660px] md:min-h-[720px] flex flex-col justify-between text-center border backdrop-blur-xl transition-all duration-300 ${
                  theme === 'light'
                    ? 'border-amber-300/70 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8),0_10px_35px_rgba(245,184,15,0.2)]'
                    : 'border-amber-400/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_15px_45px_rgba(0,0,0,0.5)]'
                }`}
              >
                {/* Crisp Cover Background Layer Inside Envelope Card */}
                {coverBackground && (
                  <div
                    className="absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-700"
                    style={{ backgroundImage: `url(${coverBackground})` }}
                  />
                )}

                {/* Refined Balanced Contrast Gradient Scrim */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity ${
                    theme === 'light'
                      ? 'bg-gradient-to-b from-white/40 via-amber-50/20 to-white/50'
                      : 'bg-gradient-to-b from-black/45 via-black/25 to-black/60'
                  }`}
                />

                {/* Corner Traditional Decorative Filigrees */}
                <div className="absolute top-3.5 left-3.5 w-10 h-10 border-t-2 border-l-2 border-amber-400/80 rounded-tl-xl pointer-events-none z-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]" />
                <div className="absolute top-3.5 right-3.5 w-10 h-10 border-t-2 border-r-2 border-amber-400/80 rounded-tr-xl pointer-events-none z-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]" />
                <div className="absolute bottom-3.5 left-3.5 w-10 h-10 border-b-2 border-l-2 border-amber-400/80 rounded-bl-xl pointer-events-none z-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]" />
                <div className="absolute bottom-3.5 right-3.5 w-10 h-10 border-b-2 border-r-2 border-amber-400/80 rounded-br-xl pointer-events-none z-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]" />

                {/* Floating Animations: Balloons for Birthday, Rings & Sparkles & Confetti for Engagement, Butterflies for Wedding */}
                {isBirthday ? (
                  <FloatingBalloonsAndGifts />
                ) : isEngagement ? (
                  <FloatingEngagementRingsAndSparkles />
                ) : (
                  <BeautifulButterflies />
                )}

                {/* Top Section */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center relative z-10"
                >
                  {/* Hidden File Input for Admin Direct Upload */}
                  {isAdmin && onUpdateEnvelopeHeaderImage && (
                    <input
                      type="file"
                      ref={headerImageInputRef}
                      accept="image/*"
                      onChange={handleHeaderImageChange}
                      className="hidden"
                    />
                  )}

                  {/* Curved Heading with Shimmer Animation */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex justify-center -mt-4 sm:-mt-6 mb-2 select-none w-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
                  >
                    <motion.svg
                      viewBox="0 0 340 100"
                      animate={{
                        y: [0, -5, 0, 3.5, 0],
                        rotate: [0, -1.2, 0, 1.2, 0],
                        scale: [1, 1.03, 1, 1.02, 1],
                      }}
                      transition={{
                        duration: 4.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="w-full max-w-[340px] h-auto overflow-visible"
                    >
                      <path
                        id="subtitleCurve"
                        d="M 20,85 Q 170,25 320,85"
                        fill="transparent"
                      />
                      <text
                        style={{
                          fill: textColor,
                          fontFamily: language === 'kh' ? 'Moul, Moulpali, serif' : 'Norican, cursive',
                          fontSize: '25px',
                          letterSpacing: '0.15em',
                          fontWeight: 'bold',
                        }}
                      >
                        <textPath href="#subtitleCurve" startOffset="50%" textAnchor="middle">
                          {language === 'kh' ? subtitleKh : subtitleEn}
                        </textPath>
                      </text>
                    </motion.svg>
                  </motion.div>

                  <div className="space-y-1">
                    <motion.h1
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.85, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                      style={{
                        color: language === 'kh' ? primaryColor : (coverEnNameColor || primaryColor),
                        fontSize: '23px',
                        fontWeight: 'normal',
                        fontFamily: language === 'en' && coverEnFontFamily ? coverEnFontFamily : undefined,
                      }}
                      className={`${language === 'kh' ? 'font-moul' : (!coverEnFontFamily ? 'font-norican capitalize' : 'capitalize')} text-[23px] py-1 leading-relaxed tracking-wide`}
                    >
                      <motion.span
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-block"
                      >
                        {language === 'kh'
                          ? (singlePerson ? groom : (bride ? `${groom} & ${bride}` : groom))
                          : (singlePerson ? (groomEn || groom) : (brideEn ? `${groomEn || groom} & ${brideEn}` : (groomEn || groom)))}
                      </motion.span>
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.85, delay: 0.38, ease: [0.25, 1, 0.5, 1] }}
                      style={{
                        color: language === 'kh' ? (coverEnNameColor || primaryColor || '#f5b80f') : textColor,
                        fontSize: '24px',
                        fontWeight: 'bold',
                        fontFamily: language === 'kh' && coverEnFontFamily ? coverEnFontFamily : undefined,
                      }}
                      className={`${language === 'kh' ? (!coverEnFontFamily ? 'font-norican capitalize' : 'capitalize') : 'font-moul'} text-[24px] font-bold opacity-90 leading-relaxed`}
                    >
                      <motion.span
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-block"
                      >
                        {language === 'kh'
                          ? (singlePerson ? (groomEn || groom) : (brideEn ? `${groomEn || groom} & ${brideEn}` : (groomEn || groom)))
                          : (singlePerson ? groom : (bride ? `${groom} & ${bride}` : groom))}
                      </motion.span>
                    </motion.p>
                  </div>

                  {/* Traditional Ornamental Divider with Subtle Pulsing */}
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '100%', opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.4 }}
                    className="flex items-center justify-center gap-3 my-5 sm:my-7"
                  >
                    <div className="h-[1.5px] w-20 sm:w-28 bg-gradient-to-r from-transparent via-amber-400 to-amber-300 shadow-[0_0_8px_rgba(245,184,15,0.6)]" />
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-[0_0_10px_rgba(245,184,15,0.8)] animate-pulse" style={{ color: primaryColor }} />
                    <div className="h-[1.5px] w-20 sm:w-28 bg-gradient-to-l from-transparent via-amber-400 to-amber-300 shadow-[0_0_8px_rgba(245,184,15,0.6)]" />
                  </motion.div>
                </motion.div>

                {/* Middle Section: Guest Card Recipient Frame */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 my-4 sm:my-6 text-center w-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
                >
                {!isEditingGuest ? (
                  <div className="space-y-3">
                    {/* Guest Selection Dropbox */}
                    {isAdmin && (
                      <div className="max-w-xs mx-auto mb-2">
                        <div className="relative">
                          <select
                            id="guest-dropbox-select"
                            value={savedGuestsList.some(g => g.name === guestName) ? guestName : ''}
                            onChange={e => handleSelectFromDropbox(e.target.value)}
                            className={`w-full pl-3 pr-8 py-1.5 rounded-lg ${theme === 'light' ? 'bg-white border-amber-300 text-amber-950 focus:border-amber-500' : 'bg-black/70 border-amber-500/40 text-amber-200 focus:border-amber-400 hover:border-amber-400/80'} border text-xs font-khmer focus:outline-none appearance-none cursor-pointer transition-all`}
                          >
                            <option value="" disabled>
                              {language === 'kh' ? '▼ ជ្រើសរើសឈ្មោះភ្ញៀវពី Drop box...' : '▼ Select Guest from Drop box...'}
                            </option>
                            {savedGuestsList.map((g, idx) => (
                              <option key={g.id ? `${g.id}-${idx}` : `env-guest-${idx}`} value={g.name} className={theme === 'light' ? 'bg-white text-amber-900 py-1' : 'bg-black text-amber-100 py-1'}>
                                {g.name} - {language === 'kh' ? g.categoryLabelKh : g.categoryLabelEn}
                              </option>
                            ))}
                            <option value="__ADD_NEW__" className={theme === 'light' ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-amber-950 text-amber-300 font-bold'}>
                              + {language === 'kh' ? 'Add ភ្ញៀវថ្មី / បន្ថែមឈ្មោះ...' : 'Add New Custom Guest...'}
                            </option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-amber-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    )}

                    {/* Royal Gold Ribbon / Custom Frame Banner for Guest */}
                    <div
                      className={`${isAdmin ? 'cursor-pointer group/name' : ''} transition-transform duration-300`}
                      onClick={() => {
                        if (!isAdmin) return;
                        if (onOpenAddGuestModal) {
                          onOpenAddGuestModal();
                        } else {
                          setTempGuestName(guestName);
                          setIsEditingGuest(true);
                        }
                      }}
                      title={isAdmin ? (language === 'kh' ? 'ចុចដើម្បី Add ភ្ញៀវ ឬកែប្រែឈ្មោះ' : 'Click to Add Guest or edit name') : undefined}
                    >
                      {envelopeFrame ? (
                        <div className="relative inline-flex items-center justify-center w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto group-hover/name:scale-[1.02] transition-transform duration-300">
                          {/* Custom or Preset Frame Background */}
                          <img
                            src={envelopeFrame}
                            alt="Guest Label Frame"
                            className="absolute inset-0 w-full h-full object-fill pointer-events-none drop-shadow-2xl"
                          />
                          {/* Content Centered Inside Frame */}
                          <div className="relative z-10 w-full pt-3 pb-4 sm:pt-3.5 sm:pb-5 px-10 sm:px-14 flex flex-col items-center justify-center text-center">
                            <span className="block text-[11px] sm:text-xs md:text-sm font-khmer font-semibold text-[#854d0e] mb-1 translate-y-0.5 sm:translate-y-0.5 tracking-wide drop-shadow-[0_1px_0_rgba(255,255,255,0.7)]">
                              {language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invited'}
                            </span>
                            <div className="text-lg sm:text-xl md:text-2xl font-moul text-[#172554] tracking-wide flex items-center justify-center gap-2.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] -mt-0.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#b47d10] shrink-0" />
                              <span
                                className="inline-flex items-center justify-center text-center truncate"
                                style={{
                                  fontSize: guestNameFontSize ? `${guestNameFontSize}px` : '20px',
                                  lineHeight: '30px',
                                  height: '35px',
                                  width: '302px',
                                  color: guestNameColor || undefined,
                                  fontFamily: guestNameFontFamily || undefined,
                                }}
                              >
                                {guestName && guestName !== 'Your Name'
                                  ? guestName
                                  : language === 'kh'
                                    ? 'ភ្ញៀវកិត្តិយស'
                                    : 'Honored Guest'}
                              </span>
                              <Sparkles className="w-3.5 h-3.5 text-[#b47d10] shrink-0" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <RoyalGoldRibbonBanner className="group-hover/name:scale-[1.02] transition-transform duration-300">
                          <span className="block text-[11px] sm:text-xs md:text-sm font-khmer font-semibold text-[#854d0e] mb-1 translate-y-0.5 sm:translate-y-0.5 tracking-wide drop-shadow-[0_1px_0_rgba(255,255,255,0.7)]">
                            {language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invited'}
                          </span>
                          <div className="text-lg sm:text-xl md:text-2xl font-moul text-[#172554] tracking-wide flex items-center justify-center gap-2.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] -mt-0.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#b47d10] shrink-0" />
                            <span
                              className="inline-flex items-center justify-center text-center truncate"
                              style={{
                                fontSize: guestNameFontSize ? `${guestNameFontSize}px` : '20px',
                                lineHeight: '30px',
                                height: '35px',
                                width: '302px',
                                color: guestNameColor || undefined,
                                fontFamily: guestNameFontFamily || undefined,
                              }}
                            >
                              {guestName && guestName !== 'Your Name'
                                ? guestName
                                : language === 'kh'
                                  ? 'ភ្ញៀវកិត្តិយស'
                                  : 'Honored Guest'}
                            </span>
                            <Sparkles className="w-3.5 h-3.5 text-[#b47d10] shrink-0" />
                          </div>
                        </RoyalGoldRibbonBanner>
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveGuestName} className={`space-y-2 py-2 px-4 rounded-2xl ${theme === 'light' ? 'bg-amber-100/50 border-amber-300' : 'bg-amber-950/60 border-amber-500/50'} border max-w-sm mx-auto`}>
                    <div className={`flex items-center justify-between text-xs font-khmer ${theme === 'light' ? 'text-amber-800' : 'text-amber-300'} font-semibold`}>
                      <span className="flex items-center gap-1">
                        <User className={`w-3 h-3 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                        <span>{language === 'kh' ? 'បញ្ចូលឈ្មោះភ្ញៀវកិត្តិយស' : 'Enter Guest Name'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditingGuest(false)}
                        className={`p-1 ${theme === 'light' ? 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5' : 'text-neutral-400 hover:text-white hover:bg-white/10'} rounded`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        id="guest-name-input"
                        type="text"
                        value={tempGuestName}
                        onChange={e => setTempGuestName(e.target.value)}
                        autoFocus
                        className={`flex-1 px-3 py-1.5 rounded-lg ${theme === 'light' ? 'bg-white border-amber-300 text-amber-950 focus:border-amber-500 focus:ring-amber-400 placeholder:text-neutral-400' : 'bg-black/70 border-amber-400 text-amber-100 focus:border-amber-300 focus:ring-amber-300 placeholder:text-neutral-500'} border font-moul text-sm text-center focus:outline-none focus:ring-1 placeholder:font-khmer`}
                        placeholder={language === 'kh' ? 'ឈ្មោះភ្ញៀវ...' : 'Guest name...'}
                      />
                      <button
                        id="save-guest-name-btn"
                        type="submit"
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 hover:from-amber-200 hover:to-amber-400 text-amber-950 font-moul text-xs font-bold flex items-center gap-1 shadow-md transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'kh' ? 'យល់ព្រម' : 'Save'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>

              {/* Bottom Section: Invitation Prompt, Music Control & Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex flex-col items-center"
              >
                {/* Invitation Prompt & Music Control */}
                <div style={{ transform: 'translateZ(32px)' }} className="relative z-10 flex items-center justify-center gap-2 mb-3">
                  <button
                    type="button"
                    id="envelope-play-music-btn"
                    onClick={toggleMusicPlay}
                    className={`px-3.5 py-1.5 rounded-full border text-xs font-khmer flex items-center gap-1.5 transition-all duration-300 shadow-md backdrop-blur-md ${
                      isPlayingMusic
                        ? 'bg-amber-400 text-amber-950 font-bold border-amber-300 ring-2 ring-amber-300/40 shadow-[0_0_15px_rgba(245,184,15,0.4)]'
                        : theme === 'light'
                        ? 'bg-white/70 hover:bg-amber-100 border-amber-300/70 text-amber-900 hover:text-amber-950'
                        : 'bg-black/60 hover:bg-amber-950/60 border-amber-500/40 text-amber-300 hover:text-white'
                    }`}
                    title={isPlayingMusic ? 'ផ្អាកតន្ត្រី / Pause Music' : 'ចាក់តន្ត្រី / Play Music'}
                  >
                    {isPlayingMusic ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        className="flex items-center"
                      >
                        <Music className="w-3.5 h-3.5 text-amber-950" />
                      </motion.div>
                    ) : (
                      <Volume2 className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`} />
                    )}
                    <span>{isPlayingMusic ? (language === 'kh' ? 'ផ្អាកតន្ត្រី' : 'Pause Music') : (language === 'kh' ? 'ចាក់តន្ត្រីមង្គលការ' : 'Play Music')}</span>
                  </button>
                </div>

                {/* Animated Prompt Text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  style={{
                    borderColor: '#000000',
                    fontWeight: 'bold',
                    fontSize: '13.5px',
                  }}
                  className={`relative z-10 ${theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'} font-khmer max-w-xs mx-auto mb-5 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]`}
                >
                  {language === 'kh'
                    ? 'សូមចុចប៊ូតុងខាងក្រោម ដើម្បីបើកលិខិតអញ្ជើញ និងទទួលស្តាប់តន្ត្រីមង្គលការ'
                    : 'Tap below to unseal your invitation and enjoy the celebration'}
                </motion.p>

                {/* Action Button */}
                <div className="relative z-10 w-full flex flex-col items-center">
                  <motion.button
                    id="open-invitation-btn"
                    onClick={handleOpenInvitation}
                    onTap={handleOpenInvitation}
                    disabled={isOpening}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="relative group w-full py-4 px-6 rounded-2xl font-moul text-sm sm:text-base text-amber-950 font-bold bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.4)] hover:shadow-[0_14px_40px_rgba(245,158,11,0.55)] border-2 border-amber-200/90 flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden cursor-pointer active:scale-95 ring-2 ring-amber-400/50"
                  >
                    {/* Dynamic Shimmer Light Reflection Sweep */}
                    <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

                    {/* Wax Seal Badge Icon */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-200 to-amber-400 border border-amber-100 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <MailOpen className="w-4 h-4 text-amber-950" />
                    </div>
                    <span className="text-amber-950 font-bold tracking-wide drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">
                      {language === 'kh' ? 'បើកសំបុត្រអញ្ជើញ' : 'Open Invitation'}
                    </span>
                    <span className="text-xs opacity-80 font-sans font-bold text-amber-900 ml-1 group-hover:translate-y-0.5 transition-transform">
                      ↓
                    </span>
                  </motion.button>
                </div>

                {/* Firebase Authorized Domain Badge for Vercel */}
                <div className="mt-4 pt-2.5 border-t border-amber-400/20 w-full flex items-center justify-between text-[10px] font-mono">
                  <a
                    href="https://wellcom-olive.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-amber-300/90 hover:text-amber-200 truncate transition-colors"
                  >
                    <Globe className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">wellcom-olive.vercel.app</span>
                  </a>
                  <span className="inline-flex items-center gap-1 text-[9.5px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 font-khmer">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {language === 'kh' ? 'Firebase Console Domain' : 'Firebase Domain'}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
