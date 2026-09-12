import { useState, useRef, type ChangeEvent } from 'react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Check,
  Calendar,
  MapPin,
  User,
  Heart,
  Save,
  Palette,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { WeddingEvent, TemplateConfig } from '../types';
import { ThemeMode } from './ThemeToggle';
import { EVENT_PRESETS } from '../data/eventTemplates';
import { EN_FONT_PRESETS, PORTRAIT_SHAPE_PRESETS } from './DesignSettingsSection';

interface CoverInfoEditorProps {
  formData: WeddingEvent;
  onUpdateFormData: (updates: Partial<WeddingEvent>) => void;
  onUpdateConfig: <K extends keyof TemplateConfig>(key: K, value: TemplateConfig[K]) => void;
  theme?: ThemeMode;
  onSave?: () => void;
}

// Preset Cover Backgrounds
export const COVER_BACKGROUND_PRESETS = [
  {
    id: 'cover-palace-gold',
    nameKh: 'វិមានមង្គលរាជវាំង (Palace Gold)',
    url: 'https://focuz-staging-space.sgp1.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/cover-2.jpg',
  },
  {
    id: 'cover-khmer-wedding',
    nameKh: 'រចនាបថធៀបខ្មែរ (Royal Wedding)',
    url: 'https://focuz-staging-space.sgp1.digitaloceanspaces.com/plan-essential/event/cover/1760580473926-q6ph48-491657278_9322919307805207_5998846575526453583_n.jpg',
  },
  {
    id: 'cover-silk-amber',
    nameKh: 'សូត្រមាសប្រណិត (Golden Silk)',
    url: 'https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/free-background.jpg',
  },
  {
    id: 'cover-romantic-floral',
    nameKh: 'ផ្កាអ័រគីដេមនោសញ្ចេតនា (Romantic)',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'cover-housewarming-home',
    nameKh: 'គេហដ្ឋានថ្មីសុខដុម (Housewarming)',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'cover-birthday-sparkle',
    nameKh: 'ពិធីខួបកំណើត (Birthday Sparkle)',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1600&q=80',
  },
];

// Preset Subtitle Options for fast 1-click apply
const SUBTITLE_PRESETS = [
  {
    type: 'wedding',
    kh: 'សិរីសួស្តី អាពាហ៍ពិពាហ៍',
    en: 'ROYAL WEDDING INVITATION',
    label: 'អាពាហ៍ពិពាហ៍ (Wedding)',
  },
  {
    type: 'engagement',
    kh: 'ពិធីភ្ជាប់ពាក្យ',
    en: 'THE ENGAGEMENT INVITATION',
    label: 'ភ្ជាប់ពាក្យ (Engagement)',
  },
  {
    type: 'housewarming',
    kh: 'ពិធីឡើងគេហដ្ឋានថ្មី',
    en: 'HOUSEWARMING INVITATION',
    label: 'ឡើងផ្ទះថ្មី (Housewarming)',
  },
  {
    type: 'birthday',
    kh: 'រីករាយថ្ងៃកំណើត',
    en: 'HAPPY BIRTHDAY INVITATION',
    label: 'ខួបកំណើត (Birthday)',
  },
];

// Preset Colors for Cover Invitation EN Name
export const EN_NAME_COLOR_PRESETS = [
  { nameKh: 'មាសប្រណិត (Royal Gold)', hex: '#f5b80f' },
  { nameKh: 'សបរិសុទ្ធ (Pure White)', hex: '#ffffff' },
  { nameKh: 'មាសខ្ចី (Champagne Gold)', hex: '#fde047' },
  { nameKh: 'ពណ៌កុលាប (Rose Gold)', hex: '#fb7185' },
  { nameKh: 'ត្បូងមរកត (Emerald Jade)', hex: '#34d399' },
  { nameKh: 'ផ្ទៃមេឃ (Diamond Sky)', hex: '#38bdf8' },
  { nameKh: 'ទឹកក្រូចមាស (Sunset Amber)', hex: '#fb923c' },
  { nameKh: 'ប្រាក់រលោង (Silver Pearl)', hex: '#e2e8f0' },
];

// Helper to compress image via canvas
function compressImage(file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
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
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Image failed to load'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
}

export default function CoverInfoEditor({
  formData,
  onUpdateFormData,
  onUpdateConfig,
  theme = 'dark',
  onSave,
}: CoverInfoEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentCoverBg =
    formData.config.cover_background ||
    formData.config.main_background ||
    'https://focuz-staging-space.sgp1.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/cover-2.jpg';

  const isBirthday =
    formData.id?.includes('birthday') ||
    formData.name?.includes('ខួបកំណើត') ||
    formData.name?.includes('Birthday');
  const isEngagement =
    formData.id?.includes('engagement') ||
    formData.name?.includes('ភ្ជាប់ពាក្យ') ||
    formData.name?.includes('Engagement');
  const isHousewarming =
    formData.id?.includes('housewarming') ||
    formData.name?.includes('ឡើងផ្ទះ') ||
    formData.name?.includes('House');

  const defaultSubtitleKh = isBirthday
    ? 'រីករាយថ្ងៃកំណើត'
    : isEngagement
    ? 'ពិធីភ្ជាប់ពាក្យ'
    : isHousewarming
    ? 'ពិធីឡើងគេហដ្ឋានថ្មី'
    : 'សិរីសួស្តី អាពាហ៍ពិពាហ៍';

  const defaultSubtitleEn = isBirthday
    ? 'HAPPY BIRTHDAY INVITATION'
    : isEngagement
    ? 'ENGAGEMENT INVITATION'
    : isHousewarming
    ? 'HOUSEWARMING INVITATION'
    : 'ROYAL WEDDING INVITATION';

  const currentSubtitleKh = formData.config.cover_subtitle_kh || defaultSubtitleKh;
  const currentSubtitleEn = formData.config.cover_subtitle_en || defaultSubtitleEn;
  const currentEnNameColor = formData.config.cover_en_name_color || '#ffffff';
  const frontColor = formData.config.primaryColor || '#f5b80f';
  const bottomColor = formData.config.textColor || '#f5b80f';

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const base64 = await compressImage(file);
      onUpdateConfig('cover_background', base64);
    } catch (err) {
      console.error('Failed to compress cover image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveCoverInfo = () => {
    if (onSave) {
      onSave();
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleApplyTemplatePreset = (preset: typeof EVENT_PRESETS[0]) => {
    const sample = preset.sampleEvent;
    onUpdateFormData({
      groom: sample.groom,
      bride: sample.bride,
      groomEn: sample.groomEn,
      brideEn: sample.brideEn,
      singlePerson: preset.type === 'birthday' ? true : false,
      location: sample.location,
      eating_time: sample.eating_time,
      startTime: sample.startTime,
      schedules: sample.schedules,
    });
    if (sample.config) {
      if (sample.config.primaryColor) onUpdateConfig('primaryColor', sample.config.primaryColor);
      if (sample.config.textColor) onUpdateConfig('textColor', sample.config.textColor);
      onUpdateConfig('cover_en_name_color', sample.config.primaryColor || '#f5b80f');
      onUpdateConfig('cover_subtitle_kh', sample.config.invitation_kh?.main_title || preset.titleKh);
      onUpdateConfig('cover_subtitle_en', sample.config.invitation_en?.main_title || preset.titleEn);
      if (sample.config.portrait_shape) onUpdateConfig('portrait_shape', sample.config.portrait_shape);
      if (sample.config.cover_background) onUpdateConfig('cover_background', sample.config.cover_background);
      if (sample.config.main_background) onUpdateConfig('main_background', sample.config.main_background);
      if (sample.config.invitation_kh) onUpdateConfig('invitation_kh', sample.config.invitation_kh);
      if (sample.config.invitation_en) onUpdateConfig('invitation_en', sample.config.invitation_en);
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div
      id="cover-information-editor-card"
      className={`rounded-2xl border transition-all overflow-hidden ${
        theme === 'light'
          ? 'bg-gradient-to-br from-amber-50/90 via-white to-amber-50/40 border-amber-300 shadow-md'
          : theme === 'gray'
          ? 'bg-[#1e222b] border-slate-700 shadow-xl'
          : 'bg-gradient-to-b from-black/90 via-[#181512]/95 to-black/90 border-amber-500/50 shadow-2xl'
      }`}
    >
      {/* Header Banner */}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between cursor-pointer select-none ${
          theme === 'light'
            ? 'bg-amber-100/70 border-amber-200'
            : 'bg-gradient-to-r from-amber-950/50 via-amber-900/30 to-amber-950/50 border-amber-500/30'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-500 shadow-inner">
            <Layers className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4
                className={`text-sm font-bold font-khmer ${
                  theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                }`}
              >
                ព័ត៌មាន Cover នៃធៀប (Cover Information - Editable)
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950">
                អាចកែប្រែបាន
              </span>
            </div>
            <p
              className={`text-[11px] font-khmer ${
                theme === 'light' ? 'text-amber-900/80' : 'text-amber-300/70'
              }`}
            >
              កែសម្រួលរូបភាព Cover, ចំណងជើងកោង, ឈ្មោះ និងកាលបរិច្ឆេទលើក្របធៀប
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-[11px] font-khmer font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-pulse">
              <Check className="w-3.5 h-3.5" />
              <span>បានរក្សាទុក!</span>
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-amber-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-5">
          {/* Quick Template Info Selector Bar */}
          <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
            theme === 'light' ? 'bg-amber-100/60 border-amber-300' : 'bg-amber-950/30 border-amber-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold font-khmer flex items-center gap-1.5 ${
                theme === 'light' ? 'text-amber-950' : 'text-amber-200'
              }`}>
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>ទាញយកព័ត៌មាន និងម៉ូដតាមពុម្ពគំរូ (Get Information from Selected Template)</span>
              </span>
              <span className="text-[10px] font-khmer opacity-75">ចុច១ដើមដើម្បីទាញយកព័ត៌មាន</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EVENT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyTemplatePreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 group active:scale-95 ${
                    theme === 'light'
                      ? 'bg-white border-amber-300 hover:border-amber-500 hover:bg-amber-50 text-neutral-900 shadow-sm'
                      : 'bg-black/60 border-amber-500/30 hover:border-amber-400 hover:bg-black/90 text-amber-100 shadow'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-bold font-khmer border"
                      style={{
                        backgroundColor: `${preset.accentColor}20`,
                        color: preset.accentColor,
                        borderColor: `${preset.accentColor}50`,
                      }}
                    >
                      {preset.badgeKh}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/20"
                      style={{ backgroundColor: preset.accentColor }}
                    />
                  </div>

                  <span className="text-xs font-bold font-khmer truncate pt-0.5">
                    {preset.titleKh}
                  </span>

                  <span className="text-[10px] font-khmer opacity-70 truncate">
                    {preset.sampleEvent.groom} & {preset.sampleEvent.bride}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Miniature Live Cover Preview Frame */}
          <div
            className={`p-3.5 rounded-2xl border text-center relative overflow-hidden ${
              theme === 'light'
                ? 'bg-amber-50/50 border-amber-200 shadow-inner'
                : 'bg-black/60 border-amber-500/30 shadow-inner'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-khmer font-bold text-amber-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ផ្ទាំងទិដ្ឋភាព Cover ជាក់ស្តែង (Live Cover Preview)</span>
              </span>
              <span className="text-[10px] font-mono opacity-70">Envelope Display</span>
            </div>

            {/* Realistic Mini Envelope Mockup */}
            <div
              className="relative w-full max-w-sm mx-auto h-48 rounded-xl overflow-hidden border-2 border-amber-400/60 shadow-lg flex flex-col items-center justify-center p-3 text-center"
              style={{
                backgroundImage: `url(${currentCoverBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Overlay tint for text legibility */}
              <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px]" />

              {/* Mini Curved Title */}
              <div className="relative z-10 w-full max-w-[260px] h-10 -mb-1">
                <svg viewBox="0 0 400 90" className="w-full h-full overflow-visible">
                  <path
                    id="miniSubtitleCurve"
                    d="M 40 70 Q 200 15 360 70"
                    fill="transparent"
                  />
                  <text
                    className="font-norican"
                    fill="#f5b80f"
                    fontSize="25px"
                    letterSpacing="1.5px"
                    style={{ textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}
                  >
                    <textPath href="#miniSubtitleCurve" startOffset="50%" textAnchor="middle">
                      {currentSubtitleKh}
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* Host / Couple Name on Cover */}
              <div className="relative z-10 space-y-0.5">
                <h5 className="font-moul text-amber-300 text-xs sm:text-sm drop-shadow-md">
                  {formData.singlePerson
                    ? formData.groom
                    : `${formData.groom} & ${formData.bride}`}
                </h5>
                <p
                  style={{ color: currentEnNameColor }}
                  className="font-norican text-sm drop-shadow-sm capitalize transition-colors"
                >
                  {formData.singlePerson
                    ? (formData.groomEn || formData.groom)
                    : `${formData.groomEn || formData.groom} & ${formData.brideEn || formData.bride}`}
                </p>
              </div>

              {/* Mini Invited Badge */}
              <div className="relative z-10 mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 font-moul text-[10px] shadow-md border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>សូមគោរពអញ្ជើញ ភ្ញៀវកិត្តិយស</span>
                <Sparkles className="w-2.5 h-2.5" />
              </div>

              {/* Mini Date on Cover */}
              <div className="relative z-10 mt-1.5 text-[9px] font-khmer text-amber-200/90 font-medium">
                {formData.config.invitation_kh?.date_time || formData.startTime?.split('T')[0] || ''}
              </div>
            </div>
          </div>

          {/* Form Fields: 2-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Cover Curved Subtitle (Khmer) */}
            <div>
              <label
                className={`block text-xs font-khmer font-semibold mb-1 ${
                  theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                }`}
              >
                ចំណងជើងកោងលើ Cover (ភាសាខ្មែរ)
              </label>
              <input
                id="cover-subtitle-kh-input"
                type="text"
                value={formData.config.cover_subtitle_kh || ''}
                onChange={(e) => {
                  onUpdateConfig('cover_subtitle_kh', e.target.value);
                }}
                placeholder={defaultSubtitleKh}
                className={`w-full px-3 py-2 rounded-xl text-xs font-khmer focus:outline-none transition-all ${
                  theme === 'light'
                    ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                    : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                }`}
              />
            </div>

            {/* 2. Cover Curved Subtitle (English) */}
            <div>
              <label
                className={`block text-xs font-khmer font-semibold mb-1 ${
                  theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                }`}
              >
                Cover Subtitle (English Curved Text)
              </label>
              <input
                id="cover-subtitle-en-input"
                type="text"
                value={formData.config.cover_subtitle_en || ''}
                onChange={(e) => {
                  onUpdateConfig('cover_subtitle_en', e.target.value);
                }}
                placeholder={defaultSubtitleEn}
                className={`w-full px-3 py-2 rounded-xl text-xs font-norican focus:outline-none transition-all ${
                  theme === 'light'
                    ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                    : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                }`}
              />
            </div>
          </div>

          {/* Quick Subtitle Preset Pills */}
          <div>
            <span
              className={`block text-[11px] font-khmer mb-1.5 ${
                theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
              }`}
            >
              ជ្រើសរើសចំណងជើងរហ័ស (Quick Subtitle Presets) ៖
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUBTITLE_PRESETS.map((preset) => (
                <button
                  key={preset.type}
                  type="button"
                  onClick={() => {
                    onUpdateConfig('cover_subtitle_kh', preset.kh);
                    onUpdateConfig('cover_subtitle_en', preset.en);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-khmer transition-all border ${
                    formData.config.cover_subtitle_kh === preset.kh
                      ? 'bg-amber-400 text-amber-950 font-bold border-amber-300 shadow-sm'
                      : theme === 'light'
                      ? 'bg-white text-neutral-800 border-amber-200 hover:border-amber-400 hover:bg-amber-50'
                      : 'bg-black/40 text-neutral-300 border-white/10 hover:border-amber-400/40 hover:text-amber-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Cover Background Wallpaper Section */}
          <div
            className={`p-3.5 rounded-xl border space-y-3 ${
              theme === 'light' ? 'bg-white border-amber-200 shadow-sm' : 'bg-black/40 border-amber-500/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <label
                className={`text-xs font-khmer font-bold flex items-center gap-1.5 ${
                  theme === 'light' ? 'text-amber-950' : 'text-amber-300'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>រូបភាពផ្ទៃខាងក្រោយ Cover (Cover Background Wallpaper)</span>
              </label>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 font-khmer text-[11px] font-bold shadow flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-3 h-3" />
                <span>{isUploading ? 'កំពុងបញ្ចូល...' : 'បញ្ចូលរូបភាពពីម៉ាស៊ីន (Upload)'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Direct URL Input */}
            <input
              id="cover-bg-url-input"
              type="url"
              value={formData.config.cover_background || ''}
              onChange={(e) => onUpdateConfig('cover_background', e.target.value)}
              placeholder="https://... តំណភ្ជាប់រូបភាពផ្ទៃក្រោយ Cover..."
              className={`w-full px-3 py-1.5 rounded-lg text-xs font-mono focus:outline-none ${
                theme === 'light'
                  ? 'bg-neutral-50 border border-amber-200 text-neutral-900 focus:border-amber-500'
                  : 'bg-black/60 border border-amber-500/30 text-amber-100 focus:border-amber-400'
              }`}
            />

            {/* Preset Cover Background Thumbnails */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
              {COVER_BACKGROUND_PRESETS.map((bg) => {
                const isSelected = currentCoverBg === bg.url;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => onUpdateConfig('cover_background', bg.url)}
                    className={`relative rounded-lg overflow-hidden border text-left group transition-all ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-md scale-[1.02]'
                        : 'border-white/10 hover:border-amber-400/50 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="h-16 w-full relative">
                      <img
                        src={bg.url}
                        alt={bg.nameKh}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <div
                      className={`p-1 text-[9px] font-khmer truncate text-center ${
                        theme === 'light' ? 'bg-amber-50 text-neutral-800' : 'bg-black/70 text-amber-200'
                      }`}
                    >
                      {bg.nameKh}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Host / Couple Names on Cover */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-khmer font-bold flex items-center gap-1.5 ${
                  theme === 'light' ? 'text-amber-950' : 'text-amber-300'
                }`}
              >
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span>ឈ្មោះម្ចាស់កម្មវិធីនៅលើ Cover (Names Displayed on Cover)</span>
              </span>

              {/* Single Person Event Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.singlePerson || false}
                  onChange={(e) => onUpdateFormData({ singlePerson: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span
                  className={`text-[11px] font-khmer ${
                    theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                  }`}
                >
                  កម្មវិធីម្នាក់ឯង (Solo / Birthday)
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  className={`block text-[11px] font-khmer mb-1 ${
                    theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                  }`}
                >
                  {formData.singlePerson ? 'ឈ្មោះម្ចាស់កម្មវិធី (Khmer)' : 'ឈ្មោះកូនប្រុស / Groom (Khmer)'}
                </label>
                <input
                  type="text"
                  value={formData.groom}
                  onChange={(e) => onUpdateFormData({ groom: e.target.value })}
                  placeholder="ឈ្មោះភាសាខ្មែរ..."
                  className={`w-full px-3 py-2 rounded-xl text-xs font-moul focus:outline-none ${
                    theme === 'light'
                      ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                      : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-[11px] font-khmer mb-1 ${
                    theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                  }`}
                >
                  {formData.singlePerson ? 'ឈ្មោះម្ចាស់កម្មវិធី (English)' : 'ឈ្មោះកូនប្រុស / Groom (English)'}
                </label>
                <input
                  type="text"
                  value={formData.groomEn || ''}
                  onChange={(e) => onUpdateFormData({ groomEn: e.target.value })}
                  placeholder="English name..."
                  className={`w-full px-3 py-2 rounded-xl text-xs font-norican focus:outline-none ${
                    theme === 'light'
                      ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                      : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                  }`}
                />
              </div>

              {!formData.singlePerson && (
                <>
                  <div>
                    <label
                      className={`block text-[11px] font-khmer mb-1 ${
                        theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                      }`}
                    >
                      ឈ្មោះកូនស្រី / Bride (Khmer)
                    </label>
                    <input
                      type="text"
                      value={formData.bride}
                      onChange={(e) => onUpdateFormData({ bride: e.target.value })}
                      placeholder="ឈ្មោះភាសាខ្មែរ..."
                      className={`w-full px-3 py-2 rounded-xl text-xs font-moul focus:outline-none ${
                        theme === 'light'
                          ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                          : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-[11px] font-khmer mb-1 ${
                        theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                      }`}
                    >
                      ឈ្មោះកូនស្រី / Bride (English)
                    </label>
                    <input
                      type="text"
                      value={formData.brideEn || ''}
                      onChange={(e) => onUpdateFormData({ brideEn: e.target.value })}
                      placeholder="English name..."
                      className={`w-full px-3 py-2 rounded-xl text-xs font-norican focus:outline-none ${
                        theme === 'light'
                          ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                          : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                      }`}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Color for Cover Invitation EN Name (add color from cover of invitaton EN name) */}
            <div className={`p-3 rounded-xl border mt-3 space-y-2.5 ${
              theme === 'light' ? 'bg-amber-50/70 border-amber-200' : 'bg-black/40 border-amber-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <label className={`text-xs font-khmer font-bold flex items-center gap-1.5 ${
                  theme === 'light' ? 'text-amber-950' : 'text-amber-300'
                }`}>
                  <Palette className="w-3.5 h-3.5 text-amber-500" />
                  <span>ពណ៌ឈ្មោះអង់គ្លេសលើ Cover (Cover Invitation EN Name Color)</span>
                </label>

                {/* Live Swatch Preview & Native Color Picker */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white/80 shadow-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: currentEnNameColor }}
                    title={`Current EN Name Color: ${currentEnNameColor}`}
                  />
                  <label className="cursor-pointer text-[10px] font-khmer px-2 py-1 rounded-md bg-amber-400/20 text-amber-500 hover:bg-amber-400/30 border border-amber-400/40 transition-colors flex items-center gap-1">
                    <span>រើសពណ៌</span>
                    <input
                      id="cover-en-name-color-picker"
                      type="color"
                      value={currentEnNameColor}
                      onChange={(e) => onUpdateConfig('cover_en_name_color', e.target.value)}
                      className="w-0 h-0 opacity-0 absolute"
                    />
                  </label>
                </div>
              </div>

              {/* Color Preset Palette */}
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Quick sync buttons to top and bottom envelope text colors */}
                <button
                  type="button"
                  onClick={() => onUpdateConfig('cover_en_name_color', frontColor)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-khmer transition-all border flex items-center gap-1.5 ${
                    currentEnNameColor.toLowerCase() === frontColor.toLowerCase()
                      ? 'border-amber-400 ring-2 ring-amber-400/40 font-bold bg-amber-400/20 text-amber-300'
                      : theme === 'light'
                      ? 'bg-amber-100/70 border-amber-300 text-amber-950 hover:bg-amber-200'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-200 hover:bg-amber-500/20'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0 shadow-sm"
                    style={{ backgroundColor: frontColor }}
                  />
                  <span>ដូចពណ៌អក្សរខាងលើនៃសំបុត្រ</span>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateConfig('cover_en_name_color', bottomColor)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-khmer transition-all border flex items-center gap-1.5 ${
                    currentEnNameColor.toLowerCase() === bottomColor.toLowerCase()
                      ? 'border-amber-400 ring-2 ring-amber-400/40 font-bold bg-amber-400/20 text-amber-300'
                      : theme === 'light'
                      ? 'bg-amber-100/70 border-amber-300 text-amber-950 hover:bg-amber-200'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-200 hover:bg-amber-500/20'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0 shadow-sm"
                    style={{ backgroundColor: bottomColor }}
                  />
                  <span>ដូចពណ៌អក្សរខាងក្រោមនៃសំបុត្រ</span>
                </button>

                {EN_NAME_COLOR_PRESETS.map((item) => (
                  <button
                    key={item.hex}
                    type="button"
                    onClick={() => onUpdateConfig('cover_en_name_color', item.hex)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-khmer transition-all border flex items-center gap-1.5 ${
                      currentEnNameColor.toLowerCase() === item.hex.toLowerCase()
                        ? 'border-amber-400 ring-2 ring-amber-400/40 font-bold ' + (theme === 'light' ? 'bg-amber-100 text-amber-950' : 'bg-black/60 text-amber-200')
                        : theme === 'light'
                        ? 'bg-white border-amber-200 text-neutral-700 hover:border-amber-400 hover:bg-amber-50/50'
                        : 'bg-black/40 border-white/10 text-neutral-300 hover:border-amber-400/40 hover:text-amber-200'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span>{item.nameKh}</span>
                  </button>
                ))}
              </div>

              {/* Custom Hex Input */}
              <div className="flex items-center gap-2 pt-1">
                <span className={`text-[11px] font-khmer ${theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  លេខកូដពណ៌ (Hex Code):
                </span>
                <input
                  id="cover-en-name-color-hex"
                  type="text"
                  value={formData.config.cover_en_name_color || ''}
                  onChange={(e) => onUpdateConfig('cover_en_name_color', e.target.value)}
                  placeholder="#ffffff ឬ #f5b80f"
                  className={`w-36 px-2.5 py-1 rounded-lg text-xs font-mono focus:outline-none ${
                    theme === 'light'
                      ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500'
                      : 'bg-black/60 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                  }`}
                />
              </div>

              {/* ម៉ូតអក្សរឈ្មោះអង់គ្លេស (EN Name Font Style) */}
              <div className="space-y-2 pt-2.5 border-t border-amber-500/20">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-khmer font-bold ${theme === 'light' ? 'text-amber-950' : 'text-amber-300'}`}>
                    ម៉ូតអក្សរឈ្មោះអង់គ្លេស (English Name Font Style):
                  </label>
                  <span className="text-[10px] font-khmer opacity-75">ចុចដើម្បីប្តូរម៉ូតអក្សរ</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EN_FONT_PRESETS.map((font) => {
                    const currentFont = formData.config.cover_en_font_family || "'Norican', cursive";
                    const isSelected = currentFont === font.fontFamily;
                    return (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => onUpdateConfig('cover_en_font_family', font.fontFamily)}
                        className={`p-2 rounded-xl border text-left transition-all flex flex-col gap-0.5 active:scale-95 ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/40 font-bold bg-amber-400/20 text-amber-300'
                            : theme === 'light'
                            ? 'bg-white border-amber-200 text-neutral-800 hover:border-amber-400 hover:bg-amber-50/50'
                            : 'bg-black/40 border-white/10 text-amber-100 hover:border-amber-400/40'
                        }`}
                      >
                        <span className="text-[10px] font-khmer opacity-75">{font.nameKh}</span>
                        <span
                          className="text-sm truncate"
                          style={{ fontFamily: font.fontFamily, color: currentEnNameColor }}
                        >
                          Malay & Volak
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* រាងរូបថតគូស្នេហ៍ (Couple Photo Frame Shape) */}
              <div className="space-y-2 pt-2.5 border-t border-amber-500/20">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-khmer font-bold ${theme === 'light' ? 'text-amber-950' : 'text-amber-300'}`}>
                    រាងរូបថតគូស្នេហ៍ (Couple Photo Frame Shape):
                  </label>
                  <span className="text-[10px] font-khmer opacity-75">រង្វង់មូលសម្រាប់ភ្ជាប់ពាក្យ</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PORTRAIT_SHAPE_PRESETS.map((shape) => {
                    const currentShape = formData.config.portrait_shape || 'rounded';
                    const isSelected = currentShape === shape.id;
                    return (
                      <button
                        key={shape.id}
                        type="button"
                        onClick={() => onUpdateConfig('portrait_shape', shape.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 active:scale-95 ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/40 font-bold bg-amber-400/20 text-amber-300'
                            : theme === 'light'
                            ? 'bg-white border-amber-200 text-neutral-800 hover:border-amber-400 hover:bg-amber-50/50'
                            : 'bg-black/40 border-white/10 text-amber-100 hover:border-amber-400/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-khmer font-bold">{shape.nameKh.split(' ')[0]}</span>
                          <div
                            className={`w-4 h-4 border border-amber-400/80 bg-amber-400/20 ${
                              shape.id === 'circle'
                                ? 'rounded-full'
                                : shape.id === 'arch'
                                ? 'rounded-t-full rounded-b-xs'
                                : shape.id === 'square'
                                ? 'rounded-none'
                                : 'rounded-md'
                            }`}
                          />
                        </div>
                        <span className="text-[10px] font-khmer opacity-70 leading-tight">
                          {shape.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 5. Date and Location on Cover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-500/20">
            <div>
              <label
                className={`block text-[11px] font-khmer mb-1 flex items-center gap-1 ${
                  theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                }`}
              >
                <Calendar className="w-3 h-3 text-amber-500" />
                <span>កាលបរិច្ឆេទលើ Cover (Khmer Date Text)</span>
              </label>
              <input
                type="text"
                value={formData.config.invitation_kh?.date_time || ''}
                onChange={(e) => {
                  onUpdateConfig('invitation_kh', {
                    ...formData.config.invitation_kh,
                    date_time: e.target.value,
                  });
                }}
                placeholder="ថ្ងៃអាទិត្យ ទី២៥ ខែកញ្ញា ឆ្នាំ២០២៦"
                className={`w-full px-3 py-2 rounded-xl text-xs font-khmer focus:outline-none ${
                  theme === 'light'
                    ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                    : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-[11px] font-khmer mb-1 flex items-center gap-1 ${
                  theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                }`}
              >
                <MapPin className="w-3 h-3 text-amber-500" />
                <span>ទីតាំងលើ Cover (Venue Location)</span>
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => onUpdateFormData({ location: e.target.value })}
                placeholder="សាលមហោស្រពវិមានសិរីមង្គល់..."
                className={`w-full px-3 py-2 rounded-xl text-xs font-khmer focus:outline-none ${
                  theme === 'light'
                    ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                    : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                }`}
              />
            </div>
          </div>

          {/* Quick Action Footer: Save Button & Notification */}
          <div
            className={`pt-3 border-t flex items-center justify-between ${
              theme === 'light' ? 'border-amber-200' : 'border-amber-500/20'
            }`}
          >
            <span
              className={`text-[11px] font-khmer ${
                theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              រាល់ការកែប្រែនឹងបង្ហាញលើអេក្រង់ Cover និង Envelope ភ្លាមៗ
            </span>

            <button
              id="save-cover-info-btn"
              type="button"
              onClick={handleSaveCoverInfo}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-amber-950 font-moul text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>រក្សាទុកព័ត៌មាន Cover</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
