import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Users,
  Gift,
  Sparkles,
  Scissors,
  Flame,
  Utensils,
  Heart,
  Crown,
  Wine,
  CalendarCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { Language, Shift } from '../types';
import { formatKhmerDate, formatEnDate, toKhmerNumber } from '../utils/khmerHelpers';

interface ScheduleSectionProps {
  shifts: Shift[];
  language: Language;
  primaryColor?: string;
  textColor?: string;
}

export default function ScheduleSection({
  shifts,
  language,
  primaryColor = '#f5b80f',
  textColor = '#f5b80f',
}: ScheduleSectionProps) {
  // Always display all days sequentially (Day 1 then Day 2)
  const [quickJumpIdx, setQuickJumpIdx] = useState<number | null>(null);

  const getIcon = (iconName?: string) => {
    const props = { className: 'w-4 h-4', style: { color: primaryColor } };
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
      default:
        return <Clock {...props} />;
    }
  };

  const scrollToDay = (index: number) => {
    setQuickJumpIdx(index);
    const element = document.getElementById(`schedule-day-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="schedule-section" className="py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto"
      >
        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/50 border border-amber-500/30 text-xs font-khmer mb-2 shadow-sm">
            <CalendarCheck className="w-3.5 h-3.5" style={{ color: primaryColor }} />
            <span style={{ color: primaryColor }}>
              {shifts.length > 1
                ? language === 'kh'
                  ? 'កម្មវិធីមង្គលការ ២ ថ្ងៃ'
                  : '2-Day Wedding Program'
                : language === 'kh'
                ? 'កម្មវិធីមង្គលការ'
                : 'Wedding Schedule'}
            </span>
          </div>
          <h2
            style={{ color: primaryColor }}
            className="text-xl sm:text-2xl font-moul drop-shadow-sm"
          >
            {language === 'kh' ? 'របៀបវារៈកម្មវិធី' : 'WEDDING AGENDA'}
          </h2>
          <p
            style={{ color: textColor }}
            className="text-xs font-khmer mt-1 opacity-90"
          >
            {language === 'kh'
              ? 'បែងចែកជាពីរថ្ងៃ តាមគន្លងប្រពៃណីខ្មែរ'
              : '2-Day Traditional Khmer Wedding Itinerary'}
          </p>
        </div>

        {/* Quick Day Shortcut Pills */}
        {shifts.length > 1 && (
          <div className="flex items-center justify-center p-1.5 rounded-2xl bg-gradient-to-r from-black/95 via-[#181308] to-black/95 border border-amber-500/40 mb-8 shadow-[0_4px_25px_rgba(0,0,0,0.7)] backdrop-blur-md gap-2 ring-1 ring-amber-400/20">
            {shifts.map((shift, idx) => {
              const isSelected = quickJumpIdx === idx;
              
              // Dynamic Day label & date with year from shift data
              let dayBadge = language === 'kh' ? `ថ្ងៃទី${toKhmerNumber(idx + 1)}` : `Day ${idx + 1}`;
              let dateDetails = '';
              let fullTitle = '';

              if (shift.date) {
                const parts = shift.date.split('-');
                if (parts.length === 3) {
                  const y = parseInt(parts[0], 10);
                  const m = parseInt(parts[1], 10);
                  const d = parseInt(parts[2], 10);
                  const dateObj = new Date(y, m - 1, d);

                  if (language === 'kh') {
                    const khmerShortDays = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
                    const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
                    const dStr = d < 10 ? `0${d}` : `${d}`;
                    dateDetails = `${khmerShortDays[dateObj.getDay()]} ${toKhmerNumber(dStr)} ${khmerMonths[m - 1]} ${toKhmerNumber(y)}`;
                    fullTitle = `${dayBadge} ៖ ${formatKhmerDate(shift.date)}`;
                  } else {
                    const enDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const dStr = d < 10 ? `0${d}` : `${d}`;
                    dateDetails = `${enDays[dateObj.getDay()]}, ${enMonths[m - 1]} ${dStr}, ${y}`;
                    fullTitle = `${dayBadge}: ${formatEnDate(shift.date)}`;
                  }
                }
              } else {
                dateDetails = language === 'kh' ? (shift.name || '') : (shift.nameEn || '');
                fullTitle = dateDetails;
              }

              return (
                <button
                  key={shift.id || idx}
                  id={`schedule-day-tab-${idx + 1}`}
                  type="button"
                  onClick={() => scrollToDay(idx)}
                  title={fullTitle}
                  className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-khmer transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 font-bold shadow-[0_3px_20px_rgba(245,184,15,0.45)] scale-[1.01] border border-amber-200 ring-1 ring-amber-300/70'
                      : 'bg-black/50 text-amber-200/90 hover:text-amber-100 hover:bg-amber-400/15 border border-amber-500/25 hover:border-amber-400/50 shadow-sm'
                  }`}
                >
                  <div className={`p-1.5 rounded-full shrink-0 transition-transform ${isSelected ? 'bg-amber-950/20 text-amber-950 scale-105' : 'bg-amber-400/10 text-amber-400'}`}>
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-center text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold ${
                      isSelected
                        ? 'bg-amber-950/20 text-amber-950'
                        : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    }`}>
                      {dayBadge}
                    </span>
                    <span className="font-semibold text-xs sm:text-[13px] tracking-tight">
                      {dateDetails}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Timeline Content: Display Day 1 and Day 2 together sequentially */}
        <div className="space-y-10">
          {shifts.map((shift, shiftIndex) => {
            const actualDayNum = shiftIndex + 1;

            return (
              <div
                key={shift.id || shiftIndex}
                id={`schedule-day-${shiftIndex}`}
                className="p-4 sm:p-5 rounded-2xl bg-black/90 border border-amber-500/30 shadow-2xl relative overflow-hidden backdrop-blur-sm scroll-mt-24 transition-all"
              >
                {/* Day Header Badge */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-amber-500/25">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400/30 to-amber-600/20 border border-amber-400/50 text-amber-300 font-bold text-xs flex items-center justify-center font-mono shadow-sm">
                      #{actualDayNum}
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold font-moul text-amber-200 leading-snug">
                        {language === 'kh' ? shift.name : shift.nameEn || shift.name}
                      </h3>
                      {shift.date && (
                        <span className="text-[11px] text-amber-300/80 font-mono flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          <span>{shift.date}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[11px] font-khmer text-amber-300 font-bold shrink-0 shadow-sm">
                    {language === 'kh' ? `ថ្ងៃទី ${actualDayNum}` : `Day ${actualDayNum}`}
                  </span>
                </div>

                {/* Timeline list */}
                <div className="relative pl-6 border-l-2 border-amber-500/30 space-y-5 my-2">
                  {shift.timeLine.map((item, idx) => (
                    <motion.div
                      key={item.id || idx}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: idx * 0.04 }}
                      className="relative group"
                    >
                      {/* Timeline dot with ceremony icon */}
                      <div className="absolute -left-[31px] top-1.5 w-6 h-6 rounded-full bg-black border-2 border-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:border-amber-300 transition-all shadow-md shadow-black/60">
                        {getIcon(item.icon)}
                      </div>

                      {/* Card */}
                      <div className="p-3 sm:p-3.5 rounded-xl bg-black/50 hover:bg-black/70 border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-sm">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-bold tracking-wider font-mono border border-amber-500/30">
                            {item.time}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold font-khmer text-amber-100 leading-snug">
                          {language === 'kh' ? item.name : item.nameEn || item.name}
                        </h4>
                        {language === 'en' && item.nameEn && (
                          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                            {item.nameEn}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Decorative flourish */}
        <div className="flex items-center justify-center my-6">
          <img
            src="https://focuz-staging-space.sgp1.digitaloceanspaces.com/plan-essential/template/free/template-1/underline-kbach-2.png"
            alt=""
            className="w-40 opacity-70"
          />
        </div>
      </motion.div>
    </section>
  );
}
