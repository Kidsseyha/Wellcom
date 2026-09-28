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
  SkipForward,
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
import weddingArchBg from '../assets/images/wedding_arch_bg_1790321830759.jpg';
const khmerRoyalGoldWeddingCover = '/assets/images/white_arch_columns_wedding_cover_1790394461049.jpg';
import {
  KhmerCornerKbach,
  RoyalWeddingMonogram,
  KhmerDividerKbach,
  RoyalWaxSealEmblem,
  CameoFloralWeddingEmblem,
  KhmerWeddingTitleWithBotanicalFlourish,
  HangingGarlandsOverlay,
  VintageScallopedGuestPlaque,
  KhmerRoyalGoldenGuestPlaque,
  AngkorTemplePillarsOverlay,
  RomanticRoseGardenArchOverlay,
  RoseGoldAnniversaryCalligraphy,
  RoseGoldOrnateGuestPlaque,
  TheapKhmerTemplate1WaxSeal,
  TheapKhmerBotanicalBranches,
  TheapKhmerCover1ArchOverlay,
  RoseGoldBeveledOpenButton,
  KhmerGoldenTeardropLocket,
  GoldenGlitterPlayButton,
  CircularPlayOpenButton,
  FiligreeGoldOrnamentDivider,
  FiligreeGoldCircularMonogramCrest,
  FiligreeGoldPillOpenButton,
  FiligreeGoldOvalMonogramCrest,
  ModernWeddingScallopedOpenButton,
  ModernWeddingCrystalOctagonCrest,
  ModernWeddingFullCrystalRococoFrame,
  ModernWeddingFloralCalendarCover,
  KhmerRoyalModernWeddingCover,
  ShapedTitleText,
  getKhmerInitial,
} from './KhmerRoyalOrnament';
import TheapKhmerTemplate15Cover from './TheapKhmerTemplate15Cover';

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
  titleTextShape?: 'straight' | 'arch-up' | 'arch-down' | 'wave';
  guestNameColor?: string;
  guestNameFontFamily?: string;
  guestNameFontSize?: string;
  envelopeThemeColor?: string;
  guestFrameStyle?: string;
  onOpenDesignTab?: () => void;
  onToggleLanguage?: () => void;
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
  titleTextShape,
  guestNameColor = '#364153',
  guestNameFontFamily,
  guestNameFontSize,
  envelopeThemeColor,
  guestFrameStyle,
  onOpenDesignTab,
  onToggleLanguage,
  theme = 'dark',
}: EnvelopeModalProps) {
  const activeEnvelopeColor = envelopeThemeColor || '#6c2925';
  const plaqueStyle = guestFrameStyle || 'rose-gold';
  const GuestPlaqueWrapper = plaqueStyle === 'royal-gold'
    ? KhmerRoyalGoldenGuestPlaque
    : plaqueStyle === 'vintage'
    ? VintageScallopedGuestPlaque
    : RoseGoldOrnateGuestPlaque;
  const [isOpening, setIsOpening] = useState(false);
  const [isEditingGuest, setIsEditingGuest] = useState(false);
  const [tempGuestName, setTempGuestName] = useState(guestName);
  const [savedGuestsList, setSavedGuestsList] = useState<GuestPreset[]>([]);
  const [currentGuestInfo, setCurrentGuestInfo] = useState<GuestPreset | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isWaxFlapOpen, setIsWaxFlapOpen] = useState(false);

  const eventTypeLower = (eventType || '').toLowerCase();
  const idLower = (id || '').toLowerCase();
  const nameLower = (name || '').toLowerCase();

  const isAnniversary = eventTypeLower === 'anniversary' || idLower.includes('anniversary') || nameLower.includes('ខួបអាពាហ៍ពិពាហ៍') || nameLower.includes('anniversary');
  const isBirthday = !isAnniversary && (eventTypeLower === 'birthday' || idLower.includes('birthday') || nameLower.includes('ខួបកំណើត') || nameLower.includes('birthday'));
  const isEngagement = eventTypeLower === 'engagement' || idLower.includes('engagement') || nameLower.includes('ភ្ជាប់ពាក្យ') || nameLower.includes('engage');
  const isHousewarming = eventTypeLower === 'housewarming' || idLower.includes('housewarming') || nameLower.includes('ឡើងផ្ទះ') || nameLower.includes('house');

  // Directly pull from ចំណងជើងធំ (Main Title) first, then coverSubtitleKh, with contextual fallbacks
  let subtitleKh = mainTitleKh?.trim() || coverSubtitleKh?.trim();
  if (!subtitleKh || (isBirthday && (subtitleKh === 'សូមគោរពអញ្ជើញ' || subtitleKh === 'សិរីសួស្តី អាពាហ៍ពិពាហ៍' || subtitleKh === 'រីករាយថ្ងៃកំណើត'))) {
    subtitleKh = isBirthday
      ? 'រីករាយពិធីខួបកំណើត'
      : isAnniversary
      ? 'ខួបអាពាហ៍ពិពាហ៍'
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
    : isAnniversary
    ? 'WEDDING ANNIVERSARY INVITATION'
    : isEngagement
    ? 'ENGAGEMENT INVITATION'
    : isHousewarming
    ? 'HOUSEWARMING INVITATION'
    : 'ROYAL WEDDING INVITATION');

  const isWeddingStyle = !isBirthday && !isEngagement && !isHousewarming;
  const isModernWedding = isWeddingStyle && (idLower.includes('modern') || nameLower.includes('សម័យ') || nameLower.includes('modern'));
  const isTraditionalWedding = isWeddingStyle && !isModernWedding;
  const activeCoverBg = isAnniversary
    ? (coverBackground && !coverBackground.includes('free-background') && !coverBackground.includes('default') ? coverBackground : 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=1200&auto=format&fit=crop')
    : isWeddingStyle
    ? (coverBackground && !coverBackground.includes('free-background') && !coverBackground.includes('default') ? coverBackground : (isModernWedding ? 'https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/free-background.jpg' : '/assets/template15/opening-background.webp'))
    : (coverBackground || khmerRoyalGoldWeddingCover);

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
    try {
      const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
      if (audio) {
        audio.muted = false;
        audio.currentTime = audio.currentTime || 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlayingMusic(true);
            })
            .catch(err => {
              console.warn('Direct audio play error:', err);
            });
        }
      }
    } catch {
      // ignore
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
    // Auto-play music when clicking open invitation button
    triggerAutoPlayMusic();
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
          className={`fixed inset-0 z-40 overflow-y-auto scroll-smooth touch-auto ${
            isTraditionalWedding
              ? 'bg-[#e9e4dc]'
              : theme === 'light'
              ? 'bg-gradient-to-b from-white via-amber-50 to-white'
              : theme === 'gray'
              ? 'bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950'
              : 'bg-gradient-to-b from-black via-black to-black'
          }`}
        >
          {/* Subtle Background Image Wallpaper with Blur */}
          <div
            className={`fixed inset-0 z-0 bg-cover bg-center ${theme === 'light' ? 'opacity-35' : 'opacity-45'} filter blur-[8px] pointer-events-none scale-110 transition-all duration-700`}
            style={{ backgroundImage: `url(${activeCoverBg})` }}
          />

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
              className={`relative w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto my-auto rounded-[32px] p-0.5 transition-shadow duration-500 ${
                isAnniversary
                  ? 'bg-gradient-to-b from-[#fce7f3] via-[#ffffff] to-[#fbcfe8] shadow-[0_25px_60px_rgba(159,18,57,0.22)]'
                  : isWeddingStyle
                  ? (isModernWedding
                      ? 'bg-gradient-to-b from-[#fef9c3]/70 via-[#fde047]/50 to-[#d97706]/60 shadow-[0_20px_50px_rgba(30,58,138,0.2)]'
                      : 'bg-gradient-to-b from-[#e5dfd5] via-[#dcd5c9] to-[#bfb39f] shadow-[0_0_42px_rgba(91,76,54,0.18)]')
                  : theme === 'light'
                  ? 'bg-gradient-to-b from-amber-200 via-amber-400 to-amber-500 shadow-[0_20px_60px_rgba(245,184,15,0.25),0_8px_25px_rgba(0,0,0,0.08)]'
                  : 'bg-gradient-to-b from-amber-300/80 via-amber-500/60 to-amber-900/80 shadow-[0_30px_80px_rgba(0,0,0,0.7),0_0_40px_rgba(245,184,15,0.2)]'
              }`}
            >
              {/* Modern Invitation Card Body */}
              <div
                className={`relative rounded-[30px] overflow-hidden min-h-[580px] sm:min-h-[660px] md:min-h-[720px] flex flex-col justify-between items-center text-center border backdrop-blur-xl transition-all duration-300 ${
                  isAnniversary
                    ? 'py-8 sm:py-10 md:py-12 px-4 sm:px-8 md:px-10 border-[#fbcfe8] shadow-[0_15px_45px_rgba(159,18,57,0.18)] bg-gradient-to-b from-[#fff5f7]/90 via-[#fdf2f8]/80 to-[#ffe4e6]/95'
                    : isWeddingStyle
                    ? (isModernWedding
                        ? 'p-0 border-[#d4af37]/60 shadow-[0_15px_45px_rgba(30,58,138,0.18)] bg-[#fbfcf9]'
                        : 'p-0 border-[#ad8b55]/30 shadow-[0_0_42px_rgba(91,76,54,0.14)] bg-[#faf7f2]')
                    : theme === 'light'
                    ? 'py-8 sm:py-10 md:py-12 px-4 sm:px-8 md:px-10 border-amber-300/70 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8),0_10px_35px_rgba(245,184,15,0.2)]'
                    : 'py-8 sm:py-10 md:py-12 px-4 sm:px-8 md:px-10 border-amber-400/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_15px_45px_rgba(0,0,0,0.5)]'
                }`}
              >
                {/* Crisp Cover Background Layer Inside Envelope Card */}
                {!isWeddingStyle && (
                  <div
                    className="absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-700"
                    style={{ backgroundImage: `url(${activeCoverBg})` }}
                  />
                )}

                {isModernWedding && (
                  <>
                    {/* Golden Border Overlays (Matching Screenshot 1) */}
                    <div className="absolute inset-3 border-[1.5px] border-[#d4af37]/50 rounded-[22px] pointer-events-none z-10" />
                    <div className="absolute inset-4 border border-[#d4af37]/30 rounded-[20px] pointer-events-none z-10" />

                    {/* Corner Flourishes */}
                    <div className="absolute top-4 left-4 w-10 h-10 text-[#d4af37]/80 pointer-events-none z-10">
                      <KhmerCornerKbach position="top-left" className="w-full h-full" />
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 text-[#d4af37]/80 pointer-events-none z-10">
                      <KhmerCornerKbach position="top-right" className="w-full h-full" />
                    </div>
                    <div className="absolute bottom-4 left-4 w-10 h-10 text-[#d4af37]/80 pointer-events-none z-10">
                      <KhmerCornerKbach position="bottom-left" className="w-full h-full" />
                    </div>
                    <div className="absolute bottom-4 right-4 w-10 h-10 text-[#d4af37]/80 pointer-events-none z-10">
                      <KhmerCornerKbach position="bottom-right" className="w-full h-full" />
                    </div>

                    {/* Floating Peonies with Gold Outlines on Left, Right and Top */}
                    <div className="absolute bottom-0 right-0 w-44 sm:w-56 h-44 sm:h-56 opacity-85 pointer-events-none z-10 select-none">
                      <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/peony-bottom-right.png" className="w-full h-full object-contain" alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="absolute bottom-12 left-0 w-36 sm:w-48 h-36 sm:h-48 opacity-80 pointer-events-none z-10 select-none">
                      <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/peony-bottom-left.png" className="w-full h-full object-contain" alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="absolute top-16 right-0 w-36 sm:w-44 h-36 sm:h-44 opacity-75 pointer-events-none z-10 select-none">
                      <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/peony-top-right.png" className="w-full h-full object-contain" alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                  </>
                )}

                {isAnniversary ? (
                  <>
                    {/* Subtle Romantic Rose-Tinted Ambient Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-rose-200/30 via-pink-100/15 to-rose-300/30 pointer-events-none" />

                    {/* Top Right Floating Controls: Next Track & Audio Toggle & Quick Design Editor */}
                    <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                      {isWaxFlapOpen && (
                        <button
                          type="button"
                          onClick={() => setIsWaxFlapOpen(false)}
                          className="px-2 py-1 rounded-full bg-white/90 hover:bg-white text-xs font-khmer font-bold flex items-center gap-1 shadow-md backdrop-blur-sm transition-transform active:scale-95 border cursor-pointer text-[#881337] border-[#881337]/30"
                          title="មើលស្រោមសំបុត្រ (View Envelope Cover)"
                        >
                          <span>✉️ ស្រោម</span>
                        </button>
                      )}
                      {isAdmin && onOpenDesignTab && (
                        <button
                          type="button"
                          onClick={onOpenDesignTab}
                          className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-xs font-khmer font-bold flex items-center gap-1.5 shadow-md backdrop-blur-sm transition-transform active:scale-95 border cursor-pointer text-[#881337] border-[#881337]/30"
                          title={language === 'kh' ? 'កែពណ៌សំបុត្រក្នុង "ការរចនា"' : 'Edit Color in "Design" Tab'}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-white shadow-xs shrink-0 bg-[#881337]"
                          />
                          <span>{language === 'kh' ? 'កែការរចនា' : 'Design'}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
                          if (audio) {
                            audio.currentTime = 0;
                            audio.play().catch(() => {});
                            setIsPlayingMusic(true);
                          }
                        }}
                        className="w-8 h-8 rounded-full bg-white/85 hover:bg-white flex items-center justify-center shadow-md backdrop-blur-sm transition-transform active:scale-95 border cursor-pointer text-[#881337] border-[#881337]/30"
                        title="Replay / Restart Music"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={toggleMusicPlay}
                        className="w-8 h-8 rounded-full bg-white/85 hover:bg-white flex items-center justify-center shadow-md backdrop-blur-sm transition-transform active:scale-95 border cursor-pointer text-[#881337] border-[#881337]/30"
                        title={isPlayingMusic ? 'Mute' : 'Play'}
                      >
                        {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Grand Roman Ionic Colonnade Arch with Hanging Cherry Blossoms, Topiary Rose Mounds & Butterflies */}
                    <RomanticRoseGardenArchOverlay />

                    {/* Top Title: សិរីមង្គលអាពាហ៍ពិពាហ៍ / Wedding Invitation */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="relative z-20 pt-7 sm:pt-9 flex flex-col items-center justify-center w-full px-4"
                    >
                      <div className="flex items-center justify-center gap-2 max-w-full">
                        {/* Left Ornate Traditional Flourish Wing */}
                        <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 sm:w-8 h-5 text-[#881337] shrink-0">
                          <path d="M34 12 C 24 12, 16 6, 8 10 C 2 13, 4 22, 10 18 C 14 15, 12 10, 4 10" stroke="#881337" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                          <circle cx="6" cy="10" r="1.5" fill="#881337" />
                        </svg>

                        <h1
                          className="text-base sm:text-lg md:text-xl font-moul font-bold tracking-wider text-center"
                          style={{
                            fontFamily: "'Moul', serif",
                            color: '#881337',
                            textShadow: '0 1px 2px rgba(255,255,255,0.9), 0 2px 8px rgba(136,19,55,0.2)',
                          }}
                        >
                          {subtitleKh || 'សិរីមង្គលអាពាហ៍ពិពាហ៍'}
                        </h1>

                        {/* Right Ornate Traditional Flourish Wing */}
                        <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 sm:w-8 h-5 text-[#881337] shrink-0 scale-x-[-1]">
                          <path d="M34 12 C 24 12, 16 6, 8 10 C 2 13, 4 22, 10 18 C 14 15, 12 10, 4 10" stroke="#881337" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                          <circle cx="6" cy="10" r="1.5" fill="#881337" />
                        </svg>
                      </div>

                      {/* Elegant English Calligraphy Subtitle: Wedding Invitation / Anniversary Invitation */}
                      <div className="flex flex-col items-center mt-0.5">
                        <span
                          className="font-norican text-lg sm:text-xl md:text-2xl tracking-wide capitalize select-none"
                          style={{
                            color: '#881337',
                            fontFamily: "'Norican', 'Great Vibes', cursive",
                            textShadow: '0 1px 3px rgba(255,255,255,0.9)',
                          }}
                        >
                          {subtitleEn || 'Wedding Invitation'}
                        </span>
                        {/* Subtle Decorative Underline */}
                        <div className="w-28 sm:w-36 h-[1px] bg-gradient-to-r from-transparent via-[#881337]/60 to-transparent -mt-0.5" />
                      </div>
                    </motion.div>

                    {/* Center 3D Rose Gold Couple Names Calligraphy with Translucent Play Triangle */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.85, delay: 0.25 }}
                      className="relative z-20 my-auto py-2"
                    >
                      <RoseGoldAnniversaryCalligraphy
                        groom={groom}
                        bride={bride}
                      />
                    </motion.div>

                    {/* Guest Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.35 }}
                      className="relative z-20 w-full flex flex-col items-center my-2 sm:my-3 px-4"
                    >
                      <span
                        style={{ color: '#881337', fontFamily: "'Noto Sans Khmer', sans-serif" }}
                        className="block text-sm sm:text-base md:text-lg font-bold mb-2 tracking-wider drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]"
                      >
                        {language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invited'}
                      </span>

                      {!isEditingGuest ? (
                        <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center">
                          {isAdmin && (
                            <div className="max-w-xs mx-auto mb-2 w-full">
                              <div className="relative">
                                <select
                                  id="guest-dropbox-select"
                                  value={savedGuestsList.some(g => g.name === guestName) ? guestName : ''}
                                  onChange={e => handleSelectFromDropbox(e.target.value)}
                                  style={{ color: '#881337', borderColor: '#88133740' }}
                                  className="w-full pl-3 pr-8 py-1.5 rounded-lg bg-white/95 border text-xs font-khmer focus:outline-none appearance-none cursor-pointer transition-all shadow-sm"
                                >
                                  <option value="" disabled>
                                    {language === 'kh' ? '▼ ជ្រើសរើសឈ្មោះភ្ញៀវពី Drop box...' : '▼ Select Guest from Drop box...'}
                                  </option>
                                  {savedGuestsList.map((g, idx) => (
                                    <option key={g.id ? `${g.id}-${idx}` : `env-guest-${idx}`} value={g.name} className="bg-white text-neutral-800 py-1">
                                      {g.name} - {language === 'kh' ? g.categoryLabelKh : g.categoryLabelEn}
                                    </option>
                                  ))}
                                  <option value="__ADD_NEW__" className="bg-rose-100 text-rose-950 font-bold">
                                    + {language === 'kh' ? 'Add ភ្ញៀវថ្មី / បន្ថែមឈ្មោះ...' : 'Add New Custom Guest...'}
                                  </option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#881337]" />
                              </div>
                            </div>
                          )}

                          <GuestPlaqueWrapper
                            accentColor="#881337"
                            className={`${isAdmin ? 'cursor-pointer group/name' : ''} hover:scale-[1.02] transition-transform duration-300`}
                          >
                            <div
                              onClick={() => {
                                if (!isAdmin) return;
                                if (onOpenAddGuestModal) {
                                  onOpenAddGuestModal();
                                } else {
                                  setTempGuestName(guestName);
                                  setIsEditingGuest(true);
                                }
                              }}
                              className="flex items-center justify-center text-center w-full px-2"
                              title={isAdmin ? (language === 'kh' ? 'ចុចដើម្បី Add ភ្ញៀវ ឬកែប្រែឈ្មោះ' : 'Click to Add Guest or edit name') : undefined}
                            >
                              <span
                                style={{
                                  fontFamily: guestNameFontFamily || "'Moul', serif",
                                  color: '#881337',
                                  fontSize: guestNameFontSize ? `${guestNameFontSize}px` : undefined,
                                }}
                                className="font-moul text-sm sm:text-base md:text-lg tracking-wide max-w-[240px] sm:max-w-[300px] text-[#881337] drop-shadow-xs leading-relaxed text-center"
                              >
                                {guestName && guestName !== 'Your Name'
                                  ? guestName
                                  : language === 'kh'
                                  ? 'លោក ពិសិដ្ឋ សក្កា និង កញ្ញា ផែ រក្សា'
                                  : 'Honored Guest'}
                              </span>
                            </div>
                          </GuestPlaqueWrapper>
                        </div>
                      ) : (
                        <form onSubmit={handleSaveGuestName} className="space-y-2 py-2 px-4 rounded-2xl bg-white/95 border border-[#881337]/40 max-w-sm mx-auto shadow-md">
                          <div className="flex items-center justify-between text-xs font-khmer font-semibold text-[#881337]">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{language === 'kh' ? 'បញ្ចូលឈ្មោះភ្ញៀវកិត្តិយស' : 'Enter Guest Name'}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsEditingGuest(false)}
                              className="p-1 text-neutral-500 hover:text-neutral-900 rounded cursor-pointer"
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
                              style={{ color: '#881337', borderColor: '#88133740' }}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-white border font-moul text-sm text-center focus:outline-none"
                              placeholder={language === 'kh' ? 'ឈ្មោះភ្ញៀវ...' : 'Guest name...'}
                            />
                            <button
                              id="save-guest-name-btn"
                              type="submit"
                              style={{ backgroundColor: '#881337' }}
                              className="px-3.5 py-1.5 rounded-lg text-white font-moul text-xs font-bold flex items-center gap-1 shadow-md transition-all cursor-pointer hover:opacity-90"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{language === 'kh' ? 'យល់ព្រម' : 'Save'}</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </motion.div>

                    {/* Bottom Beveled Button: សូមចុចបើកធៀប */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.45 }}
                      className="relative z-20 w-full flex flex-col items-center pb-2 px-4"
                    >
                      <RoseGoldBeveledOpenButton
                        onOpen={handleOpenInvitation}
                        isOpening={isOpening}
                        labelKh={language === 'kh' ? 'សូមចុចបើកធៀប' : 'Open Invitation'}
                      />
                    </motion.div>

                    {/* ========================================================= */}
                    {/* THEAP KHMER TEMPLATE 1 - BI-FOLD WAX SEAL FLAP OVERLAY     */}
                    {/* (Matching theapkhmer.com/template1/opening-screen1)       */}
                    {/* ========================================================= */}
                    <AnimatePresence>
                      {!isWaxFlapOpen && (
                        isModernWedding ? (
                          <motion.div
                            id="modern-wedding-envelope-flap"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.6 } }}
                            className="absolute inset-0 z-40 flex flex-col items-center justify-between p-6 sm:p-8 rounded-[30px] overflow-hidden select-none cursor-pointer"
                            style={{
                              background: 'linear-gradient(145deg, #f5eae6 0%, #ebd9d4 50%, #e1c8c2 100%)',
                              boxShadow: 'inset 0 0 50px rgba(136, 19, 55, 0.12)',
                            }}
                            onClick={() => {
                              try {
                                confetti({
                                  particleCount: 120,
                                  spread: 80,
                                  origin: { y: 0.6 },
                                  colors: ['#fb7185', '#f43f5e', '#d4af37', '#fef3c7', '#ffffff'],
                                });
                              } catch {}
                              triggerAutoPlayMusic();
                              setIsWaxFlapOpen(true);
                            }}
                          >
                            {/* Decorative Hanging Crystals & Gold Flourish in Top Corners (Screenshot 2) */}
                            <div className="absolute top-0 left-0 w-36 h-36 opacity-90 pointer-events-none z-10">
                              <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/corner-crystals-left.png" className="w-full h-full object-contain" alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            </div>
                            <div className="absolute top-0 right-0 w-36 h-36 opacity-90 pointer-events-none z-10 scale-x-[-1]">
                              <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/corner-crystals-left.png" className="w-full h-full object-contain" alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            </div>

                            {/* Bottom Corner Magnificent Quartz Crystals & Flowers (Screenshot 2) */}
                            <div className="absolute bottom-0 left-0 w-40 sm:w-48 h-40 sm:h-48 opacity-95 pointer-events-none z-10">
                              <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/peony-bottom-left.png" className="absolute bottom-0 left-0 w-full h-full object-contain filter brightness-110 saturate-125" alt="" />
                              {/* Sparkling Crystal Overlay */}
                              <div className="absolute bottom-2 left-2 w-24 h-24 bg-gradient-to-tr from-pink-300/40 via-purple-300/20 to-white/40 blur-md rounded-full mix-blend-screen animate-pulse" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-40 sm:w-48 h-40 sm:h-48 opacity-95 pointer-events-none z-10">
                              <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/peony-bottom-right.png" className="absolute bottom-0 right-0 w-full h-full object-contain filter brightness-110 saturate-125" alt="" />
                              {/* Sparkling Crystal Overlay */}
                              <div className="absolute bottom-2 right-2 w-24 h-24 bg-gradient-to-tr from-pink-300/40 via-purple-300/20 to-white/40 blur-md rounded-full mix-blend-screen animate-pulse" />
                            </div>

                            {/* Elegant Lace Triangular Flap Line Overlay (Screenshot 2) */}
                            <svg className="absolute top-0 inset-x-0 w-full h-[55%] text-[#ebd9d4] pointer-events-none z-10 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)]" viewBox="0 0 320 180" preserveAspectRatio="none">
                              {/* Flap Body */}
                              <path d="M 0 0 L 320 0 L 320 20 L 160 162 L 0 20 Z" fill="#ebd9d4" />
                              {/* Flap Gold Rim */}
                              <path d="M 0 18 L 160 160 L 320 18" stroke="#d4af37" strokeWidth="2.2" fill="none" opacity="0.85" />
                              {/* White Lace Border Motif along Flap Edge */}
                              <path d="M 0 18 L 160 160 L 320 18" stroke="#ffffff" strokeWidth="6" strokeDasharray="3 4" fill="none" opacity="0.9" />
                            </svg>

                            {/* Center Rose Gold & Crystal Wax Seal (Screenshot 2) */}
                            <div className="relative z-30 flex flex-col items-center my-auto pt-44 sm:pt-48">
                              {/* Ambient Halo */}
                              <div className="absolute inset-0 -m-8 rounded-full bg-pink-400/20 blur-2xl animate-pulse pointer-events-none" />

                              {/* Rose Gold Filigree Seal Frame */}
                              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-[0_12px_36px_rgba(136,19,55,0.45)] border-4 border-[#e1c8c2] bg-gradient-to-br from-[#fbcfe8] via-[#e1cdc8] to-[#f472b6]">
                                {/* Glass Shimmer */}
                                <div className="absolute inset-1.5 rounded-full bg-gradient-to-tr from-white/10 via-transparent to-white/40 pointer-events-none" />
                                
                                {/* Gold Beveled Ring */}
                                <div className="absolute inset-2 rounded-full border border-[#d4af37]/60" />

                                {/* Hanging Diamond Crystal at Flap Seal Bottom (Screenshot 2) */}
                                <div className="absolute -bottom-6 w-3 h-8 flex flex-col items-center animate-bounce">
                                  <div className="w-[1.5px] h-3 bg-[#d4af37]" />
                                  <div className="w-2.5 h-4 bg-gradient-to-b from-purple-200 to-pink-400 rotate-45 border border-white/60 shadow-md" />
                                </div>

                                {/* Initials: e.g. T & D / D & B */}
                                <div className="relative z-10 flex items-center justify-center font-serif text-rose-950 font-bold tracking-tight">
                                  <span style={{ fontFamily: "'Great Vibes', cursive" }} className="text-2xl sm:text-3xl text-rose-900 drop-shadow-sm transform -translate-x-0.5 -translate-y-0.5">
                                    {getKhmerInitial(groom) || 'D'}
                                  </span>
                                  <span className="text-xs text-[#b8860b] mx-0.5 opacity-80">&</span>
                                  <span style={{ fontFamily: "'Great Vibes', cursive" }} className="text-2xl sm:text-3xl text-rose-900 drop-shadow-sm transform translate-x-0.5 translate-y-0.5">
                                    {getKhmerInitial(bride) || 'B'}
                                  </span>
                                </div>
                              </div>

                              {/* TAP TO OPEN Prompt */}
                              <div className="mt-8 flex flex-col items-center gap-1.5">
                                <span className="font-serif text-xs sm:text-sm tracking-[0.3em] text-rose-900 uppercase font-black animate-pulse drop-shadow-[0_1px_1px_rgba(255,255,255,0.95)]">
                                  {language === 'kh' ? 'សូមចុចបើកសំបុត្រ' : 'TAP TO OPEN'}
                                </span>
                                <span className="text-[10px] font-khmer text-rose-950/70 uppercase tracking-widest">
                                  {language === 'kh' ? '• ចុចលើត្រាកម្រងផ្កាដើម្បីបើកធៀប •' : '• Click Crystal Wax Seal to Open •'}
                                </span>
                              </div>
                            </div>

                            {/* Empty bottom space to keep wax seal centered */}
                            <div className="h-6" />
                          </motion.div>
                        ) : (
                          <motion.div
                            id="theapkhmer-opening-screen1"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.6 } }}
                            className="absolute inset-0 z-40 flex flex-col items-center justify-between p-6 sm:p-8 rounded-[30px] overflow-hidden select-none cursor-pointer"
                            style={{
                              background: 'linear-gradient(145deg, #fdfbf7 0%, #f9f6ef 45%, #f1ebe0 100%)',
                              boxShadow: 'inset 0 0 40px rgba(217, 119, 6, 0.08)',
                            }}
                            onClick={() => {
                              // Celebrate opening with confetti and music
                              try {
                                confetti({
                                  particleCount: 80,
                                  spread: 70,
                                  origin: { y: 0.6 },
                                  colors: ['#f5b80f', '#fbbf24', '#d97706', '#fef3c7', '#ffffff'],
                                });
                              } catch {
                                // ignore
                              }
                              triggerAutoPlayMusic();
                              setIsWaxFlapOpen(true);
                            }}
                          >
                            {/* Delicate Golden Botanical Foliage Vines */}
                            <TheapKhmerBotanicalBranches />

                            {/* Subtle Paper Grain / Linen Texture */}
                            <div
                              className="absolute inset-0 opacity-15 pointer-events-none"
                              style={{
                                backgroundImage: `radial-gradient(#b45309 0.75px, transparent 0.75px)`,
                                backgroundSize: '16px 16px',
                              }}
                            />

                            {/* Subtle Center Flap Split Shadow (Bi-Fold Illusion) */}
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-amber-700/20 to-transparent pointer-events-none" />

                            {/* Top Subtle Subtitle */}
                            <div className="relative z-20 flex flex-col items-center pt-8 sm:pt-10">
                              <span
                                className="text-sm sm:text-base tracking-wider font-bold"
                                style={{
                                  fontFamily: "'Noto Serif Khmer', serif",
                                  color: '#881337',
                                  textShadow: '0 1px 2px rgba(255,255,255,0.9)',
                                }}
                              >
                                {subtitleKh || 'សិរីមង្គលអាពាហ៍ពិពាហ៍'}
                              </span>
                              <span
                                className="font-norican text-sm sm:text-base text-[#9f1239] mt-0.5 tracking-wide"
                                style={{ fontFamily: "'Norican', 'Great Vibes', cursive" }}
                              >
                                {subtitleEn || 'Wedding Invitation'}
                              </span>
                            </div>

                            {/* Center Realistic 3D Wax Seal with Monogram & Subtle Pulsing Aura */}
                            <div className="relative z-30 flex flex-col items-center my-auto py-6">
                              {/* Pulsing Golden Glow Aura */}
                              <div className="absolute inset-0 -m-4 rounded-full bg-amber-400/20 blur-xl animate-pulse pointer-events-none" />

                              <TheapKhmerTemplate1WaxSeal
                                initials={`${getKhmerInitial(groom)}${getKhmerInitial(bride)}` || 'HP'}
                                className="w-24 h-24 sm:w-28 sm:h-28"
                              />

                              {/* "TAP TO OPEN" Pulsing Text & Finger Tap Prompt */}
                              <div className="mt-4 flex flex-col items-center gap-1">
                                <span
                                  className="text-xs sm:text-sm tracking-widest text-[#881337] animate-bounce drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] font-bold"
                                  style={{
                                    fontFamily: "'Noto Serif Khmer', serif",
                                  }}
                                >
                                  {language === 'kh' ? 'សូមចុចបើកសំបុត្រ' : 'TAP TO OPEN'}
                                </span>
                                <span className="text-[10px] font-khmer text-amber-800/80 uppercase tracking-widest">
                                  {language === 'kh' ? '• ចុចលើត្រាមាសដើម្បីបើកធៀប •' : '• Click Wax Seal to Open •'}
                                </span>
                              </div>
                            </div>

                            {/* Spacer to balance top title and keep wax seal centered */}
                            <div className="relative z-20 pb-4" />
                          </motion.div>
                        )
                      )}
                    </AnimatePresence>
                  </>
                ) : isWeddingStyle ? (
                  isModernWedding ? (
                    <div className="relative z-20 w-full h-full flex flex-col justify-between items-center">
                      {/* Top Right Floating Controls: Next Track & Audio Toggle & Quick Design Editor */}
                      <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5">
                        {onToggleLanguage && (
                          <button
                            type="button"
                            onClick={onToggleLanguage}
                            className="px-2 py-0.5 rounded-full bg-white/90 hover:bg-white text-[11px] font-khmer font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm border cursor-pointer text-amber-900 border-amber-300"
                            title={language === 'kh' ? 'ប្តូរទៅអង់គ្លេស / Switch to English' : 'Switch to Khmer / ប្តូរទៅខ្មែរ'}
                          >
                            <Globe className="w-3 h-3" />
                            <span>{language === 'kh' ? 'ខ្មែរ | EN' : 'EN | ខ្មែរ'}</span>
                          </button>
                        )}
                        {isAdmin && onOpenDesignTab && (
                          <button
                            type="button"
                            onClick={onOpenDesignTab}
                            className="px-2 py-0.5 rounded-full bg-white/90 hover:bg-white text-[11px] font-khmer font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm border cursor-pointer text-amber-900 border-amber-300"
                            title={language === 'kh' ? 'កែពណ៌សំបុត្រក្នុង "ការរចនា"' : 'Edit Color in "Design" Tab'}
                          >
                            <span className="w-2.5 h-2.5 rounded-full border border-white shadow-xs shrink-0 bg-amber-500" />
                            <span>{language === 'kh' ? 'កែ' : 'Edit'}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
                            if (audio) {
                              audio.currentTime = 0;
                              audio.play().catch(() => {});
                              setIsPlayingMusic(true);
                            }
                          }}
                          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm backdrop-blur-sm border cursor-pointer text-amber-900 border-amber-300"
                          title="Replay / Restart Music"
                        >
                          <SkipForward className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={toggleMusicPlay}
                          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md backdrop-blur-sm border cursor-pointer text-amber-900 border-amber-300"
                          title={isPlayingMusic ? 'Mute' : 'Play'}
                        >
                          {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <KhmerRoyalModernWeddingCover
                        groom={groom}
                        bride={bride}
                        groomEn={groomEn}
                        brideEn={brideEn}
                        subtitleKh={subtitleKh}
                        guestName={guestName && guestName !== 'Your Name' ? guestName : (language === 'kh' ? 'លោក រ៉ូហ្សា\nនិងភរិយាព្រមទាំងបុត្រ' : 'Honored Guest')}
                        titleShape={titleTextShape}
                        language={language}
                        onOpenInvitation={handleOpenInvitation}
                        isOpening={isOpening}
                        isAdmin={isAdmin}
                        savedGuestsList={savedGuestsList}
                        onSelectFromDropbox={handleSelectFromDropbox}
                        onOpenAddGuestModal={onOpenAddGuestModal}
                        onUpdateGuestName={onUpdateGuestName}
                      />
                    </div>
                  ) : (
                    <div className="relative z-20 w-full h-full flex flex-col justify-between items-center">
                      {/* Top Right Floating Controls: Next Track & Audio Toggle & Quick Design Editor */}
                      <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5">
                        {onToggleLanguage && (
                          <button
                            type="button"
                            onClick={onToggleLanguage}
                            className="px-2 py-0.5 rounded-full bg-white/90 hover:bg-white text-[11px] font-khmer font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm border cursor-pointer text-[#ad8b55] border-[#ad8b55]/40"
                            title={language === 'kh' ? 'ប្តូរទៅអង់គ្លេស / Switch to English' : 'Switch to Khmer / ប្តូរទៅខ្មែរ'}
                          >
                            <Globe className="w-3 h-3" />
                            <span>{language === 'kh' ? 'ខ្មែរ | EN' : 'EN | ខ្មែរ'}</span>
                          </button>
                        )}
                        {isAdmin && onOpenDesignTab && (
                          <button
                            type="button"
                            onClick={onOpenDesignTab}
                            className="px-2 py-0.5 rounded-full bg-white/90 hover:bg-white text-[11px] font-khmer font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm border cursor-pointer text-[#ad8b55] border-[#ad8b55]/40"
                            title={language === 'kh' ? 'កែពណ៌សំបុត្រក្នុង "ការរចនា"' : 'Edit Color in "Design" Tab'}
                          >
                            <span className="w-2.5 h-2.5 rounded-full border border-white shadow-xs shrink-0 bg-[#ad8b55]" />
                            <span>{language === 'kh' ? 'កែ' : 'Edit'}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
                            if (audio) {
                              audio.currentTime = 0;
                              audio.play().catch(() => {});
                              setIsPlayingMusic(true);
                            }
                          }}
                          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm backdrop-blur-sm border cursor-pointer text-[#ad8b55] border-[#ad8b55]/40"
                          title="Replay / Restart Music"
                        >
                          <SkipForward className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={toggleMusicPlay}
                          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md backdrop-blur-sm border cursor-pointer text-[#ad8b55] border-[#ad8b55]/40"
                          title={isPlayingMusic ? 'Mute' : 'Play'}
                        >
                          {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <TheapKhmerTemplate15Cover
                        groom={groom}
                        bride={bride}
                        groomEn={groomEn}
                        brideEn={brideEn}
                        subtitleKh={subtitleKh}
                        guestName={guestName && guestName !== 'Your Name' ? guestName : (language === 'kh' ? 'លោក ស្រី មករា' : 'Honored Guest')}
                        language={language}
                        onOpenInvitation={handleOpenInvitation}
                        isOpening={isOpening}
                        isAdmin={isAdmin}
                        savedGuestsList={savedGuestsList}
                        onSelectFromDropbox={handleSelectFromDropbox}
                        onOpenAddGuestModal={onOpenAddGuestModal}
                        onUpdateGuestName={onUpdateGuestName}
                        guestNameFontFamily={guestNameFontFamily}
                        guestNameColor={guestNameColor}
                        guestNameFontSize={guestNameFontSize}
                      />
                    </div>
                  )
                ) : (
                  <>
                    {/* Refined Balanced Contrast Gradient Scrim */}
                    <div
                      className={`absolute inset-0 pointer-events-none transition-opacity ${
                        theme === 'light'
                          ? 'bg-gradient-to-b from-white/40 via-amber-50/20 to-white/50'
                          : 'bg-gradient-to-b from-black/45 via-black/25 to-black/60'
                      }`}
                    />

                    {/* Inner Beveled Double Gold Hairline Border */}
                    <div className="absolute inset-2.5 sm:inset-3.5 rounded-[22px] border border-amber-400/40 pointer-events-none z-10" />
                    <div className="absolute inset-3 sm:inset-4 rounded-[20px] border border-amber-300/20 pointer-events-none z-10" />

                    {/* Khmer Royal Traditional Corner Filigrees (Kbach Phni Tes) */}
                    <div className="absolute top-2 left-2 z-10">
                      <KhmerCornerKbach position="top-left" className="w-12 h-12 sm:w-14 sm:h-14" />
                    </div>
                    <div className="absolute top-2 right-2 z-10">
                      <KhmerCornerKbach position="top-right" className="w-12 h-12 sm:w-14 sm:h-14" />
                    </div>
                    <div className="absolute bottom-2 left-2 z-10">
                      <KhmerCornerKbach position="bottom-left" className="w-12 h-12 sm:w-14 sm:h-14" />
                    </div>
                    <div className="absolute bottom-2 right-2 z-10">
                      <KhmerCornerKbach position="bottom-right" className="w-12 h-12 sm:w-14 sm:h-14" />
                    </div>

                    {/* Floating Animations */}
                    {isBirthday ? (
                      <FloatingBalloonsAndGifts />
                    ) : (
                      <FloatingEngagementRingsAndSparkles />
                    )}

                    {/* Top Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="flex flex-col items-center relative z-10 pt-2"
                    >
                      {/* Curved Heading with Shimmer Animation */}
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex justify-center -mt-2 mb-1 select-none w-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
                      >
                        <motion.svg
                          viewBox="0 0 340 90"
                          animate={{
                            y: [0, -4, 0, 3, 0],
                            scale: [1, 1.02, 1, 1.015, 1],
                          }}
                          transition={{
                            duration: 4.2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="w-full max-w-[340px] h-auto overflow-visible"
                        >
                          <defs>
                            <linearGradient id="curveGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#d4af37" />
                              <stop offset="25%" stopColor="#fff8db" />
                              <stop offset="50%" stopColor="#f5b80f" />
                              <stop offset="75%" stopColor="#fff8db" />
                              <stop offset="100%" stopColor="#d4af37" />
                            </linearGradient>
                          </defs>
                          <path
                            id="subtitleCurve"
                            d="M 20,78 Q 170,20 320,78"
                            fill="transparent"
                          />
                          <text
                            style={{
                              fill: 'url(#curveGoldGradient)',
                              fontFamily: language === 'kh' ? 'Moul, Moulpali, serif' : 'Norican, cursive',
                              fontSize: '24px',
                              letterSpacing: '0.12em',
                              fontWeight: 'bold',
                            }}
                          >
                            <textPath href="#subtitleCurve" startOffset="50%" textAnchor="middle">
                              {language === 'kh' ? subtitleKh : subtitleEn}
                            </textPath>
                          </text>
                        </motion.svg>
                      </motion.div>

                      {/* Couple / Host Names */}
                      <div className="space-y-1 my-1">
                        <motion.h1
                          style={{
                            color: language === 'kh' ? primaryColor : (coverEnNameColor || primaryColor),
                            fontSize: '24px',
                            fontWeight: 'normal',
                            fontFamily: language === 'kh' ? "'Moul', serif" : "'Norican', cursive",
                            lineHeight: '35px',
                          }}
                          className={`${language === 'kh' ? 'font-moul' : 'font-norican capitalize'} text-[24px] py-0.5 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]`}
                        >
                          <span>{language === 'kh' ? (singlePerson ? groom : (bride ? `${groom} & ${bride}` : groom)) : (singlePerson ? (groomEn || groom) : (brideEn ? `${groomEn || groom} & ${brideEn}` : (groomEn || groom)))}</span>
                        </motion.h1>
                      </div>

                      <KhmerDividerKbach className="w-52 sm:w-64 h-5 my-3" color={primaryColor} />
                    </motion.div>

                    {/* Middle Section: Guest */}
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="relative z-10 my-4 sm:my-6 text-center w-full"
                    >
                      <RoyalGoldRibbonBanner className="hover:scale-[1.02] transition-transform duration-300">
                        <span className="block text-[11px] sm:text-xs md:text-sm font-khmer font-semibold text-[#854d0e] mb-1 tracking-wide">
                          {language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invited'}
                        </span>
                        <div className="text-lg sm:text-xl md:text-2xl font-moul text-[#172554] tracking-wide flex items-center justify-center gap-2.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#b47d10] shrink-0" />
                          <span className="truncate max-w-[280px]" style={{ fontFamily: "'Moul', serif" }}>
                            {guestName && guestName !== 'Your Name' ? guestName : (language === 'kh' ? 'ភ្ញៀវកិត្តិយស' : 'Honored Guest')}
                          </span>
                          <Sparkles className="w-3.5 h-3.5 text-[#b47d10] shrink-0" />
                        </div>
                      </RoyalGoldRibbonBanner>
                    </motion.div>

                    {/* Bottom Action Button */}
                    <div className="relative z-10 w-full flex flex-col items-center">
                      <motion.button
                        id="open-invitation-btn"
                        onClick={handleOpenInvitation}
                        disabled={isOpening}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        className="relative group w-full py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl text-sm sm:text-base text-amber-950 font-bold bg-gradient-to-r from-[#ffeaa7] via-[#f5b80f] to-[#e6a100] shadow-[0_12px_35px_rgba(245,158,11,0.45)] border-2 border-amber-200/90 flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden cursor-pointer"
                      >
                        <RoyalWaxSealEmblem className="w-10 h-10 sm:w-11 sm:h-11" />
                        <span
                          className="text-amber-950 font-bold tracking-wide"
                          style={{ fontFamily: "'Noto Serif Khmer', serif" }}
                        >
                          {language === 'kh' ? 'បើកសំបុត្រអញ្ជើញ' : 'Open Invitation'}
                        </span>
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
