import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, User, Check, X } from 'lucide-react';

interface TheapKhmerTemplate15CoverProps {
  groom?: string;
  bride?: string;
  groomEn?: string;
  brideEn?: string;
  subtitleKh?: string;
  guestName?: string;
  language?: string;
  isOpening?: boolean;
  onOpenInvitation?: () => void;
  isAdmin?: boolean;
  savedGuestsList?: Array<{ id?: string; name: string; categoryLabelKh?: string; categoryLabelEn?: string }>;
  onSelectFromDropbox?: (name: string) => void;
  onOpenAddGuestModal?: () => void;
  onUpdateGuestName?: (name: string) => void;
  guestNameFontFamily?: string;
  guestNameColor?: string;
  guestNameFontSize?: string;
}

// Ornate Khmer Traditional Divider component matching Theap Khmer Template 15
export function TheapKhmerDivider({
  className = '',
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <span className={`pointer-events-none relative block overflow-hidden ${className}`} aria-hidden="true">
      <img
        src="/assets/template15/divider.webp"
        alt=""
        draggable={false}
        className={`absolute left-1/2 top-1/2 w-[160%] max-w-none -translate-x-1/2 -translate-y-1/2 select-none drop-shadow-[0_2px_2px_rgba(126,88,45,0.14)] ${
          inverted ? 'rotate-180' : ''
        }`}
      />
    </span>
  );
}

export default function TheapKhmerTemplate15Cover({
  groom = 'ជា ដារ៉ា',
  bride = 'សុខ បុប្ផា',
  subtitleKh = 'សិរីមង្គលអាពាហ៍ពិពាហ៍',
  guestName = 'ភ្ញៀវកិត្តិយស',
  language = 'kh',
  isOpening = false,
  onOpenInvitation,
  isAdmin = false,
  savedGuestsList = [],
  onSelectFromDropbox,
  onOpenAddGuestModal,
  onUpdateGuestName,
  guestNameFontFamily,
  guestNameColor,
  guestNameFontSize,
}: TheapKhmerTemplate15CoverProps) {
  const [isEditingInlineGuest, setIsEditingInlineGuest] = useState(false);
  const [tempGuestInput, setTempGuestInput] = useState(guestName || '');

  const displayGuest = guestName && guestName !== 'Your Name' ? guestName.trim() : (language === 'kh' ? 'ភ្ញៀវកិត្តិយស' : 'Honored Guest');

  const handleSaveInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempGuestInput.trim() && onUpdateGuestName) {
      onUpdateGuestName(tempGuestInput.trim());
    }
    setIsEditingInlineGuest(false);
  };

  return (
    <div
      className="relative isolate w-full h-full min-h-[600px] sm:min-h-[660px] md:min-h-[720px] flex flex-col justify-between items-center text-center overflow-hidden overscroll-none touch-none bg-[#faf7f2] select-none shadow-[0_0_42px_rgba(91,76,54,0.14)] font-moulpali text-[#ad8b55]"
    >
      {/* 1. Ornate Textured Background Image */}
      <img
        src="/assets/template15/opening-background.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute inset-0 -z-[3] h-full w-full select-none object-fill"
      />

      {/* 2. Soft Ambient Radial Gradient */}
      <div
        className="pointer-events-none absolute inset-0 -z-[2] bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.18),transparent_42%)]"
        aria-hidden="true"
      />

      {/* 3. Swaying Hanging Green Flowers Garland (Matching Template 15) */}
      <motion.img
        src="/assets/template15/hanging-flowers.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute -left-[2%] -top-[1%] z-[1] h-auto w-[104%] origin-top select-none drop-shadow-[0_8px_14px_rgba(89,107,55,0.08)]"
        initial={{ opacity: 0, y: -18 }}
        animate={{
          opacity: 1,
          x: [0, 3, -2, 2, 0],
          y: [0, 1, -1, 1, 0],
          rotate: [0, 1.2, -0.9, 0.6, 0],
        }}
        transition={{
          opacity: { duration: 1 },
          x: { duration: 7.5, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 7.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* 4. Top Header with Khmer Royal Dividers & Auspicious Wedding Title */}
      <motion.header
        className="absolute inset-x-[4%] top-[21%] sm:top-[23%] z-[2] flex flex-col items-center"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.12, ease: 'easeOut' }}
      >
        <TheapKhmerDivider className="h-[clamp(24px,4svh,34px)] w-[50%]" />

        <h1
          className="wedding-opening-title -mt-0.5 [overflow-wrap:anywhere] text-[clamp(1.16rem,5.8vw,1.9rem)] font-bold leading-[1.5] text-[#ad8b55] [text-shadow:0_1px_0_rgba(255,255,255,0.95),0_3px_8px_rgba(126,99,58,0.13)] select-none px-2"
          style={{ fontFamily: "'Moul', serif" }}
        >
          {subtitleKh || 'សិរីមង្គលអាពាហ៍ពិពាហ៍'}
        </h1>

        <TheapKhmerDivider inverted className="-mt-px h-[clamp(24px,4svh,34px)] w-[53%]" />
      </motion.header>

      {/* 5. Center Golden Monogram Emblem with Gentle Vertical Float */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[37%] sm:top-[38%] z-[2] mx-auto w-[46%] max-w-[210px]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.35, ease: 'easeOut' }}
      >
        <motion.img
          src="/assets/template15/monogram.webp"
          alt={`${groom} and ${bride} wedding monogram`}
          draggable={false}
          className="wedding-opening-monogram block h-auto w-full select-none drop-shadow-[0_10px_18px_rgba(123,96,55,0.12)]"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* 6. Guest Section with Cordially Invited & Guest Name & Divider */}
      <motion.section
        className="absolute inset-x-[6%] top-[64%] sm:top-[66%] z-[2] flex flex-col items-center"
        aria-label="Invited guest"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.65, ease: 'easeOut' }}
      >
        <p
          className="wedding-opening-invitation m-0 text-[clamp(0.98rem,4.6vw,1.4rem)] font-semibold leading-[1.55] text-[#ad8b55] [text-shadow:0_1px_0_rgba(255,255,255,0.95)]"
          style={{ fontFamily: "'Noto Sans Khmer', sans-serif" }}
        >
          {language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invited'}
        </p>

        {/* Dropdown for admin to select saved guests */}
        {isAdmin && savedGuestsList.length > 0 && onSelectFromDropbox && (
          <div className="w-full max-w-[260px] my-1 flex items-center justify-center relative z-10">
            <div className="relative w-full">
              <select
                id="guest-dropbox-select-t15"
                value={savedGuestsList.some(g => g.name === guestName) ? guestName : ''}
                onChange={e => onSelectFromDropbox(e.target.value)}
                style={{ color: '#ad8b55', borderColor: '#ad8b5560' }}
                className="w-full px-2.5 py-1 pr-7 rounded-md bg-white/95 border text-[11px] font-khmer focus:outline-none cursor-pointer shadow-xs appearance-none"
              >
                <option value="" disabled>
                  {language === 'kh' ? '▼ ជ្រើសរើសឈ្មោះភ្ញៀវ...' : '▼ Select Guest...'}
                </option>
                {savedGuestsList.map((g, idx) => (
                  <option key={g.id ? `${g.id}-${idx}` : `env-guest-${idx}`} value={g.name} className="bg-white text-neutral-800 py-1 font-sans">
                    {g.name} - {language === 'kh' ? g.categoryLabelKh : g.categoryLabelEn}
                  </option>
                ))}
                <option value="__ADD_NEW__" className="bg-amber-100 text-amber-900 font-bold">
                  + {language === 'kh' ? 'Add ភ្ញៀវថ្មី / បន្ថែមឈ្មោះ...' : 'Add New Custom Guest...'}
                </option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#ad8b55]" />
            </div>
          </div>
        )}

        {isEditingInlineGuest ? (
          <form onSubmit={handleSaveInline} className="my-1 p-1.5 rounded-xl bg-white/95 border border-[#ad8b55] shadow-md flex items-center gap-1.5 z-10">
            <input
              type="text"
              value={tempGuestInput}
              onChange={e => setTempGuestInput(e.target.value)}
              autoFocus
              placeholder={language === 'kh' ? 'បញ្ចូលឈ្មោះភ្ញៀវ...' : 'Enter guest name...'}
              className="px-2 py-1 text-xs border rounded border-amber-300 font-moul text-center text-[#ad8b55] focus:outline-none"
            />
            <button
              type="submit"
              className="px-2 py-1 bg-[#ad8b55] text-white rounded text-xs font-bold font-khmer cursor-pointer hover:opacity-90"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditingInlineGuest(false)}
              className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs cursor-pointer hover:bg-gray-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <h2
            onClick={() => {
              if (isAdmin) {
                if (onOpenAddGuestModal) {
                  onOpenAddGuestModal();
                } else {
                  setTempGuestInput(displayGuest);
                  setIsEditingInlineGuest(true);
                }
              }
            }}
            className={`wedding-opening-guest-name mt-[clamp(2px,0.5vh,6px)] mb-0 text-[clamp(0.86rem,4vw,1.25rem)] font-normal leading-[1.5] text-[#ad8b55] [text-shadow:0_1px_0_rgba(255,255,255,0.95)] max-w-[280px] sm:max-w-[340px] truncate ${
              isAdmin ? 'cursor-pointer hover:opacity-85' : ''
            }`}
            style={{
              fontFamily: guestNameFontFamily || "'Moul', 'Moulpali', 'Khmer OS Muol Light', serif",
              color: guestNameColor && guestNameColor !== '#364153' ? guestNameColor : '#ad8b55',
              fontSize: guestNameFontSize ? `${guestNameFontSize}px` : undefined,
              lineHeight: '35px',
            }}
            title={isAdmin ? (language === 'kh' ? 'ចុចដើម្បី Add ភ្ញៀវ ឬកែប្រែឈ្មោះ' : 'Click to Add Guest or edit name') : undefined}
          >
            {displayGuest}
          </h2>
        )}

        <TheapKhmerDivider className="mt-[clamp(2px,0.5vh,6px)] h-[clamp(22px,3.7svh,31px)] w-[45%]" />
      </motion.section>

      {/* 7. Auspicious Open Button (Matching Template 15 with Button Frame & Shimmer) */}
      {onOpenInvitation && (
        <motion.button
          type="button"
          onClick={onOpenInvitation}
          disabled={isOpening}
          aria-label={isOpening ? 'Opening' : (language === 'kh' ? 'បើកលិខិតអញ្ជើញ' : 'Open Invitation')}
          className="group absolute inset-x-0 bottom-[6.5%] sm:bottom-[7.5%] z-[4] mx-auto grid aspect-[2000/791] w-[46%] sm:w-[42%] max-w-[220px] cursor-pointer place-items-center overflow-hidden border-0 bg-transparent p-0 outline-none [-webkit-tap-highlight-color:transparent] focus-visible:rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ad8b55] transition-transform duration-200 hover:scale-[1.025] active:scale-[0.97]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.9, ease: 'easeOut' }}
        >
          {/* Button Frame Artwork */}
          <img
            src="/assets/template15/button-frame.webp"
            alt=""
            aria-hidden="true"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain drop-shadow-[0_7px_11px_rgba(130,98,51,0.14)]"
          />

          {/* Shimmer Light Bar */}
          <div
            className="pointer-events-none absolute inset-x-[11%] top-[14%] bottom-[14%] z-[1] -translate-x-[80%] bg-[linear-gradient(105deg,transparent_25%,rgba(255,255,255,0.7)_48%,transparent_70%)] opacity-0 transition-all duration-[1250ms] ease-out group-hover:translate-x-[80%] group-hover:opacity-100 group-focus-visible:translate-x-[80%] group-focus-visible:opacity-100 motion-reduce:hidden"
          />

          {/* Button Label: បើកលិខិតអញ្ជើញ */}
          <span
            className="relative z-[2] max-w-[84%] whitespace-nowrap text-[clamp(0.72rem,3.2vw,0.98rem)] font-bold leading-[1.4] text-[#ad8b55] [text-shadow:0_1px_0_rgba(255,255,255,0.95)]"
            style={{ fontFamily: "'Noto Sans Khmer', sans-serif", fontWeight: 'bold' }}
          >
            {isOpening
              ? (language === 'kh' ? 'កំពុងបើក...' : 'Opening...')
              : (language === 'kh' ? 'បើកលិខិតអញ្ជើញ' : 'Open Invitation')}
          </span>
        </motion.button>
      )}
    </div>
  );
}
