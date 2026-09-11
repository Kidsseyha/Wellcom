import { ThemeMode } from "./ThemeToggle";
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, Download, Sparkles, Clock, ExternalLink, Heart } from 'lucide-react';
import { toKhmerNumber, formatKhmerDate, formatEnDate, generateGoogleCalendarUrl, downloadIcsFile } from '../utils/khmerHelpers';
import { Language, WeddingEvent, Shift } from '../types';

interface CountdownSectionProps {
  event: WeddingEvent;
  language: Language;
  primaryColor?: string;
  textColor?: string;
  theme?: ThemeMode;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const KHMER_MONTHS = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ',
];

const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS_KH_SHORT = ['អា', 'ច', 'អ', 'ព', 'ព្រ', 'សុ', 'ស'];
const WEEKDAYS_EN_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getShiftStartTime(shift: Shift | undefined, fallbackStartTime: string): { timestamp: number; isoString: string; firstTimeStr: string } {
  if (!shift || !shift.date) {
    const d = new Date(fallbackStartTime);
    const ts = isNaN(d.getTime()) ? Date.now() : d.getTime();
    return { timestamp: ts, isoString: fallbackStartTime, firstTimeStr: '05:00 AM' };
  }

  // Default to 5:00 AM (05:00) as in timeanddate iso=20260925T05
  let hours = 5;
  let minutes = 0;
  let firstTimeStr = '05:00 AM';

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
    // Treat as Asia/Phnom Penh time (UTC+7)
    const localDate = new Date(parts[0], parts[1] - 1, parts[2], hours, minutes, 0);
    return {
      timestamp: localDate.getTime(),
      isoString: localDate.toISOString(),
      firstTimeStr,
    };
  }

  const fallback = new Date(fallbackStartTime);
  return {
    timestamp: isNaN(fallback.getTime()) ? Date.now() : fallback.getTime(),
    isoString: fallbackStartTime,
    firstTimeStr,
  };
}

export default function CountdownSection({
  event,
  language,
  primaryColor = '#f5b80f',
  textColor = '#f5b80f',
  theme = 'dark',
}: CountdownSectionProps) {
  const shifts = event.schedules?.[0]?.shifts || [];

  // Official Wedding Day shift (Day 2 if 2 days, or the sole shift)
  const weddingShift = shifts.length > 0 ? shifts[shifts.length - 1] : undefined;
  const day1Shift = shifts.length > 1 ? shifts[0] : undefined;

  const { timestamp: weddingTargetTs, isoString: targetIsoString } =
    getShiftStartTime(weddingShift, event.startTime);

  // Real-time timestamp updated every second for live countdown
  const [nowTs, setNowTs] = useState<number>(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTs(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate live countdown from now until the wedding day
  const getMainCountdown = (): TimeRemaining => {
    const diff = weddingTargetTs - nowTs;
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
    };
  };

  const time = getMainCountdown();

  // Calendar parameters derived from wedding date (e.g. 2026-09-25)
  const calendarData = useMemo(() => {
    let year = 2026;
    let monthIdx = 8; // September (0-indexed)
    let weddingDay = 25;
    let day1Day: number | undefined = 24;

    if (weddingShift?.date) {
      const parts = weddingShift.date.split('-').map(Number);
      if (parts.length === 3) {
        year = parts[0];
        monthIdx = parts[1] - 1;
        weddingDay = parts[2];
      }
    }

    if (day1Shift?.date) {
      const parts = day1Shift.date.split('-').map(Number);
      if (parts.length === 3 && parts[0] === year && parts[1] - 1 === monthIdx) {
        day1Day = parts[2];
      }
    }

    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, monthIdx, 1).getDay(); // 0 = Sunday

    const cells: {
      day: number | null;
      isWeddingDay: boolean;
      isDay1: boolean;
    }[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({ day: null, isWeddingDay: false, isDay1: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        isWeddingDay: d === weddingDay,
        isDay1: day1Day !== undefined && d === day1Day,
      });
    }

    return {
      year,
      monthIdx,
      weddingDay,
      day1Day,
      cells,
      monthNameKh: KHMER_MONTHS[monthIdx] || 'កញ្ញា',
      monthNameEn: EN_MONTHS[monthIdx] || 'September',
    };
  }, [weddingShift?.date, day1Shift?.date]);

  const currentDayBadge = language === 'kh' ? 'ថ្ងៃមង្គលការ' : 'Wedding Day';

  const currentDateFormatted = weddingShift?.date
    ? (language === 'kh' ? formatKhmerDate(weddingShift.date) : formatEnDate(weddingShift.date))
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

  const timeAndDateUrl = 'https://www.timeanddate.com/countdown/wedding?iso=20260925T05&p0=3448&font=cursive';

  return (
    <section id="countdown-section" className="py-8 px-3 sm:px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl mx-auto"
      >
        {/* Section Title */}
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
          <h2
            style={{ color: primaryColor }}
            className="text-base sm:text-lg md:text-xl font-moul tracking-wide"
          >
            {language === 'kh' ? 'ប្រតិទិន និងរាប់ថយក្រោយអាពាហ៍ពិពាហ៍' : 'WEDDING CALENDAR & COUNTDOWN'}
          </h2>
          <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
        </div>

        {/* Subtitle / Couple Name (Flexible with EN / KH) */}
        <div className="mb-6 flex flex-col items-center px-2">
          {language === 'kh' ? (
            <p className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xl sm:text-2xl md:text-3xl font-moul text-amber-300 drop-shadow-sm tracking-wide text-center">
              <span>{event.groom}</span>
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400 inline-block mx-1 animate-pulse-gold shrink-0" />
              <span>{event.bride}</span>
            </p>
          ) : (
            <p className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 font-norican text-2xl sm:text-3xl md:text-4xl text-amber-300 drop-shadow-sm tracking-wide capitalize text-center">
              <span>{event.groomEn || 'Ro Malay'}</span>
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400 inline-block mx-1 animate-pulse-gold shrink-0" />
              <span>{event.brideEn || 'Uom Volak'}</span>
            </p>
          )}

          {/* Secondary Subtitle Name in Alternative Language */}
          <div className="mt-1 text-amber-300/80 text-center">
            {language === 'kh' ? (
              <span className="font-norican text-base sm:text-lg capitalize tracking-wider">
                {event.groomEn || 'Ro Malay'} & {event.brideEn || 'Uom Volak'}
              </span>
            ) : (
              <span className="font-moul text-xs sm:text-sm tracking-wide">
                {event.groom} & {event.bride}
              </span>
            )}
          </div>

          <div className="mt-1.5 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-khmer text-amber-200/90 text-center">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              {language === 'kh'
                ? `ថ្ងៃសុក្រ ទី២៥ ខែកញ្ញា ឆ្នាំ២០២៦ វេលាម៉ោង ០៥:០០ ព្រឹក`
                : `Friday, September 25, 2026 at 5:00 AM (Phnom Penh Time)`}
            </span>
          </div>
        </div>

        {/* Main Wedding Calendar Card & Live Countdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 mb-6 items-stretch">
          {/* 1. Monthly Calendar Tear-off Sheet (5 cols on md) */}
          <div className="md:col-span-5 flex flex-col">
            <div className={`h-full rounded-2xl ${theme === 'light' ? 'bg-amber-50 border-amber-300 shadow-[0_8px_30px_rgba(0,0,0,0.1)]' : 'bg-gradient-to-b from-amber-400/15 via-[#1c1408]/90 to-black/95 border-amber-500/40 shadow-[0_8px_30px_rgba(0,0,0,0.5)]'} border p-3.5 sm:p-4 backdrop-blur-md flex flex-col justify-between`}>
              {/* Calendar Month Header */}
              <div className={`flex items-center justify-between pb-2.5 mb-2.5 border-b ${theme === 'light' ? 'border-amber-300/50' : 'border-amber-500/30'}`}>
                <div className="flex items-center gap-2 text-left">
                  <div className={`w-8 h-8 rounded-lg ${theme === 'light' ? 'bg-amber-200 border-amber-300 text-amber-700' : 'bg-amber-400/20 border-amber-400/40 text-amber-300'} border flex items-center justify-center`}>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold font-moul ${theme === 'light' ? 'text-amber-900' : 'text-amber-300'} leading-tight`}>
                      {language === 'kh'
                        ? `ខែ${calendarData.monthNameKh}`
                        : calendarData.monthNameEn}
                    </h3>
                    <p className={`text-[11px] font-mono ${theme === 'light' ? 'text-amber-700' : 'text-amber-200/70'}`}>
                      {language === 'kh' ? toKhmerNumber(calendarData.year) : calendarData.year}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] sm:text-[11px] font-khmer px-2 py-0.5 rounded-full flex items-center gap-1 ${theme === 'light' ? 'bg-amber-200 text-amber-900 border-amber-400' : 'bg-amber-400/20 text-amber-300 border-amber-400/30'} border`}>
                  <Heart className={`w-2.5 h-2.5 ${theme === 'light' ? 'fill-amber-600 text-amber-600' : 'fill-amber-400 text-amber-400'}`} />
                  {language === 'kh' ? 'ថ្ងៃជ័យមង្គល' : 'Save the Date'}
                </span>
              </div>

              {/* Days of Week Header */}
              <div className={`grid grid-cols-7 gap-1 text-center mb-1.5 text-[10px] sm:text-xs font-semibold ${theme === 'light' ? 'text-amber-800' : 'text-amber-400/80'}`}>
                {(language === 'kh' ? WEEKDAYS_KH_SHORT : WEEKDAYS_EN_SHORT).map((dayName, idx) => (
                  <div key={idx} className={`py-0.5 ${idx === 0 || idx === 6 ? (theme === 'light' ? 'text-red-700' : 'text-amber-300') : ''}`}>
                    {dayName}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
                {calendarData.cells.map((cell, idx) => {
                  if (cell.day === null) {
                    return <div key={`empty-${idx}`} className="h-7 sm:h-8" />;
                  }

                  if (cell.isWeddingDay) {
                    return (
                      <div
                        key={`day-${cell.day}`}
                        title={language === 'kh' ? 'ថ្ងៃមង្គលការ (Wedding Day)' : 'Wedding Day'}
                        className="h-7 sm:h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-300 text-amber-950 font-bold flex flex-col items-center justify-center relative shadow-[0_0_15px_rgba(245,184,15,0.75)] ring-2 ring-amber-100 scale-105 animate-pulse-gold cursor-default"
                      >
                        <span className="text-[11px] sm:text-xs font-extrabold leading-none">
                          {language === 'kh' ? toKhmerNumber(cell.day) : cell.day}
                        </span>
                        <Heart className="w-2 h-2 fill-amber-950 text-amber-950 mt-0.5" />
                      </div>
                    );
                  }

                  if (cell.isDay1) {
                    return (
                      <div
                        key={`day-${cell.day}`}
                        title={language === 'kh' ? 'ថ្ងៃចូលរោង (Day 1)' : 'Reception Setup'}
                        className={`h-7 sm:h-8 rounded-lg ${theme === 'light' ? 'bg-amber-200 text-amber-900 border-amber-400/60' : 'bg-amber-500/30 text-amber-200 border-amber-400/60'} font-bold flex items-center justify-center border`}
                      >
                        <span className="text-[11px] sm:text-xs">
                          {language === 'kh' ? toKhmerNumber(cell.day) : cell.day}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`day-${cell.day}`}
                      className={`h-7 sm:h-8 rounded-md flex items-center justify-center ${theme === 'light' ? 'text-amber-950 hover:bg-amber-100' : 'text-amber-200/80 hover:bg-amber-400/10'} transition-colors text-[11px] sm:text-xs`}
                    >
                      {language === 'kh' ? toKhmerNumber(cell.day) : cell.day}
                    </div>
                  );
                })}
              </div>

              {/* Calendar Footer Highlight Note */}
              <div className={`mt-3 pt-2 border-t ${theme === 'light' ? 'border-amber-300/50 text-amber-800' : 'border-amber-500/20 text-amber-300/90'} text-[11px] font-khmer flex items-center justify-center gap-1.5`}>
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block shadow-[0_0_6px_#f5b80f]" />
                <span>
                  {language === 'kh'
                    ? `ថ្ងៃទី២៥ ខែកញ្ញា ៖ ${currentDayBadge}`
                    : `September 25: ${currentDayBadge}`}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Live Countdown Counters (7 cols on md) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            {time.isExpired ? (
              <div
                style={{ color: primaryColor }}
                className={`h-full rounded-2xl ${theme === 'light' ? 'bg-amber-100/50 border-amber-300' : 'bg-amber-950/40 border-amber-500/40'} border p-6 flex flex-col items-center justify-center`}
              >
                <Sparkles className="w-8 h-8 text-amber-400 mb-2" />
                <p className="text-xl sm:text-2xl font-moul">
                  {language === 'kh'
                    ? 'កម្មវិធីមង្គលការបានមកដល់ហើយ!'
                    : 'The Wedding Celebration is Here!'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-between gap-3">
                {/* 4 Countdown Boxes */}
                <div className="grid grid-cols-4 gap-2 sm:gap-2.5 flex-1 items-stretch">
                  {/* Days */}
                  <motion.div
                    whileHover={{ scale: 1.04, y: -2 }}
                    className={`relative overflow-hidden flex flex-col items-center justify-center py-3.5 px-1 sm:py-4 rounded-2xl ${theme === 'light' ? 'bg-white border-amber-300 shadow-[0_8px_25px_rgba(0,0,0,0.05)]' : 'bg-gradient-to-b from-amber-400/25 via-black/85 to-[#1c160a]/95 border-amber-400/80 shadow-[0_8px_25px_rgba(245,184,15,0.3)] ring-amber-300/40'} border-2 backdrop-blur-lg ring-1`}
                  >
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                    <span
                      style={{ color: primaryColor }}
                      className="text-2xl sm:text-3xl md:text-4xl font-bold font-moul tracking-wider drop-shadow-[0_2px_10px_rgba(245,184,15,0.45)]"
                    >
                      {language === 'kh' ? toKhmerNumber(time.days) : time.days.toString().padStart(2, '0')}
                    </span>
                    <span
                      style={{ color: textColor }}
                      className={`text-[10px] sm:text-xs font-khmer font-bold mt-1 tracking-wider uppercase opacity-95 ${theme === 'light' ? 'text-amber-900' : ''}`}
                    >
                      {language === 'kh' ? 'ថ្ងៃ' : 'Days'}
                    </span>
                  </motion.div>

                  {/* Hours */}
                  <motion.div
                    whileHover={{ scale: 1.04, y: -2 }}
                    className={`relative overflow-hidden flex flex-col items-center justify-center py-3.5 px-1 sm:py-4 rounded-2xl ${theme === 'light' ? 'bg-amber-50 border-amber-300/60 shadow-[0_4px_15px_rgba(0,0,0,0.05)]' : 'bg-gradient-to-b from-amber-950/50 via-black/85 to-[#161208]/95 border-amber-500/50 shadow-[0_6px_20px_rgba(0,0,0,0.5)] ring-amber-400/20'} border backdrop-blur-lg ring-1`}
                  >
                    <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                    <span
                      style={{ color: primaryColor }}
                      className="text-2xl sm:text-3xl md:text-4xl font-bold font-moul tracking-wider drop-shadow-sm"
                    >
                      {language === 'kh' ? toKhmerNumber(time.hours) : time.hours.toString().padStart(2, '0')}
                    </span>
                    <span
                      style={{ color: textColor }}
                      className={`text-[10px] sm:text-xs font-khmer font-semibold mt-1 opacity-85 ${theme === 'light' ? 'text-amber-900' : ''}`}
                    >
                      {language === 'kh' ? 'ម៉ោង' : 'Hours'}
                    </span>
                  </motion.div>

                  {/* Minutes */}
                  <motion.div
                    whileHover={{ scale: 1.04, y: -2 }}
                    className={`relative overflow-hidden flex flex-col items-center justify-center py-3.5 px-1 sm:py-4 rounded-2xl ${theme === 'light' ? 'bg-amber-50 border-amber-300/60 shadow-[0_4px_15px_rgba(0,0,0,0.05)]' : 'bg-gradient-to-b from-amber-950/50 via-black/85 to-[#161208]/95 border-amber-500/50 shadow-[0_6px_20px_rgba(0,0,0,0.5)] ring-amber-400/20'} border backdrop-blur-lg ring-1`}
                  >
                    <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                    <span
                      style={{ color: primaryColor }}
                      className="text-2xl sm:text-3xl md:text-4xl font-bold font-moul tracking-wider drop-shadow-sm"
                    >
                      {language === 'kh' ? toKhmerNumber(time.minutes) : time.minutes.toString().padStart(2, '0')}
                    </span>
                    <span
                      style={{ color: textColor }}
                      className={`text-[10px] sm:text-xs font-khmer font-semibold mt-1 opacity-85 ${theme === 'light' ? 'text-amber-900' : ''}`}
                    >
                      {language === 'kh' ? 'នាទី' : 'Minutes'}
                    </span>
                  </motion.div>

                  {/* Seconds */}
                  <motion.div
                    whileHover={{ scale: 1.04, y: -2 }}
                    className={`relative overflow-hidden flex flex-col items-center justify-center py-3.5 px-1 sm:py-4 rounded-2xl ${theme === 'light' ? 'bg-amber-50 border-amber-300/60 shadow-[0_4px_15px_rgba(0,0,0,0.05)]' : 'bg-gradient-to-b from-amber-950/50 via-black/85 to-[#161208]/95 border-amber-500/50 shadow-[0_6px_20px_rgba(0,0,0,0.5)] ring-amber-400/20'} border backdrop-blur-lg ring-1`}
                  >
                    <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                    <span
                      style={{ color: primaryColor }}
                      className="text-2xl sm:text-3xl md:text-4xl font-bold font-moul tracking-wider text-amber-300 drop-shadow-sm font-mono"
                    >
                      {language === 'kh' ? toKhmerNumber(time.seconds) : time.seconds.toString().padStart(2, '0')}
                    </span>
                    <span
                      style={{ color: textColor }}
                      className={`text-[10px] sm:text-xs font-khmer font-semibold mt-1 opacity-85 ${theme === 'light' ? 'text-amber-900' : ''}`}
                    >
                      {language === 'kh' ? 'វិនាទី' : 'Seconds'}
                    </span>
                  </motion.div>
                </div>

                {/* Status Box */}
                <div className={`rounded-xl ${theme === 'light' ? 'bg-amber-100/60 border-amber-300' : 'bg-gradient-to-r from-amber-950/60 via-black/70 to-amber-950/60 border-amber-500/30'} border py-2 px-3 text-center`}>
                  <p className={`text-xs sm:text-sm font-khmer ${theme === 'light' ? 'text-amber-900' : 'text-amber-200'} flex items-center justify-center gap-1.5`}>
                    <Sparkles className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'} shrink-0`} />
                    <span>
                      {language === 'kh'
                        ? `នៅសល់តែ ${toKhmerNumber(time.days)} ថ្ងៃទៀតប៉ុណ្ណោះ នឹងឈានដល់ថ្ងៃមង្គលការ!`
                        : `Only ${time.days} days remaining until our wedding celebration!`}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calendar Integration & External Countdown Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {/* Google Calendar */}
          <a
            id="add-google-calendar-btn"
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold font-khmer ${theme === 'light' ? 'bg-white hover:bg-amber-50 border-amber-300 text-amber-700' : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-200'} border transition-all hover:scale-[1.02] shadow-sm`}
          >
            <Calendar className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'} shrink-0`} />
            <span>{language === 'kh' ? 'Google Calendar' : 'Google Calendar'}</span>
          </a>

          {/* Download iCal */}
          <button
            id="download-ics-btn"
            onClick={() =>
              downloadIcsFile(calendarTitle, calendarDesc, event.location, targetIsoString)
            }
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold font-khmer ${theme === 'light' ? 'bg-white hover:bg-amber-50 border-amber-300 text-amber-700' : 'bg-amber-950/40 hover:bg-amber-900/40 border-amber-500/30 text-amber-300'} border transition-all hover:scale-[1.02] shadow-sm`}
          >
            <Download className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'} shrink-0`} />
            <span>{language === 'kh' ? 'ទាញយក iCal' : 'Download iCal'}</span>
          </button>

          {/* Time & Date Countdown Link */}
          <a
            id="timeanddate-countdown-btn"
            href={timeAndDateUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="មើលការរាប់ថយក្រោយផ្ទាល់លើ timeanddate.com"
            className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-400 to-amber-300 text-amber-950 hover:from-amber-300 hover:to-amber-200 border border-amber-300 transition-all hover:scale-[1.02] ${theme === 'light' ? 'shadow-[0_4px_15px_rgba(245,184,15,0.2)]' : 'shadow-[0_4px_15px_rgba(245,184,15,0.4)]'}`}
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span className="font-norican text-lg sm:text-xl tracking-wider capitalize pt-1">
              {language === 'kh' ? 'Live Cursive Countdown' : 'Live Cursive Countdown'}
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
