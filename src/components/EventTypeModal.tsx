import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Heart,
  Home,
  Cake,
  Sparkles,
  Check,
  Plus,
  Calendar,
  MapPin,
  Clock,
  Music,
  Palette,
  ArrowRight,
  ArrowLeft,
  Eye,
  Sliders,
  Scissors,
  Flame,
  Utensils,
  Gift,
  Users,
  Wine,
  Crown,
  CalendarCheck,
  LayoutTemplate,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Language, WeddingEvent } from '../types';
import { ThemeMode } from './ThemeToggle';
import { EVENT_PRESETS, EventTypePreset } from '../data/eventTemplates';
import TemplateLivePreview from './TemplateLivePreview';

interface EventTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentEvent: WeddingEvent;
  onApplyTemplate: (eventData: WeddingEvent) => void;
  onEditTemplate?: (eventData: WeddingEvent) => void;
  theme?: ThemeMode;
}

export default function EventTypeModal({
  isOpen,
  onClose,
  language,
  currentEvent,
  onApplyTemplate,
  onEditTemplate,
  theme = 'dark',
}: EventTypeModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<EventTypePreset>(EVENT_PRESETS[0]);
  const [viewingProgramPreset, setViewingProgramPreset] = useState<EventTypePreset | null>(null);
  const [livePreviewPreset, setLivePreviewPreset] = useState<EventTypePreset | null>(null);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [filterType, setFilterType] = useState<string>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Custom Event Form State
  const [customType, setCustomType] = useState<'wedding' | 'engagement' | 'housewarming' | 'birthday' | 'anniversary'>('wedding');
  const [customName, setCustomName] = useState('');
  const [customHost1, setCustomHost1] = useState('');
  const [customHost2, setCustomHost2] = useState('');
  const [customDate, setCustomDate] = useState('2026-10-20');
  const [customTime, setCustomTime] = useState('05:00 PM');
  const [customLocation, setCustomLocation] = useState('');

  const handleSelectCategory = (t: string) => {
    if (filterType === t && t !== 'all') {
      setFilterType('all');
      setSuccessToast(language === 'kh' ? 'បានលុបការជ្រើសរើស (Unselected)' : 'Unselected');
      setTimeout(() => setSuccessToast(null), 2000);
      return;
    }
    setFilterType(t);
    if (t !== 'all') {
      const matched = EVENT_PRESETS.find((p) => p.type === t);
      if (matched) {
        setSelectedPreset(matched);
        if (viewingProgramPreset) {
          setViewingProgramPreset(matched);
        }
        setSuccessToast(
          language === 'kh'
            ? `បានជ្រើសរើសប្រភេទ៖ ${matched.titleKh}`
            : `Selected Category: ${matched.titleEn}`
        );
        setTimeout(() => setSuccessToast(null), 2500);
      }
    } else {
      if (viewingProgramPreset) {
        setViewingProgramPreset(EVENT_PRESETS[0]);
      }
    }
  };

  const getIcon = (type: string, className = 'w-5 h-5') => {
    switch (type) {
      case 'wedding':
        return <Heart className={className} />;
      case 'engagement':
        return <Sparkles className={className} />;
      case 'housewarming':
        return <Home className={className} />;
      case 'birthday':
        return <Cake className={className} />;
      case 'anniversary':
        return <Crown className={className} />;
      default:
        return <Sparkles className={className} />;
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

  const [preserveDesignSettings, setPreserveDesignSettings] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wedding_preserve_design_settings');
      return stored !== null ? stored === 'true' : false;
    }
    return false;
  });

  const handleTogglePreserveDesign = (val: boolean) => {
    setPreserveDesignSettings(val);
    try {
      localStorage.setItem('wedding_preserve_design_settings', String(val));
    } catch (e) {}
  };

  const getSavedTemplateData = (presetId: string): WeddingEvent | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(`wedding_template_saved_${presetId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return null;
  };

  const handleResetPresetSavedData = (presetId: string, title: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(`wedding_template_saved_${presetId}`);
      setSuccessToast(language === 'kh' ? `បានស្ដារការកំណត់ដើមសម្រាប់ "${title}"!` : `Restored original defaults for "${title}"!`);
      setTimeout(() => setSuccessToast(null), 2500);
    } catch (e) {}
  };

  const buildEffectiveEvent = (preset: EventTypePreset): WeddingEvent => {
    // 1. Check if user has explicitly saved customizations for this preset
    const saved = getSavedTemplateData(preset.sampleEvent.id);
    if (saved) {
      return {
        ...saved,
        eventType: preset.type,
        singlePerson: preset.type === 'birthday' ? true : (saved.singlePerson ?? false),
      };
    }

    // 2. If preserveDesignSettings is ON, merge current customized design properties
    if (preserveDesignSettings && currentEvent?.config) {
      return {
        ...preset.sampleEvent,
        eventType: preset.type,
        singlePerson: preset.type === 'birthday' ? true : false,
        config: {
          ...preset.sampleEvent.config,
          cover_background: currentEvent.config.cover_background !== undefined ? currentEvent.config.cover_background : preset.sampleEvent.config.cover_background,
          hide_cover_background: currentEvent.config.hide_cover_background !== undefined ? currentEvent.config.hide_cover_background : preset.sampleEvent.config.hide_cover_background,
          envelope_frame: currentEvent.config.envelope_frame || preset.sampleEvent.config.envelope_frame,
          envelope_header_image: currentEvent.config.envelope_header_image || preset.sampleEvent.config.envelope_header_image,
          primaryColor: currentEvent.config.primaryColor || preset.sampleEvent.config.primaryColor,
          textColor: currentEvent.config.textColor || preset.sampleEvent.config.textColor,
          cover_en_name_color: currentEvent.config.cover_en_name_color || preset.sampleEvent.config.cover_en_name_color,
          cover_en_font_family: currentEvent.config.cover_en_font_family || preset.sampleEvent.config.cover_en_font_family,
          cover_subtitle_kh: currentEvent.config.cover_subtitle_kh || preset.sampleEvent.config.cover_subtitle_kh,
          cover_subtitle_en: currentEvent.config.cover_subtitle_en || preset.sampleEvent.config.cover_subtitle_en,
          guest_frame_style: currentEvent.config.guest_frame_style || preset.sampleEvent.config.guest_frame_style,
          guest_label_text: currentEvent.config.guest_label_text || preset.sampleEvent.config.guest_label_text,
          background_music: currentEvent.config.background_music || preset.sampleEvent.config.background_music,
        },
      };
    }

    return {
      ...preset.sampleEvent,
      eventType: preset.type,
      singlePerson: preset.type === 'birthday' ? true : false,
    };
  };

  const handleApply = async (preset: EventTypePreset) => {
    // Build fresh event data for the chosen template preset
    const freshPresetEvent: WeddingEvent = {
      ...preset.sampleEvent,
      eventType: preset.type,
      singlePerson: preset.type === 'birthday' ? true : false,
      updatedAt: new Date().toISOString(),
    };
    
    // Set a loading/saving toast message
    setSuccessToast(
      language === 'kh'
        ? `កំពុងផ្លាស់ប្តូរទៅកាន់ "${preset.titleKh}"...`
        : `Switching to "${preset.titleEn}"...`
    );

    try {
      localStorage.setItem('wedding_custom_event_data', JSON.stringify(freshPresetEvent));
      localStorage.setItem(`wedding_template_saved_${preset.sampleEvent.id}`, JSON.stringify(freshPresetEvent));
      localStorage.setItem('wedding_last_active_template_id', preset.sampleEvent.id);
      localStorage.setItem('wedding_last_template_type', preset.type);
    } catch (e) {}

    // Save the event data completely to server/localStorage/Firebase
    await onApplyTemplate(freshPresetEvent);

    setSuccessToast(
      language === 'kh'
        ? `បានផ្លាស់ប្តូរទៅកាន់ "${preset.titleKh}" ដោយជោគជ័យ!`
        : `Successfully switched to "${preset.titleEn}"!`
    );

    setTimeout(() => {
      setSuccessToast(null);
      onClose();
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('type', preset.type);
        url.searchParams.set('id', preset.sampleEvent.id);
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}
      window.location.reload();
    }, 600);
  };

  const handleEdit = (preset: EventTypePreset) => {
    const eventToEdit = buildEffectiveEvent(preset);
    if (onEditTemplate) {
      onEditTemplate(eventToEdit);
    } else {
      onApplyTemplate(eventToEdit);
      onClose();
    }
  };

  const handleCreateCustom = () => {
    const basePreset = EVENT_PRESETS.find((p) => p.type === customType) || EVENT_PRESETS[0];
    const newEvent: WeddingEvent = {
      ...basePreset.sampleEvent,
      id: `custom-event-${Date.now()}`,
      name: customName || (language === 'kh' ? basePreset.titleKh : basePreset.titleEn),
      groom: customHost1 || basePreset.sampleEvent.groom,
      bride: customHost2 || basePreset.sampleEvent.bride,
      location: customLocation || basePreset.sampleEvent.location,
      eating_time: customTime || basePreset.sampleEvent.eating_time,
      startTime: `${customDate}T17:00:00+07:00`,
      singlePerson: customType === 'birthday' ? true : false,
    };

    onApplyTemplate(newEvent);
    setSuccessToast(
      language === 'kh'
        ? 'បានបង្កើត និងប្រើប្រាស់កម្មវិធីថ្មីដោយជោគជ័យ!'
        : 'Created and applied new custom event successfully!'
    );
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 1200);
  };

  const filteredPresets = filterType === 'all'
    ? EVENT_PRESETS
    : filterType === 'celebration'
    ? EVENT_PRESETS.filter((p) => p.type === 'birthday' || p.type === 'anniversary')
    : EVENT_PRESETS.filter((p) => p.type === filterType);

  const isLight = theme === 'light';
  const isGray = theme === 'gray';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md overflow-y-auto ${
        isLight ? 'bg-amber-950/40' : isGray ? 'bg-slate-950/75' : 'bg-black/85'
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25 }}
          className={`relative w-full max-w-4xl border-2 rounded-3xl overflow-hidden flex flex-col max-h-[92vh] ${
            isLight
              ? 'bg-gradient-to-b from-[#faf8f4] via-[#f5ede0] to-[#eae0ce] border-amber-500/50 ring-1 ring-amber-500/20 text-neutral-900 shadow-[0_25px_80px_rgba(212,175,55,0.25)]'
              : isGray
              ? 'bg-gradient-to-b from-[#1f242d] via-[#181c23] to-[#12151b] border-slate-600/70 ring-1 ring-slate-500/20 text-slate-100 shadow-[0_25px_80px_rgba(0,0,0,0.85)]'
              : 'bg-gradient-to-b from-[#1a140f] via-[#120e0b] to-[#0c0907] border-amber-400/50 ring-1 ring-amber-500/20 text-white shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(245,184,15,0.18)]'
          }`}
        >
          {/* Traditional Khmer Corner Gold Ornaments */}
          <div className={`absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg pointer-events-none ${
            isLight ? 'border-amber-600/70' : isGray ? 'border-slate-500/80' : 'border-amber-400/60'
          }`} />
          <div className={`absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg pointer-events-none ${
            isLight ? 'border-amber-600/70' : isGray ? 'border-slate-500/80' : 'border-amber-400/60'
          }`} />
          <div className={`absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg pointer-events-none ${
            isLight ? 'border-amber-600/70' : isGray ? 'border-slate-500/80' : 'border-amber-400/60'
          }`} />
          <div className={`absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 rounded-br-lg pointer-events-none ${
            isLight ? 'border-amber-600/70' : isGray ? 'border-slate-500/80' : 'border-amber-400/60'
          }`} />

          {/* Top Header Banner */}
          <div className={`relative px-6 py-5 border-b flex items-center justify-between ${
            isLight
              ? 'border-amber-500/30 bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/90'
              : isGray
              ? 'border-slate-700/60 bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90'
              : 'border-amber-500/30 bg-gradient-to-r from-amber-950/70 via-black to-amber-950/70'
          }`}>
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 text-amber-950 flex items-center justify-center shadow-[0_4px_20px_rgba(245,184,15,0.4)] font-bold border border-amber-200/50 shrink-0">
                <Sparkles className="w-6 h-6 text-amber-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`text-base sm:text-xl font-moul ${
                    isLight
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950'
                      : isGray
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-amber-300 to-slate-100'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 drop-shadow-[0_2px_8px_rgba(245,184,15,0.3)]'
                  }`}>
                    {language === 'kh' ? 'ប្រភេទធៀប និងកម្មវិធីបុណ្យ' : 'Event Types & Templates'}
                  </h2>
                </div>
                <p className={`text-xs sm:text-sm font-khmer mt-0.5 ${
                  isLight ? 'text-amber-900/80 font-medium' : isGray ? 'text-slate-300' : 'text-amber-300/80'
                }`}>
                  {language === 'kh'
                    ? 'ជ្រើសរើសប្រភេទធៀបមង្គលការ ភ្ជាប់ពាក្យ ឡើងផ្ទះថ្មី ឬខួបកំណើត'
                    : 'Choose or create Wedding, Engagement, Housewarming, or Birthday templates'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`p-2 rounded-xl border transition-all ${
                  isLight
                    ? 'text-amber-950 hover:bg-amber-500/15 border-amber-600/30'
                    : isGray
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700'
                    : 'text-neutral-400 hover:text-amber-200 hover:bg-amber-400/10 border-white/10 hover:border-amber-400/30'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className={`flex items-center justify-between px-6 py-3 border-b ${
            isLight ? 'border-amber-500/20 bg-amber-100/50' : isGray ? 'border-slate-700/60 bg-slate-900/80' : 'border-amber-500/20 bg-black/60'
          }`}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-khmer transition-all flex items-center gap-2 ${
                  activeTab === 'presets'
                    ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 shadow-[0_4px_15px_rgba(245,184,15,0.35)] border border-amber-200'
                    : isLight
                    ? 'text-amber-900/80 hover:text-amber-950 hover:bg-amber-500/15 border border-transparent'
                    : isGray
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent'
                    : 'text-amber-200/70 hover:text-amber-200 hover:bg-amber-400/10 border border-transparent'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{language === 'kh' ? `គំរូកម្មវិធីទាំងអស់ (${EVENT_PRESETS.length} គំរូ)` : `All ${EVENT_PRESETS.length} Event Templates`}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-khmer transition-all flex items-center gap-2 ${
                  activeTab === 'custom'
                    ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 shadow-[0_4px_15px_rgba(245,184,15,0.35)] border border-amber-200'
                    : isLight
                    ? 'text-amber-900/80 hover:text-amber-950 hover:bg-amber-500/15 border border-transparent'
                    : isGray
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent'
                    : 'text-amber-200/70 hover:text-amber-200 hover:bg-amber-400/10 border border-transparent'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'kh' ? 'បង្កើតកម្មវិធីផ្ទាល់ខ្លួន' : 'Create Custom Event'}</span>
              </button>
            </div>

            {activeTab === 'presets' && (
              <div className="flex items-center gap-1.5 ml-4 min-w-0 flex-1 justify-end group">
                <button
                  type="button"
                  onClick={() => scrollCategories('left')}
                  className={`shrink-0 p-1 rounded-lg border transition-all opacity-100 ${
                    isLight ? 'bg-white border-amber-200 text-amber-800 hover:bg-amber-50' : 'bg-black/40 border-white/10 text-amber-200 hover:bg-white/5'
                  } shadow-sm z-10`}
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div 
                  ref={categoryScrollRef}
                  className="flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar py-1 max-w-full scroll-smooth"
                >
                  {['all', 'wedding', 'engagement', 'housewarming', 'celebration'].map((t) => {
                    const isSelected = filterType === t;
                    const categoryActiveStyle = isLight
                      ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 border-amber-400 font-bold shadow-[0_2px_10px_rgba(245,184,15,0.3)] ring-1 ring-amber-400/50'
                      : isGray
                      ? 'bg-slate-700 text-amber-300 border-amber-400/60 font-bold shadow-sm ring-1 ring-amber-400/30'
                      : 'bg-gradient-to-r from-amber-400/25 to-amber-400/15 text-amber-300 border-amber-400/60 font-bold shadow-[0_0_15px_rgba(245,184,15,0.25)] ring-1 ring-amber-400/40';

                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleSelectCategory(t)}
                        className={`px-3 py-1.5 rounded-xl capitalize font-khmer transition-all flex items-center gap-1.5 shrink-0 cursor-pointer text-xs active:scale-95 border ${
                          isSelected
                            ? categoryActiveStyle
                            : isLight
                            ? 'border-transparent text-amber-900/50 hover:text-amber-950 hover:bg-amber-200/40 opacity-70 hover:opacity-100'
                            : isGray
                            ? 'border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800 opacity-70 hover:opacity-100'
                            : 'border-transparent text-neutral-500 hover:text-neutral-200 hover:bg-white/5 opacity-70 hover:opacity-100'
                        }`}
                      >
                        {t === 'all' && <LayoutGrid className="w-3.5 h-3.5" />}
                        {t === 'wedding' && <Heart className="w-3.5 h-3.5 text-amber-500" />}
                        {t === 'engagement' && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                        {t === 'housewarming' && <Home className="w-3.5 h-3.5 text-amber-500" />}
                        {t === 'celebration' && (
                          <div className="flex items-center -space-x-1">
                            <Cake className="w-3.5 h-3.5 text-amber-500 relative z-10" />
                            <Crown className="w-3.5 h-3.5 text-amber-500 opacity-80" />
                          </div>
                        )}
                        <span>
                          {t === 'all'
                            ? language === 'kh' ? 'ទាំងអស់' : 'All'
                            : t === 'wedding'
                            ? language === 'kh' ? 'មង្គលការ' : 'Wedding'
                            : t === 'engagement'
                            ? language === 'kh' ? 'ភ្ជាប់ពាក្យ' : 'Engagement'
                            : t === 'housewarming'
                            ? language === 'kh' ? 'ឡើងផ្ទះ' : 'House'
                            : language === 'kh' ? 'ខួបកំណើត & មង្គលការ' : 'Birthday & Anniversary'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => scrollCategories('right')}
                  className={`shrink-0 p-1 rounded-lg border transition-all opacity-100 ${
                    isLight ? 'bg-white border-amber-200 text-amber-800 hover:bg-amber-50' : 'bg-black/40 border-white/10 text-amber-200 hover:bg-white/5'
                  } shadow-sm z-10`}
                  title="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Success Toast */}
          <AnimatePresence>
            {successToast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-6 mt-4 p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-600 dark:text-emerald-200 text-sm font-khmer font-bold flex items-center gap-2.5 shadow-lg"
              >
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{successToast}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
            {/* Remember Saved Design Settings Toggle Bar */}
            {activeTab === 'presets' && !viewingProgramPreset && (
              <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isLight
                  ? 'bg-amber-100/70 border-amber-300/80 text-amber-950 shadow-sm'
                  : isGray
                  ? 'bg-slate-800/80 border-slate-700 text-slate-100'
                  : 'bg-black/60 border-amber-500/30 text-amber-100'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border shrink-0 ${
                    preserveDesignSettings
                      ? 'bg-amber-500/20 border-amber-500 text-amber-500'
                      : isLight ? 'bg-neutral-200 border-neutral-300 text-neutral-500' : 'bg-white/5 border-white/10 text-neutral-400'
                  }`}>
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold font-khmer flex items-center gap-1.5">
                      <span>{language === 'kh' ? 'រក្សាការកំណត់ដាច់ដោយឡែកតាមប្រភេទនិមួយៗ (Separate Settings Per Event Type)' : 'Independent Settings Per Event Type'}</span>
                      {!preserveDesignSettings ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-400/40">
                          {language === 'kh' ? 'តាមប្រភេទនិមួយៗ (Per Type)' : 'Per Type Active'}
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-400/40">
                          {language === 'kh' ? 'ចែករំលែករួម' : 'Shared Design'}
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] ${isLight ? 'text-amber-900/70' : 'text-neutral-400'} font-khmer mt-0.5`}>
                      {language === 'kh'
                        ? 'ប្រភេទនិមួយៗ (មង្គលការ, ភ្ជាប់ពាក្យ, ឡើងផ្ទះ, ខួបកំណើត, ខួបមង្គលការ) មានរូប Cover, ពណ៌, ស៊ុម, កាលវិភាគ និងការកំណត់ផ្ទាល់ខ្លួនដាច់ដោយឡែកពីគ្នា។'
                        : 'Each event type (Wedding, Engagement, Housewarming, Birthday, Anniversary) has its own distinct wallpapers, colors, frames, schedules, and settings.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTogglePreserveDesign(!preserveDesignSettings)}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-khmer font-bold flex items-center gap-1.5 transition-all self-end sm:self-auto shrink-0 shadow-sm ${
                    !preserveDesignSettings
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 ring-2 ring-emerald-400/30'
                      : isLight
                      ? 'bg-amber-400 hover:bg-amber-300 text-amber-950 border-amber-500'
                      : 'bg-black/60 hover:bg-white/10 text-neutral-300 border-white/20'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${!preserveDesignSettings ? 'opacity-100 stroke-[3]' : 'opacity-70'}`} />
                  <span>{!preserveDesignSettings ? (language === 'kh' ? 'តាមប្រភេទនិមួយៗ' : 'Per Type (Distinct)') : (language === 'kh' ? 'ចែករំលែករួម' : 'Shared Design')}</span>
                </button>
              </div>
            )}
            {viewingProgramPreset ? (
              /* Program / Schedule Timeline Detail Viewer */
              <div className="space-y-6">
                {/* Back button & Title */}
                <div className={`flex items-center justify-between gap-4 pb-3 border-b ${
                  isLight ? 'border-amber-500/20' : 'border-amber-500/20'
                }`}>
                  <button
                    type="button"
                    onClick={() => setViewingProgramPreset(null)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-khmer text-xs font-bold transition-all shadow ${
                      isLight
                        ? 'border-amber-600/30 bg-amber-100 text-amber-950 hover:bg-amber-200'
                        : 'border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{language === 'kh' ? 'ត្រឡប់ទៅបញ្ជីគំរូ' : 'Back to Templates'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLivePreviewPreset(viewingProgramPreset)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-khmer font-bold transition-all shadow ${
                        isLight
                          ? 'border-amber-500/60 bg-amber-200/80 text-amber-950 hover:bg-amber-300'
                          : 'border-amber-400/50 bg-gradient-to-r from-amber-400/20 via-amber-400/10 to-amber-400/20 text-amber-200 hover:text-white hover:border-amber-300'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-500" />
                      <span>{language === 'kh' ? 'មើលគំរូធៀបផ្ទាល់ (Live Preview)' : 'Live Preview'}</span>
                    </button>

                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold font-khmer hidden sm:inline-block"
                      style={{
                        backgroundColor: `${viewingProgramPreset.accentColor}25`,
                        color: viewingProgramPreset.accentColor,
                        border: `1px solid ${viewingProgramPreset.accentColor}50`,
                      }}
                    >
                      {language === 'kh' ? viewingProgramPreset.titleKh : viewingProgramPreset.titleEn}
                    </span>
                  </div>
                </div>

                {/* Event Summary Banner */}
                <div className={`relative rounded-2xl border overflow-hidden p-5 shadow-xl ${
                  isLight
                    ? 'border-amber-500/40 bg-gradient-to-r from-amber-50 via-white to-amber-50'
                    : isGray
                    ? 'border-slate-700 bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90'
                    : 'border-amber-500/30 bg-gradient-to-r from-black/80 via-black/60 to-black/80'
                }`}>
                  <div
                    className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
                    style={{ backgroundImage: `url(${viewingProgramPreset.coverImage})` }}
                  />
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shadow"
                          style={{
                            backgroundColor: `${viewingProgramPreset.accentColor}30`,
                            color: viewingProgramPreset.accentColor,
                          }}
                        >
                          {getIcon(viewingProgramPreset.type, 'w-4 h-4')}
                        </div>
                        <h3 className={`text-base sm:text-lg font-bold font-khmer ${
                          isLight ? 'text-amber-950' : isGray ? 'text-slate-100' : 'text-white'
                        }`}>
                          {viewingProgramPreset.sampleEvent.name}
                        </h3>
                      </div>
                      <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-khmer ${
                        isLight ? 'text-amber-900/80' : isGray ? 'text-slate-300' : 'text-neutral-300'
                      }`}>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-500" />
                          {language === 'kh'
                            ? viewingProgramPreset.sampleEvent.config.invitation_kh.date_time
                            : viewingProgramPreset.sampleEvent.config.invitation_en.date_time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          {language === 'kh' ? 'ពិសាភោជនាហារ៖ ' : 'Banquet: '}
                          {viewingProgramPreset.sampleEvent.eating_time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          {viewingProgramPreset.sampleEvent.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleEdit(viewingProgramPreset)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 hover:bg-amber-400 hover:text-amber-950 font-bold text-xs font-khmer transition-all shadow-lg flex items-center justify-center gap-2 shrink-0"
                      >
                        <LayoutTemplate className="w-4 h-4" />
                        <span>{language === 'kh' ? 'កែសម្រួលព័ត៌មាន' : 'Edit Info'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApply(viewingProgramPreset)}
                        className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 font-bold text-xs font-khmer hover:from-amber-300 hover:to-amber-200 transition-all shadow-lg flex items-center justify-center gap-2 shrink-0"
                      >
                        <Check className="w-4 h-4" />
                        <span>{language === 'kh' ? 'ប្រើប្រាស់គំរូនេះ' : 'Apply Program'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detailed Shifts & Timeline List */}
                <div className="space-y-6">
                  {viewingProgramPreset.sampleEvent.schedules?.[0]?.shifts?.map((shift, shiftIndex) => (
                    <div
                      key={`modal-shift-${shift.id || shiftIndex}-${shiftIndex}`}
                      className={`rounded-2xl border p-4 sm:p-5 shadow-lg space-y-4 ${
                        isLight
                          ? 'border-amber-500/30 bg-white/90 shadow-[0_4px_20px_rgba(212,175,55,0.1)]'
                          : isGray
                          ? 'border-slate-700/80 bg-slate-900/80 text-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                          : 'border-white/10 bg-[#151210]'
                      }`}
                    >
                      {/* Shift Header */}
                      <div className={`flex flex-wrap items-center justify-between gap-2 pb-3 border-b ${
                        isLight ? 'border-amber-500/20' : isGray ? 'border-slate-700/70' : 'border-white/10'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-600 dark:text-amber-300 font-bold text-xs flex items-center justify-center font-mono">
                            {shiftIndex + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4
                                className={`text-sm sm:text-base font-bold font-khmer transition-all flex flex-wrap items-center gap-2 ${
                                  isLight
                                    ? viewingProgramPreset.type === 'housewarming'
                                      ? 'text-emerald-950'
                                      : viewingProgramPreset.type === 'engagement'
                                      ? 'text-rose-950'
                                      : viewingProgramPreset.type === 'birthday'
                                      ? 'text-purple-950'
                                      : 'text-amber-950'
                                    : isGray
                                    ? viewingProgramPreset.type === 'housewarming'
                                      ? 'text-emerald-300'
                                      : viewingProgramPreset.type === 'engagement'
                                      ? 'text-rose-300'
                                      : viewingProgramPreset.type === 'birthday'
                                      ? 'text-purple-300'
                                      : 'text-amber-300'
                                    : viewingProgramPreset.type === 'housewarming'
                                    ? 'text-emerald-200 drop-shadow-[0_1px_4px_rgba(16,185,129,0.35)]'
                                    : viewingProgramPreset.type === 'engagement'
                                    ? 'text-rose-200 drop-shadow-[0_1px_4px_rgba(244,63,94,0.35)]'
                                    : viewingProgramPreset.type === 'birthday'
                                    ? 'text-purple-200 drop-shadow-[0_1px_4px_rgba(139,92,246,0.35)]'
                                    : 'text-amber-200 drop-shadow-[0_1px_4px_rgba(245,184,15,0.35)]'
                                }`}
                              >
                                <span>{language === 'kh' ? shift.name : shift.nameEn || shift.name}</span>
                                <span
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-khmer font-bold border shadow-xs"
                                  style={{
                                    backgroundColor: `${viewingProgramPreset.accentColor}20`,
                                    color: viewingProgramPreset.accentColor,
                                    borderColor: `${viewingProgramPreset.accentColor}50`,
                                  }}
                                >
                                  {getIcon(viewingProgramPreset.type, 'w-3 h-3')}
                                  <span>{language === 'kh' ? viewingProgramPreset.badgeKh : viewingProgramPreset.badgeEn}</span>
                                </span>
                              </h4>
                            </div>
                            {shift.date && (
                              <p className={`text-[11px] font-mono mt-0.5 flex items-center gap-1.5 ${
                                isLight ? 'text-neutral-600' : isGray ? 'text-slate-400' : 'text-neutral-400'
                              }`}>
                                <Calendar className="w-3 h-3 text-amber-500/80" />
                                <span>{shift.date}</span>
                                {shift.nameEn && language === 'kh' && (
                                  <span className="opacity-70 font-sans">({shift.nameEn})</span>
                                )}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-khmer border ${
                          isLight
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : isGray
                            ? 'bg-slate-800 border-slate-700 text-slate-300'
                            : 'bg-black/40 border-white/10 text-neutral-300'
                        }`}>
                          {shift.timeLine?.length || 0} {language === 'kh' ? 'កម្មវិធី' : 'Activities'}
                        </span>
                      </div>

                      {/* Timeline steps */}
                      <div className="space-y-3 relative before:absolute before:top-3 before:bottom-3 before:left-[19px] before:w-[2px] before:bg-gradient-to-b before:from-amber-400/60 before:via-amber-400/30 before:to-transparent">
                        {shift.timeLine?.map((item, itemIdx) => (
                          <div
                            key={`modal-timeline-${shiftIndex}-${itemIdx}-${item.id || itemIdx}`}
                            className="relative flex items-start gap-3.5 group pl-1"
                          >
                            {/* Step icon bullet */}
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 z-10 shadow-md border transition-transform group-hover:scale-110"
                              style={{
                                backgroundColor: isLight ? '#fbf8f2' : isGray ? '#1e242d' : '#1f1b16',
                                borderColor: `${viewingProgramPreset.accentColor}60`,
                              }}
                            >
                              {getTimelineIcon(item.icon, viewingProgramPreset.accentColor)}
                            </div>

                            {/* Content card */}
                            <div className={`flex-1 p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                              isLight
                                ? 'bg-amber-50/70 border-amber-300/40 group-hover:border-amber-500/50'
                                : isGray
                                ? 'bg-slate-800/70 border-slate-700/80 text-slate-200 group-hover:border-slate-500'
                                : 'bg-black/50 border-white/5 group-hover:border-amber-400/30'
                            }`}>
                              <div className="space-y-0.5">
                                <h5 className={`text-xs sm:text-sm font-bold font-khmer ${
                                  isLight ? 'text-amber-950' : isGray ? 'text-slate-100' : 'text-white'
                                }`}>
                                  {language === 'kh' ? item.name : item.nameEn || item.name}
                                </h5>
                                {item.nameEn && language === 'kh' && (
                                  <p className={`text-[11px] font-sans ${
                                    isLight ? 'text-amber-900/60' : isGray ? 'text-slate-400' : 'text-neutral-400'
                                  }`}>
                                    {item.nameEn}
                                  </p>
                                )}
                              </div>

                              <div className={`flex items-center gap-1.5 self-start sm:self-center px-2.5 py-1 rounded-lg border font-mono text-xs font-bold shrink-0 ${
                                isLight
                                  ? 'bg-amber-200/70 border-amber-400/50 text-amber-950'
                                  : isGray
                                  ? 'bg-slate-700/80 border-slate-600 text-amber-300'
                                  : 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                              }`}>
                                <Clock className="w-3.5 h-3.5" />
                                <span>{item.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Action Footer */}
                <div className={`pt-2 flex items-center justify-between gap-4 border-t ${
                  isLight ? 'border-amber-500/20' : isGray ? 'border-slate-700/50' : 'border-amber-500/20'
                }`}>
                  <button
                    type="button"
                    onClick={() => setViewingProgramPreset(null)}
                    className={`px-5 py-2.5 rounded-xl border font-khmer text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      isLight
                        ? 'border-amber-600/30 text-amber-950 hover:bg-amber-100'
                        : isGray
                        ? 'border-slate-600 text-slate-300 hover:bg-slate-800'
                        : 'border-white/20 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{language === 'kh' ? 'ត្រឡប់ក្រោយ' : 'Back'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApply(viewingProgramPreset)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 font-bold text-xs font-khmer hover:from-amber-300 hover:to-amber-200 transition-all shadow-lg flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{language === 'kh' ? 'ប្រើប្រាស់គំរូកម្មវិធីនេះ' : 'Apply This Program'}</span>
                  </button>
                </div>
              </div>
            ) : activeTab === 'presets' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {filteredPresets.map((preset, presetIdx) => {
                  const exactMatch = currentEvent.id === preset.sampleEvent.id || currentEvent.id === preset.id;
                  const hasAnyExactMatch = EVENT_PRESETS.some((p) => p.sampleEvent.id === currentEvent.id || p.id === currentEvent.id);
                  const defaultMatch = !hasAnyExactMatch && preset.id === EVENT_PRESETS.find((p) => p.type === (currentEvent.eventType || 'wedding'))?.id;
                  const isCurrent = exactMatch || defaultMatch;

                  return (
                    <motion.div
                      key={`modal-preset-${preset.id}-${presetIdx}`}
                      whileHover={{ y: -3 }}
                      className={`relative rounded-2xl border p-4 sm:p-5 flex flex-col justify-between overflow-hidden transition-all ${
                        isLight
                          ? isCurrent
                            ? 'bg-gradient-to-b from-[#ffffff] via-[#fcf9f2] to-[#f7f0e4] border-amber-500 ring-2 ring-amber-500/40 shadow-[0_10px_35px_rgba(212,175,55,0.2)]'
                            : 'bg-gradient-to-b from-[#ffffff] via-[#fbf8f0] to-[#f4ebe0] border-amber-500/30 hover:border-amber-500/60 shadow-[0_4px_20px_rgba(212,175,55,0.1)]'
                          : isGray
                          ? isCurrent
                            ? 'bg-gradient-to-b from-[#252b36] via-[#1c212a] to-[#151921] border-amber-400 ring-2 ring-amber-400/40 text-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.5)]'
                            : 'bg-gradient-to-b from-[#232832] via-[#1a1f27] to-[#13171e] border-slate-700/80 hover:border-slate-500 text-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                          : isCurrent
                          ? 'bg-gradient-to-b from-[#201a14] via-[#14100c] to-[#0d0a08] border-amber-400 ring-2 ring-amber-400/40 shadow-[0_10px_35px_rgba(245,184,15,0.25)]'
                          : 'bg-gradient-to-b from-[#201a14] via-[#14100c] to-[#0d0a08] border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_8px_25px_rgba(245,184,15,0.15)]'
                      }`}
                    >
                      {/* Gold corner accent dots */}
                      <div className={`absolute top-2 left-2 w-1.5 h-1.5 rounded-full ${
                        isLight ? 'bg-amber-600/70' : isGray ? 'bg-slate-400' : 'bg-amber-400/60'
                      }`} />
                      <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${
                        isLight ? 'bg-amber-600/70' : isGray ? 'bg-slate-400' : 'bg-amber-400/60'
                      }`} />

                      {/* Ambient corner glow */}
                      <div
                        className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
                        style={{ backgroundColor: preset.accentColor }}
                      />

                      <div>
                        {/* Header info */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md shrink-0 border"
                              style={{
                                backgroundColor: `${preset.accentColor}25`,
                                color: preset.accentColor,
                                borderColor: `${preset.accentColor}60`,
                              }}
                            >
                              {getIcon(preset.type, 'w-5 h-5')}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className={`text-base font-bold font-khmer ${
                                  isLight ? 'text-amber-950' : isGray ? 'text-slate-100 font-bold' : 'text-amber-100 drop-shadow-sm'
                                }`}>
                                  {language === 'kh' ? preset.titleKh : preset.titleEn}
                                </h3>
                              </div>
                              <span
                                className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-1 font-khmer border shadow-sm"
                                style={{
                                  backgroundColor: `${preset.accentColor}20`,
                                  color: preset.accentColor,
                                  borderColor: `${preset.accentColor}50`,
                                }}
                              >
                                {language === 'kh' ? preset.badgeKh : preset.badgeEn}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            {isCurrent && (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-khmer flex items-center gap-1 shadow-sm">
                                <Check className="w-3.5 h-3.5" />
                                <span>{language === 'kh' ? 'កំពុងប្រើប្រាស់' : 'Active'}</span>
                              </span>
                            )}
                            {getSavedTemplateData(preset.sampleEvent.id) && !isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-600 dark:text-amber-300 text-[10px] font-bold font-khmer flex items-center gap-1 shadow-sm" title="មានការកំណត់ដែលអ្នកបានរក្សាទុក">
                                <span>💾 {language === 'kh' ? 'មានការកំណត់រក្សាទុក' : 'Saved Data'}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className={`text-xs font-khmer leading-relaxed mb-4 ${
                          isLight ? 'text-neutral-700' : isGray ? 'text-slate-300' : 'text-neutral-300'
                        }`}>
                          {language === 'kh' ? preset.descriptionKh : preset.descriptionEn}
                        </p>

                        {/* Event Details Quick Summary */}
                        <div className={`p-3.5 rounded-xl border space-y-2 mb-4 text-xs font-khmer shadow-inner ${
                          isLight
                            ? 'bg-amber-50/80 border-amber-500/20 text-neutral-800'
                            : isGray
                            ? 'bg-slate-900/70 border-slate-700/60 text-slate-200'
                            : 'bg-black/60 border-amber-500/20 text-neutral-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>
                              {language === 'kh'
                                ? preset.sampleEvent.config.invitation_kh.date_time
                                : preset.sampleEvent.config.invitation_en.date_time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="truncate">{preset.sampleEvent.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>
                              {language === 'kh' ? 'ម៉ោងពិសាភោជនាហារ ៖ ' : 'Reception: '}
                              {preset.sampleEvent.eating_time}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={`pt-3 border-t flex flex-wrap items-center justify-between gap-2 ${
                        isLight ? 'border-amber-500/20' : isGray ? 'border-slate-700/50' : 'border-amber-500/20'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setLivePreviewPreset(preset)}
                            className={`px-2.5 py-1.5 rounded-xl border text-xs font-khmer font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                              isLight
                                ? 'border-amber-500/50 bg-amber-100/90 text-amber-950 hover:bg-amber-200'
                                : isGray
                                ? 'border-amber-400/40 bg-slate-800 text-amber-200 hover:bg-slate-700'
                                : 'border-amber-400/50 bg-amber-400/15 hover:bg-amber-400/25 text-amber-200 hover:text-white'
                            }`}
                            title="មើលគំរូធៀបជាក់ស្តែង Live Preview"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-500" />
                            <span>{language === 'kh' ? 'មើលគំរូ' : 'Preview'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setViewingProgramPreset(preset);
                              setFilterType(preset.type);
                            }}
                            className={`px-2.5 py-1.5 rounded-xl border text-xs font-khmer font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                              isLight
                                ? 'border-amber-600/30 bg-amber-50/80 text-amber-950 hover:bg-amber-100'
                                : isGray
                                ? 'border-slate-600 bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                                : 'border-white/10 hover:border-amber-400/40 text-neutral-300 hover:text-amber-200 bg-white/5'
                            }`}
                            title="ពិនិត្យកាលវិភាគលម្អិត"
                          >
                            <Sliders className="w-3.5 h-3.5 text-amber-500" />
                            <span>{language === 'kh' ? 'កាលវិភាគ' : 'Schedule'}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleEdit(preset)}
                              className={`px-3 py-1.5 rounded-xl border font-bold text-xs font-khmer transition-all shadow-md flex items-center gap-1.5 active:scale-95 hover:scale-[1.03] hover:shadow-amber-500/10 ${
                                isLight
                                  ? 'bg-amber-100/90 border-amber-500/50 text-amber-950 hover:bg-amber-200/90 hover:border-amber-500'
                                  : isGray
                                  ? 'bg-amber-500/15 border-amber-400/40 text-amber-300 hover:bg-amber-500/25 hover:border-amber-400'
                                  : 'bg-amber-500/15 border-amber-400/40 text-amber-300 hover:bg-amber-400 hover:text-amber-950 hover:border-amber-300'
                              }`}
                              title="កែសម្រួលព័ត៌មានធៀបនេះ"
                            >
                              <LayoutTemplate className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                              <span>{language === 'kh' ? 'កែសម្រួល' : 'Edit'}</span>
                            </button>
                          )}

                          {isCurrent ? (
                            <button
                              type="button"
                              disabled
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 font-bold text-xs font-khmer flex items-center gap-1.5 cursor-not-allowed shadow-inner"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>{language === 'kh' ? 'កំពុងប្រើប្រាស់' : 'Active'}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleApply(preset)}
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-amber-950 font-bold text-xs font-khmer hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-95 hover:scale-[1.03] flex items-center gap-1.5 cursor-pointer ring-1 ring-amber-500/30 hover:ring-amber-400/50 group"
                            >
                              <span>{language === 'kh' ? 'ប្រើគំរូ' : 'Apply'}</span>
                              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* Custom Event Creator Form */
              <div className={`border rounded-2xl p-5 sm:p-7 space-y-6 ${
                isLight
                  ? 'bg-white/95 border-amber-500/30 shadow-[0_4px_25px_rgba(212,175,55,0.1)]'
                  : isGray
                  ? 'bg-slate-900/80 border-slate-700/80 text-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.4)]'
                  : 'bg-[#1a1714] border-amber-500/30'
              }`}>
                <div>
                  <h3 className={`text-base font-bold font-khmer mb-1 ${
                    isLight ? 'text-amber-950' : isGray ? 'text-slate-100' : 'text-amber-200'
                  }`}>
                    {language === 'kh' ? 'បង្កើតកម្មវិធីបុណ្យ ឬពិធីផ្ទាល់ខ្លួន' : 'Create Custom Event Template'}
                  </h3>
                  <p className={`text-xs font-khmer ${
                    isLight ? 'text-amber-900/70' : isGray ? 'text-slate-300' : 'text-neutral-400'
                  }`}>
                    {language === 'kh'
                      ? 'បំពេញព័ត៌មានកម្មវិធីរបស់អ្នកខាងក្រោម ដើម្បីបង្កើតគេហទំព័រធៀបស្វ័យប្រវត្តិ'
                      : 'Fill in your custom event details to generate an interactive invitation webpage'}
                  </p>
                </div>

                {/* Event Type Selector */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className={`block text-xs font-bold font-khmer ${
                      isLight ? 'text-amber-950' : isGray ? 'text-slate-200' : 'text-amber-300'
                    }`}>
                      {language === 'kh' ? 'ជ្រើសរើសប្រភេទកម្មវិធី' : 'Select Event Category'}
                    </label>

                    {/* Prominently show name of chosen category */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-600 dark:text-amber-300 text-xs font-khmer font-bold shadow-xs">
                      <span>ប្រភេទដែលបានជ្រើស ៖</span>
                      <span className="font-extrabold text-amber-700 dark:text-amber-200 underline decoration-amber-400">
                        {customType === 'wedding'
                          ? 'ពិធីមង្គលការ (Wedding)'
                          : customType === 'engagement'
                          ? 'ពិធីភ្ជាប់ពាក្យ (Engagement)'
                          : customType === 'housewarming'
                          ? 'ពិធីឡើងផ្ទះថ្មី (Housewarming)'
                          : 'ពិធីខួបកំណើត (Birthday)'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'wedding', labelKh: 'មង្គលការ', labelEn: 'Wedding', icon: 'heart', color: '#f5b80f', bg: 'https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/event/cover/1760580473926-q6ph48-491657278_9322919307805207_5998846575526453583_n.jpg' },
                      { id: 'engagement', labelKh: 'ភ្ជាប់ពាក្យ', labelEn: 'Engagement', icon: 'sparkles', color: '#f43f5e', bg: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop' },
                      { id: 'housewarming', labelKh: 'ឡើងផ្ទះថ្មី', labelEn: 'New House', icon: 'home', color: '#10b981', bg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop' },
                      { id: 'birthday', labelKh: 'ខួបកំណើត', labelEn: 'Birthday', icon: 'cake', color: '#8b5cf6', bg: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop' },
                      { id: 'anniversary', labelKh: 'ខួបមង្គលការ', labelEn: 'Anniversary', icon: 'crown', color: '#d4af37', bg: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=600&auto=format&fit=crop' },
                    ].map((item) => {
                      const isSelected = customType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCustomType(item.id as any)}
                          className={`relative h-28 rounded-2xl overflow-hidden border-2 flex flex-col items-center justify-end p-3 transition-all active:scale-95 group/card shadow-md cursor-pointer ${
                            isSelected
                              ? 'border-amber-400 ring-4 ring-amber-400/20 shadow-[0_10px_25px_rgba(245,184,15,0.45)]'
                              : 'border-white/10 hover:border-amber-400/50'
                          }`}
                        >
                          {/* Background Image with Zoom and Overlay */}
                          <div 
                            style={{ backgroundImage: `url(${item.bg})` }}
                            className="absolute inset-0 bg-cover bg-center group-hover/card:scale-105 transition-transform duration-500"
                          />
                          <div className={`absolute inset-0 transition-colors duration-300 ${
                            isSelected ? 'bg-gradient-to-t from-black/90 via-black/40 to-transparent' : 'bg-gradient-to-t from-black/85 via-black/50 to-black/20 group-hover/card:from-black/75 group-hover/card:via-black/40'
                          }`} />

                          {/* Selection Check Badge */}
                          {isSelected && (
                            <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-amber-950 flex items-center justify-center text-xs font-bold shadow-lg ring-1 ring-white/35">
                              ✓
                            </span>
                          )}

                          {/* Floating Category Icon and Text Content */}
                          <div className="relative z-10 flex flex-col items-center gap-1 text-center w-full">
                            <div
                              className="p-1 rounded-lg bg-black/40 backdrop-blur-xs text-white"
                              style={{ color: item.color }}
                            >
                              {getIcon(item.id, 'w-4 h-4')}
                            </div>
                            <span className="text-white text-xs sm:text-xs font-khmer font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
                              {language === 'kh' ? item.labelKh : item.labelEn}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Event Title */}
                <div>
                  <label className={`block text-xs font-bold font-khmer mb-1.5 ${
                    isLight ? 'text-amber-950' : isGray ? 'text-slate-200' : 'text-amber-300'
                  }`}>
                    {language === 'kh' ? 'ចំណងជើងកម្មវិធី (Event Title)' : 'Event Title'}
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={
                      customType === 'wedding'
                        ? 'ឧ. អាពាហ៍ពិពាហ៍ សុជាតិ & សុជាតា'
                        : customType === 'engagement'
                        ? 'ឧ. ពិធីភ្ជាប់ពាក្យ សុជាតិ & សុជាតា'
                        : customType === 'housewarming'
                        ? 'ឧ. ពិធីឡើងគេហដ្ឋានថ្មី លោក សុជាតិ & ភរិយា'
                        : customType === 'birthday'
                        ? 'ឧ. ពិធីខួបកំណើតគម្រប់ ២០ឆ្នាំ សុជាតិ'
                        : 'ឧ. ខួបអាពាហ៍ពិពាហ៍ ៥០ឆ្នាំ លោក សុខ & អ្នកស្រី ម៉ារី'
                    }
                    className={`w-full px-4 py-2.5 rounded-xl border font-khmer text-sm focus:outline-none ${
                      isLight
                        ? 'bg-amber-50/60 border-amber-400/50 text-neutral-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-500'
                        : isGray
                        ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-slate-500 focus:ring-1 focus:ring-slate-500'
                        : 'bg-black/60 border-amber-500/30 text-white focus:border-amber-400'
                    }`}
                  />
                </div>

                {/* Hosts / Honorees */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-bold font-khmer mb-1.5 ${
                      isLight ? 'text-amber-950' : isGray ? 'text-slate-200' : 'text-amber-300'
                    }`}>
                      {customType === 'wedding' || customType === 'engagement' || customType === 'anniversary'
                        ? language === 'kh' ? 'កូនប្រុសនាម' : 'Groom Name'
                        : customType === 'birthday'
                        ? language === 'kh' ? 'ឈ្មោះម្ចាស់ខួបកំណើត' : 'Birthday Star'
                        : language === 'kh' ? 'ឈ្មោះម្ចាស់កម្មវិធីទី១' : 'Host 1 Name'}
                    </label>
                    <input
                      type="text"
                      value={customHost1}
                      onChange={(e) => setCustomHost1(e.target.value)}
                      placeholder="ឧ. រ៉ូ ម៉ាឡេ"
                      className={`w-full px-4 py-2.5 rounded-xl border font-khmer text-sm focus:outline-none ${
                        isLight
                          ? 'bg-amber-50/60 border-amber-400/50 text-neutral-900 focus:border-amber-600'
                          : isGray
                          ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-slate-500'
                          : 'bg-black/60 border-amber-500/30 text-white focus:border-amber-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold font-khmer mb-1.5 ${
                      isLight ? 'text-amber-950' : isGray ? 'text-slate-200' : 'text-amber-300'
                    }`}>
                      {customType === 'wedding' || customType === 'engagement' || customType === 'anniversary'
                        ? language === 'kh' ? 'កូនស្រីនាម' : 'Bride Name'
                        : customType === 'birthday'
                        ? language === 'kh' ? 'អាយុ ឬចំណងជើង' : 'Age / Milestone'
                        : language === 'kh' ? 'ឈ្មោះម្ចាស់កម្មវិធីទី២' : 'Host 2 Name'}
                    </label>
                    <input
                      type="text"
                      value={customHost2}
                      onChange={(e) => setCustomHost2(e.target.value)}
                      placeholder="ឧ. អួម វល្ខ័ក"
                      className={`w-full px-4 py-2.5 rounded-xl border font-khmer text-sm focus:outline-none ${
                        isLight
                          ? 'bg-amber-50/60 border-amber-400/50 text-neutral-900 focus:border-amber-600'
                          : isGray
                          ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-slate-500'
                          : 'bg-black/60 border-amber-500/30 text-white focus:border-amber-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Date, Time & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-xs font-bold font-khmer mb-1.5 ${
                      isLight ? 'text-amber-950' : isGray ? 'text-slate-200' : 'text-amber-300'
                    }`}>
                      {language === 'kh' ? 'កាលបរិច្ឆេទ (Date)' : 'Date'}
                    </label>
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${
                        isLight
                          ? 'bg-amber-50/60 border-amber-400/50 text-neutral-900 focus:border-amber-600'
                          : isGray
                          ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-slate-500'
                          : 'bg-black/60 border-amber-500/30 text-white focus:border-amber-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold font-khmer mb-1.5 ${
                      isLight ? 'text-amber-950' : isGray ? 'text-slate-200' : 'text-amber-300'
                    }`}>
                      {language === 'kh' ? 'ម៉ោងពិសាអាហារ' : 'Banquet Time'}
                    </label>
                    <input
                      type="text"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      placeholder="05:00 PM"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${
                        isLight
                          ? 'bg-amber-50/60 border-amber-400/50 text-neutral-900 focus:border-amber-600'
                          : isGray
                          ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-slate-500'
                          : 'bg-black/60 border-amber-500/30 text-white focus:border-amber-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold font-khmer mb-1.5 ${
                      isLight ? 'text-amber-950' : isGray ? 'text-slate-200' : 'text-amber-300'
                    }`}>
                      {language === 'kh' ? 'ទីតាំងប្រារព្ធពិធី' : 'Location'}
                    </label>
                    <input
                      type="text"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      placeholder="ឧ. សាលមហោស្រពវិមានសិរីមង្គល់"
                      className={`w-full px-4 py-2.5 rounded-xl border font-khmer text-sm focus:outline-none ${
                        isLight
                          ? 'bg-amber-50/60 border-amber-400/50 text-neutral-900 focus:border-amber-600'
                          : isGray
                          ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-slate-500'
                          : 'bg-black/60 border-amber-500/30 text-white focus:border-amber-400'
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('presets')}
                    className={`px-5 py-2.5 rounded-xl border font-khmer text-xs font-bold transition-colors ${
                      isLight
                        ? 'border-amber-600/30 text-amber-950 hover:bg-amber-100'
                        : isGray
                        ? 'border-slate-600 text-slate-300 hover:bg-slate-800'
                        : 'border-white/20 text-neutral-300 hover:text-white'
                    }`}
                  >
                    {language === 'kh' ? 'ថយក្រោយ' : 'Cancel'}
                  </button>

                  <button
                    type="button"
                    onClick={handleCreateCustom}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 font-bold text-xs font-khmer hover:from-amber-300 hover:to-amber-200 transition-all shadow-lg flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{language === 'kh' ? 'បង្កើត និងប្រើប្រាស់ភ្លាមៗ' : 'Create & Apply'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className={`px-6 py-3.5 border-t flex items-center justify-center text-xs font-khmer ${
            isLight
              ? 'border-amber-500/20 bg-amber-100/50 text-amber-950'
              : isGray
              ? 'border-slate-700/60 bg-slate-900/90 text-slate-300'
              : 'border-amber-500/20 bg-black/60 text-neutral-400'
          }`}>
            <span className={`flex items-center gap-1.5 ${
              isLight ? 'text-amber-900 font-bold' : 'text-amber-300/90'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'kh' ? 'គាំទ្រពិធីមង្គលការ ភ្ជាប់ពាក្យ ឡើងផ្ទះថ្មី និងខួបកំណើត' : 'Supports Wedding, Engagement, Housewarming, and Birthday'}</span>
            </span>
          </div>
        </motion.div>
      </div>

      {/* FULL LIVE INVITATION PREVIEW (Phone / Desktop interactive simulation like PlanEssential Preview) */}
      {livePreviewPreset && (
        <TemplateLivePreview
          preset={livePreviewPreset}
          language={language}
          theme={theme}
          onClose={() => setLivePreviewPreset(null)}
          onApply={(presetToApply) => {
            handleApply(presetToApply);
            setLivePreviewPreset(null);
          }}
        />
      )}
    </AnimatePresence>
  );
}
