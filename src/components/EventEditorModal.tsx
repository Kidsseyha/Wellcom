import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Save,
  RotateCcw,
  Users,
  Image as ImageIcon,
  Calendar,
  MessageSquare,
  QrCode,
  Music,
  Plus,
  Trash2,
  Check,
  Clock,
  Sparkles,
  LayoutTemplate,
  Palette,
  Heart,
  Home,
  Cake,
  Sliders,
} from 'lucide-react';
import { WeddingEvent, TimelineItem, Shift } from '../types';
import { toKhmerNumber } from '../utils/khmerHelpers';
import { EVENT_PRESETS, EventTypePreset } from '../data/eventTemplates';
import ImageUploadInput from './ImageUploadInput';
import DesignSettingsSection from './DesignSettingsSection';
import { ThemeMode } from './ThemeToggle';

function generateDayTitlesFromDate(dateStr: string, shiftIndex: number) {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;

  const dateObj = new Date(y, m - 1, d);
  const dayOfWeek = dateObj.getDay();

  const khmerDays = [
    'ថ្ងៃអាទិត្យ',
    'ថ្ងៃច័ន្ទ',
    'ថ្ងៃអង្គារ',
    'ថ្ងៃពុធ',
    'ថ្ងៃព្រហស្បតិ៍',
    'ថ្ងៃសុក្រ',
    'ថ្ងៃសៅរ៍',
  ];
  const khmerMonths = [
    'មករា',
    'កុម្ភៈ',
    'មីនា',
    'មេសា',
    'ឧសភា',
    'មិថុនា',
    'កក្កដា',
    'សីហា',
    'កញ្ញា',
    'តុលា',
    'វិច្ឆិកា',
    'ធ្នូ',
  ];

  const enDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const enMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dStr = d < 10 ? `0${d}` : `${d}`;
  const dKh = toKhmerNumber(dStr);
  const yKh = toKhmerNumber(y);
  const dayNumKh = toKhmerNumber(shiftIndex + 1);

  const khTitle = `ថ្ងៃទី${dayNumKh} ៖ ${khmerDays[dayOfWeek]} ទី${dKh} ខែ${khmerMonths[m - 1]} ឆ្នាំ${yKh}`;
  const enTitle = `Day ${shiftIndex + 1}: ${enDays[dayOfWeek]}, ${enMonths[m - 1]} ${dStr}, ${y}`;

  return {
    khTitle,
    enTitle,
    khmerDay: khmerDays[dayOfWeek],
    enDay: enDays[dayOfWeek],
    khmerMonth: khmerMonths[m - 1],
    enMonth: enMonths[m - 1],
    dayNumber: dStr,
    year: y,
    summaryKh: `${khmerDays[dayOfWeek]} ទី${dKh} ខែ${khmerMonths[m - 1]} ឆ្នាំ${yKh}`,
    summaryEn: `${enDays[dayOfWeek]}, ${enMonths[m - 1]} ${dStr}, ${y}`,
  };
}

interface EventEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: WeddingEvent;
  onSave: (updatedEvent: WeddingEvent) => Promise<boolean | void> | void;
  onReset: () => void;
  theme?: ThemeMode;
}

type TabType = 'presets' | 'design' | 'couple' | 'photos' | 'schedule' | 'messages' | 'khqr' | 'music';

const MUSIC_PRESETS = [
  {
    name: 'Plan Essential Official Theme (Default)',
    url: 'https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/audio/audio-2.mp3',
  },
  {
    name: 'Romantic Acoustic Wedding',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-113540.mp3',
  },
  {
    name: 'Sweet Piano Melodies',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=warm-memories-emotional-inspiring-piano-10820.mp3',
  },
];

export default function EventEditorModal({
  isOpen,
  onClose,
  event,
  onSave,
  onReset,
  theme = 'dark',
}: EventEditorModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('couple');
  const [formData, setFormData] = useState<WeddingEvent>(event);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeShiftIndex, setActiveShiftIndex] = useState(0);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(event);
    }
  }, [event, isOpen]);

  // Gallery Photos list
  const galleryPhotos =
    formData.config.galleryPhotos && formData.config.galleryPhotos.length > 0
      ? formData.config.galleryPhotos
      : [
          formData.config.photo_gallary.photo1,
          formData.config.photo_gallary.photo2,
          formData.config.photo_gallary.photo3,
          formData.config.photo_gallary.photo4,
        ].filter(Boolean);

  const handleUpdateField = <K extends keyof WeddingEvent>(key: K, value: WeddingEvent[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateConfig = <K extends keyof WeddingEvent['config']>(
    key: K,
    value: WeddingEvent['config'][K]
  ) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value,
      },
    }));
  };

  const handleUpdateKhContent = (field: string, val: string) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        invitation_kh: {
          ...prev.config.invitation_kh,
          [field]: val,
        },
      },
    }));
  };

  const handleUpdateEnContent = (field: string, val: string) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        invitation_en: {
          ...prev.config.invitation_en,
          [field]: val,
        },
      },
    }));
  };

  // Gallery Management
  const handleAddGalleryPhoto = (newUrl: string) => {
    if (!newUrl) return;
    const updated = [...galleryPhotos, newUrl];
    handleUpdateConfig('galleryPhotos', updated);
  };

  const handleRemoveGalleryPhoto = (indexToRemove: number) => {
    const updated = galleryPhotos.filter((_, idx) => idx !== indexToRemove);
    handleUpdateConfig('galleryPhotos', updated);
  };

  const handleUpdateGalleryPhoto = (indexToUpdate: number, newUrl: string) => {
    const updated = galleryPhotos.map((item, idx) => (idx === indexToUpdate ? newUrl : item));
    handleUpdateConfig('galleryPhotos', updated);
  };

  // Timeline / Schedule Management
  const shifts = formData.schedules[0]?.shifts || [];
  const activeShift = shifts[activeShiftIndex] || shifts[0];
  const timelineItems = activeShift?.timeLine || [];

  const handleUpdateShiftInfo = (shiftIdx: number, updates: Partial<Shift>) => {
    const updatedShifts = shifts.map((shift, idx) =>
      idx === shiftIdx ? { ...shift, ...updates } : shift
    );
    setFormData(prev => ({
      ...prev,
      schedules: [{ ...prev.schedules[0], shifts: updatedShifts }],
    }));
  };

  const handleUpdateShiftDate = (shiftIdx: number, newDate: string, autoFormatTitles = false) => {
    const formatted = generateDayTitlesFromDate(newDate, shiftIdx);
    const updates: Partial<Shift> = { date: newDate };

    const currentShift = shifts[shiftIdx];
    const isDefaultOrEmpty =
      !currentShift?.name ||
      currentShift.name.startsWith('ថ្ងៃទី') ||
      !currentShift?.nameEn ||
      currentShift.nameEn.startsWith('Day ');

    if ((autoFormatTitles || isDefaultOrEmpty) && formatted) {
      updates.name = formatted.khTitle;
      updates.nameEn = formatted.enTitle;
    }

    const updatedShifts = shifts.map((shift, idx) =>
      idx === shiftIdx ? { ...shift, ...updates } : shift
    );

    const extraUpdates: Partial<WeddingEvent> = {};
    if (shiftIdx === 0 && newDate) {
      extraUpdates.startTime = `${newDate}T07:00:00.000Z`;
    }
    if (formatted && (shiftIdx === 1 || (shifts.length === 1 && shiftIdx === 0))) {
      extraUpdates.config = {
        ...formData.config,
        invitation_kh: {
          ...formData.config.invitation_kh,
          date_time: formatted.summaryKh,
        },
        invitation_en: {
          ...formData.config.invitation_en,
          date_time: formatted.summaryEn,
        },
      };
    }

    setFormData(prev => ({
      ...prev,
      ...extraUpdates,
      schedules: [{ ...prev.schedules[0], shifts: updatedShifts }],
    }));
  };

  const handleApplyCalendarTitles = (shiftIdx: number) => {
    const currentShift = shifts[shiftIdx];
    if (!currentShift?.date) return;
    const formatted = generateDayTitlesFromDate(currentShift.date, shiftIdx);
    if (!formatted) return;
    handleUpdateShiftInfo(shiftIdx, {
      name: formatted.khTitle,
      nameEn: formatted.enTitle,
    });
  };

  const handleSetTwoDaysPreset = () => {
    const twoDayShifts: Shift[] = [
      {
        id: 'cmgstpkqn0005kz04vai61xd7',
        name: 'ថ្ងៃទី១ ៖ ថ្ងៃសៅរ៍ ទី​០៦ ខែមករា (ចូលរោង & សូត្រមន្ត)',
        nameEn: 'Day 1: Saturday, January 06 (Blessing & Hair-Cutting)',
        date: '2026-01-06',
        timeLine: [
          {
            id: 'time-d1-1',
            time: '02:00 PM',
            name: 'ជួបជុំភ្ញៀវកិត្តិយស និងញាតិមិត្តជិតឆ្ងាយ (ពិធីចូលរោងជ័យ)',
            nameEn: 'Guest & Family Gathering (Entering the Blessing Hall)',
            icon: 'users',
          },
          {
            id: 'time-d1-2',
            time: '03:30 PM',
            name: 'ពិធីសូត្រមន្តចម្រើនព្រះបរិត្ត សុំសិរីសួស្តី',
            nameEn: 'Monks’ Blessing Chanting Ceremony',
            icon: 'flame',
          },
          {
            id: 'time-d1-3',
            time: '04:30 PM',
            name: 'ពិធីកាត់សក់ បង្កក់សិរី សិរីសួស្តីជ័យមង្គល',
            nameEn: 'Traditional Hair-Cutting Cleansing Ceremony',
            icon: 'scissors',
          },
          {
            id: 'time-d1-4',
            time: '06:00 PM',
            name: 'ពិសារភោជនាហារពេលល្ងាច ជួបជុំបងប្អូន (ថ្ងៃទី១)',
            nameEn: 'Day 1 Evening Dinner & Family Gathering',
            icon: 'utensils',
          },
        ],
      },
      {
        id: 'shift-day-2',
        name: 'ថ្ងៃទី២ ៖ ថ្ងៃអាទិត្យ ទី០៧ ខែមករា (ហែជំនូន & ពិសាភោជនាហារ)',
        nameEn: 'Day 2: Sunday, January 07 (Procession & Grand Banquet)',
        date: '2026-01-07',
        timeLine: [
          {
            id: 'time-d2-1',
            time: '07:00 AM',
            name: 'ពិធីហែជំនូន ចូលរោងជ័យ និងជូនកំណត់ជើងការ',
            nameEn: 'Groom’s Grand Procession & Dowry Offering',
            icon: 'gift',
          },
          {
            id: 'time-d2-2',
            time: '08:30 AM',
            name: 'ពិធីរៀបរាប់ផ្លែឈើ និងសុំស្រីអនមកសំពះផ្ទឹម',
            nameEn: 'Fruit Presentation & Knot-Tying Ceremony',
            icon: 'heart',
          },
          {
            id: 'time-d2-3',
            time: '10:00 AM',
            name: 'ពិធីបង្វិលពពិល បង្កក់សិរី និងចងដៃប្រសិទ្ធពរជ័យ',
            nameEn: 'Spinning Lanterns Blessing & Hand-Tying Ceremony',
            icon: 'crown',
          },
          {
            id: 'time-d2-4',
            time: '12:00 PM',
            name: 'ពិសារភោជនាហារពេលថ្ងៃត្រង់',
            nameEn: 'Luncheon',
            icon: 'utensils',
          },
          {
            id: 'time-d2-5',
            time: '05:00 PM',
            name: 'ពិធីពិសារភោជនាហារពេលល្ងាច និងរាំកម្សាន្ត (Wedding Banquet Reception)',
            nameEn: 'Grand Wedding Banquet Reception & Dance',
            icon: 'wine',
          },
        ],
      },
    ];

    setFormData(prev => ({
      ...prev,
      schedules: [{ ...prev.schedules[0], shifts: twoDayShifts }],
      config: {
        ...prev.config,
        invitation_kh: {
          ...prev.config.invitation_kh,
          date_time: 'ថ្ងៃសៅរ៍ ទី០៦ និង ថ្ងៃអាទិត្យ ទី០៧ ខែមករា ឆ្នាំ២០២៦',
        },
        invitation_en: {
          ...prev.config.invitation_en,
          date_time: 'Saturday 06 & Sunday 07 January 2026',
        },
      },
    }));
    setActiveShiftIndex(0);
  };

  const handleSyncDateFromShift = (shiftIdx: number) => {
    const shift = shifts[shiftIdx];
    if (!shift?.date) return;
    const formatted = generateDayTitlesFromDate(shift.date, shiftIdx);
    if (!formatted) return;

    setFormData(prev => ({
      ...prev,
      startTime: `${shift.date}T17:00:00.000Z`,
      config: {
        ...prev.config,
        invitation_kh: {
          ...prev.config.invitation_kh,
          date_time: formatted.summaryKh,
        },
        invitation_en: {
          ...prev.config.invitation_en,
          date_time: formatted.summaryEn,
        },
      },
    }));
    setSyncFeedback(`បានទាញយកទិន្នន័យពីរបៀបវារៈ ៖ ${formatted.summaryKh}`);
    setTimeout(() => setSyncFeedback(null), 3500);
  };

  const handleSyncBothDaysDate = () => {
    if (shifts.length < 2) return;
    const s1 = shifts[0];
    const s2 = shifts[1];
    const f1 = s1?.date ? generateDayTitlesFromDate(s1.date, 0) : null;
    const f2 = s2?.date ? generateDayTitlesFromDate(s2.date, 1) : null;

    if (f1 && f2) {
      const khStr = `${f1.khmerDay} ទី${toKhmerNumber(f1.dayNumber)} និង ${f2.khmerDay} ទី${toKhmerNumber(f2.dayNumber)} ខែ${f2.khmerMonth} ឆ្នាំ${toKhmerNumber(f2.year)}`;
      const enStr = `${f1.enDay}, ${f1.enMonth} ${f1.dayNumber} & ${f2.enDay}, ${f2.enMonth} ${f2.dayNumber}, ${f2.year}`;
      setFormData(prev => ({
        ...prev,
        config: {
          ...prev.config,
          invitation_kh: {
            ...prev.config.invitation_kh,
            date_time: khStr,
          },
          invitation_en: {
            ...prev.config.invitation_en,
            date_time: enStr,
          },
        },
      }));
      setSyncFeedback(`បានទាញយកកាលបរិច្ឆេទទាំង ២ ថ្ងៃពីរបៀបវារៈ ៖ ${khStr}`);
      setTimeout(() => setSyncFeedback(null), 3500);
    }
  };

  const handleAddDay = () => {
    if (shifts.length >= 2) return;
    const newDayNum = shifts.length + 1;
    const newShift: Shift = {
      id: `shift-day-${Date.now()}`,
      name: `ថ្ងៃទី${newDayNum} ៖ ថ្ងៃអាទិត្យ ទី០៧ ខែមករា (ហែជំនូន & ពិសាភោជនាហារ)`,
      nameEn: `Day ${newDayNum}: Sunday, January 07 (Procession & Banquet)`,
      date: '2026-01-07',
      timeLine: [
        {
          id: `time-${Date.now()}-1`,
          time: '07:00 AM',
          name: 'ពិធីហែជំនូន ចូលរោងជ័យ',
          nameEn: 'Groom’s Grand Procession',
          icon: 'gift',
        },
        {
          id: `time-${Date.now()}-2`,
          time: '08:30 AM',
          name: 'ពិធីរៀបរាប់ផ្លែឈើ និងសំពះផ្ទឹម',
          nameEn: 'Fruit Presentation & Knot-Tying Ceremony',
          icon: 'heart',
        },
        {
          id: `time-${Date.now()}-3`,
          time: '05:00 PM',
          name: 'ពិធីពិសារភោជនាហារពេលល្ងាច និងរាំកម្សាន្ត',
          nameEn: 'Grand Wedding Banquet Reception',
          icon: 'wine',
        },
      ],
    };
    const updatedShifts = [...shifts, newShift];
    setFormData(prev => ({
      ...prev,
      schedules: [{ ...prev.schedules[0], shifts: updatedShifts }],
      config: {
        ...prev.config,
        invitation_kh: {
          ...prev.config.invitation_kh,
          date_time: 'ថ្ងៃសៅរ៍ ទី០៦ និង ថ្ងៃអាទិត្យ ទី០៧ ខែមករា ឆ្នាំ២០២៦',
        },
        invitation_en: {
          ...prev.config.invitation_en,
          date_time: 'Saturday 06 & Sunday 07 January 2026',
        },
      },
    }));
    setActiveShiftIndex(updatedShifts.length - 1);
  };

  const handleRemoveDay = (shiftIdx: number) => {
    if (shifts.length <= 1) return;
    const updatedShifts = shifts.filter((_, idx) => idx !== shiftIdx);
    
    // Automatically adjust invitation date text if reduced to 1 day
    let updatedConfig = { ...formData.config };
    if (updatedShifts.length === 1) {
      if (shiftIdx === 0) {
        // Day 1 was deleted, only Day 2 remains
        updatedConfig = {
          ...updatedConfig,
          invitation_kh: {
            ...updatedConfig.invitation_kh,
            date_time: 'ថ្ងៃអាទិត្យ ទី០៧ ខែមករា ឆ្នាំ២០២៦',
          },
          invitation_en: {
            ...updatedConfig.invitation_en,
            date_time: 'Sunday, January 07, 2026',
          },
        };
      } else {
        // Day 2 was deleted, only Day 1 remains
        updatedConfig = {
          ...updatedConfig,
          invitation_kh: {
            ...updatedConfig.invitation_kh,
            date_time: 'ថ្ងៃសៅរ៍ ទី០៦ ខែមករា ឆ្នាំ២០២៦',
          },
          invitation_en: {
            ...updatedConfig.invitation_en,
            date_time: 'Saturday, January 06, 2026',
          },
        };
      }
    }

    setFormData(prev => ({
      ...prev,
      schedules: [{ ...prev.schedules[0], shifts: updatedShifts }],
      config: updatedConfig,
    }));
    setActiveShiftIndex(0);
  };

  const handleAddTimelineItem = () => {
    const newItem: TimelineItem = {
      id: `custom-time-${Date.now()}`,
      time: '06:00 PM',
      name: 'កម្មវិធីថ្មី (New Ceremony)',
      nameEn: 'New Ceremony Event',
      icon: 'sparkles',
    };
    const updatedTimeline = [...timelineItems, newItem];
    const updatedShifts = shifts.map((shift, idx) => 
      idx === activeShiftIndex ? { ...shift, timeLine: updatedTimeline } : shift
    );
    setFormData(prev => ({
      ...prev,
      schedules: [{ ...prev.schedules[0], shifts: updatedShifts }],
    }));
  };

  const handleUpdateTimelineItem = (id: string, updates: Partial<TimelineItem>) => {
    const updatedTimeline = timelineItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    const updatedShifts = shifts.map((shift, idx) => 
      idx === activeShiftIndex ? { ...shift, timeLine: updatedTimeline } : shift
    );
    setFormData(prev => ({
      ...prev,
      schedules: [{ ...prev.schedules[0], shifts: updatedShifts }],
    }));
  };

  const handleDeleteTimelineItem = (id: string) => {
    const updatedTimeline = timelineItems.filter(item => item.id !== id);
    const updatedShifts = shifts.map((shift, idx) => 
      idx === activeShiftIndex ? { ...shift, timeLine: updatedTimeline } : shift
    );
    setFormData(prev => ({
      ...prev,
      schedules: [{ ...prev.schedules[0], shifts: updatedShifts }],
    }));
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      await onSave(formData);
      setShowSavedToast(true);
      setTimeout(() => {
        setShowSavedToast(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Save failed:', err);
      alert('រក្សាទុកមិនបានជោគជ័យ សូមព្យាយាមម្តងទៀត / Failed to save, please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('តើអ្នកពិតជាចង់កំណត់ទិន្នន័យឡើងវិញដើមឬទេ? / Reset all information to default?')) {
      onReset();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            className={`relative w-full max-w-2xl border rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden ${
              theme === 'light'
                ? 'bg-[#fdfbf7] border-amber-300 text-neutral-900 shadow-amber-900/10'
                : theme === 'gray'
                ? 'bg-[#1b1e25] border-slate-700/60 text-slate-100'
                : 'bg-black border-amber-500/40 text-white'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b ${
              theme === 'light'
                ? 'border-amber-200 bg-amber-100/50'
                : theme === 'gray'
                ? 'border-slate-800 bg-[#16181f]'
                : 'border-amber-500/30 bg-black'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-md ${
                  theme === 'light'
                    ? 'bg-amber-200 text-amber-950 border-amber-300'
                    : 'bg-gradient-to-br from-amber-400/30 to-amber-600/30 text-amber-300 border-amber-400/40'
                }`}>
                  <LayoutTemplate className={`w-5 h-5 ${theme === 'light' ? 'text-amber-900' : 'text-amber-300'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm sm:text-base font-moul ${
                      theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                    }`}>
                      គម្រូធៀប
                    </h3>
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold font-mono ${
                      theme === 'light'
                        ? 'bg-amber-200/80 border-amber-300 text-amber-950'
                        : 'bg-amber-400/20 border-amber-400/30 text-amber-300'
                    }`}>
                      #template
                    </span>
                  </div>
                  <p className={`text-[11px] font-khmer flex items-center gap-1.5 mt-0.5 ${
                    theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
                  }`}>
                    <span>Plan Essential Event & Template Editor</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className={`p-2 rounded-lg transition-all text-xs flex items-center gap-1 font-khmer ${
                    theme === 'light'
                      ? 'text-neutral-600 hover:text-amber-950 hover:bg-amber-200/50'
                      : 'text-neutral-400 hover:text-amber-300 hover:bg-white/5'
                  }`}
                  title="កំណត់ឡើងវិញ / Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">ដើម</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'light'
                      ? 'text-neutral-600 hover:text-neutral-900 hover:bg-amber-200/50'
                      : 'text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className={`flex items-center overflow-x-auto no-scrollbar px-3 py-2 border-b gap-1.5 shrink-0 ${
              theme === 'light'
                ? 'border-amber-200 bg-amber-50/70'
                : theme === 'gray'
                ? 'border-slate-800 bg-[#13151a]'
                : 'border-amber-500/20 bg-black/40'
            }`}>
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`px-3 py-1.5 rounded-lg text-xs font-khmer flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'presets'
                    ? 'bg-amber-400 text-amber-950 font-bold shadow'
                    : theme === 'light'
                    ? 'text-neutral-700 hover:text-amber-950 hover:bg-amber-200/40'
                    : 'text-neutral-300 hover:text-amber-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>ប្រភេទធៀប</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('design')}
                className={`px-3 py-1.5 rounded-lg text-xs font-khmer flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'design'
                    ? 'bg-amber-400 text-amber-950 font-bold shadow'
                    : theme === 'light'
                    ? 'text-neutral-700 hover:text-amber-950 hover:bg-amber-200/40'
                    : 'text-neutral-300 hover:text-amber-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>ការរចនា</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('couple')}
                className={`px-3 py-1.5 rounded-lg text-xs font-khmer flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'couple'
                    ? 'bg-amber-400 text-amber-950 font-bold shadow'
                    : theme === 'light'
                    ? 'text-neutral-700 hover:text-amber-950 hover:bg-amber-200/40'
                    : 'text-neutral-300 hover:text-amber-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>គូស្នេហ៍ & ទីតាំង</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('photos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-khmer flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'photos'
                    ? 'bg-amber-400 text-amber-950 font-bold shadow'
                    : theme === 'light'
                    ? 'text-neutral-700 hover:text-amber-950 hover:bg-amber-200/40'
                    : 'text-neutral-300 hover:text-amber-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>រូបភាព & កម្រងរូបថត ({galleryPhotos.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('schedule')}
                className={`px-3 py-1.5 rounded-lg text-xs font-khmer flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'schedule'
                    ? 'bg-amber-400 text-amber-950 font-bold shadow'
                    : theme === 'light'
                    ? 'text-neutral-700 hover:text-amber-950 hover:bg-amber-200/40'
                    : 'text-neutral-300 hover:text-amber-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>របៀបវារៈ ({timelineItems.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('messages')}
                className={`px-3 py-1.5 rounded-lg text-xs font-khmer flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'messages'
                    ? 'bg-amber-400 text-amber-950 font-bold shadow'
                    : theme === 'light'
                    ? 'text-neutral-700 hover:text-amber-950 hover:bg-amber-200/40'
                    : 'text-neutral-300 hover:text-amber-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>សារអញ្ជើញ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('khqr')}
                className={`px-3 py-1.5 rounded-lg text-xs font-khmer flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'khqr'
                    ? 'bg-amber-400 text-amber-950 font-bold shadow'
                    : theme === 'light'
                    ? 'text-neutral-700 hover:text-amber-950 hover:bg-amber-200/40'
                    : 'text-neutral-300 hover:text-amber-200'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>ចងដៃ KHQR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('music')}
                className={`px-3 py-1.5 rounded-lg text-xs font-khmer flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'music'
                    ? 'bg-amber-400 text-amber-950 font-bold shadow'
                    : theme === 'light'
                    ? 'text-neutral-700 hover:text-amber-950 hover:bg-amber-200/40'
                    : 'text-neutral-300 hover:text-amber-200'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>តន្ត្រី</span>
              </button>
            </div>

            {/* Scrollable Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-left text-sm">
              {/* TAB -1: EVENT TYPE PRESETS (WEDDING, ENGAGEMENT, NEW HOUSES, BIRTHDAY) */}
              {activeTab === 'presets' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`text-sm font-bold font-khmer ${
                        theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                      }`}>
                        ជ្រើសរើសប្រភេទធៀបគំរូ (Event Type Presets)
                      </h4>
                      <p className={`text-xs font-khmer mt-0.5 ${
                        theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
                      }`}>
                        ជ្រើសរើសគំរូកម្មវិធីដែលត្រូវនឹងតម្រូវការរបស់អ្នក រួមមានមង្គលការ ភ្ជាប់ពាក្យ ឡើងផ្ទះថ្មី និងខួបកំណើត
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {EVENT_PRESETS.map((preset) => {
                      const isSelected = formData.id === preset.sampleEvent.id || (
                        preset.type === 'wedding' && !formData.id.startsWith('engagement') && !formData.id.startsWith('housewarming') && !formData.id.startsWith('birthday') && !formData.id.startsWith('custom')
                      );

                      return (
                        <div
                          key={preset.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg ' + (theme === 'light' ? 'bg-amber-100/50' : 'bg-black/40')
                              : theme === 'light'
                              ? 'bg-white border-amber-200 hover:border-amber-400 shadow-sm'
                              : 'bg-black/40 border-white/10 hover:border-amber-400/30'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2.5">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-9 h-9 rounded-xl flex items-center justify-center shadow"
                                  style={{
                                    backgroundColor: `${preset.accentColor}25`,
                                    color: preset.accentColor,
                                    border: `1px solid ${preset.accentColor}50`,
                                  }}
                                >
                                  {preset.type === 'wedding' && <Heart className="w-4 h-4" />}
                                  {preset.type === 'engagement' && <Sparkles className="w-4 h-4" />}
                                  {preset.type === 'housewarming' && <Home className="w-4 h-4" />}
                                  {preset.type === 'birthday' && <Cake className="w-4 h-4" />}
                                </div>
                                <div>
                                  <h5 className={`font-bold font-khmer text-xs ${
                                    theme === 'light' ? 'text-neutral-900' : 'text-white'
                                  }`}>
                                    {preset.titleKh}
                                  </h5>
                                  <span className={`text-[10px] font-mono ${
                                    theme === 'light' ? 'text-amber-800' : 'text-amber-300/80'
                                  }`}>
                                    {preset.titleEn}
                                  </span>
                                </div>
                              </div>

                              {isSelected && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-600 dark:text-emerald-300 text-[10px] font-bold font-khmer">
                                  កំពុងប្រើ
                                </span>
                              )}
                            </div>

                            <p className={`text-[11px] font-khmer leading-relaxed mb-3 ${
                              theme === 'light' ? 'text-neutral-600' : 'text-neutral-300'
                            }`}>
                              {preset.descriptionKh}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setFormData(preset.sampleEvent);
                              setSyncFeedback(`បានជ្រើសរើស ${preset.titleKh}`);
                              setTimeout(() => setSyncFeedback(null), 2000);
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 font-bold text-xs font-khmer hover:from-amber-300 hover:to-amber-200 transition-all shadow flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>ទាញយកគំរូនេះមកកែសម្រួល</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 0: DESIGN & THEME SETTINGS */}
              {activeTab === 'design' && (
                <DesignSettingsSection
                  config={formData.config}
                  onUpdateConfig={handleUpdateConfig}
                  eventImage={formData.image}
                  onUpdateEventImage={(url) => handleUpdateField('image', url)}
                  theme={theme}
                />
              )}

              {/* TAB 1: COUPLE & GENERAL INFO */}
              {activeTab === 'couple' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-khmer font-semibold mb-1 ${
                        theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                      }`}>
                        ឈ្មោះកូនប្រុស (Khmer)
                      </label>
                      <input
                        type="text"
                        value={formData.groom}
                        onChange={e => handleUpdateField('groom', e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-khmer focus:outline-none ${
                          theme === 'light'
                            ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                            : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-khmer font-semibold mb-1 ${
                        theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                      }`}>
                        Groom Name (English)
                      </label>
                      <input
                        type="text"
                        value={formData.groomEn || ''}
                        onChange={e => handleUpdateField('groomEn', e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none ${
                          theme === 'light'
                            ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                            : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-khmer font-semibold mb-1 ${
                        theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                      }`}>
                        ឈ្មោះកូនស្រី (Khmer)
                      </label>
                      <input
                        type="text"
                        value={formData.bride}
                        onChange={e => handleUpdateField('bride', e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-khmer focus:outline-none ${
                          theme === 'light'
                            ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                            : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-khmer font-semibold mb-1 ${
                        theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                      }`}>
                        Bride Name (English)
                      </label>
                      <input
                        type="text"
                        value={formData.brideEn || ''}
                        onChange={e => handleUpdateField('brideEn', e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none ${
                          theme === 'light'
                            ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                            : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t ${
                    theme === 'light' ? 'border-amber-200' : 'border-amber-500/20'
                  }`}>
                    <div>
                      <label className={`block text-xs font-khmer font-semibold mb-1 ${
                        theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                      }`}>
                        ចំណងជើងធំ (Main Title)
                      </label>
                      <input
                        type="text"
                        value={formData.config.invitation_kh.main_title}
                        onChange={e => handleUpdateKhContent('main_title', e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-khmer focus:outline-none ${
                          theme === 'light'
                            ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                            : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-khmer font-semibold mb-1 ${
                        theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                      }`}>
                        ពាក្យស្វាគមន៍ (Welcome Subtitle)
                      </label>
                      <input
                        type="text"
                        value={formData.config.invitation_kh.subtitle}
                        onChange={e => handleUpdateKhContent('subtitle', e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-khmer focus:outline-none ${
                          theme === 'light'
                            ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                            : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div className={`space-y-3 pt-2 border-t ${
                    theme === 'light' ? 'border-amber-200' : 'border-amber-500/20'
                  }`}>
                    <div>
                      <label className={`block text-xs font-khmer font-semibold mb-1 ${
                        theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                      }`}>
                        ទីតាំងរៀបចំពិធី (Khmer Venue)
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={e => {
                          handleUpdateField('location', e.target.value);
                          handleUpdateKhContent('location', e.target.value);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-khmer focus:outline-none ${
                          theme === 'light'
                            ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                            : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-khmer font-semibold mb-1 ${
                        theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                      }`}>
                        Venue Location (English)
                      </label>
                      <input
                        type="text"
                        value={formData.locationEn || ''}
                        onChange={e => handleUpdateField('locationEn', e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none ${
                          theme === 'light'
                            ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                            : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-khmer font-semibold mb-1 ${
                        theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                      }`}>
                        តំណភ្ជាប់ Google Maps (Map Link URL)
                      </label>
                      <input
                        type="url"
                        value={formData.config.map_url}
                        onChange={e => handleUpdateConfig('map_url', e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none ${
                          theme === 'light'
                            ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                            : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PHOTOS & GALLERY */}
              {activeTab === 'photos' && (
                <div className="space-y-6">
                  {/* Venue Map Image */}
                  <div className={`p-4 rounded-xl border ${
                    theme === 'light'
                      ? 'bg-amber-50/50 border-amber-200/80 shadow-sm'
                      : 'bg-black/40 border-amber-500/20'
                  }`}>
                    <ImageUploadInput
                      label="រូបភាពផែនទីទីតាំង (Venue Map Photo)"
                      value={formData.config.event_location}
                      onChange={newUrl => handleUpdateConfig('event_location', newUrl)}
                      aspectRatio="aspect-video"
                      helpText="បង្ហាញក្នុងផ្នែកទីតាំងកម្មវិធី (Shown in the location section)"
                      theme={theme}
                    />
                  </div>

                  {/* Photo Gallery (Add Picture & Manage) */}
                  <div className={`p-4 rounded-xl border space-y-4 ${
                    theme === 'light'
                      ? 'bg-amber-50/50 border-amber-200/80 shadow-sm'
                      : 'bg-black/40 border-amber-500/20'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-xs font-bold font-moul ${
                          theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                        }`}>
                          កម្រងរូបភាពអនុស្សាវរីយ៍ (Pre-Wedding Gallery)
                        </h4>
                        <p className={`text-[11px] font-khmer ${
                          theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
                        }`}>
                          អ្នកអាចបន្ថែមរូបភាពថ្មី ឬលុបរូបភាពដែលមានស្រាប់
                        </p>
                      </div>
                    </div>

                    {/* Gallery Items Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {galleryPhotos.map((photoUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative aspect-[3/4] rounded-xl overflow-hidden border group ${
                            theme === 'light'
                              ? 'border-amber-300 bg-amber-100/30'
                              : 'border-amber-500/30 bg-black/50'
                          }`}
                        >
                          <img
                            src={photoUrl}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Overlay buttons */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryPhoto(idx)}
                              className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 shadow"
                              title="Delete Photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-amber-300 font-mono">
                            #{idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add New Picture Section */}
                    <div className={`pt-2 border-t ${
                      theme === 'light' ? 'border-amber-200' : 'border-amber-500/20'
                    }`}>
                      <ImageUploadInput
                        label="➕ បន្ថែមរូបភាពថ្មីចូលក្នុងកម្រងរូបថត (Add New Picture to Gallery)"
                        value=""
                        onChange={handleAddGalleryPhoto}
                        aspectRatio="aspect-video"
                        helpText="ជ្រើសរើសរូប ឬទាញទម្លាក់ដើម្បីបន្ថែមរូបភាពថ្មី / Upload or drop an image to add"
                        theme={theme}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: WEDDING SCHEDULE / TIMELINE */}
              {activeTab === 'schedule' && (
                <div className="space-y-5">
                  {/* 2-Day Management Card Banner */}
                  <div className={`p-4 rounded-2xl border space-y-3 shadow-md ${
                    theme === 'light'
                      ? 'bg-amber-50/70 border-amber-200/90'
                      : 'bg-gradient-to-br from-amber-950/50 via-black/60 to-black/80 border-amber-500/30'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                          theme === 'light'
                            ? 'bg-amber-200 border-amber-300 text-amber-950'
                            : 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                        }`}>
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className={`text-xs sm:text-sm font-bold font-moul ${
                            theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                          }`}>
                            ការបែងចែកកម្មវិធីមង្គលការ (Wedding Days)
                          </h4>
                          <p className={`text-[11px] font-khmer ${
                            theme === 'light' ? 'text-neutral-600' : 'text-amber-300/70'
                          }`}>
                            {shifts.length > 1
                              ? 'កម្មវិធីត្រូវបានបែងចែកជា ២ ថ្ងៃ (Day 1 & Day 2)'
                              : 'កម្មវិធីមានតែ ១ ថ្ងៃ'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={handleSetTwoDaysPreset}
                          className={`px-3 py-1.5 rounded-xl border font-khmer text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                            theme === 'light'
                              ? 'bg-amber-200/80 hover:bg-amber-200 text-amber-950 border-amber-300'
                              : 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border-amber-400/40'
                          }`}
                          title="កំណត់គំរូកម្មវិធីប្រពៃណីខ្មែរ ២ ថ្ងៃដោយស្វ័យប្រវត្តិ"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>កំណត់គំរូ ២ ថ្ងៃប្រពៃណីខ្មែរ</span>
                        </button>

                        {shifts.length < 2 && (
                          <button
                            type="button"
                            onClick={handleAddDay}
                            className="px-3 py-1.5 rounded-xl bg-amber-400 text-amber-950 font-khmer font-bold text-xs hover:bg-amber-300 flex items-center gap-1 transition-all shadow"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>បន្ថែមថ្ងៃទី២</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Day selector tabs */}
                    <div className={`flex items-center gap-2 pt-2 border-t ${
                      theme === 'light' ? 'border-amber-200' : 'border-amber-500/20'
                    }`}>
                      {shifts.map((shift, idx) => {
                        const isSelected = activeShiftIndex === idx;
                        return (
                          <div
                            key={shift.id || idx}
                            className={`flex-1 flex items-center justify-between p-2 sm:px-3 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-400/60 shadow-md shadow-amber-500/10'
                                : theme === 'light'
                                ? 'bg-white border-amber-200 hover:bg-amber-50'
                                : 'bg-black/40 border-amber-500/20 hover:bg-black/60'
                            }`}
                            onClick={() => setActiveShiftIndex(idx)}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`w-5 h-5 rounded-md text-[10px] font-bold font-mono flex items-center justify-center ${
                                  isSelected
                                    ? 'bg-amber-400 text-amber-950'
                                    : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <p
                                  className={`text-xs font-khmer font-semibold truncate ${
                                    isSelected
                                      ? theme === 'light' ? 'text-amber-950 font-bold' : 'text-amber-200'
                                      : theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                                  }`}
                                >
                                  {idx === 0 ? 'ថ្ងៃទី១ (សៅរ៍)' : 'ថ្ងៃទី២ (អាទិត្យ)'}
                                </p>
                                <p className={`text-[10px] font-mono truncate ${
                                  theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'
                                }`}>
                                  {shift.timeLine?.length || 0} ពិធី
                                </p>
                              </div>
                            </div>

                            {shifts.length > 1 && (
                              <button
                                type="button"
                                onClick={e => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemoveDay(idx);
                                }}
                                className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 hover:text-rose-200 border border-rose-500/30 hover:border-rose-500/50 shadow-sm ml-1.5 transition-all active:scale-90 shrink-0 group/del cursor-pointer"
                                title="ចុចដើម្បីលុបថ្ងៃនេះ (Click to delete this day)"
                                aria-label="Delete this day"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-400 group-hover/del:text-rose-200 group-hover/del:scale-110 transition-transform duration-150" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Day Information Edit Card */}
                  {activeShift && (
                    <div className={`p-4 rounded-2xl border space-y-3 ${
                      theme === 'light'
                        ? 'bg-amber-50/50 border-amber-200/80 shadow-sm'
                        : 'bg-black/40 border-amber-500/20'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold font-moul flex items-center gap-1.5 ${
                          theme === 'light' ? 'text-amber-950' : 'text-amber-300'
                        }`}>
                          <span>កែសម្រួលព័ត៌មានថ្ងៃទី {activeShiftIndex + 1}</span>
                        </span>
                        <span className={`text-[11px] font-mono ${
                          theme === 'light' ? 'text-amber-800 font-bold' : 'text-amber-400/80'
                        }`}>
                          {activeShift.timeLine?.length || 0} កម្មវិធី
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className={`text-[11px] font-khmer font-semibold flex items-center gap-1.5 ${
                              theme === 'light' ? 'text-neutral-800' : 'text-neutral-300'
                            }`}>
                              <Calendar className="w-3.5 h-3.5 text-amber-600" />
                              <span>ចំណងជើងថ្ងៃ (Day Title - Khmer)</span>
                            </label>
                            {activeShift.date && (
                              <button
                                type="button"
                                onClick={() => handleApplyCalendarTitles(activeShiftIndex)}
                                className={`text-[10px] font-khmer flex items-center gap-1 transition-colors cursor-pointer ${
                                  theme === 'light' ? 'text-amber-800 hover:text-amber-950 font-bold' : 'text-amber-400 hover:text-amber-200'
                                }`}
                                title="បង្កើតចំណងជើងស្វ័យប្រវត្តិតាមប្រតិទិន"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>យកតាមប្រតិទិន</span>
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={activeShift.name}
                            onChange={e =>
                              handleUpdateShiftInfo(activeShiftIndex, { name: e.target.value })
                            }
                            placeholder="ឧ. ថ្ងៃទី១ ៖ ថ្ងៃសៅរ៍ ទី០៦ ខែមករា..."
                            className={`w-full px-3 py-2 rounded-xl text-xs font-khmer focus:outline-none transition-all ${
                              theme === 'light'
                                ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                                : 'bg-black/60 border border-amber-500/40 text-amber-100 focus:border-amber-400 shadow-inner'
                            }`}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className={`text-[11px] font-khmer font-semibold flex items-center gap-1.5 ${
                              theme === 'light' ? 'text-neutral-800' : 'text-neutral-300'
                            }`}>
                              <Calendar className="w-3.5 h-3.5 text-amber-600" />
                              <span>Day Title (English)</span>
                            </label>
                            {activeShift.date && (
                              <button
                                type="button"
                                onClick={() => handleApplyCalendarTitles(activeShiftIndex)}
                                className={`text-[10px] font-sans flex items-center gap-1 transition-colors cursor-pointer ${
                                  theme === 'light' ? 'text-amber-800 hover:text-amber-950 font-bold' : 'text-amber-400 hover:text-amber-200'
                                }`}
                                title="Auto-fill English Day Title from Calendar"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>From Calendar</span>
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={activeShift.nameEn || ''}
                            onChange={e =>
                              handleUpdateShiftInfo(activeShiftIndex, { nameEn: e.target.value })
                            }
                            placeholder="e.g. Day 1: Saturday, January 06..."
                            className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none transition-all ${
                              theme === 'light'
                                ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                                : 'bg-black/60 border border-amber-500/40 text-neutral-200 focus:border-amber-400 shadow-inner'
                            }`}
                          />
                        </div>
                      </div>

                      <div className={`w-full p-3 rounded-xl border space-y-2 ${
                        theme === 'light'
                          ? 'bg-amber-100/60 border-amber-300 text-neutral-900'
                          : 'bg-amber-500/10 border border-amber-500/30'
                      }`}>
                        <div className="flex items-center justify-between">
                          <label className={`text-[11px] font-khmer font-semibold flex items-center gap-1.5 ${
                            theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                          }`}>
                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            <span>កាលបរិច្ឆេទថ្ងៃទី {activeShiftIndex + 1} (Calendar Date)</span>
                          </label>
                          {activeShift.date && (
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold ${
                              theme === 'light'
                                ? 'bg-amber-200 border-amber-300 text-amber-950'
                                : 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                            }`}>
                              {generateDayTitlesFromDate(activeShift.date, activeShiftIndex)?.khmerDay || 'ប្រតិទិន'}
                            </span>
                          )}
                        </div>
                        <input
                          type="date"
                          value={activeShift.date || ''}
                          onChange={e =>
                            handleUpdateShiftDate(activeShiftIndex, e.target.value, true)
                          }
                          className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono cursor-pointer transition-all ${
                            theme === 'light'
                              ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                              : 'bg-black/70 border border-amber-500/50 text-amber-100 focus:border-amber-400 shadow-md'
                          }`}
                        />
                        {activeShift.date && (() => {
                          const calInfo = generateDayTitlesFromDate(activeShift.date, activeShiftIndex);
                          if (!calInfo) return null;
                          return (
                            <div className={`flex flex-wrap items-center justify-between gap-2 pt-1 border-t text-[11px] ${
                              theme === 'light' ? 'border-amber-200' : 'border-amber-500/20'
                            }`}>
                              <div className={`font-khmer flex items-center gap-1.5 ${
                                theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                              }`}>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className={`font-medium ${theme === 'light' ? 'text-amber-950 font-bold' : 'text-amber-200'}`}>{calInfo.summaryKh}</span>
                                <span className={`font-mono text-[10px] ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>({calInfo.summaryEn})</span>
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => handleApplyCalendarTitles(activeShiftIndex)}
                                  className={`px-2.5 py-1 rounded-lg border text-[10px] font-khmer font-semibold flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer ${
                                    theme === 'light'
                                      ? 'bg-white hover:bg-amber-100 text-amber-950 border-amber-300'
                                      : 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 hover:text-amber-100 border-amber-400/40'
                                  }`}
                                  title="ធ្វើបច្ចុប្បន្នភាពចំណងជើងថ្ងៃ"
                                >
                                  <Sparkles className="w-3 h-3 text-amber-600" />
                                  <span>Sync Titles</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSyncDateFromShift(activeShiftIndex)}
                                  className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 border border-amber-400/50 text-[10px] font-khmer font-bold flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
                                  title="កំណត់កាលបរិច្ឆេទថ្ងៃនេះក្នុងលិខិតអញ្ជើញ"
                                >
                                  <Calendar className="w-3 h-3 text-amber-900" />
                                  <span>ដាក់ជាថ្ងៃក្នុងលិខិតអញ្ជើញ (Set as Invite Date)</span>
                                </button>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Ceremonies / Timeline Items for Active Day */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <h4 className={`text-xs font-bold font-moul ${
                        theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                      }`}>
                        តារាងកម្មវិធីសម្រាប់ថ្ងៃទី {activeShiftIndex + 1}
                      </h4>
                      <p className={`text-[11px] font-khmer ${
                        theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
                      }`}>
                        កែសម្រួលម៉ោង និងឈ្មោះពិធីនីមួយៗ
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddTimelineItem}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 text-amber-950 font-khmer font-bold text-xs hover:bg-amber-300 flex items-center gap-1 shadow transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>បន្ថែមកម្មវិធី</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {timelineItems.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className={`p-3.5 rounded-xl border space-y-2.5 transition-all ${
                          theme === 'light'
                            ? 'bg-white border-amber-200 shadow-sm hover:border-amber-400'
                            : 'bg-black/50 border-amber-500/20 hover:border-amber-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <input
                              type="text"
                              value={item.time}
                              onChange={e => handleUpdateTimelineItem(item.id, { time: e.target.value })}
                              placeholder="07:00 AM"
                              className={`w-24 px-2 py-1 rounded-lg font-mono text-xs focus:outline-none ${
                                theme === 'light'
                                  ? 'bg-amber-50 border border-amber-300 text-amber-950 font-bold focus:border-amber-500'
                                  : 'bg-black/60 border border-amber-500/30 text-amber-300 focus:border-amber-400'
                              }`}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteTimelineItem(item.id)}
                            className="p-1 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Delete step"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={item.name}
                            onChange={e => handleUpdateTimelineItem(item.id, { name: e.target.value })}
                            placeholder="ឈ្មោះពិធី (Khmer)"
                            className={`w-full px-2.5 py-1.5 rounded-lg font-khmer text-xs focus:outline-none ${
                              theme === 'light'
                                ? 'bg-amber-50/50 border border-amber-200 text-neutral-900 focus:border-amber-500'
                                : 'bg-black/60 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                            }`}
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            value={item.nameEn || ''}
                            onChange={e => handleUpdateTimelineItem(item.id, { nameEn: e.target.value })}
                            placeholder="Ceremony Name (English)"
                            className={`w-full px-2.5 py-1.5 rounded-lg text-xs focus:outline-none ${
                              theme === 'light'
                                ? 'bg-amber-50/50 border border-amber-200 text-neutral-700 focus:border-amber-500'
                                : 'bg-black/60 border border-amber-500/30 text-neutral-300 focus:border-amber-400'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: MESSAGES & CONTENT */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-xs font-khmer font-semibold mb-1 ${
                      theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                    }`}>
                      ចំណងជើងសេចក្តីអញ្ជើញ (Invitation Title)
                    </label>
                    <input
                      type="text"
                      value={formData.config.invitation_kh.invitation_title}
                      onChange={e => handleUpdateKhContent('invitation_title', e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-khmer focus:outline-none ${
                        theme === 'light'
                          ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                          : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-khmer font-semibold mb-1 ${
                      theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                    }`}>
                      ខ្លឹមសារអញ្ជើញ (Invitation Message - Khmer)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.config.invitation_kh.invitation_message}
                      onChange={e => handleUpdateKhContent('invitation_message', e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-khmer focus:outline-none ${
                        theme === 'light'
                          ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                          : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                      }`}
                    />
                  </div>

                  <div className={`pt-2 border-t ${
                    theme === 'light' ? 'border-amber-200' : 'border-amber-500/20'
                  }`}>
                    <label className={`block text-xs font-khmer font-semibold mb-1 ${
                      theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                    }`}>
                      ចំណងជើងអរគុណ (Gratitude Title)
                    </label>
                    <input
                      type="text"
                      value={formData.config.invitation_kh.gratitude_title || ''}
                      onChange={e => handleUpdateKhContent('gratitude_title', e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-khmer focus:outline-none ${
                        theme === 'light'
                          ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                          : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-khmer font-semibold mb-1 ${
                      theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                    }`}>
                      សារអរគុណ និងសូមអភ័យទោស (Gratitude Message - Khmer)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.config.invitation_kh.gratitude_message || ''}
                      onChange={e => handleUpdateKhContent('gratitude_message', e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-khmer focus:outline-none ${
                        theme === 'light'
                          ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                          : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: KHQR & GIFTS */}
              {activeTab === 'khqr' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-khmer font-semibold mb-1 ${
                        theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                      }`}>
                        ឈ្មោះគណនី (Account Name)
                      </label>
                      <input
                        type="text"
                        value={formData.config.bankInfo?.accountName || 'RO MALAY & UOM VOLAK'}
                        onChange={e => {
                          const currentBank = formData.config.bankInfo || {
                            accountName: '',
                            accountNumber: '',
                            bankName: 'ABA Bank',
                          };
                          handleUpdateConfig('bankInfo', {
                            ...currentBank,
                            accountName: e.target.value,
                          });
                        }}
                        className={`w-full px-3 py-2 rounded-xl font-mono text-xs focus:outline-none ${
                          theme === 'light'
                            ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                            : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-khmer font-semibold mb-1 ${
                        theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                      }`}>
                        លេខគណនី / ធនាគារ (Account Number / Bank)
                      </label>
                      <input
                        type="text"
                        value={formData.config.bankInfo?.accountNumber || '002 458 912 (ABA Bank)'}
                        onChange={e => {
                          const currentBank = formData.config.bankInfo || {
                            accountName: 'RO MALAY & UOM VOLAK',
                            accountNumber: '',
                            bankName: 'ABA Bank',
                          };
                          handleUpdateConfig('bankInfo', {
                            ...currentBank,
                            accountNumber: e.target.value,
                          });
                        }}
                        className={`w-full px-3 py-2 rounded-xl font-mono text-xs focus:outline-none ${
                          theme === 'light'
                            ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                            : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t ${
                    theme === 'light' ? 'border-amber-200' : 'border-amber-500/20'
                  }`}>
                    <div className={`p-3 rounded-xl border ${
                      theme === 'light' ? 'bg-amber-50/50 border-amber-200/80 shadow-sm' : 'bg-black/40 border-amber-500/20'
                    }`}>
                      <ImageUploadInput
                        label="រូបភាព KHQR ប្រាក់ដុល្លារ (USD QR Code)"
                        value={formData.config.qr_code || ''}
                        onChange={newUrl => handleUpdateConfig('qr_code', newUrl)}
                        aspectRatio="aspect-square"
                        theme={theme}
                      />
                    </div>

                    <div className={`p-3 rounded-xl border ${
                      theme === 'light' ? 'bg-amber-50/50 border-amber-200/80 shadow-sm' : 'bg-black/40 border-amber-500/20'
                    }`}>
                      <ImageUploadInput
                        label="រូបភាព KHQR ប្រាក់រៀល (KHR QR Code)"
                        value={formData.config.qr_code_riel || ''}
                        onChange={newUrl => handleUpdateConfig('qr_code_riel', newUrl)}
                        aspectRatio="aspect-square"
                        theme={theme}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: BACKGROUND MUSIC */}
              {activeTab === 'music' && (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-xs font-khmer font-semibold mb-1 ${
                      theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                    }`}>
                      តំណភ្ជាប់តន្ត្រី (Audio URL)
                    </label>
                    <input
                      type="url"
                      value={formData.config.background_music}
                      onChange={e => handleUpdateConfig('background_music', e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none ${
                        theme === 'light'
                          ? 'bg-white border border-amber-300 text-neutral-900 focus:border-amber-500 shadow-sm'
                          : 'bg-black/50 border border-amber-500/30 text-amber-100 focus:border-amber-400'
                      }`}
                    />
                  </div>

                  <div className={`pt-2 border-t ${
                    theme === 'light' ? 'border-amber-200' : 'border-amber-500/20'
                  }`}>
                    <label className={`block text-xs font-khmer font-semibold mb-2 ${
                      theme === 'light' ? 'text-amber-950' : 'text-amber-200'
                    }`}>
                      ជ្រើសរើសបទចម្រៀងគំរូ (Select Preset Melodies)
                    </label>
                    <div className="space-y-2">
                      {MUSIC_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleUpdateConfig('background_music', preset.url)}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                            formData.config.background_music === preset.url
                              ? 'bg-amber-400/20 border-amber-400 text-amber-900 dark:text-amber-200 font-bold'
                              : theme === 'light'
                              ? 'bg-white border-amber-200 text-neutral-800 hover:border-amber-400 shadow-sm'
                              : 'bg-black/40 border-white/10 text-neutral-300 hover:border-amber-500/30'
                          }`}
                        >
                          <span className="font-khmer">{preset.name}</span>
                          {formData.config.background_music === preset.url && (
                            <Check className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Action Buttons */}
            <div className={`flex items-center justify-between px-5 py-3.5 border-t ${
              theme === 'light'
                ? 'border-amber-200 bg-amber-100/50'
                : theme === 'gray'
                ? 'border-slate-800 bg-[#16181f]'
                : 'border-amber-500/30 bg-black'
            }`}>
              <span className={`text-[11px] font-khmer ${
                theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
              }`}>
                {isSaving ? (
                  <span className="text-amber-600 dark:text-amber-300 flex items-center gap-1.5 animate-pulse">
                    <div className="w-3.5 h-3.5 border-2 border-amber-600 dark:border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>កំពុងរក្សាទុក និងធ្វើសមកាលកម្មលើ Server...</span>
                  </span>
                ) : showSavedToast ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>បានរក្សាទុកលើ Server រួចរាល់! (Cloud Synced)</span>
                  </span>
                ) : (
                  <span>ព័ត៌មានដែលកែប្រែនឹងបង្ហាញដល់ភ្ញៀវទាំងអស់ដែលបើកតំណភ្ជាប់</span>
                )}
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={onClose}
                  className={`px-4 py-2 rounded-xl text-xs font-khmer transition-colors disabled:opacity-50 ${
                    theme === 'light'
                      ? 'text-neutral-700 hover:text-neutral-900 bg-amber-200/60 hover:bg-amber-200'
                      : 'text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10'
                  }`}
                >
                  បិទ
                </button>

                <button
                  id="save-event-changes-btn"
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveAll}
                  className="px-5 py-2 rounded-xl font-moul text-xs text-amber-950 font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 hover:from-amber-200 hover:to-amber-400 shadow-lg shadow-amber-900/40 flex items-center gap-1.5 transition-all disabled:opacity-50 active:scale-95"
                >
                  {isSaving ? (
                    <div className="w-3.5 h-3.5 border-2 border-amber-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{isSaving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក (Save)'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
