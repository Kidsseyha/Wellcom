import { useState, useRef } from 'react';
import {
  Smartphone,
  Monitor,
  X,
  Check,
  MapPin,
  Heart,
  Volume2,
  VolumeX,
  Sparkles,
  Users,
  Gift,
  Cake,
  Home,
  Crown,
  Flame,
  Scissors,
  Utensils,
  Wine,
  Music,
  ExternalLink,
  Clock,
  LayoutTemplate,
} from 'lucide-react';
import { Language } from '../types';
import { ThemeMode } from './ThemeToggle';
import { EventTypePreset } from '../data/eventTemplates';

interface TemplateLivePreviewProps {
  preset: EventTypePreset;
  language: Language;
  onClose: () => void;
  onApply: (preset: EventTypePreset) => void;
  onEdit?: (preset: EventTypePreset) => void;
  theme?: ThemeMode;
}

export default function TemplateLivePreview({
  preset,
  language,
  onClose,
  onApply,
  onEdit,
  theme = 'dark',
}: TemplateLivePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [previewTab, setPreviewTab] = useState<'invitation' | 'schedule'>('invitation');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const event = preset.sampleEvent;
  const invKh = event.config?.invitation_kh;
  const invEn = event.config?.invitation_en;

  const galleryImages = [
    ...(event.config?.galleryPhotos || []),
    event.config?.photo_gallary?.photo1,
    event.config?.photo_gallary?.photo2,
    event.config?.photo_gallary?.photo3,
    event.config?.photo_gallary?.photo4,
  ].filter(Boolean) as string[];

  const toggleAudio = () => {
    const musicUrl = event.config?.background_music;
    if (!audioRef.current && musicUrl) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
    }
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlayingAudio(true);
      }
    }
  };

  const getTimelineIcon = (iconName?: string, color = '#f5b80f') => {
    const props = { className: 'w-4 h-4', style: { color } };
    switch (iconName) {
      case 'users':
        return <Users {...props} />;
      case 'gift':
        return <Gift {...props} />;
      case 'sparkles':
        return <Sparkles {...props} />;
      case 'scissors':
        return <Scissors {...props} />;
      case 'flame':
        return <Flame {...props} />;
      case 'utensils':
        return <Utensils {...props} />;
      case 'heart':
        return <Heart {...props} />;
      case 'crown':
        return <Crown {...props} />;
      case 'wine':
        return <Wine {...props} />;
      case 'cake':
        return <Cake {...props} />;
      case 'music':
        return <Music {...props} />;
      default:
        return <Clock {...props} />;
    }
  };

  const isLight = theme === 'light';
  const isGray = theme === 'gray';

  return (
    <div className={`fixed inset-0 z-50 flex flex-col backdrop-blur-xl animate-in fade-in duration-200 select-none overflow-hidden ${
      isLight ? 'bg-amber-950/60' : isGray ? 'bg-slate-950/90' : 'bg-black/95'
    }`}>
      {/* TOP CONTROLS BAR */}
      <div className={`h-14 sm:h-16 px-4 sm:px-6 border-b flex items-center justify-between gap-3 shrink-0 z-20 ${
        isLight
          ? 'border-amber-500/30 bg-[#faf8f4] text-neutral-900 shadow-sm'
          : isGray
          ? 'border-slate-700/80 bg-[#1e232d] text-slate-100 shadow-sm'
          : 'border-amber-500/20 bg-neutral-950/90 text-white'
      }`}>
        {/* Left: Template info */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 shadow"
            style={{
              backgroundColor: `${preset.accentColor}25`,
              color: preset.accentColor,
              border: `1px solid ${preset.accentColor}60`,
            }}
          >
            {preset.type === 'wedding' && <Heart className="w-4 h-4" />}
            {preset.type === 'engagement' && <Sparkles className="w-4 h-4" />}
            {preset.type === 'housewarming' && <Home className="w-4 h-4" />}
            {preset.type === 'birthday' && <Cake className="w-4 h-4" />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`text-xs sm:text-sm font-bold font-khmer truncate ${
                isLight ? 'text-amber-950' : isGray ? 'text-slate-100' : 'text-white'
              }`}>
                {language === 'kh' ? preset.titleKh : preset.titleEn}
              </h3>
              <span className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                isLight
                  ? 'border-amber-500/40 text-amber-900 bg-amber-100'
                  : isGray
                  ? 'border-slate-500/40 text-amber-300 bg-slate-800'
                  : 'border-amber-400/40 text-amber-300 bg-amber-400/10'
              }`}>
                Live Preview
              </span>
            </div>
            <p className={`text-[11px] font-sans truncate hidden sm:block ${
              isLight ? 'text-neutral-600' : isGray ? 'text-slate-400' : 'text-neutral-400'
            }`}>
              {event.name}
            </p>
          </div>
        </div>

        {/* Center: Device & Tab Switchers */}
        <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
          isLight
            ? 'bg-amber-100/70 border-amber-300/50'
            : isGray
            ? 'bg-slate-800/90 border-slate-700'
            : 'bg-black/60 border-white/10'
        }`}>
          <button
            type="button"
            onClick={() => setPreviewTab('invitation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-khmer font-bold transition-all ${
              previewTab === 'invitation'
                ? 'bg-amber-400 text-amber-950 shadow'
                : isLight
                ? 'text-neutral-700 hover:text-neutral-950'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'kh' ? 'ទិដ្ឋភាពធៀប' : 'Invitation'}
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab('schedule')}
            className={`px-3 py-1.5 rounded-lg text-xs font-khmer font-bold transition-all ${
              previewTab === 'schedule'
                ? 'bg-amber-400 text-amber-950 shadow'
                : isLight
                ? 'text-neutral-700 hover:text-neutral-950'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'kh' ? 'កាលវិភាគ' : 'Schedule'}
          </button>

          <div className={`w-[1px] h-4 mx-1 hidden sm:block ${
            isLight ? 'bg-amber-400/40' : 'bg-white/20'
          }`} />

          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded-lg text-xs transition-all hidden sm:flex items-center gap-1 ${
              deviceMode === 'mobile'
                ? isLight
                  ? 'bg-amber-300 text-amber-950 shadow-sm'
                  : 'bg-white/20 text-amber-300'
                : isLight
                ? 'text-neutral-700 hover:text-neutral-950'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-[11px]">Phone</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded-lg text-xs transition-all hidden sm:flex items-center gap-1 ${
              deviceMode === 'desktop'
                ? isLight
                  ? 'bg-amber-300 text-amber-950 shadow-sm'
                  : 'bg-white/20 text-amber-300'
                : isLight
                ? 'text-neutral-700 hover:text-neutral-950'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
            <span className="text-[11px]">Desktop</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {event.config?.background_music && (
            <button
              type="button"
              onClick={toggleAudio}
              className={`p-2 rounded-xl border transition-all ${
                isPlayingAudio
                  ? 'border-amber-400 bg-amber-400 text-amber-950 animate-pulse'
                  : isLight
                  ? 'border-amber-300 bg-white/70 text-amber-900 hover:bg-amber-100'
                  : isGray
                  ? 'border-slate-600 bg-slate-800 text-slate-300 hover:text-white'
                  : 'border-white/20 bg-white/5 text-neutral-300 hover:text-white'
              }`}
              title="Preview Music"
            >
              {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                }
                onEdit(preset);
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 hover:bg-amber-400 hover:text-amber-950 font-bold text-xs sm:text-sm font-khmer transition-all shadow-lg flex items-center gap-1.5"
            >
              <LayoutTemplate className="w-4 h-4" />
              <span className="hidden xs:inline">{language === 'kh' ? 'កែសម្រួលព័ត៌មាន' : 'Edit Info'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onApply(preset)}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 font-bold text-xs sm:text-sm font-khmer hover:from-amber-300 hover:to-amber-200 transition-all shadow-lg flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span className="hidden xs:inline">{language === 'kh' ? 'ប្រើគំរូនេះ' : 'Apply'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause();
              }
              onClose();
            }}
            className={`p-2 rounded-xl border transition-colors ${
              isLight
                ? 'border-amber-400/40 text-neutral-700 hover:text-black hover:bg-amber-100'
                : isGray
                ? 'border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                : 'border-white/20 hover:bg-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PREVIEW CANVAS CONTAINER */}
      <div className={`flex-1 overflow-auto p-2 sm:p-6 flex items-center justify-center ${
        isLight
          ? 'bg-radial from-amber-100/50 via-[#f0e6d6] to-[#e4d8c5]'
          : isGray
          ? 'bg-radial from-slate-900 via-slate-950 to-black'
          : 'bg-radial from-neutral-900 via-black to-neutral-950'
      }`}>
        {deviceMode === 'mobile' ? (
          /* SMARTPHONE MOCKUP FRAME */
          <div className="relative w-full max-w-[420px] h-[85vh] max-h-[860px] rounded-[42px] p-3 sm:p-3.5 bg-neutral-900 border-[6px] border-[#2d2822] shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(245,184,15,0.15)] flex flex-col ring-1 ring-amber-500/30">
            {/* Dynamic Island / Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 mr-2" />
              <div className="w-2 h-2 rounded-full bg-blue-900/60" />
            </div>

            {/* Inner Phone Screen */}
            <div className="relative w-full h-full rounded-[32px] overflow-y-auto overflow-x-hidden bg-[#0a0908] text-white custom-scrollbar select-text">
              {/* Phone Status Bar */}
              <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-mono text-neutral-400 shrink-0 sticky top-0 z-20 bg-black/40 backdrop-blur-md">
                <span>09:41</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {previewTab === 'invitation' ? (
                /* INVITATION PREVIEW CONTENT */
                <div className="space-y-8 pb-12">
                  {/* Traditional Khmer Ribbon / Royal Header */}
                  <div className="relative pt-4 text-center px-4">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-400/10 via-amber-400/20 to-amber-400/10 text-amber-300 text-xs font-khmer font-bold shadow">
                      <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
                      <span>{language === 'kh' ? 'សិរីសួស្តី ជ័យមង្គល វិបុលសុខ' : 'Auspicious Celebration'}</span>
                    </div>

                    <h1 className="text-xl sm:text-2xl font-extrabold text-amber-200 font-khmer mt-4 leading-tight tracking-wide drop-shadow-md">
                      {event.name}
                    </h1>

                    <p className="text-xs text-amber-300/80 font-mono mt-1">
                      {language === 'kh' ? invKh?.date_time : invEn?.date_time}
                    </p>
                  </div>

                  {/* Hero Cover Card */}
                  <div className="px-4">
                    <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-2xl aspect-[4/5] bg-neutral-900">
                      <img
                        src={event.image || preset.coverImage}
                        alt="Event Cover"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      <div className="absolute bottom-4 inset-x-4 text-center space-y-1">
                        <p className="text-lg font-bold text-amber-100 font-khmer">
                          {language === 'kh'
                            ? (event.singlePerson ? event.groom : `${event.groom} & ${event.bride}`)
                            : (event.singlePerson ? (event.groomEn || event.groom) : `${event.groomEn || event.groom} & ${event.brideEn || event.bride}`)}
                        </p>
                        <p className="text-xs text-neutral-300 font-khmer flex items-center justify-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{event.location}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Invitation Letter Section */}
                  <div className="px-4">
                    <div className="p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#1c1815] to-[#12100e] text-center space-y-4 shadow-xl">
                      <div className="space-y-1">
                        <span className="text-[10px] text-amber-400 font-mono uppercase tracking-widest">
                          INVITATION LETTER
                        </span>
                        <h2 className="text-sm font-bold text-amber-200 font-khmer">
                          {language === 'kh' ? invKh?.invitation_title || 'លិខិតអញ្ជើញជាកិត្តិយស' : invEn?.invitation_title || 'Honorary Invitation'}
                        </h2>
                      </div>

                      <p className="text-xs text-neutral-300 font-khmer leading-relaxed">
                        {language === 'kh' ? invKh?.invitation_message : invEn?.invitation_message}
                      </p>

                      <div className="pt-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono">
                          {language === 'kh' ? `ពិសាភោជនាហារ៖ ${event.eating_time}` : `Banquet: ${event.eating_time}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights of Agenda */}
                  <div className="px-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-amber-300 font-khmer flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{language === 'kh' ? 'កម្មវិធីសង្ខេប' : 'Agenda Highlights'}</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setPreviewTab('schedule')}
                        className="text-[11px] text-amber-400 underline font-khmer font-bold"
                      >
                        {language === 'kh' ? 'មើលលម្អិត' : 'View Full'}
                      </button>
                    </div>

                    <div className="space-y-2">
                      {event.schedules?.[0]?.shifts?.[0]?.timeLine?.slice(0, 4).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs font-khmer"
                        >
                          <span className="text-white font-medium">{item.name}</span>
                          <span className="text-amber-300 font-mono text-[11px] font-bold">
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location & Map Card */}
                  <div className="px-4">
                    <div className="p-4 rounded-2xl bg-neutral-900 border border-amber-500/30 space-y-3">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-white font-khmer">
                            {language === 'kh' ? 'ទីតាំងប្រារព្ធពិធី' : 'Event Location'}
                          </h4>
                          <p className="text-xs text-neutral-300 font-khmer mt-0.5">
                            {event.location}
                          </p>
                        </div>
                      </div>

                      {event.config?.map_url && (
                        <a
                          href={event.config.map_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 rounded-xl bg-amber-400/10 border border-amber-400/40 text-amber-300 hover:bg-amber-400/20 text-xs font-bold font-khmer flex items-center justify-center gap-1.5 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{language === 'kh' ? 'បើកមើលផែនទី Google Maps' : 'Open Google Maps'}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Photo Gallery Grid Preview - Enlarged & Prominent */}
                  {galleryImages.length > 0 && (
                    <div className="px-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-amber-300 font-khmer flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>{language === 'kh' ? 'កម្រងរូបភាពអនុស្សាវរីយ៍' : 'Photo Gallery'}</span>
                        </h3>
                        <span className="text-[10px] text-amber-400/80 font-mono">
                          {galleryImages.length} {language === 'kh' ? 'សន្លឹក' : 'photos'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                        {galleryImages.slice(0, 6).map((img, i) => (
                          <div
                            key={i}
                            className="group relative aspect-[3/4] sm:aspect-[4/5] min-h-[160px] sm:min-h-[220px] rounded-2xl overflow-hidden border-2 border-amber-400/40 bg-neutral-900 shadow-xl transition-all duration-300 hover:border-amber-300 hover:shadow-amber-500/20"
                          >
                            <img
                              src={img}
                              alt={`Gallery Preview ${i + 1}`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-sm text-[10px] text-amber-300 font-mono font-bold border border-amber-400/30 shadow">
                              #{i + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KHQR Gift Card Preview */}
                  {(event.config?.qr_code || event.config?.bankInfo?.accountName) && (
                    <div className="px-4">
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-black to-neutral-950 border border-red-500/30 text-center space-y-3">
                        <h4 className="text-xs font-bold text-red-300 font-khmer">
                          {language === 'kh' ? 'ចងដៃតាមប្រព័ន្ធ KHQR Bakong' : 'Gift via KHQR'}
                        </h4>
                        {event.config?.qr_code && (
                          <div className="w-32 h-32 mx-auto rounded-xl p-2 bg-white border border-amber-400/40">
                            <img
                              src={event.config.qr_code}
                              alt="KHQR QR"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        {event.config?.bankInfo?.accountName && (
                          <p className="text-xs font-bold text-white font-mono">
                            {event.config.bankInfo.accountName}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* SCHEDULE TAB PREVIEW */
                <div className="p-4 space-y-6 pb-12">
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-bold text-amber-200 font-khmer">
                      {language === 'kh' ? 'កាលវិភាគពិធីបុណ្យ & កម្មវិធី' : 'Ceremony Schedule'}
                    </h3>
                    <p className="text-xs text-neutral-400 font-khmer">
                      {event.name}
                    </p>
                  </div>

                  {event.schedules?.[0]?.shifts?.map((shift, sIdx) => (
                    <div
                      key={sIdx}
                      className="rounded-2xl border border-white/10 bg-[#14110e] p-3.5 space-y-3 shadow-lg"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <h4 className="text-xs font-bold text-amber-300 font-khmer">
                          {shift.name}
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {shift.date}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {shift.timeLine?.map((item, tIdx) => (
                          <div
                            key={tIdx}
                            className="flex items-start gap-2.5 p-2 rounded-xl bg-black/40 border border-white/5"
                          >
                            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
                              {getTimelineIcon(item.icon, preset.accentColor)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white font-khmer truncate">
                                {item.name}
                              </p>
                              {item.nameEn && (
                                <p className="text-[10px] text-neutral-400 font-sans truncate">
                                  {item.nameEn}
                                </p>
                              )}
                            </div>
                            <span className="text-[11px] font-mono font-bold text-amber-300 shrink-0">
                              {item.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* DESKTOP BROWSER MOCKUP FRAME */
          <div className="relative w-full max-w-5xl h-[85vh] rounded-2xl bg-neutral-900 border border-amber-500/30 shadow-2xl flex flex-col overflow-hidden">
            {/* Desktop Browser Window Header */}
            <div className="h-10 px-4 bg-neutral-950 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>

              <div className="px-6 py-1 rounded-md bg-black/50 border border-white/10 text-[11px] font-mono text-neutral-400 flex items-center gap-2 max-w-md w-full justify-center truncate">
                <span>https://wedding.invitation.kh/event/{event.id}</span>
              </div>

              <div className="w-16" />
            </div>

            {/* Desktop Inner Frame Body */}
            <div className="flex-1 overflow-y-auto bg-[#0a0908] text-white p-6 sm:p-10 custom-scrollbar">
              <div className="max-w-3xl mx-auto space-y-10 pb-16">
                <div className="text-center space-y-3">
                  <span className="inline-block px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-xs font-khmer font-bold">
                    {language === 'kh' ? 'សិរីសួស្តី ជ័យមង្គល វិបុលសុខ' : 'Auspicious Celebration'}
                  </span>
                  <h1 className="text-3xl font-extrabold text-amber-200 font-khmer">
                    {event.name}
                  </h1>
                  <p className="text-sm text-neutral-300 font-mono">
                    {language === 'kh' ? invKh?.date_time : invEn?.date_time}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-xl aspect-[4/5]">
                    <img
                      src={event.image || preset.coverImage}
                      alt="Cover"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-4 p-6 rounded-2xl bg-neutral-900 border border-white/10">
                    <h3 className="text-base font-bold text-amber-300 font-khmer">
                      {language === 'kh' ? invKh?.invitation_title || 'លិខិតអញ្ជើញជាកិត្តិយស' : invEn?.invitation_title || 'Honorary Invitation'}
                    </h3>
                    <p className="text-xs text-neutral-300 font-khmer leading-relaxed">
                      {language === 'kh' ? invKh?.invitation_message : invEn?.invitation_message}
                    </p>
                    <div className="pt-3 border-t border-white/10 space-y-2 text-xs font-khmer">
                      <p className="flex items-center gap-2 text-amber-200">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>{language === 'kh' ? `ពិសារភោជនាហារ៖ ${event.eating_time}` : `Banquet: ${event.eating_time}`}</span>
                      </p>
                      <p className="flex items-center gap-2 text-neutral-300">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <span>{event.location}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Schedule List */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-amber-300 font-khmer">
                    {language === 'kh' ? 'កាលវិភាគពិធីបុណ្យ' : 'Ceremony Timeline'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {event.schedules?.[0]?.shifts?.[0]?.timeLine?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-between text-xs font-khmer"
                      >
                        <span className="text-white font-medium">{item.name}</span>
                        <span className="text-amber-300 font-mono font-bold">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photo Gallery in Desktop View */}
                {galleryImages.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-amber-300 font-khmer flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>{language === 'kh' ? 'កម្រងរូបភាពអនុស្សាវរីយ៍' : 'Photo Gallery'}</span>
                      </h3>
                      <span className="text-xs text-amber-400/80 font-mono">
                        {galleryImages.length} {language === 'kh' ? 'សន្លឹក' : 'photos'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {galleryImages.slice(0, 6).map((img, i) => (
                        <div
                          key={i}
                          className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-amber-400/40 bg-neutral-900 shadow-xl transition-all duration-300 hover:border-amber-300 hover:shadow-amber-500/20"
                        >
                          <img
                            src={img}
                            alt={`Gallery ${i + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-sm text-xs text-amber-300 font-mono font-bold border border-amber-400/30">
                            #{i + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
