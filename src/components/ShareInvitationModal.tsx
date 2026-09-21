import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  Globe,
  Sparkles,
  Link2,
  ExternalLink,
  MessageCircle,
  QrCode,
  Users,
  Plus,
  Trash2,
  Download,
  MailOpen,
  Loader2,
  Smartphone,
  CheckCircle2,
  Table,
  Search,
  Heart,
  Home,
  Cake,
} from 'lucide-react';
import { Language } from '../types';
import { ThemeMode } from './ThemeToggle';
import { getPublicShareUrl, shortenUrl, PUBLIC_APP_URL } from '../lib/shareUrl';
import { fetchGuestsFromFirebase, deleteGuestFromFirebase } from '../lib/firebaseGuests';
import { GuestPreset } from '../data/guests';
import { EVENT_PRESETS, EventTypePreset, getCategoryCoverImage } from '../data/eventTemplates';

interface ShareInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestName: string;
  onUpdateGuestName?: (newName: string) => void;
  onSelectCategory?: (category: 'wedding' | 'engagement' | 'housewarming' | 'birthday') => void;
  language: Language;
  eventId?: string;
  eventType?: string;
  eventName?: string;
  singlePerson?: boolean;
  groom?: string;
  bride?: string;
  weddingDate?: string;
  locationName?: string;
  coverImage?: string;
  theme?: ThemeMode;
}

export default function ShareInvitationModal({
  isOpen,
  onClose,
  guestName,
  onUpdateGuestName,
  onSelectCategory,
  language,
  eventId = 'cmgrawhnk0003le0434762j7n',
  eventType,
  eventName,
  singlePerson = false,
  groom = 'រ៉ូ ម៉ាឡេ',
  bride = 'អួម វល្ខ័ក',
  weddingDate = 'ថ្ងៃអាទិត្យ ទី១៨ ខែឧសភា ឆ្នាំ២០២៥',
  locationName = 'សាលមហោស្រពកោះពេជ្រ (Koh Pich) អគារ G',
  coverImage,
  theme = 'dark',
}: ShareInvitationModalProps) {
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'qrcode'>('single');
  const [targetGuest, setTargetGuest] = useState(guestName || '');
  const [copiedShort, setCopiedShort] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [shortUrl, setShortUrl] = useState<string>('');
  const [loadingShort, setLoadingShort] = useState<boolean>(false);
  const [qrMode, setQrMode] = useState<'short' | 'direct'>('short');
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // Determine initial category from eventType, eventId, or eventName
  const initialCategory = (() => {
    const t = (eventType || '').toLowerCase();
    const id = (eventId || '').toLowerCase();
    const n = (eventName || '').toLowerCase();
    if (t === 'birthday' || id.includes('birthday') || n.includes('ខួប') || n.includes('birthday')) return 'birthday';
    if (t === 'housewarming' || id.includes('housewarming') || n.includes('ឡើងផ្ទះ') || n.includes('house')) return 'housewarming';
    if (t === 'engagement' || id.includes('engagement') || n.includes('ភ្ជាប់ពាក្យ') || n.includes('engage')) return 'engagement';
    return 'wedding';
  })();

  const [selectedCategory, setSelectedCategory] = useState<'wedding' | 'engagement' | 'housewarming' | 'birthday'>(initialCategory);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const activePreset: EventTypePreset = EVENT_PRESETS.find((p) => p.type === selectedCategory) || EVENT_PRESETS[0];

  const handleCategoryChange = (newCat: 'wedding' | 'engagement' | 'housewarming' | 'birthday') => {
    setSelectedCategory(newCat);
    if (onSelectCategory) {
      onSelectCategory(newCat);
    }
  };

  const [batchGuests, setBatchGuests] = useState<string[]>([
    'លោក សុខ រតនៈវិសាល និងភរិយា',
    'ឯកឧត្តម និងលោកជំទាវ',
    'លោក ចាន់ វិសាល និងក្រុមគ្រួសារ',
  ]);
  const [newBatchName, setNewBatchName] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allDbGuests, setAllDbGuests] = useState<GuestPreset[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchGuestsFromFirebase().then((list) => {
        if (list && list.length > 0) {
          setAllDbGuests(list);
        }
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (guestName && guestName !== 'Your Name') {
      setTargetGuest(guestName);
    }
  }, [guestName]);

  const currentShareGuest = targetGuest.trim() || guestName || 'Your Name';

  // Information retrieval from the selected category template
  const isSameCategoryAsCurrent = selectedCategory === initialCategory;
  const activeEventId = isSameCategoryAsCurrent ? (eventId || activePreset.sampleEvent.id) : activePreset.sampleEvent.id;

  const fullUrl = getPublicShareUrl(currentShareGuest, activeEventId);

  // Automatically fetch short URL whenever fullUrl changes
  useEffect(() => {
    let isMounted = true;
    setLoadingShort(true);
    shortenUrl(fullUrl)
      .then((res) => {
        if (isMounted) {
          setShortUrl(res);
          setLoadingShort(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingShort(false);
      });
    return () => {
      isMounted = false;
    };
  }, [fullUrl]);

  const activeShareLink = shortUrl || fullUrl;

  // Unified Copy Link feature with guest name and toast confirmation
  const handleCopyLink = (customUrl?: string) => {
    const linkToCopy = customUrl || activeShareLink || fullUrl;
    if (!linkToCopy) return;

    const copySuccess = () => {
      setCopiedFull(true);
      setCopiedShort(true);
      setCopyToast(
        language === 'kh'
          ? `បានចម្លងតំណភ្ជាប់សំបុត្រសម្រាប់ ${currentShareGuest}!`
          : `Copied invitation link for ${currentShareGuest}!`
      );
      setTimeout(() => {
        setCopiedFull(false);
        setCopiedShort(false);
        setCopyToast(null);
      }, 2500);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(linkToCopy).then(copySuccess).catch(() => {
        fallbackCopyText(linkToCopy, copySuccess);
      });
    } else {
      fallbackCopyText(linkToCopy, copySuccess);
    }
  };

  const fallbackCopyText = (text: string, cb?: () => void) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      if (cb) cb();
    } catch (e) {
      console.error('Fallback copy failed', e);
    }
  };

  const handleCopyShortLink = () => {
    handleCopyLink(activeShareLink);
  };

  const handleCopyFullLink = () => {
    handleCopyLink(fullUrl);
  };

  // Retrieve event information from selected category template
  const effectiveCoverImage = isSameCategoryAsCurrent && coverImage && !coverImage.includes('491657278')
    ? coverImage
    : activePreset.coverImage || getCategoryCoverImage(selectedCategory);

  const displayHeaderKh = isSameCategoryAsCurrent && eventName
    ? eventName
    : activePreset.sampleEvent.name || (
        selectedCategory === 'birthday'
          ? `ខួបកំណើតគម្រប់ ២៥ឆ្នាំ លីណា`
          : selectedCategory === 'housewarming'
          ? `ពិធីឡើងគេហដ្ឋានថ្មី ម៉ៅ វិបុល`
          : selectedCategory === 'engagement'
          ? `ពិធីភ្ជាប់ពាក្យ គង់ វិសាល & ជា ស្រីពៅ`
          : `អាពាហ៍ពិពាហ៍ ${groom} & ${bride}`
      );

  const displayHeaderEn = isSameCategoryAsCurrent && eventName
    ? eventName
    : activePreset.titleEn || (
        selectedCategory === 'birthday'
          ? `Happy Birthday Celebration`
          : selectedCategory === 'housewarming'
          ? `Housewarming Celebration`
          : selectedCategory === 'engagement'
          ? `Engagement Ceremony`
          : `Wedding Celebration`
      );

  const celebrationCelebrants = isSameCategoryAsCurrent && (groom || bride)
    ? (selectedCategory === 'birthday'
        ? `🎂 *${groom || eventName}*`
        : selectedCategory === 'housewarming'
        ? `🏡 *${groom || eventName}*`
        : selectedCategory === 'engagement'
        ? `💍 *${groom}* & 👰 *${bride}*`
        : singlePerson
        ? `🎉 *${groom}*`
        : `🤵 *${groom}* & 👰 *${bride}*`)
    : (selectedCategory === 'birthday'
        ? `🎂 *${activePreset.sampleEvent.groom}*`
        : selectedCategory === 'housewarming'
        ? `🏡 *${activePreset.sampleEvent.groom}*`
        : selectedCategory === 'engagement'
        ? `💍 *${activePreset.sampleEvent.groom}* & 👰 *${activePreset.sampleEvent.bride}*`
        : `🤵 *${activePreset.sampleEvent.groom}* & 👰 *${activePreset.sampleEvent.bride}*`);

  const effectiveDate = isSameCategoryAsCurrent && weddingDate
    ? weddingDate
    : ((activePreset.sampleEvent as any).date || activePreset.sampleEvent.schedules?.[0]?.shifts?.[0]?.date || activePreset.sampleEvent.schedules?.[0]?.shifts?.[0]?.name || 'ថ្ងៃសៅរ៍ ទី១២ ខែធ្នូ ឆ្នាំ២០២៦');

  const effectiveLocation = isSameCategoryAsCurrent && locationName
    ? locationName
    : (typeof activePreset.sampleEvent.location === 'string'
        ? activePreset.sampleEvent.location
        : (activePreset.sampleEvent.location as any)?.name || 'ភោជនីយដ្ឋាន សួនមនោរម្យ (កោះពេជ្រ)');

  const weddingMessageKh = `💌 *${displayHeaderKh}*

សូមគោរពអញ្ជើញ៖ *${currentShareGuest}*
ចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយសក្នុងកម្មវិធីរបស់យើងខ្ញុំ៖
${celebrationCelebrants}

📅 *កាលបរិច្ឆេទ*៖ ${effectiveDate}
📍 *ទីតាំង*៖ ${effectiveLocation}

👉 *សូមចុចតំណភ្ជាប់ខាងក្រោមដើម្បីបើកសំបុត្រអញ្ជើញ*៖
${activeShareLink}

វត្តមានដ៏ឧត្តុង្គឧត្តមរបស់លោកអ្នក ជាកិត្តិយសដ៏ធំធេងសម្រាប់ក្រុមគ្រួសារយើងខ្ញុំ! 🙏✨`;

  const weddingMessageEn = `💌 *${displayHeaderEn}*

Cordially Invited: *${currentShareGuest}*
To celebrate with us:
${celebrationCelebrants}

📅 *Date*: ${effectiveDate}
📍 *Venue*: ${effectiveLocation}

👉 *Click the link below to open your personalized invitation*:
${activeShareLink}

Your presence will make our day truly special! 🙏✨`;

  const activeMessage = language === 'kh' ? weddingMessageKh : weddingMessageEn;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(activeMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const shareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(activeShareLink)}&text=${encodeURIComponent(
        activeMessage
      )}`,
      '_blank'
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(activeShareLink)}`,
      '_blank'
    );
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(activeMessage)}`, '_blank');
  };

  const handleAddBatchGuest = (e: FormEvent) => {
    e.preventDefault();
    if (newBatchName.trim()) {
      setBatchGuests([...batchGuests, newBatchName.trim()]);
      setNewBatchName('');
    }
  };

  const handleRemoveBatchGuest = (index: number) => {
    setBatchGuests(batchGuests.filter((_, i) => i !== index));
  };

  const handleCopyBatchGuestLink = (name: string, index: number) => {
    const url = getPublicShareUrl(name, activeEventId);
    handleCopyLink(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // QR code encoding data: uses standard high-contrast black on white
  const activeQrData = qrMode === 'short' && shortUrl ? shortUrl : fullUrl;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    activeQrData
  )}&margin=12&bgcolor=ffffff&color=000000`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={onClose}
        >
          {/* Target Modal Box with Refined High-Contrast Luxury Theme */}
          <motion.div
            initial={{ scale: 0.94, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-lg ${
              isLight
                ? 'bg-white border-amber-500/40 text-neutral-900 shadow-[0_10px_40px_rgba(245,158,11,0.15)]'
                : 'bg-black border-amber-500/50 text-white shadow-[0_0_50px_rgba(245,158,11,0.18)]'
            } border rounded-3xl p-5 sm:p-6 text-left max-h-[90vh] flex flex-col`}
          >
            {/* Copy Toast Alert */}
            {copyToast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-khmer text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-emerald-400 pointer-events-none"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>{copyToast}</span>
              </motion.div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-full ${
                isLight
                  ? 'text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200'
                  : 'text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10'
              } transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className={`text-center pb-3 border-b ${isLight ? 'border-amber-500/30' : 'border-amber-500/20'} shrink-0`}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-400/50 text-amber-500 flex items-center justify-center mx-auto mb-2 shadow-inner">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className={`text-base sm:text-lg font-moul ${isLight ? 'text-amber-900' : 'text-amber-200'}`}>
                {language === 'kh' ? 'ចែករំលែកសំបុត្រអញ្ជើញ (Send Invitation)' : 'Share Invitation'}
              </h3>
              <p className={`text-xs ${isLight ? 'text-amber-800/80' : 'text-amber-300/80'} font-khmer mt-0.5`}>
                {language === 'kh'
                  ? 'បង្កើតលីងដាក់ឈ្មោះភ្ញៀវផ្ទាល់ខ្លួន និង QR Code ដំណើរការជាសាធារណៈ ១០០%'
                  : 'Generate personalized 100% public guest links & scannable QR Code'}
              </p>
            </div>

            {/* Event Category Selector Pill Bar */}
            <div className="pt-2.5 pb-1 shrink-0">
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span className={`text-[11px] font-khmer font-medium ${isLight ? 'text-amber-900/80' : 'text-amber-300/80'}`}>
                  {language === 'kh' ? 'ប្រភេទកម្មវិធី (Event Category):' : 'Event Category:'}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isLight ? 'bg-amber-100/90 border-amber-300 text-amber-950 font-bold' : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                }`}>
                  {selectedCategory === 'wedding' ? (language === 'kh' ? 'អាពាហ៍ពិពាហ៍' : 'Wedding') :
                   selectedCategory === 'engagement' ? (language === 'kh' ? 'ភ្ជាប់ពាក្យ' : 'Engagement') :
                   selectedCategory === 'housewarming' ? (language === 'kh' ? 'ឡើងផ្ទះ' : 'Housewarming') :
                   (language === 'kh' ? 'ខួបកំណើត' : 'Birthday')}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'wedding', labelKh: 'មង្គលការ', labelEn: 'Wedding', icon: Heart },
                  { id: 'engagement', labelKh: 'ភ្ជាប់ពាក្យ', labelEn: 'Engage', icon: Sparkles },
                  { id: 'housewarming', labelKh: 'ឡើងផ្ទះ', labelEn: 'House', icon: Home },
                  { id: 'birthday', labelKh: 'ខួបកំណើត', labelEn: 'Birthday', icon: Cake },
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(cat.id as any)}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-1 sm:px-2 rounded-xl text-xs font-khmer font-semibold transition-all border ${
                        isSelected
                          ? isLight
                            ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow font-bold'
                            : 'bg-amber-500/30 text-amber-200 border-amber-400/90 shadow-sm'
                          : isLight
                          ? 'bg-amber-50/50 hover:bg-amber-100/70 border-amber-200 text-neutral-600'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-400'
                      }`}
                    >
                      <Icon className="w-3 h-3 shrink-0" />
                      <span className="truncate">{language === 'kh' ? cat.labelKh : cat.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className={`flex items-center gap-1.5 p-1 ${isLight ? 'bg-amber-50/70 border-amber-300' : 'bg-black/50 border-amber-500/25'} rounded-xl border my-2.5 shrink-0`}>
              <button
                type="button"
                onClick={() => setActiveTab('single')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-khmer font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'single'
                    ? isLight
                      ? 'bg-amber-500 text-neutral-950 shadow font-bold'
                      : 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-sm'
                    : isLight
                    ? 'text-neutral-600 hover:text-neutral-900'
                    : 'text-neutral-400 hover:text-amber-200'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>{language === 'kh' ? 'លីងផ្ទាល់ខ្លួន' : 'Personal Link'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('qrcode')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-khmer font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'qrcode'
                    ? isLight
                      ? 'bg-amber-500 text-neutral-950 shadow font-bold'
                      : 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-sm'
                    : isLight
                    ? 'text-neutral-600 hover:text-neutral-900'
                    : 'text-neutral-400 hover:text-amber-200'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{language === 'kh' ? 'កូដ QR Code' : 'QR Code'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('batch')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-khmer font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'batch'
                    ? isLight
                      ? 'bg-amber-500 text-neutral-950 shadow font-bold'
                      : 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-sm'
                    : isLight
                    ? 'text-neutral-600 hover:text-neutral-900'
                    : 'text-neutral-400 hover:text-amber-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{language === 'kh' ? 'តារាងភ្ញៀវ' : 'Guest List'}</span>
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto pr-1 space-y-4 flex-1">
              {/* TAB 1: Single Personalized Guest Link */}
              {activeTab === 'single' && (
                <div className="space-y-4">
                  {/* Guest Name Input Field & Quick Selector from Guest List */}
                  <div className={`p-3.5 rounded-2xl ${isLight ? 'bg-amber-50/50 border-amber-300/80' : 'bg-black/40 border-amber-500/30'} border space-y-2.5`}>
                    <div className="flex items-center justify-between">
                      <label className={`block text-xs font-semibold ${isLight ? 'text-amber-900' : 'text-amber-300'} font-khmer`}>
                        {language === 'kh' ? 'ឈ្មោះភ្ញៀវកិត្តិយស (Guest Name):' : 'Guest Name:'}
                      </label>
                      <span className={`text-[11px] ${isLight ? 'text-amber-700' : 'text-amber-400/80'} font-normal flex items-center gap-1`}>
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{language === 'kh' ? 'នឹងបង្ហាញលើបន្ទះមាស' : 'Appears on Gold Plaque'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={targetGuest}
                        onChange={(e) => {
                          setTargetGuest(e.target.value);
                          if (onUpdateGuestName) onUpdateGuestName(e.target.value);
                        }}
                        placeholder="ឧ. លោក សុខ រតនៈវិសាល និងភរិយា"
                        className={`flex-1 px-3.5 py-2.5 rounded-xl border font-khmer text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 ${
                          isLight
                            ? 'bg-white border-amber-300 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500'
                            : 'bg-black/60 border-amber-500/40 text-amber-100 placeholder:text-neutral-600 focus:border-amber-400'
                        }`}
                      />
                    </div>

                    {/* Quick Select from Saved Guests */}
                    {allDbGuests.length > 0 && (
                      <div className={`space-y-1.5 pt-1 border-t ${isLight ? 'border-amber-300/40' : 'border-amber-500/15'}`}>
                        <div className={`flex items-center justify-between text-[11px] ${isLight ? 'text-amber-800' : 'text-amber-400/80'} font-khmer`}>
                          <span>{language === 'kh' ? 'ជ្រើសរើសពីបញ្ជីភ្ញៀវ (Select Guest):' : 'Select from Guest List:'}</span>
                          <span className={`text-[10px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'} font-mono`}>
                            {allDbGuests.length} {language === 'kh' ? 'នាក់' : 'guests'}
                          </span>
                        </div>
                        <select
                          value={allDbGuests.some(g => g.name === targetGuest) ? targetGuest : ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              setTargetGuest(e.target.value);
                              if (onUpdateGuestName) onUpdateGuestName(e.target.value);
                            }
                          }}
                          className={`w-full px-3 py-2 rounded-xl border font-khmer text-xs focus:outline-none ${
                            isLight
                              ? 'bg-white border-amber-300 text-neutral-900 focus:border-amber-500'
                              : 'bg-black/70 border-amber-500/30 text-amber-200 focus:border-amber-400'
                          }`}
                        >
                          <option value="" disabled>
                            {language === 'kh' ? '-- ចុចជ្រើសរើសឈ្មោះភ្ញៀវក្នុងបញ្ជី --' : '-- Choose guest from list --'}
                          </option>
                          {allDbGuests.map((g, idx) => (
                            <option key={g.id ? `${g.id}-${idx}` : `db-guest-${idx}`} value={g.name} className={isLight ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-amber-100'}>
                              {g.name} ({g.categoryLabelKh || g.category})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Primary Link Box (With Guest Name embedded in Link) */}
                  <div className={`space-y-2.5 p-3.5 rounded-2xl ${isLight ? 'bg-amber-50/60 border-amber-300/80' : 'bg-black/50 border-amber-500/30'} border`}>
                    <div className="flex items-center justify-between">
                      <label className={`block text-xs font-semibold ${isLight ? 'text-amber-900' : 'text-amber-300'} font-khmer flex items-center gap-1.5`}>
                        <Link2 className="w-3.5 h-3.5 text-amber-500" />
                        <span>{language === 'kh' ? 'តំណភ្ជាប់មានឈ្មោះភ្ញៀវ (Personalized Link):' : 'Personalized Guest Link:'}</span>
                      </label>
                      <span className={`text-[11px] ${isLight ? 'text-emerald-700 bg-emerald-100 border-emerald-300' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'} font-khmer flex items-center gap-1 px-2 py-0.5 rounded-full border`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{language === 'kh' ? 'សាធារណៈ 100%' : '100% Public'}</span>
                      </span>
                    </div>

                    {/* Direct Personalized URL displaying full guest name parameter */}
                    <div className="flex items-center gap-2">
                      <div className={`flex-1 px-3 py-2.5 rounded-xl border text-xs font-mono truncate select-all flex items-center gap-1.5 ${
                        isLight
                          ? 'bg-white border-amber-300 text-amber-950'
                          : 'bg-black/70 border-amber-500/30 text-amber-200'
                      }`}>
                        <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{fullUrl}</span>
                      </div>
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-3 py-2.5 rounded-xl border text-xs font-khmer font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                          isLight
                            ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900'
                            : 'bg-amber-400/15 hover:bg-amber-400/25 border-amber-400/40 text-amber-200'
                        }`}
                        title={language === 'kh' ? 'បើកមើលសាកល្បង' : 'Test Open'}
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                        <span className="hidden sm:inline">{language === 'kh' ? 'បើក' : 'Open'}</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyFullLink}
                        className={`px-3.5 py-2.5 rounded-xl text-xs font-khmer font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                          copiedFull
                            ? 'bg-emerald-500 text-emerald-950 font-bold shadow-lg shadow-emerald-500/30'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-md'
                        }`}
                      >
                        {copiedFull ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                        <span>
                          {copiedFull
                            ? language === 'kh'
                              ? 'បានចម្លង!'
                              : 'Copied!'
                            : language === 'kh'
                            ? 'ចម្លងលីង'
                            : 'Copy'}
                        </span>
                      </button>
                    </div>

                    {/* Short Link Alternative */}
                    {shortUrl && (
                      <div className={`pt-2 border-t ${isLight ? 'border-amber-200' : 'border-white/5'} flex items-center justify-between text-[11px] text-neutral-400 gap-2`}>
                        <div className="flex items-center gap-1.5 truncate">
                          <span className={`${isLight ? 'text-amber-800' : 'text-amber-400/70'} font-khmer shrink-0`}>{language === 'kh' ? 'លីងខ្លី៖' : 'Short Link:'}</span>
                          <span className={`${isLight ? 'text-amber-900 font-semibold' : 'text-amber-300/80'} font-mono truncate`}>{shortUrl}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyShortLink}
                          className={`${isLight ? 'text-amber-700 hover:text-amber-900' : 'text-amber-400 hover:text-amber-300'} font-khmer font-medium flex items-center gap-1 underline shrink-0`}
                        >
                          {copiedShort ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500">{language === 'kh' ? 'បានចម្លងលីងខ្លី!' : 'Copied Short!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{language === 'kh' ? 'ចម្លងលីងខ្លី' : 'Copy Short Link'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Rich Invitation Preview Card with Cover Image and Link */}
                  <div className={`p-3 rounded-2xl ${isLight ? 'bg-amber-50/50 border-amber-300' : 'bg-gradient-to-b from-amber-950/40 to-black/60 border-amber-500/30'} border space-y-2.5 overflow-hidden`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isLight ? 'text-amber-900' : 'text-amber-300'} font-khmer flex items-center gap-1.5`}>
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{language === 'kh' ? 'គំរូផ្ទាំងសំបុត្រ និងរូបភាពក្រប (Invitation Card Preview):' : 'Invitation Card Preview:'}</span>
                      </span>
                      <a
                        href={activeShareLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-[11px] ${isLight ? 'text-amber-700 hover:text-amber-900' : 'text-amber-400 hover:text-amber-200'} font-khmer font-medium flex items-center gap-1 hover:underline`}
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{language === 'kh' ? 'មើលសាកល្បង' : 'Preview'}</span>
                      </a>
                    </div>

                    {/* Visual Telegram/Facebook Style Link Card with Cover Image */}
                    <div className={`rounded-xl overflow-hidden border ${isLight ? 'border-amber-300 bg-white' : 'border-amber-500/30 bg-black/60'} shadow-lg group`}>
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                        <img
                          src={effectiveCoverImage}
                          alt="Invitation Cover"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          crossOrigin="anonymous"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 drop-shadow">
                            Plan Essential Digital Invitation
                          </span>
                          <h4 className="text-sm sm:text-base font-moul text-amber-100 drop-shadow-md leading-tight mt-0.5">
                            {displayHeaderKh}
                          </h4>
                          <p className="text-[11px] sm:text-xs font-khmer text-amber-200 drop-shadow mt-0.5">
                            សូមគោរពអញ្ជើញ <span className="font-bold text-amber-300 underline underline-offset-2">{currentShareGuest}</span>
                          </p>
                        </div>
                      </div>
                      <div className={`p-2.5 ${isLight ? 'bg-amber-50/80 border-amber-200' : 'bg-[#121110] border-amber-500/20'} border-t flex items-center justify-between gap-2`}>
                        <div className="min-w-0 flex-1">
                          <p className={`text-[11px] font-mono ${isLight ? 'text-amber-900' : 'text-amber-400/90'} truncate`}>
                            {activeShareLink}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyShortLink}
                          className={`px-2.5 py-1 rounded-lg ${
                            isLight
                              ? 'bg-amber-200 hover:bg-amber-300 text-amber-950 border-amber-300'
                              : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/30'
                          } border text-[11px] font-khmer font-bold flex items-center gap-1 shrink-0 transition-colors`}
                        >
                          {copiedShort ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedShort ? 'បានចម្លង' : 'ចម្លងលីង'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pre-written Khmer Wedding Message Preview */}
                  <div className={`p-3.5 rounded-2xl ${isLight ? 'bg-amber-50/50 border-amber-300' : 'bg-black/50 border-amber-500/25'} border space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isLight ? 'text-amber-900' : 'text-amber-300'} font-khmer flex items-center gap-1.5`}>
                        <MailOpen className="w-3.5 h-3.5 text-amber-500" />
                        <span>{language === 'kh' ? 'សារអញ្ជើញភ្ជាប់ជាមួយលីង (Ready Message):' : 'Invitation Message with Link:'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyMessage}
                        className={`text-[11px] ${isLight ? 'text-amber-700 hover:text-amber-900' : 'text-amber-400 hover:text-amber-200'} font-khmer font-semibold flex items-center gap-1`}
                      >
                        {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedMessage ? (language === 'kh' ? 'បានចម្លងសារ!' : 'Copied!') : (language === 'kh' ? 'ចម្លងសារទាំងមូល' : 'Copy All')}</span>
                      </button>
                    </div>
                    <div className={`p-2.5 rounded-xl border text-[11px] sm:text-xs font-khmer leading-relaxed whitespace-pre-line max-h-32 overflow-y-auto select-all ${
                      isLight
                        ? 'bg-white border-amber-200 text-neutral-800'
                        : 'bg-black/70 border-amber-500/20 text-neutral-300'
                    }`}>
                      {activeMessage}
                    </div>
                  </div>

                  {/* Direct Share Buttons */}
                  <div className="space-y-1.5">
                    <span className={`block text-xs font-semibold ${isLight ? 'text-amber-900' : 'text-amber-300'} font-khmer`}>
                      {language === 'kh' ? 'ផ្ញើទៅកាន់កម្មវិធីផ្សេងៗ (Share Directly):' : 'Share Directly:'}
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={shareTelegram}
                        className={`py-2.5 px-3 rounded-xl border border-[#229ED9]/40 text-[#229ED9] ${isLight ? 'bg-sky-50 hover:bg-sky-100' : 'bg-black/20 hover:bg-black/30'} text-xs font-khmer font-bold flex items-center justify-center gap-1.5 transition-all`}
                      >
                        <Send className="w-4 h-4" />
                        <span>Telegram</span>
                      </button>
                      <button
                        type="button"
                        onClick={shareFacebook}
                        className={`py-2.5 px-3 rounded-xl border border-[#1877F2]/40 text-[#1877F2] ${isLight ? 'bg-blue-50 hover:bg-blue-100' : 'bg-black/20 hover:bg-black/30'} text-xs font-khmer font-bold flex items-center justify-center gap-1.5 transition-all`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Messenger</span>
                      </button>
                      <button
                        type="button"
                        onClick={shareWhatsApp}
                        className={`py-2.5 px-3 rounded-xl border border-[#25D366]/40 text-[#25D366] ${isLight ? 'bg-emerald-50 hover:bg-emerald-100' : 'bg-black/20 hover:bg-black/30'} text-xs font-khmer font-bold flex items-center justify-center gap-1.5 transition-all`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: QR Code Generator */}
              {activeTab === 'qrcode' && (
                <div className="text-center space-y-4 py-1">
                  {/* High Contrast QR Code Display Card */}
                  <div className="relative inline-block mx-auto p-4 rounded-3xl bg-white border-2 border-amber-400 shadow-[0_10px_35px_rgba(0,0,0,0.15)]">
                    <img
                      src={qrCodeUrl}
                      alt="Wedding Invitation QR Code"
                      className="w-52 h-52 block mx-auto rounded-lg"
                      loading="eager"
                    />
                    <div className="mt-2 pt-2 border-t border-neutral-200 flex items-center justify-center gap-1.5 text-neutral-800 text-[11px] font-khmer font-bold">
                      <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'kh' ? 'ស្កេនជាមួយ Camera ទូរស័ព្ទ' : 'Scan with Phone Camera'}</span>
                    </div>
                  </div>

                  {/* Guest Information */}
                  <div className="space-y-1">
                    <h4 className={`text-sm font-bold font-khmer ${isLight ? 'text-amber-900' : 'text-amber-200'}`}>
                      {language === 'kh' ? `សំបុត្រសម្រាប់៖ ${currentShareGuest}` : `Invitation for: ${currentShareGuest}`}
                    </h4>
                    <p className={`text-[11px] ${isLight ? 'text-amber-800' : 'text-amber-400/80'} font-mono truncate max-w-sm mx-auto px-2`}>
                      {activeQrData}
                    </p>
                  </div>

                  {/* QR Link Type Selector */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQrMode('short')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-khmer transition-all border ${
                        qrMode === 'short'
                          ? isLight
                            ? 'bg-amber-500 border-amber-600 text-neutral-950 font-bold shadow-sm'
                            : 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold'
                          : isLight
                          ? 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-neutral-900'
                          : 'bg-black/40 border-white/10 text-neutral-400'
                      }`}
                    >
                      {language === 'kh' ? 'QR លីងខ្លី (ស្កេនលឿនបំផុត)' : 'Short Link QR (Fastest)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setQrMode('direct')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-khmer transition-all border ${
                        qrMode === 'direct'
                          ? isLight
                            ? 'bg-amber-500 border-amber-600 text-neutral-950 font-bold shadow-sm'
                            : 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold'
                          : isLight
                          ? 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-neutral-900'
                          : 'bg-black/40 border-white/10 text-neutral-400'
                      }`}
                    >
                      {language === 'kh' ? 'QR លីងផ្ទាល់' : 'Direct Link QR'}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-2.5 pt-1">
                    <a
                      href={activeQrData}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3.5 py-2 rounded-xl border text-xs font-khmer font-semibold flex items-center gap-1.5 transition-all ${
                        isLight
                          ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900'
                          : 'bg-amber-400/20 hover:bg-amber-400/30 border-amber-400/50 text-amber-200'
                      }`}
                    >
                      <ExternalLink className="w-4 h-4 text-amber-500" />
                      <span>{language === 'kh' ? 'បើកសាកល្បង' : 'Test Open'}</span>
                    </a>
                    <a
                      href={qrCodeUrl}
                      download={`invitation-qr-${selectedCategory}-${currentShareGuest.replace(/\s+/g, '_')}.png`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-khmer font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>{language === 'kh' ? 'ទាញយក QR Code' : 'Download QR Code'}</span>
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 3: Batch Guest Table */}
              {activeTab === 'batch' && (
                <div className="space-y-3.5">
                  {/* Search and Add Guest Bar */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={language === 'kh' ? 'ស្វែងរកឈ្មោះភ្ញៀវក្នុងតារាង...' : 'Search guest in table...'}
                        className={`w-full pl-8 pr-3 py-2 rounded-xl border font-khmer text-xs focus:outline-none ${
                          isLight
                            ? 'bg-white border-amber-300 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500'
                            : 'bg-black/60 border-amber-500/30 text-amber-100 placeholder:text-neutral-500 focus:border-amber-400'
                        }`}
                      />
                    </div>

                    {/* Quick Add to Table */}
                    <form onSubmit={handleAddBatchGuest} className="flex gap-1.5 shrink-0">
                      <input
                        type="text"
                        value={newBatchName}
                        onChange={(e) => setNewBatchName(e.target.value)}
                        placeholder={language === 'kh' ? 'បញ្ចូលឈ្មោះថ្មី...' : 'New guest...'}
                        className={`w-36 sm:w-44 px-3 py-2 rounded-xl border font-khmer text-xs focus:outline-none ${
                          isLight
                            ? 'bg-white border-amber-300 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500'
                            : 'bg-black/60 border-amber-500/30 text-amber-100 placeholder:text-neutral-500 focus:border-amber-400'
                        }`}
                      />
                      <button
                        type="submit"
                        disabled={!newBatchName.trim()}
                        className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-neutral-950 font-khmer font-bold text-xs flex items-center gap-1 shadow transition-all shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{language === 'kh' ? 'បន្ថែម' : 'Add'}</span>
                      </button>
                    </form>
                  </div>

                  {/* Complete Guest Table */}
                  {(() => {
                    // Combine database guests and batch guests
                    const allGuestNames = Array.from(
                      new Set([
                        ...batchGuests,
                        ...allDbGuests.map((g) => g.name).filter(Boolean),
                      ])
                    );

                    const filteredNames = allGuestNames.filter((name) =>
                      name.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    return (
                      <div className={`border ${isLight ? 'border-amber-300 bg-amber-50/30' : 'border-amber-500/30 bg-black/50'} rounded-2xl overflow-hidden shadow-inner`}>
                        {/* Table Header with Counts */}
                        <div className={`px-3.5 py-2.5 ${isLight ? 'bg-amber-100 border-amber-300' : 'bg-amber-950/70 border-amber-500/30'} border-b flex items-center justify-between text-xs font-khmer flex-wrap gap-2`}>
                          <div className="flex items-center gap-2">
                            <Table className="w-4 h-4 text-amber-500" />
                            <span className={`${isLight ? 'text-amber-950' : 'text-amber-200'} font-bold`}>
                              {language === 'kh'
                                ? `តារាងភ្ញៀវសរុប (${filteredNames.length} នាក់)`
                                : `All Guests Table (${filteredNames.length})`}
                            </span>
                          </div>
                          <span className={`text-[11px] ${isLight ? 'text-amber-900 bg-amber-200/70 border-amber-300' : 'text-amber-300/80 bg-amber-500/10 border-amber-500/20'} px-2.5 py-0.5 rounded-full border`}>
                            {language === 'kh' ? 'មានតំណភ្ជាប់ផ្ទាល់ខ្លួន' : 'Personalized Links'}
                          </span>
                        </div>

                        {/* Responsive Table Container */}
                        <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                          {filteredNames.length === 0 ? (
                            <div className="p-6 text-center text-neutral-400 font-khmer text-xs">
                              {language === 'kh' ? 'រកមិនឃើញឈ្មោះភ្ញៀវទេ' : 'No guests found'}
                            </div>
                          ) : (
                            <table className="w-full text-left text-xs font-khmer border-collapse">
                              <thead className={`${isLight ? 'bg-neutral-100 text-amber-900' : 'bg-neutral-900/90 text-amber-300'} text-[11px] uppercase sticky top-0 border-b border-amber-300/20 backdrop-blur-md`}>
                                <tr>
                                  <th className="py-2.5 px-3 font-semibold text-center w-12">#</th>
                                  <th className="py-2.5 px-3 font-semibold">{language === 'kh' ? 'ឈ្មោះភ្ញៀវ' : 'Guest Name'}</th>
                                  <th className="py-2.5 px-3 font-semibold text-right w-36">{language === 'kh' ? 'សកម្មភាព' : 'Actions'}</th>
                                </tr>
                              </thead>
                              <tbody className={`divide-y ${isLight ? 'divide-amber-200/50' : 'divide-white/5'}`}>
                                {filteredNames.map((name, idx) => {
                                  const guestLink = getPublicShareUrl(name, activeEventId);
                                  return (
                                    <tr
                                      key={idx}
                                      className={`${isLight ? 'hover:bg-amber-100/50' : 'hover:bg-amber-400/5'} transition-colors group`}
                                    >
                                      <td className={`py-2.5 px-3 text-center ${isLight ? 'text-neutral-500' : 'text-neutral-400'} text-[11px] font-mono`}>
                                        {idx + 1}
                                      </td>
                                      <td className="py-2.5 px-3">
                                        <div className={`font-semibold ${isLight ? 'text-neutral-900' : 'text-amber-100'} flex items-center gap-1.5`}>
                                          <span>{name}</span>
                                        </div>
                                      </td>
                                      <td className="py-2.5 px-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                          <a
                                            href={guestLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`p-1.5 rounded-lg ${isLight ? 'text-neutral-600 hover:text-amber-800 hover:bg-amber-200/60' : 'text-neutral-400 hover:text-amber-300 hover:bg-amber-400/10'} transition-colors`}
                                            title={language === 'kh' ? 'បើកមើលសាកល្បង' : 'Test Open'}
                                          >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                          </a>
                                          <button
                                            type="button"
                                            onClick={() => handleCopyBatchGuestLink(name, idx)}
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-khmer font-bold flex items-center gap-1 transition-all ${
                                              copiedIndex === idx
                                                ? 'bg-emerald-500 text-emerald-950 font-bold shadow'
                                                : isLight
                                                ? 'bg-amber-200 hover:bg-amber-300 text-amber-950 border border-amber-300'
                                                : 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/30'
                                            }`}
                                            title={language === 'kh' ? 'ចម្លងតំណភ្ជាប់' : 'Copy Link'}
                                          >
                                            {copiedIndex === idx ? (
                                              <>
                                                <Check className="w-3 h-3 text-emerald-950 stroke-[3]" />
                                                <span>បានចម្លង</span>
                                              </>
                                            ) : (
                                              <>
                                                <Copy className="w-3 h-3" />
                                                <span>ចម្លងលីង</span>
                                              </>
                                            )}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={async () => {
                                              setBatchGuests(batchGuests.filter((g) => g !== name));
                                              const dbMatch = allDbGuests.find((g) => g.name === name);
                                              if (dbMatch && dbMatch.id) {
                                                try {
                                                  await deleteGuestFromFirebase(dbMatch.id);
                                                } catch (err) {
                                                  console.error('Error deleting guest:', err);
                                                }
                                              }
                                              setAllDbGuests(allDbGuests.filter((g) => g.name !== name));
                                            }}
                                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                                            title={language === 'kh' ? 'លុប' : 'Delete'}
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Public Access Reassurance Badge */}
              <div className={`p-3 rounded-2xl ${isLight ? 'bg-amber-50/80 border-amber-300' : 'bg-amber-950/30 border-amber-500/25'} border text-center font-khmer shrink-0`}>
                <div className={`flex items-center justify-center gap-1.5 text-xs font-semibold ${isLight ? 'text-emerald-700' : 'text-emerald-400'} mb-0.5`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'kh' ? 'តំណភ្ជាប់សាធារណៈ ១០០% ដំណើរការភ្លាមៗ' : '100% Public & Instant Access'}</span>
                </div>
                <p className={`text-[11px] ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                  {language === 'kh'
                    ? 'ភ្ញៀវដែលទទួលបានតំណភ្ជាប់ ឬស្កេន QR Code អាចបើកមើលសំបុត្រអញ្ជើញបានភ្លាមៗ ដោយមិនបាច់ Login ឡើយ។'
                    : 'Recipients can immediately scan or open their invitation without logging in.'}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
