import { useState, useRef, type ChangeEvent, type ReactNode } from 'react';
import { Palette, Upload, Image as ImageIcon, Sparkles, RefreshCw, Layers, Check, Trash2, MapPin, Building2, EyeOff } from 'lucide-react';
import { TemplateConfig } from '../types';
import { FRAME_PRESETS } from '../data/framePresets';

interface DesignSettingsSectionProps {
  config: TemplateConfig;
  onUpdateConfig: <K extends keyof TemplateConfig>(key: K, value: TemplateConfig[K]) => void;
  eventImage: string;
  onUpdateEventImage: (url: string) => void;
}

// Famous Khmer Wedding Place / Venue Background Presets
export const VENUE_PLACE_PRESETS = [
  {
    id: 'venue-current',
    nameKh: 'ទីតាំងរៀបចំពិធីបច្ចុប្បន្ន',
    nameEn: 'Current Event Venue',
    imageUrl: 'https://focuz-staging-space.sgp1.digitaloceanspaces.com/plan-essential/event/template/assets/1760584282359-vqmy8x-Maps.JPG',
    previewUrl: 'https://focuz-staging-space.sgp1.digitaloceanspaces.com/plan-essential/event/template/assets/1760584282359-vqmy8x-Maps.JPG',
  },
  {
    id: 'venue-vimean-serey',
    nameKh: 'វិមានសិរីមង្គល (ចំការដូង)',
    nameEn: 'Vimean Sereymongkul Hall',
    imageUrl: 'https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/free-background.jpg',
    previewUrl: 'https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/free-background.jpg',
  },
  {
    id: 'venue-koh-pich',
    nameKh: 'សាលមហោស្រពកោះពេជ្រ',
    nameEn: 'Koh Pich Grand Hall',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'venue-premier-sen-sok',
    nameKh: 'សាលមង្គល ព្រីមៀ សែនសុខ',
    nameEn: 'Premier Centre Sen Sok',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'venue-royal-palace',
    nameKh: 'រចនាបថព្រះបរមរាជវាំងខ្មែរ',
    nameEn: 'Royal Khmer Palace Hall',
    imageUrl: 'https://focuz-staging-space.sgp1.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/cover-2.jpg',
    previewUrl: 'https://focuz-staging-space.sgp1.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/cover-2.jpg',
  },
];

// Helper to compress image
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

interface FilePickerProps {
  label: string;
  previewUrl: string;
  onFileSelected: (url: string) => void;
  aspectClass?: string;
  defaultFilename?: string;
  helpText?: string;
  extraControls?: ReactNode;
}

function DesignFilePicker({
  label,
  previewUrl,
  onFileSelected,
  aspectClass = 'aspect-[16/9]',
  helpText,
  extraControls,
}: FilePickerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>('No file chosen');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    try {
      const dataUrl = await compressImage(file);
      onFileSelected(dataUrl);
    } catch (err) {
      console.error('Error reading image file:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2.5 p-3.5 rounded-2xl bg-black/40 border border-amber-500/20">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-amber-200 font-khmer">
          {label}
        </label>
        {helpText && (
          <span className="text-[10px] text-amber-300/70 font-khmer">
            {helpText}
          </span>
        )}
      </div>

      {/* Preview Section */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-amber-300/70 font-khmer">Preview</span>
        <div className={`relative w-full ${aspectClass} rounded-xl overflow-hidden border border-amber-500/30 bg-black flex items-center justify-center`}>
          {previewUrl && previewUrl !== 'none' ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover object-center"
            />
          ) : previewUrl === 'none' ? (
            <div className="flex flex-col items-center gap-1.5 p-3 text-center text-amber-500/80">
              <EyeOff className="w-8 h-8 opacity-60 text-amber-500" />
              <span className="text-[10px] font-khmer font-bold leading-normal">លាក់រូបភាពទាំងស្រុង (Hidden Completely)</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-neutral-500">
              <ImageIcon className="w-8 h-8 opacity-40" />
              <span className="text-[10px]">No image selected</span>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-amber-300 text-xs font-khmer">
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" /> កំពុងបញ្ចូល...
            </div>
          )}
        </div>
      </div>

      {/* File Input Control Line: "No file chosen" + "ដាក់រូបភាព" Button */}
      <div className="pt-1 flex items-center justify-between gap-2">
        <div className="flex-1 truncate text-xs text-neutral-400 font-mono bg-black/60 px-3 py-2 rounded-xl border border-neutral-700/50">
          {fileName}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-khmer text-xs font-bold shadow-md flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>ដាក់រូបភាព</span>
        </button>
      </div>

      {extraControls}
    </div>
  );
}

export default function DesignSettingsSection({
  config,
  onUpdateConfig,
  eventImage,
  onUpdateEventImage,
}: DesignSettingsSectionProps) {
  const frontColor = config.primaryColor || '#f5b80f';
  const bottomColor = config.textColor || '#f5b80f';
  const currentFrame = config.envelope_frame || '';
  const currentBackground = config.main_background || '';
  const venueLocationImg = config.event_location || VENUE_PLACE_PRESETS[0].imageUrl;

  const dynamicVenuePresets = [
    {
      id: 'venue-current',
      nameKh: 'ទីតាំងរៀបចំពិធីបច្ចុប្បន្ន',
      nameEn: 'Current Event Venue',
      imageUrl: venueLocationImg,
      previewUrl: venueLocationImg,
    },
    ...VENUE_PLACE_PRESETS.slice(1),
  ];

  const handleApplyPlaceToBackground = (placeUrl: string) => {
    onUpdateConfig('main_background', placeUrl);
    onUpdateConfig('cover_background', placeUrl);
  };

  return (
    <div className="space-y-5">
      {/* Title Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-amber-500/20">
        <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
          <Palette className="w-4 h-4" />
        </div>
        <h4 className="text-sm font-moul text-amber-200">
          ការរចនា
        </h4>
        <span className="text-[11px] text-amber-300/60 font-khmer ml-auto">
          Theme & Styling Settings
        </span>
      </div>

      {/* Colors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. ពណ៌អក្សរខាងមុខ */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/20 space-y-2">
          <label className="block text-xs font-semibold text-amber-200 font-khmer">
            ពណ៌អក្សរខាងមុខ
          </label>
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center">
              <input
                type="color"
                value={frontColor}
                onChange={(e) => onUpdateConfig('primaryColor', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0 p-0"
              />
            </div>
            <input
              type="text"
              value={frontColor}
              onChange={(e) => onUpdateConfig('primaryColor', e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 font-mono text-xs focus:outline-none focus:border-amber-400"
              placeholder="#f5b80f"
            />
          </div>
          <p className="text-[10px] text-neutral-400 font-khmer">
            សម្រាប់ចំណងជើងធំ ឈ្មោះកូនកំលោះ-កូនក្រមុំ និងប័ណ្ណកិត្តិយស
          </p>
        </div>

        {/* 2. ពណ៌អក្សរខាងក្រោម */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/20 space-y-2">
          <label className="block text-xs font-semibold text-amber-200 font-khmer">
            ពណ៌អក្សរខាងក្រោម
          </label>
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center">
              <input
                type="color"
                value={bottomColor}
                onChange={(e) => onUpdateConfig('textColor', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0 p-0"
              />
            </div>
            <input
              type="text"
              value={bottomColor}
              onChange={(e) => onUpdateConfig('textColor', e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 font-mono text-xs focus:outline-none focus:border-amber-400"
              placeholder="#f5b80f"
            />
          </div>
          <p className="text-[10px] text-neutral-400 font-khmer">
            សម្រាប់កាលបរិច្ឆេទ ទីតាំង ព័ត៌មានលម្អិត និងសារថ្លែងអំណរគុណ
          </p>
        </div>
      </div>

      {/* 3. រូបថតគូស្នេហ៍ចម្បង (Hero Portrait Photo) */}
      <DesignFilePicker
        label="រូបថតគូស្នេហ៍ចម្បង (Main Couple Portrait)"
        previewUrl={eventImage || config.main_background}
        onFileSelected={(url) => onUpdateEventImage(url)}
        aspectClass="aspect-[3/4] w-48 mx-auto"
        helpText="រូបថតបង្ហាញនៅចំកណ្តាលលិខិតអញ្ជើញ (Shown in the middle of the invitation)"
      />

      {/* 3.5. រូបភាពនិមិត្តសញ្ញាក្បាលសំបុត្រអញ្ជើញ (Envelope Header Crest / Ribbon Picture) */}
      <DesignFilePicker
        label="រូបភាពនិមិត្តសញ្ញាក្បាលសំបុត្រអញ្ជើញ (Envelope Header Crest / Picture)"
        previewUrl={config.envelope_header_image || ''}
        onFileSelected={(url) => onUpdateConfig('envelope_header_image', url)}
        aspectClass="aspect-[16/6] max-w-xs mx-auto"
        helpText="អាចផ្លាស់ប្តូររូបភាពខ្សែបូ/រូបសញ្ញានៅខាងលើសំបុត្រ (Change envelope top ribbon/crest photo)"
        extraControls={
          <div className="pt-2 flex justify-end gap-2">
            {config.envelope_header_image !== 'none' && (
              <button
                type="button"
                onClick={() => onUpdateConfig('envelope_header_image', 'none')}
                className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-[11px] font-khmer flex items-center gap-1 transition-all"
                title="លាក់រូបភាពទាំងស្រុង"
              >
                <EyeOff className="w-3 h-3" />
                <span>លាក់រូបភាពទាំងស្រុង (Hide Picture)</span>
              </button>
            )}
            {config.envelope_header_image && config.envelope_header_image !== '' && (
              <button
                type="button"
                onClick={() => onUpdateConfig('envelope_header_image', '')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-khmer flex items-center gap-1 transition-all"
                title="ប្រើខ្សែបូដើមវិញ"
              >
                <Trash2 className="w-3 h-3" />
                <span>ប្រើខ្សែបូដើម (Use Default)</span>
              </button>
            )}
          </div>
        }
      />

      {/* 4. ការរចនាស៊ុមស្លាកឈ្មោះភ្ញៀវ (Guest Name Label & Frame Design) */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-black/60 to-black/80 border border-amber-500/30 space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold font-moul text-amber-200">
                ការរចនាស៊ុមស្លាកឈ្មោះភ្ញៀវ (Guest Label Design)
              </h4>
              <p className="text-[11px] text-amber-300/70 font-khmer">
                មានកន្លែងបញ្ចូលរូបភាព ស៊ុម/ស្លាកឈ្មោះ សម្រាប់ប្រើលើឈ្មោះភ្ញៀវមុនពេលបើកសំបុត្រ
              </p>
            </div>
          </div>
          {currentFrame && (
            <button
              type="button"
              onClick={() => onUpdateConfig('envelope_frame', '')}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-khmer flex items-center gap-1 transition-all"
            >
              <Trash2 className="w-3 h-3" />
              <span>កំណត់ដើម</span>
            </button>
          )}
        </div>

        {/* Frame Presets quick selection */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-khmer font-semibold text-amber-300/80">
            ជ្រើសរើសគំរូស៊ុមស្លាកឈ្មោះមាស ឬបញ្ចូលរូបភាពផ្ទាល់ខ្លួន (Choose Preset or Upload Custom):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {FRAME_PRESETS.map((preset) => {
              const isSelected = currentFrame === preset.imageUrl;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onUpdateConfig('envelope_frame', preset.imageUrl)}
                  className={`p-2 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all group ${
                    isSelected
                      ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/30 shadow-md shadow-amber-500/20 scale-[1.02]'
                      : 'bg-black/60 border-amber-500/20 hover:bg-black/90 hover:border-amber-400/60 hover:scale-[1.01]'
                  }`}
                >
                  <div className="w-full aspect-[16/6] rounded-lg bg-black p-1 border border-amber-500/20 flex items-center justify-center overflow-hidden relative group-hover:border-amber-400/50 transition-colors">
                    <img
                      src={preset.previewUrl}
                      alt={preset.nameKh}
                      className="w-full h-full object-contain filter drop-shadow"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className="w-full text-center">
                    <span className="block text-[11px] font-khmer font-bold text-amber-200 leading-tight">
                      {preset.nameKh}
                    </span>
                    <span className="block text-[9px] text-amber-400/70 truncate mt-0.5">
                      {preset.nameEn}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Clear / Default Option */}
            <button
              type="button"
              onClick={() => onUpdateConfig('envelope_frame', '')}
              className={`p-2 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all ${
                !currentFrame
                  ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/30 shadow-md scale-[1.02]'
                  : 'bg-black/60 border-amber-500/20 hover:bg-black/90'
              }`}
            >
              <div className="w-full aspect-[16/6] rounded-lg bg-black p-1 border border-dashed border-neutral-600 flex flex-col items-center justify-center text-neutral-400">
                <span className="text-xs font-mono font-bold text-amber-300">Default</span>
                <span className="text-[9px] font-khmer text-neutral-400">បូក្បាច់មាសដើម</span>
              </div>
              <div className="w-full text-center">
                <span className="block text-[11px] font-khmer font-bold text-neutral-300 leading-tight">
                  គំរូដើម (Standard)
                </span>
                <span className="block text-[9px] text-neutral-500 truncate mt-0.5">
                  Default Ribbon
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 4. រូបភាពក្របខាងមុខ (Cover) */}
      <DesignFilePicker
        label="រូបភាពក្របខាងមុខ (Cover)"
        previewUrl={config.cover_background || config.main_background}
        onFileSelected={(url) => onUpdateConfig('cover_background', url)}
        aspectClass="aspect-[16/9]"
      />

      {/* 5. ផ្ទៃខាងក្រោម(Backgroud) & Place / Venue Background Selection */}
      <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-black via-black/80 to-black border border-amber-500/35 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold font-moul text-amber-200">
                ផ្ទៃខាងក្រោម(Backgroud) នៃលិខិតអញ្ជើញ
              </h4>
              <p className="text-[11px] text-amber-300/70 font-khmer">
                អាចជ្រើសរើសរូបភាពទីតាំងមង្គលការ (Place/Venue) ឬដាក់រូបភាពផ្ទាល់ខ្លួន
              </p>
            </div>
          </div>

          {/* Quick 1-Click Apply Place Button */}
          <button
            type="button"
            onClick={() => handleApplyPlaceToBackground(venueLocationImg)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-khmer font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            title="កំណត់យករូបភាពទីតាំងជាផ្ទៃខាងក្រោយ"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>ប្រើរូបទីតាំង (Apply Place)</span>
          </button>
        </div>

        {/* Place / Venue Presets Grid */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-khmer font-semibold text-amber-300/90 flex items-center justify-between">
            <span>ជ្រើសរើសគំរូរូបភាពទីតាំងមង្គលការ (Venue & Place Presets):</span>
            <span className="text-[10px] text-amber-400/70 font-normal">ចុច ១ ឃ្លីកដើម្បីប្តូរភ្លាមៗ</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {dynamicVenuePresets.map((preset) => {
              const isSelected = currentBackground === preset.imageUrl;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPlaceToBackground(preset.imageUrl)}
                  className={`p-2 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all group ${
                    isSelected
                      ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/30 shadow-md shadow-amber-500/20 scale-[1.02]'
                      : 'bg-black/60 border-amber-500/20 hover:bg-black/90 hover:border-amber-400/60 hover:scale-[1.01]'
                  }`}
                >
                  <div className="w-full aspect-[4/3] rounded-lg bg-black border border-amber-500/20 overflow-hidden relative group-hover:border-amber-400/50 transition-colors">
                    <img
                      src={preset.previewUrl}
                      alt={preset.nameKh}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className="w-full text-center">
                    <span className="block text-[10px] sm:text-[11px] font-khmer font-bold text-amber-200 leading-tight truncate">
                      {preset.nameKh}
                    </span>
                    <span className="block text-[9px] text-amber-400/70 truncate mt-0.5">
                      {preset.nameEn}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Background Upload / File Picker */}
        <DesignFilePicker
          label="ឬបញ្ចូលរូបភាពផ្ទៃខាងក្រោយផ្ទាល់ខ្លួន (Custom Upload Background)"
          previewUrl={config.main_background}
          onFileSelected={(url) => onUpdateConfig('main_background', url)}
          aspectClass="aspect-[16/9]"
          helpText="ទំហំដែលសមស្រប 1600x900 ឬខ្ពស់ជាង"
        />
      </div>
    </div>
  );
}


