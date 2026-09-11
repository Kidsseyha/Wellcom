import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Download, Sparkles, Clock } from 'lucide-react';
import { toKhmerNumber, formatKhmerDate, formatEnDate, generateGoogleCalendarUrl, downloadIcsFile } from '../utils/khmerHelpers';
import { Language, WeddingEvent, Shift } from '../types';

interface CountdownSectionProps {
  event: WeddingEvent;
  language: Language;
  primaryColor?: string;
  textColor?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function getShiftStartTime(shift: Shift | undefined, fallbackStartTime: string): { timestamp: number; isoString: string; firstTimeStr: string; firstCeremonyName: string } {
  let firstCeremonyName = '';
  if (shift?.timeLine && shift.timeLine.length > 0) {
    firstCeremonyName = shift.timeLine[0].name || '';
  }

  if (!shift || !shift.date) {
    const d = new Date(fallbackStartTime);
    const ts = isNaN(d.getTime()) ? Date.now() : d.getTime();
    return { timestamp: ts, isoString: fallbackStartTime, firstTimeStr: '', firstCeremonyName };
  }

  let hours = 7;
  let minutes = 0;
  let firstTimeStr = '';

  if (shift.timeLine && shift.timeLine.length > 0) {
    firstTimeStr = shift.timeLine[0].time;
    const match = firstTimeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      const ampm = match[3]?.toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }
  }

  const parts = shift.date.split('-').map(Number);
  if (parts.length === 3) {
    const d = new Date(parts[0], parts[1] - 1, parts[2], hours, minutes, 0);
    return {
      timestamp: d.getTime(),
      isoString: d.toISOString(),
      firstTimeStr,
      firstCeremonyName,
    };
  }

  const fallback = new Date(fallbackStartTime);
  return {
    timestamp: isNaN(fallback.getTime()) ? Date.now() : fallback.getTime(),
    isoString: fallbackStartTime,
    firstTimeStr,
    firstCeremonyName,
  };
}

function formatShortDate(dateStr: string, lang: Language): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(m) || isNaN(d)) return dateStr;
  const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
  const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (lang === 'kh') {
    return `${toKhmerNumber(d)} ${khmerMonths[m - 1]} ${toKhmerNumber(y)}`;
  }
  return `${d} ${enMonths[m - 1]} ${y}`;
}

export default function CountdownSection({
  event,
  language,
  primaryColor = '#f5b80f',
  textColor = '#f5b80f',
}: CountdownSectionProps) {
  const shifts = event.schedules?.[0]?.shifts || [];

  // Auto-select nearest upcoming shift (counts down one day by one day: Day 1 first, then Day 2)
  const getNearestShiftIdx = () => {
    if (!shifts || shifts.length === 0) return 0;
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    for (let i = 0; i < shifts.length; i++) {
      if (shifts[i]?.date) {
        const parts = shifts[i].date.split('-').map(Number);
        const shiftMidnight = new Date(parts[0], parts[1] - 1, parts[2]).getTime();
        // If shift is today or in the future
        if (shiftMidnight >= todayMidnight) {
          return i;
        }
      }
    }
    return 0;
  };

  const [activeShiftIdx, setActiveShiftIdx] = useState<number>(() => {
    return getNearestShiftIdx();
  });

  const currentShift = shifts[activeShiftIdx] || shifts[0];
  const { timestamp: targetTimestamp, isoString: targetIsoString, firstTimeStr, firstCeremonyName } =
    getShiftStartTime(currentShift, event.startTime);

  // Real-time timestamp updated every second for live countdown
  const [nowTs, setNowTs] = useState<number>(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTs(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate live countdown for any shift (days, hours, minutes, seconds)
  // Ensures exact calendar day difference: e.g. Sep 10 to Dec 19 is exactly 100 days, Dec 20 is 101 days
  const getShiftCountdown = (idx: number): TimeRemaining => {
    const shift = shifts[idx];
    if (!shift || !shift.date) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };

    const parts = shift.date.split('-').map(Number);
    if (parts.length !== 3) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };

    const now = new Date(nowTs);
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const targetMidnight = new Date(parts[0], parts[1] - 1, parts[2]).getTime();

    // Exact calendar days count (e.g. from Sep 10 to Dec 19 = 100 days; Dec 20 = 101 days)
    const calendarDays = Math.round((targetMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

    if (calendarDays < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    if (calendarDays === 0) {
      const { timestamp: startTs } = getShiftStartTime(shift, event.startTime);
      const diffToStart = startTs - nowTs;
      if (diffToStart > 0) {
        const hours = Math.floor(diffToStart / (1000 * 60 * 60));
        const minutes = Math.floor((diffToStart % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffToStart % (1000 * 60)) / 1000);
        return { days: 0, hours, minutes, seconds, isExpired: false };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    // Time remaining until the end of today (smooth continuous countdown of hours, minutes, seconds)
    const nextMidnight = todayMidnight + 24 * 60 * 60 * 1000;
    const msUntilMidnight = Math.max(0, nextMidnight - nowTs);

    const hours = Math.floor(msUntilMidnight / (1000 * 60 * 60)) % 24;
    const minutes = Math.floor((msUntilMidnight % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((msUntilMidnight % (1000 * 60)) / 1000);

    return {
      days: calendarDays,
      hours,
      minutes,
      seconds,
      isExpired: false,
    };
  };

  const time = getShiftCountdown(activeShiftIdx);

  const currentDayBadge = shifts.length > 1
    ? (activeShiftIdx === 1
        ? (language === 'kh' ? 'ថ្ងៃមង្គលការ (ថ្ងៃទី២)' : 'Wedding Day (Day 2)')
        : (language === 'kh' ? 'ថ្ងៃចូលរោង (ថ្ងៃទី១)' : 'Day 1 Ceremony'))
    : (language === 'kh' ? 'ថ្ងៃមង្គលការ' : 'Wedding Day');

  const currentDateFormatted = currentShift?.date
    ? (language === 'kh' ? formatKhmerDate(currentShift.date) : formatEnDate(currentShift.date))
    : (language === 'kh' ? event.config.invitation_kh.date_time : event.config.invitation_en.date_time);

  const calendarTitle =
    language === 'kh'
      ? `អាពាហ៍ពិពាហ៍ ${event.groom} & ${event.bride} (${currentDayBadge})`
      : `Wedding of ${event.groomEn || event.groom} & ${event.brideEn || event.bride} (${currentDayBadge})`;

  const calendarDesc =
    language === 'kh'
      ? `សូមគោរពអញ្ជើញចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស ក្នុងពិធីអាពាហ៍ពិពាហ៍ (${currentDayBadge}) នៅ ${event.location}`
      : `Cordially inviting you to honor our wedding celebration (${currentDayBadge}) at ${event.locationEn || event.location}`;

  const gcalUrl = generateGoogleCalendarUrl(
    calendarTitle,
    calendarDesc,
    event.location,
    targetIsoString
  );

  return (
    <section id="countdown-section" className="py-8 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
          <h2
            style={{ color: primaryColor }}
            className="text-base sm:text-lg font-moul"
          >
            {language === 'kh' ? 'ចំនួនថ្ងៃរាប់ថយក្រោយ' : 'EVENT COUNTDOWN'}
          </h2>
          <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
        </div>

        {/* Day selection tabs if multiple days exist (Counting down one day by one day) */}
        {shifts.length > 1 && (
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 flex-wrap">
              {shifts.map((shift, idx) => {
                const isSelected = activeShiftIdx === idx;
                const isWeddingDay = idx === 1;
                const shiftTime = getShiftCountdown(idx);
                const dayTitle = isWeddingDay
                  ? (language === 'kh' ? 'វារៈថ្ងៃទី២ ៖ ថ្ងៃមង្គលការ' : 'Day 2: Wedding Day')
                  : (language === 'kh' ? 'វារៈថ្ងៃទី១ ៖ ចូលរោង' : 'Day 1: Reception Setup');
                const shiftShortDate = shift.date ? formatShortDate(shift.date, language) : '';

                return (
                  <button
                    key={shift.id || idx}
                    id={`countdown-day-tab-${idx + 1}`}
                    type="button"
                    onClick={() => setActiveShiftIdx(idx)}
                    className={`px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-khmer transition-all duration-300 flex items-center gap-2.5 sm:gap-3 cursor-pointer shadow-md text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 font-bold shadow-[0_8px_30px_rgba(245,184,15,0.55)] scale-[1.03] border-2 border-amber-100 ring-2 ring-amber-300/90'
                        : 'bg-gradient-to-b from-[#1c1408]/90 via-black/90 to-[#140e04]/90 text-amber-200 hover:text-white border border-amber-500/40 hover:border-amber-400/80 hover:bg-amber-950/40 hover:scale-[1.01]'
                    }`}
                  >
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm font-mono shadow-inner shrink-0 ${
                      isSelected ? 'bg-amber-950 text-amber-300' : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    }`}>
                      {language === 'kh' ? toKhmerNumber(idx + 1) : idx + 1}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap ${
                          isSelected ? 'text-amber-950 font-moul' : 'text-amber-200'
                        }`}>
                          {dayTitle}
                        </span>
                        {shiftShortDate && (
                          <span className={`text-[10px] sm:text-[11px] font-normal opacity-90 whitespace-nowrap ${
                            isSelected ? 'text-amber-900' : 'text-amber-300/80'
                          }`}>
                            ({shiftShortDate})
                          </span>
                        )}
                      </div>

                      {/* Live Countdown: Days, Hours, Minutes, and Seconds */}
                      <div className="flex items-center gap-1 sm:gap-1.5 mt-1 text-[11px] sm:text-xs font-mono">
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-md font-bold transition-all shadow-sm flex items-center gap-0.5 sm:gap-1 ${
                          isSelected
                            ? 'bg-amber-950/20 text-amber-950 border border-amber-950/30'
                            : 'bg-black/60 text-amber-200 border border-amber-500/40'
                        }`}>
                          <span className="font-bold">{language === 'kh' ? toKhmerNumber(shiftTime.days) : shiftTime.days}</span>
                          <span className="text-[10px] font-khmer">{language === 'kh' ? 'ថ្ងៃ' : 'd'}</span>
                        </span>

                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-md font-bold transition-all shadow-sm flex items-center gap-0.5 sm:gap-1 ${
                          isSelected
                            ? 'bg-amber-950/20 text-amber-950 border border-amber-950/30'
                            : 'bg-black/60 text-amber-200 border border-amber-500/40'
                        }`}>
                          <span className="font-bold">{language === 'kh' ? toKhmerNumber(shiftTime.hours.toString().padStart(2, '0')) : shiftTime.hours.toString().padStart(2, '0')}</span>
                          <span className="text-[10px] font-khmer">{language === 'kh' ? 'ម៉ោង' : 'h'}</span>
                        </span>

                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-md font-bold transition-all shadow-sm flex items-center gap-0.5 sm:gap-1 ${
                          isSelected
                            ? 'bg-amber-950/20 text-amber-950 border border-amber-950/30'
                            : 'bg-black/60 text-amber-200 border border-amber-500/40'
                        }`}>
                          <span className="font-bold">{language === 'kh' ? toKhmerNumber(shiftTime.minutes.toString().padStart(2, '0')) : shiftTime.minutes.toString().padStart(2, '0')}</span>
                          <span className="text-[10px] font-khmer">{language === 'kh' ? 'នាទី' : 'm'}</span>
                        </span>

                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-md font-bold transition-all shadow-sm flex items-center gap-0.5 sm:gap-1 ${
                          isSelected
                            ? 'bg-amber-950/30 text-amber-950 border border-amber-950/40 font-bold'
                            : 'bg-amber-500/30 text-amber-300 border border-amber-400/50 font-bold'
                        }`}>
                          <span className="font-bold">{language === 'kh' ? toKhmerNumber(shiftTime.seconds.toString().padStart(2, '0')) : shiftTime.seconds.toString().padStart(2, '0')}</span>
                          <span className="text-[10px] font-khmer">{language === 'kh' ? 'វិ' : 's'}</span>
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step-by-step indicator for day-by-day countdown */}
            <div className="text-center text-[11px] sm:text-xs font-khmer text-amber-200/90 flex items-center justify-center gap-1.5 py-1 px-3 rounded-full bg-amber-950/40 border border-amber-500/20 max-w-fit mx-auto mt-2 mb-3">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {language === 'kh'
                  ? `កំពុងរាប់ថយក្រោយឆ្ពោះទៅកាន់ ៖ ${currentDayBadge} (${currentDateFormatted})`
                  : `Counting down to: ${currentDayBadge} (${currentDateFormatted})`}
              </span>
            </div>
          </div>
        )}

        {time.isExpired ? (
          <div
            style={{ color: primaryColor }}
            className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/40 font-moul mb-6"
          >
            🎉 {language === 'kh' ? `ពិធីមង្គលការ ${currentDayBadge} បានមកដល់ហើយ!` : `${currentDayBadge} Celebration has arrived!`}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
            {/* 1. Days Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="relative overflow-hidden flex flex-col items-center justify-center py-3.5 px-1.5 sm:py-4 rounded-2xl bg-gradient-to-b from-amber-400/25 via-black/85 to-[#1c160a]/95 border-2 border-amber-400/80 backdrop-blur-lg shadow-[0_8px_25px_rgba(245,184,15,0.3)] ring-1 ring-amber-300/40"
            >
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
              <span
                style={{ color: primaryColor }}
                className="text-2xl sm:text-3xl font-bold font-moul tracking-wider drop-shadow-[0_2px_10px_rgba(245,184,15,0.45)]"
              >
                {language === 'kh' ? toKhmerNumber(time.days) : time.days.toString().padStart(2, '0')}
              </span>
              <span
                style={{ color: textColor }}
                className="text-[11px] sm:text-xs font-khmer font-bold mt-1 tracking-wider uppercase opacity-95"
              >
                {language === 'kh' ? 'ថ្ងៃ' : 'Days'}
              </span>
            </motion.div>

            {/* 2. Hours Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="relative overflow-hidden flex flex-col items-center justify-center py-3.5 px-1.5 sm:py-4 rounded-2xl bg-gradient-to-b from-amber-950/50 via-black/85 to-[#161208]/95 border border-amber-500/50 backdrop-blur-lg shadow-[0_6px_20px_rgba(0,0,0,0.5)] ring-1 ring-amber-400/20"
            >
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
              <span
                style={{ color: primaryColor }}
                className="text-2xl sm:text-3xl font-bold font-moul tracking-wider drop-shadow-sm"
              >
                {language === 'kh' ? toKhmerNumber(time.hours) : time.hours.toString().padStart(2, '0')}
              </span>
              <span
                style={{ color: textColor }}
                className="text-[11px] sm:text-xs font-khmer font-semibold mt-1 opacity-85"
              >
                {language === 'kh' ? 'ម៉ោង' : 'Hours'}
              </span>
            </motion.div>

            {/* 3. Minutes Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="relative overflow-hidden flex flex-col items-center justify-center py-3.5 px-1.5 sm:py-4 rounded-2xl bg-gradient-to-b from-amber-950/50 via-black/85 to-[#161208]/95 border border-amber-500/50 backdrop-blur-lg shadow-[0_6px_20px_rgba(0,0,0,0.5)] ring-1 ring-amber-400/20"
            >
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
              <span
                style={{ color: primaryColor }}
                className="text-2xl sm:text-3xl font-bold font-moul tracking-wider drop-shadow-sm"
              >
                {language === 'kh' ? toKhmerNumber(time.minutes) : time.minutes.toString().padStart(2, '0')}
              </span>
              <span
                style={{ color: textColor }}
                className="text-[11px] sm:text-xs font-khmer font-semibold mt-1 opacity-85"
              >
                {language === 'kh' ? 'នាទី' : 'Min'}
              </span>
            </motion.div>

            {/* 4. Seconds Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="relative overflow-hidden flex flex-col items-center justify-center py-3.5 px-1.5 sm:py-4 rounded-2xl bg-gradient-to-b from-amber-950/50 via-black/85 to-[#161208]/95 border border-amber-500/50 backdrop-blur-lg shadow-[0_6px_20px_rgba(0,0,0,0.5)] ring-1 ring-amber-400/20"
            >
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
              <span
                style={{ color: primaryColor }}
                className="text-2xl sm:text-3xl font-bold font-moul tracking-wider text-amber-300 drop-shadow-sm font-mono"
              >
                {language === 'kh' ? toKhmerNumber(time.seconds) : time.seconds.toString().padStart(2, '0')}
              </span>
              <span
                style={{ color: textColor }}
                className="text-[11px] sm:text-xs font-khmer font-semibold mt-1 opacity-85"
              >
                {language === 'kh' ? 'វិនាទី' : 'Sec'}
              </span>
            </motion.div>
          </div>
        )}

        {/* Calendar Integration Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <a
            id="add-google-calendar-btn"
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold font-khmer bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition-all hover:scale-[1.02]"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'kh' ? 'ដាក់ចូល Google Calendar' : 'Google Calendar'}</span>
          </a>

          <button
            id="download-ics-btn"
            onClick={() =>
              downloadIcsFile(calendarTitle, calendarDesc, event.location, targetIsoString)
            }
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold font-khmer bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-500/30 transition-all hover:scale-[1.02]"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'kh' ? 'ទាញយកប្រតិទិន iCal' : 'Download iCal'}</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}
