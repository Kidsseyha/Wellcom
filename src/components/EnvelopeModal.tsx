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
} from 'lucide-react';
import { Language } from '../types';
import { getSavedGuests, GuestPreset } from '../data/guests';
import RoyalGoldRibbonBanner from './RoyalGoldRibbonBanner';
import IntertwinedRibbonHearts from './IntertwinedRibbonHearts';
import RingIcon from './RingIcon';

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
  name?: string;
  language: Language;
  isAdmin?: boolean;
  coverBackground?: string;
  primaryColor?: string;
  textColor?: string;
  envelopeFrame?: string;
  envelopeHeaderImage?: string;
  onUpdateEnvelopeHeaderImage?: (url: string) => void;
  coverSubtitleKh?: string;
  coverSubtitleEn?: string;
  coverEnNameColor?: string;
  coverEnFontFamily?: string;
  theme?: ThemeMode;
}

// Compress image via canvas to prevent database quota errors
function compressImage(file: File, maxWidth = 1400, maxHeight = 1400, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
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
  name,
  language,
  isAdmin = false,
  coverBackground,
  primaryColor = '#f5b80f',
  textColor = '#f5b80f',
  envelopeFrame,
  envelopeHeaderImage,
  onUpdateEnvelopeHeaderImage,
  coverSubtitleKh,
  coverSubtitleEn,
  coverEnNameColor,
  coverEnFontFamily,
  theme = 'dark',
}: EnvelopeModalProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isEditingGuest, setIsEditingGuest] = useState(false);
  const [tempGuestName, setTempGuestName] = useState(guestName);
  const [savedGuestsList, setSavedGuestsList] = useState<GuestPreset[]>([]);
  const [currentGuestInfo, setCurrentGuestInfo] = useState<GuestPreset | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const isBirthday = id?.includes('birthday') || name?.includes('ខួបកំណើត') || name?.includes('Birthday');
  const isEngagement = id?.includes('engagement') || name?.includes('ភ្ជាប់ពាក្យ') || name?.includes('Engagement');
  const isHousewarming = id?.includes('housewarming') || name?.includes('ឡើងផ្ទះ') || name?.includes('House');

  const subtitleKh = coverSubtitleKh?.trim() || (isBirthday
    ? 'រីករាយថ្ងៃកំណើត'
    : isEngagement
    ? 'ពិធីភ្ជាប់ពាក្យ'
    : isHousewarming
    ? 'ពិធីឡើងគេហដ្ឋានថ្មី'
    : 'សិរីសួស្តី អាពាហ៍ពិពាហ៍');

  const subtitleEn = coverSubtitleEn?.trim() || (isBirthday
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
          className={`fixed inset-0 z-40 overflow-y-auto ${theme === 'light' ? 'bg-gradient-to-b from-white via-amber-50 to-white' : theme === 'gray' ? 'bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950' : 'bg-gradient-to-b from-black via-black to-black'}`}
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

          <div className="min-h-full flex flex-col p-4 py-12 relative z-10">
            {/* Envelope Card */}
            <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={isOpening ? { scale: 0.95, y: -40, rotateX: 20 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`relative w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto my-auto rounded-3xl p-0.5 ${theme === 'light' ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 shadow-[0_20px_60px_rgba(245,184,15,0.2)]' : 'bg-gradient-to-b from-amber-400 via-amber-600 to-amber-900 shadow-2xl'}`}
          >
            <div
              className={`relative rounded-3xl overflow-hidden py-10 sm:py-14 md:py-16 px-6 sm:px-10 md:px-14 min-h-[580px] sm:min-h-[660px] md:min-h-[720px] flex flex-col justify-between text-center border ${theme === 'light' ? 'border-amber-300/60 shadow-[0_10px_40px_rgba(245,184,15,0.25)]' : 'border-amber-500/40 shadow-2xl'} backdrop-blur-md`}
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
                    ? 'bg-gradient-to-b from-white/35 via-amber-50/15 to-white/45'
                    : 'bg-gradient-to-b from-black/40 via-black/20 to-black/55'
                }`}
              />

              {/* Corner Traditional Decorative Filigrees */}
              <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-amber-400/70 rounded-tl-xl pointer-events-none z-10" />
              <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-amber-400/70 rounded-tr-xl pointer-events-none z-10" />
              <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-amber-400/70 rounded-bl-xl pointer-events-none z-10" />
              <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-amber-400/70 rounded-br-xl pointer-events-none z-10" />

              {/* Top Section */}
              <div className="flex flex-col items-center relative z-10">
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

                 {/* Curved Heading (replacing the picture with elegant bigger arc typography) */}
                 <div className="flex justify-center -mt-4 sm:-mt-6 mb-2 select-none w-full">
                   <svg
                     viewBox="0 0 340 100"
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
                       className="shadow-sm"
                     >
                       <textPath href="#subtitleCurve" startOffset="50%" textAnchor="middle">
                         {language === 'kh' ? subtitleKh : subtitleEn}
                       </textPath>
                     </text>
                   </svg>
                 </div>

                  <div className="space-y-1">
                  <h1
                    style={{
                      color: language === 'kh' ? primaryColor : (coverEnNameColor || primaryColor),
                      fontSize: '22px',
                      fontWeight: 'normal',
                      fontFamily: language === 'en' && coverEnFontFamily ? coverEnFontFamily : undefined,
                    }}
                    className={`${language === 'kh' ? 'font-moul' : (!coverEnFontFamily ? 'font-norican capitalize' : 'capitalize')} text-[22px] py-1 drop-shadow-md leading-relaxed`}
                  >
                    {language === 'kh'
                      ? (singlePerson ? groom : (bride ? `${groom} & ${bride}` : groom))
                      : (singlePerson ? (groomEn || groom) : (brideEn ? `${groomEn || groom} & ${brideEn}` : (groomEn || groom)))}
                  </h1>
                  <p
                    style={{
                      color: language === 'kh' ? (coverEnNameColor || '#ffffff') : textColor,
                      fontSize: '24px',
                      fontWeight: 'bold',
                      fontFamily: language === 'kh' && coverEnFontFamily ? coverEnFontFamily : undefined,
                    }}
                    className={`${language === 'kh' ? (!coverEnFontFamily ? 'font-norican capitalize' : 'capitalize') : 'font-moul'} text-[24px] font-bold opacity-90 leading-relaxed`}
                  >
                    {language === 'kh'
                      ? (singlePerson ? (groomEn || groom) : (brideEn ? `${groomEn || groom} & ${brideEn}` : (groomEn || groom)))
                      : (singlePerson ? groom : (bride ? `${groom} & ${bride}` : groom))}
                  </p>
                </div>

                {/* Traditional Ornamental Divider */}
                <div className="flex items-center justify-center gap-3 my-5 sm:my-7">
                  <div className="h-[1px] w-20 sm:w-28 bg-gradient-to-r from-transparent to-amber-400/70" />
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: primaryColor }} />
                  <div className="h-[1px] w-20 sm:w-28 bg-gradient-to-l from-transparent to-amber-400/70" />
                </div>
              </div>

              {/* Middle Section: Guest Card Recipient Frame */}
              <div className="relative z-10 my-4 sm:my-6 text-center w-full">
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
                            {savedGuestsList.map(g => (
                              <option key={g.id} value={g.name} className={theme === 'light' ? 'bg-white text-amber-900 py-1' : 'bg-black text-amber-100 py-1'}>
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
                                  fontSize: '20px',
                                  lineHeight: '30px',
                                  height: '35px',
                                  width: '302px',
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
                                fontSize: '20px',
                                lineHeight: '30px',
                                height: '35px',
                                width: '302px',
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
              </div>

              {/* Invitation Prompt & Music Control */}
              <div className="relative z-10 flex items-center justify-center gap-2 mb-4">
                <button
                  type="button"
                  id="envelope-play-music-btn"
                  onClick={toggleMusicPlay}
                  className={`px-3 py-1.5 rounded-full border text-xs font-khmer flex items-center gap-1.5 transition-all shadow-md ${
                    isPlayingMusic
                      ? 'bg-amber-400 text-amber-950 font-bold border-amber-300 ring-2 ring-amber-300/30'
                      : theme === 'light' ? 'bg-white/60 hover:bg-amber-100 border-amber-300/60 text-amber-800 hover:text-amber-950' : 'bg-black/60 hover:bg-amber-950/50 border-amber-500/40 text-amber-300 hover:text-white'
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

              <p className={`relative z-10 text-xs ${theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'} font-khmer max-w-xs mx-auto mb-6 leading-relaxed`}>
                {language === 'kh'
                  ? 'សូមចុចប៊ូតុងខាងក្រោម ដើម្បីបើកលិខិតអញ្ជើញ និងទទួលស្តាប់តន្ត្រីមង្គលការ'
                  : 'Tap below to unseal your invitation and enjoy the celebration'}
              </p>

              {/* Seal Button */}
              <motion.button
                id="open-invitation-btn"
                onClick={handleOpenInvitation}
                disabled={isOpening}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="relative z-10 group w-full py-3.5 px-6 rounded-xl font-moul text-sm sm:text-base text-amber-950 font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 shadow-xl shadow-amber-900/40 hover:shadow-amber-500/25 border border-amber-200 flex items-center justify-center gap-2.5 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />
                <MailOpen className="w-4 h-4" style={{ color: '#1b48b4' }} />
                <span style={{ color: '#1b48b4' }}>{language === 'kh' ? 'បើកសំបុត្រអញ្ជើញ' : 'Open Invitation'}</span>
              </motion.button>
            </div>
          </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
