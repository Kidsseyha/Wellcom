import { useState } from 'react';
import {
  Sparkles,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { WeddingEvent, TemplateConfig } from '../types';
import { ThemeMode } from './ThemeToggle';

interface CoverInfoEditorProps {
  formData: WeddingEvent;
  onUpdateFormData?: (updates: Partial<WeddingEvent>) => void;
  onUpdateConfig?: <K extends keyof TemplateConfig>(key: K, value: TemplateConfig[K]) => void;
  theme?: ThemeMode;
  onSave?: () => void;
}

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

export default function CoverInfoEditor({
  formData,
  theme = 'dark',
}: CoverInfoEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const currentCoverBg =
    formData.config.cover_background ||
    'https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/free-background.jpg';

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

  const defaultSubtitleKh = formData.config.invitation_kh?.main_title || (isBirthday
    ? 'រីករាយពិធីខួបកំណើត'
    : isEngagement
    ? 'ពិធីភ្ជាប់ពាក្យ'
    : isHousewarming
    ? 'ពិធីឡើងគេហដ្ឋានថ្មី'
    : 'សិរីសួស្តី អាពាហ៍ពិពាហ៍');

  const defaultSubtitleEn = isBirthday
    ? 'HAPPY BIRTHDAY INVITATION'
    : isEngagement
    ? 'ENGAGEMENT INVITATION'
    : isHousewarming
    ? 'HOUSEWARMING INVITATION'
    : 'ROYAL WEDDING INVITATION';

  const rawSubtitleKh = formData.config.cover_subtitle_kh || defaultSubtitleKh;
  const currentSubtitleKh = rawSubtitleKh === 'រីករាយថ្ងៃកំណើត' ? 'រីករាយពិធីខួបកំណើត' : rawSubtitleKh;
  const currentEnNameColor = formData.config.cover_en_name_color || '#ffffff';

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
                ទិដ្ឋភាព Cover នៃធៀប (Live Cover Preview)
              </h4>
            </div>
            <p
              className={`text-[11px] font-khmer ${
                theme === 'light' ? 'text-amber-900/80' : 'text-amber-300/70'
              }`}
            >
              ផ្ទាំងបង្ហាញទិដ្ឋភាពក្របធៀបជាក់ស្តែង (Real-time Envelope & Cover Preview)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ChevronDown
            className={`w-4 h-4 text-amber-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5">
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

            {/* Realistic Mini Envelope Mockup - Full Width */}
            <div
              className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden border-2 border-amber-400/60 shadow-lg flex flex-col items-center justify-center p-3 text-center"
              style={{
                backgroundImage: `url(${currentCoverBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Overlay tint for text legibility */}
              <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px]" />

              {/* Mini Curved Title */}
              <div className="relative z-10 w-full max-w-xs sm:max-w-md h-11 -mb-1">
                <svg viewBox="0 0 400 90" className="w-full h-full overflow-visible">
                  <path
                    id="miniSubtitleCurve"
                    d="M 40 70 Q 200 15 360 70"
                    fill="transparent"
                  />
                  <text
                    className="font-norican font-extrabold"
                    fill="#f5b80f"
                    fontSize="26px"
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
                <h5 className="font-moul font-black text-amber-300 text-sm sm:text-base drop-shadow-md">
                  {formData.singlePerson
                    ? formData.groom
                    : `${formData.groom} & ${formData.bride}`}
                </h5>
                <p
                  style={{ color: currentEnNameColor }}
                  className="font-norican font-bold text-sm sm:text-base drop-shadow-sm capitalize transition-colors"
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
        </div>
      )}
    </div>
  );
}
