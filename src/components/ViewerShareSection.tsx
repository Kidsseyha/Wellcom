import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  Globe,
  Send,
  MessageCircle,
  QrCode,
  Sparkles,
  Link2,
} from 'lucide-react';
import { Language, WeddingEvent } from '../types';
import { ThemeMode } from './ThemeToggle';
import { getPublicShareUrl, shortenUrl } from '../lib/shareUrl';
import { getCategoryCoverImage } from '../data/eventTemplates';

interface ViewerShareSectionProps {
  guestName: string;
  event: WeddingEvent;
  language: Language;
  theme: ThemeMode;
  primaryColor?: string;
  textColor?: string;
  onOpenShareModal: () => void;
}

export default function ViewerShareSection({
  guestName,
  event,
  language,
  theme,
  primaryColor = '#f5b80f',
  textColor = '#f5b80f',
  onOpenShareModal,
}: ViewerShareSectionProps) {
  const isLight = theme === 'light';
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);
  const [shortUrl, setShortUrl] = useState<string>('');

  const currentGuest = guestName && guestName !== 'Your Name' ? guestName : '';
  const fullUrl = getPublicShareUrl(currentGuest, event.id);

  useEffect(() => {
    let isMounted = true;
    shortenUrl(fullUrl).then(res => {
      if (isMounted && res) {
        setShortUrl(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [fullUrl]);

  const activeShareLink = shortUrl || fullUrl;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = fullUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopyShort = async () => {
    try {
      const linkToCopy = shortUrl || fullUrl;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(linkToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = linkToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedShort(true);
      setTimeout(() => setCopiedShort(false), 2500);
    } catch {
      // fallback
    }
  };

  const shareTitle = language === 'kh'
    ? `លិខិតអញ្ជើញអាពាហ៍ពិពាហ៍៖ ${event.groom} & ${event.bride}`
    : `Wedding Invitation: ${event.groom} & ${event.bride}`;

  const shareText = language === 'kh'
    ? `សូមគោរពអញ្ជើញ ${currentGuest || 'លោកអ្នក'} ចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយសក្នុងពិធីអាពាហ៍ពិពាហ៍របស់យើងខ្ញុំតាមរយៈតំណភ្ជាប់នេះ៖\n${activeShareLink}`
    : `You are cordially invited to celebrate our wedding. View our invitation here:\n${activeShareLink}`;

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(activeShareLink)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(activeShareLink)}`, '_blank');
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: activeShareLink,
        });
      } catch {
        // Share cancelled or not supported
      }
    } else {
      handleCopyLink();
    }
  };

  const effectiveCoverImage = event.cover_image || event.image || getCategoryCoverImage(event.eventType || event.id);

  return (
    <section id="viewer-share-section" className="relative z-10 py-10 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`max-w-2xl mx-auto rounded-3xl p-5 sm:p-7 border shadow-xl backdrop-blur-md relative overflow-hidden ${
          isLight
            ? 'bg-amber-50/70 border-amber-300/80 shadow-amber-900/5'
            : 'bg-gradient-to-b from-[#161412]/95 via-black/90 to-black/95 border-amber-500/30 shadow-black/50'
        }`}
      >
        {/* Decorative Top Golden Trim */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

        {/* Section Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-400 mb-2.5 shadow-sm">
            <Share2 className="w-5 h-5 text-amber-400" />
          </div>
          <h3
            style={{ color: primaryColor }}
            className="text-lg sm:text-xl font-moul tracking-wide"
          >
            {language === 'kh' ? 'ចែករំលែកលិខិតអញ្ជើញ' : 'Share Digital Invitation'}
          </h3>
          <p
            style={{ color: textColor }}
            className="text-xs sm:text-sm font-khmer mt-1.5 opacity-90 leading-relaxed max-w-lg mx-auto"
          >
            {language === 'kh'
              ? 'លោកអ្នកអាចចម្លងតំណភ្ជាប់ ឬផ្ញើបន្តទៅកាន់ក្រុមគ្រួសារ និងមិត្តភក្តិដើម្បីមើលលិខិតអញ្ជើញនេះ'
              : 'Share this personalized wedding invitation with your friends and family'}
          </p>
        </div>

        <div className="space-y-4">
          {/* ELEMENT 1: Personalized Guest Link Box (Matches CSS Selector 1) */}
          <div
            id="viewer-link-box"
            className={`space-y-3 p-4 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md hover:border-amber-400/80 ${
              isLight ? 'bg-white/80 border-amber-300' : 'bg-black/55 border-amber-500/35'
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-1.5">
              <label className={`text-xs font-semibold ${isLight ? 'text-amber-900' : 'text-amber-300'} font-khmer flex items-center gap-1.5`}>
                <Link2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{language === 'kh' ? 'តំណភ្ជាប់សំបុត្រអញ្ជើញសម្រាប់ភ្ញៀវ (Personalized Link):' : 'Personalized Guest Invitation Link:'}</span>
              </label>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-[10px] sm:text-[11px] ${isLight ? 'text-amber-800 bg-amber-100 border-amber-300' : 'text-amber-300 bg-amber-500/15 border-amber-400/30'} font-khmer px-2 py-0.5 rounded-full border font-semibold`}>
                  {language === 'kh' ? 'សម្រាប់ភ្ញៀវ' : 'For Viewer'}
                </span>
                <span className={`text-[10px] sm:text-[11px] ${isLight ? 'text-emerald-700 bg-emerald-100 border-emerald-300' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'} font-khmer flex items-center gap-1 px-2 py-0.5 rounded-full border`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{language === 'kh' ? 'សាធារណៈ' : 'Public'}</span>
                </span>
              </div>
            </div>

            {/* Direct URL Row with Copy and Test Open */}
            <div className="flex items-center gap-2">
              <div
                className={`flex-1 px-3 py-2.5 rounded-xl border text-xs font-mono truncate select-all flex items-center gap-1.5 shadow-inner ${
                  isLight
                    ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                    : 'bg-black/70 border-amber-500/30 text-amber-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{fullUrl}</span>
              </div>

              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-2.5 rounded-xl border text-xs font-khmer font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                  isLight
                    ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900 shadow-sm'
                    : 'bg-amber-400/15 hover:bg-amber-400/25 border-amber-400/40 text-amber-200 shadow-sm'
                }`}
                title={language === 'kh' ? 'បើកមើលសាកល្បង' : 'Test Open'}
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">{language === 'kh' ? 'បើក' : 'Open'}</span>
              </a>

              <button
                id="viewer-copy-link-btn"
                type="button"
                onClick={handleCopyLink}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-khmer font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  copiedLink
                    ? 'bg-emerald-500 text-emerald-950 font-bold shadow-lg shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-md hover:shadow-lg'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                <span>
                  {copiedLink
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
              <div className={`pt-2.5 border-t ${isLight ? 'border-amber-200' : 'border-white/5'} flex items-center justify-between text-[11px] gap-2`}>
                <div className="flex items-center gap-1.5 truncate">
                  <span className={`${isLight ? 'text-amber-800 font-semibold' : 'text-amber-400/80 font-semibold'} font-khmer shrink-0`}>
                    {language === 'kh' ? 'លីងខ្លី៖' : 'Short Link:'}
                  </span>
                  <span className={`${isLight ? 'text-amber-950 font-bold' : 'text-amber-300'} font-mono truncate`}>
                    {shortUrl}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyShort}
                  className={`${isLight ? 'text-amber-800 hover:text-amber-950 bg-amber-100/70 hover:bg-amber-200' : 'text-amber-300 hover:text-white bg-amber-500/15 hover:bg-amber-500/25'} px-2.5 py-1 rounded-lg border border-amber-400/30 font-khmer font-semibold flex items-center gap-1 transition-all shrink-0 cursor-pointer`}
                >
                  {copiedShort ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-600 font-bold">{language === 'kh' ? 'បានចម្លង!' : 'Copied!'}</span>
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

          {/* ELEMENT 2: Rich Invitation Preview Card with Cover Image and Link (Matches CSS Selector 2) */}
          <div
            id="viewer-preview-card-box"
            className={`p-3.5 rounded-2xl border space-y-3 overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl hover:border-amber-400/80 ${
              isLight
                ? 'bg-gradient-to-b from-white to-amber-50/70 border-amber-300'
                : 'bg-gradient-to-b from-amber-950/40 via-black/70 to-black/90 border-amber-500/35'
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className={`text-xs font-semibold ${isLight ? 'text-amber-900' : 'text-amber-300'} font-khmer flex items-center gap-1.5`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                <span>{language === 'kh' ? 'គំរូផ្ទាំងសំបុត្រ និងរូបភាពក្របសម្រាប់ភ្ញៀវមើល (Viewer Card Preview):' : 'Viewer Invitation Card Preview:'}</span>
              </span>
              <a
                href={activeShareLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[11px] ${isLight ? 'text-amber-800 hover:text-amber-950 font-semibold' : 'text-amber-400 hover:text-amber-200'} font-khmer flex items-center gap-1 hover:underline`}
              >
                <ExternalLink className="w-3 h-3" />
                <span>{language === 'kh' ? 'មើលសាកល្បង' : 'Preview'}</span>
              </a>
            </div>

            {/* Visual Card Image Banner */}
            <div className={`rounded-xl overflow-hidden border ${isLight ? 'border-amber-300 bg-white shadow-md' : 'border-amber-500/30 bg-black/70 shadow-lg'} group transition-all duration-300`}>
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                <img
                  src={effectiveCoverImage}
                  alt="Invitation Cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-3.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 drop-shadow flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Digital Wedding Invitation
                  </span>
                  <h4 className="text-sm sm:text-base font-moul text-amber-100 drop-shadow-md leading-tight mt-1">
                    {event.singlePerson ? event.groom : `${event.groom} & ${event.bride}`}
                  </h4>
                  {currentGuest && (
                    <p className="text-[11px] sm:text-xs font-khmer text-amber-200 drop-shadow mt-0.5">
                      សូមគោរពអញ្ជើញ <span className="font-bold text-amber-300 underline underline-offset-2">{currentGuest}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom URL Bar in Card */}
              <div className={`p-2.5 ${isLight ? 'bg-amber-50/90 border-amber-200' : 'bg-[#121110] border-amber-500/20'} border-t flex items-center justify-between gap-2`}>
                <div className="min-w-0 flex-1">
                  <p className={`text-[11px] font-mono ${isLight ? 'text-amber-950 font-medium' : 'text-amber-300'} truncate select-all`}>
                    {activeShareLink}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyShort}
                  className={`px-2.5 py-1.5 rounded-lg ${
                    isLight
                      ? 'bg-amber-200 hover:bg-amber-300 text-amber-950 border-amber-300 font-bold'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/30 font-bold'
                  } border text-[11px] font-khmer flex items-center gap-1 shrink-0 transition-all cursor-pointer`}
                >
                  {copiedShort ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedShort ? (language === 'kh' ? 'បានចម្លង!' : 'Copied!') : (language === 'kh' ? 'ចម្លងលីង' : 'Copy Link')}</span>
                </button>
              </div>
            </div>

            {/* Direct Instant Share Action Buttons for Viewers */}
            <div className="pt-1">
              <span className={`block text-[11px] font-semibold ${isLight ? 'text-amber-900' : 'text-amber-300/90'} font-khmer mb-2`}>
                {language === 'kh' ? 'ផ្ញើទៅកាន់កម្មវិធីផ្សេងៗ (Quick Share to):' : 'Send Directly to:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={shareTelegram}
                  className={`py-2 px-3 rounded-xl border border-[#229ED9]/40 text-[#229ED9] ${
                    isLight ? 'bg-sky-50 hover:bg-sky-100' : 'bg-sky-500/10 hover:bg-sky-500/20'
                  } text-xs font-khmer font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </button>

                <button
                  type="button"
                  onClick={shareFacebook}
                  className={`py-2 px-3 rounded-xl border border-[#1877F2]/40 text-[#1877F2] ${
                    isLight ? 'bg-blue-50 hover:bg-blue-100' : 'bg-blue-500/10 hover:bg-blue-500/20'
                  } text-xs font-khmer font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Messenger</span>
                </button>

                <button
                  type="button"
                  onClick={shareWhatsApp}
                  className={`py-2 px-3 rounded-xl border border-[#25D366]/40 text-[#25D366] ${
                    isLight ? 'bg-emerald-50 hover:bg-emerald-100' : 'bg-emerald-500/10 hover:bg-emerald-500/20'
                  } text-xs font-khmer font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenShareModal}
                  className={`py-2 px-3 rounded-xl border border-amber-400/50 ${
                    isLight ? 'bg-amber-100 hover:bg-amber-200 text-amber-950' : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200'
                  } text-xs font-khmer font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'kh' ? 'កូដ QR & ច្រើនទៀត' : 'QR & More'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
