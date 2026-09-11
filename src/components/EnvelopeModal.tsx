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
  language: Language;
  isAdmin?: boolean;
  coverBackground?: string;
  primaryColor?: string;
  textColor?: string;
  envelopeFrame?: string;
  envelopeHeaderImage?: string;
  onUpdateEnvelopeHeaderImage?: (url: string) => void;
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
  language,
  isAdmin = false,
  coverBackground,
  primaryColor = '#f5b80f',
  textColor = '#f5b80f',
  envelopeFrame,
  envelopeHeaderImage,
  onUpdateEnvelopeHeaderImage,
  theme = 'dark',
}: EnvelopeModalProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isEditingGuest, setIsEditingGuest] = useState(false);
  const [tempGuestName, setTempGuestName] = useState(guestName);
  const [savedGuestsList, setSavedGuestsList] = useState<GuestPreset[]>([]);
  const [currentGuestInfo, setCurrentGuestInfo] = useState<GuestPreset | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

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
          {/* Subtle Background Image Wallpaper */}
          {coverBackground && (
            <div
              className={`fixed inset-0 z-0 bg-cover bg-center ${theme === 'light' ? 'opacity-30' : 'opacity-40'} filter blur-[2px] pointer-events-none scale-105`}
              style={{ backgroundImage: `url(${coverBackground})` }}
            />
          )}

          {/* Subtle Golden Particles Background */}
          <div className={`fixed inset-0 z-0 ${theme === 'light' ? 'opacity-10' : 'opacity-20'} pointer-events-none bg-[radial-gradient(#f5b80f_1px,transparent_1px)] [background-size:24px_24px]`} />

          <div className="min-h-full flex items-center justify-center p-4 py-8 relative z-10">
            {/* Envelope Card */}
            <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={isOpening ? { scale: 0.95, y: -40, rotateX: 20 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`relative w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto rounded-3xl p-0.5 ${theme === 'light' ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 shadow-[0_20px_60px_rgba(245,184,15,0.2)]' : 'bg-gradient-to-b from-amber-400 via-amber-600 to-amber-900 shadow-2xl'}`}
          >
            <div
              style={
                coverBackground
                  ? {
                      backgroundImage: theme === 'light' 
                        ? `linear-gradient(180deg, rgba(255, 253, 248, 0.25) 0%, rgba(255, 251, 240, 0.5) 50%, rgba(255, 248, 230, 0.9) 100%), url(${coverBackground})`
                        : `linear-gradient(180deg, rgba(29, 23, 18, 0.15) 0%, rgba(22, 17, 13, 0.4) 50%, rgba(14, 11, 8, 0.85) 100%), url(${coverBackground})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
              className={`relative rounded-3xl ${theme === 'light' ? 'bg-gradient-to-b from-white via-amber-50/50 to-white' : 'bg-gradient-to-b from-black via-black to-black'} py-10 sm:py-14 md:py-16 px-6 sm:px-10 md:px-14 min-h-[580px] sm:min-h-[660px] md:min-h-[720px] flex flex-col justify-between text-center border ${theme === 'light' ? 'border-amber-300/40 shadow-inner' : 'border-amber-500/30 overflow-hidden shadow-inner'} backdrop-blur-sm`}
            >
              {/* Corner Traditional Decorative Filigrees */}
              <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-amber-400/60 rounded-tl-xl pointer-events-none" />
              <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-amber-400/60 rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-amber-400/60 rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-amber-400/60 rounded-br-xl pointer-events-none" />

              {/* Top Section */}
              <div className="flex flex-col items-center">
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

                 {/* Intertwined Red Ribbon Hearts Crest or Custom Header Image */}
                {envelopeHeaderImage === 'none' ? (
                  isAdmin && onUpdateEnvelopeHeaderImage ? (
                    <div
                      onClick={handleHeaderImageClick}
                      className="mx-auto mb-3 sm:mb-4 flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-amber-500/30 hover:border-amber-400 bg-black/20 hover:bg-black/40 text-amber-200 cursor-pointer transition-all w-64 h-24"
                      title="ចុចដើម្បីបន្ថែមរូបភាពក្បាលសំបុត្រ (Click to add header crest)"
                    >
                      <Camera className="w-5 h-5 mb-1 opacity-70" />
                      <span className="text-[10px] font-khmer font-bold">លាក់រូបភាពក្បាលសំបុត្រ (Crest Hidden)</span>
                      <span className="text-[9px] text-neutral-400 mt-1">ចុចទីនេះដើម្បីប្តូរ / Click to upload</span>
                    </div>
                  ) : null
                ) : (
                  <div
                    onClick={handleHeaderImageClick}
                    className={`mx-auto mb-3 sm:mb-4 flex items-center justify-center relative ${
                      isAdmin && onUpdateEnvelopeHeaderImage
                        ? 'group cursor-pointer hover:opacity-90 transition-opacity'
                        : ''
                    }`}
                    title={isAdmin && onUpdateEnvelopeHeaderImage ? 'ចុចដើម្បីប្តូររូបភាពក្បាលសំបុត្រ (Click to edit header crest)' : undefined}
                  >
                    {envelopeHeaderImage ? (
                      <img
                        src={envelopeHeaderImage}
                        alt="Envelope Crest"
                        className="max-w-[280px] sm:max-w-[360px] md:max-w-[420px] max-h-36 sm:max-h-44 object-contain filter drop-shadow-[0_8px_20px_rgba(217,4,41,0.3)] transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="transition-transform duration-300 group-hover:scale-[1.03]">
                        <IntertwinedRibbonHearts size="lg" className="w-64 sm:w-80 md:w-96 h-auto" />
                      </div>
                    )}

                    {/* Admin Edit Controls overlay */}
                    {isAdmin && onUpdateEnvelopeHeaderImage && (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-amber-400 text-amber-950 font-khmer font-bold text-[10px] sm:text-xs px-2.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-amber-950" />
                            <span>ប្តូររូបភាពក្បាលសំបុត្រ (Upload Crest)</span>
                          </div>
                        </div>

                        {/* If custom image is set, allow to clear and return to default intertwined ribbon hearts */}
                        {envelopeHeaderImage && (
                          <button
                            type="button"
                            onClick={handleResetHeaderImage}
                            className="absolute -top-1 -right-1 p-1.5 rounded-full bg-rose-500 hover:bg-rose-400 text-white shadow-md hover:scale-110 active:scale-95 transition-all z-10"
                            title="កំណត់ដើមឡើងវិញ"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Heading */}
                <p
                  style={{
                    color: textColor,
                    fontSize: '15px',
                    lineHeight: '18px',
                  }}
                  className="uppercase tracking-[0.3em] font-semibold mb-2 opacity-90"
                >
                  {language === 'kh' ? 'សិរីសួស្តី អាពាហ៍ពិពាហ៍' : 'ROYAL WEDDING INVITATION'}
                </p>

                <h1
                  style={{ color: primaryColor, fontSize: '30px' }}
                  className={`${language === 'kh' ? 'font-moul' : 'font-norican tracking-wider capitalize'} py-1.5 drop-shadow-md leading-relaxed`}
                >
                  {language === 'kh' ? `${groom} & ${bride}` : `${groomEn || groom} & ${brideEn || bride}`}
                </h1>

                {/* Traditional Ornamental Divider */}
                <div className="flex items-center justify-center gap-3 my-5 sm:my-7">
                  <div className="h-[1px] w-20 sm:w-28 bg-gradient-to-r from-transparent to-amber-400/70" />
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: primaryColor }} />
                  <div className="h-[1px] w-20 sm:w-28 bg-gradient-to-l from-transparent to-amber-400/70" />
                </div>
              </div>

              {/* Middle Section: Guest Card Recipient Frame */}
              <div className="relative my-4 sm:my-6 text-center w-full">
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
              <div className="flex items-center justify-center gap-2 mb-4">
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

              <p className={`text-xs ${theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'} font-khmer max-w-xs mx-auto mb-6 leading-relaxed`}>
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
                className="relative group w-full py-3.5 px-6 rounded-xl font-moul text-sm sm:text-base text-amber-950 font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 shadow-xl shadow-amber-900/40 hover:shadow-amber-500/25 border border-amber-200 flex items-center justify-center gap-2.5 transition-all overflow-hidden"
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
