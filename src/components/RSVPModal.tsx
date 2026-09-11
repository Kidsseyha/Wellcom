import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, UserCheck, Users, Phone, MessageSquareQuote } from 'lucide-react';
import { Language } from '../types';
import { saveRSVPToFirebase } from '../lib/firebaseServices';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGuestName: string;
  language: Language;
  theme?: 'light' | 'dark';
}

export default function RSVPModal({
  isOpen,
  onClose,
  defaultGuestName,
  language,
  theme = 'dark',
}: RSVPModalProps) {
  const isLight = theme === 'light';
  const [name, setName] = useState(defaultGuestName);
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guestCount, setGuestCount] = useState('1');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (attending === 'yes') {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f5b80f', '#10b981', '#ffffff', '#f43f5e'],
        });
      } catch {
        // ignore
      }
    }

    const rsvpData = {
      name,
      attending,
      guestCount: attending === 'yes' ? parseInt(guestCount, 10) : 0,
      phone,
      note,
      timestamp: new Date().toISOString(),
    };

    // Save to Firebase Firestore
    saveRSVPToFirebase(rsvpData).catch(err => {
      console.error('Error saving RSVP to Firebase:', err);
    });

    // Save to localStorage
    try {
      localStorage.setItem('wedding_rsvp_status', JSON.stringify(rsvpData));
    } catch {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20 }}
            onClick={e => e.stopPropagation()}
            className={`relative w-full max-w-md ${
              isLight ? 'bg-white border-amber-500/40 text-neutral-900 shadow-2xl' : 'bg-black border-amber-500/40 text-white shadow-2xl'
            } border rounded-2xl p-6 sm:p-7 text-left my-8`}
          >
            {/* Close */}
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

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto mb-4 text-emerald-500">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className={`text-lg font-moul ${isLight ? 'text-amber-800' : 'text-amber-200'} mb-2`}>
                  {language === 'kh' ? 'សូមអរគុណ!' : 'Thank You!'}
                </h3>
                <p className={`text-sm ${isLight ? 'text-neutral-700' : 'text-neutral-300'} font-khmer mb-6 leading-relaxed`}>
                  {attending === 'yes'
                    ? language === 'kh'
                      ? `យើងខ្ញុំរីករាយណាស់ដែលទទួលបានការឆ្លើយតបចូលរួមពីលោកអ្នក (${name})!`
                      : `We are thrilled to welcome you (${name}) to our celebration!`
                    : language === 'kh'
                    ? `យើងខ្ញុំសូមអរគុណចំពោះការឆ្លើយតបជូនដំណឹងរបស់លោកអ្នក (${name})។`
                    : `We appreciate you letting us know. You will be missed!`}
                </p>

                <button
                  onClick={onClose}
                  className="py-2.5 px-6 rounded-xl font-moul text-xs text-amber-950 font-bold bg-amber-400 hover:bg-amber-300 transition-all shadow-md"
                >
                  {language === 'kh' ? 'បិទ' : 'Done'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className={`text-center pb-2 border-b ${isLight ? 'border-amber-500/30' : 'border-amber-500/20'}`}>
                  <span className={`text-[11px] uppercase font-bold tracking-widest ${isLight ? 'text-amber-700' : 'text-amber-400'} block mb-1`}>
                    RSVP CONFIRMATION
                  </span>
                  <h3 className={`text-base sm:text-lg font-moul ${isLight ? 'text-amber-900' : 'text-amber-200'}`}>
                    {language === 'kh' ? 'ការឆ្លើយតបវត្តមាន' : 'Will You Attend?'}
                  </h3>
                </div>

                {/* Guest Name */}
                <div>
                  <label className={`block text-xs font-semibold ${isLight ? 'text-amber-900' : 'text-amber-200/90'} font-khmer mb-1 flex items-center gap-1.5`}>
                    <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>{language === 'kh' ? 'ឈ្មោះភ្ញៀវកិត្តិយស' : 'Guest Name'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-khmer focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      isLight
                        ? 'bg-amber-50/40 border-amber-300 text-neutral-900 placeholder-neutral-400 focus:border-amber-500'
                        : 'bg-black/60 border-amber-500/30 text-amber-100 placeholder-neutral-500 focus:border-amber-400'
                    }`}
                  />
                </div>

                {/* Attendance Radio */}
                <div>
                  <label className={`block text-xs font-semibold ${isLight ? 'text-amber-900' : 'text-amber-200/90'} font-khmer mb-1.5`}>
                    {language === 'kh' ? 'ការចូលរួមរបស់អ្នក' : 'Attendance'}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setAttending('yes')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-khmer font-semibold border text-center transition-all ${
                        attending === 'yes'
                          ? 'bg-amber-400 text-amber-950 border-amber-400 font-bold shadow-md'
                          : isLight
                          ? 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-amber-400/50'
                          : 'bg-black/40 text-neutral-300 border-white/10 hover:border-amber-400/40'
                      }`}
                    >
                      {language === 'kh' ? 'ចូលរួមដោយរីករាយ' : 'Joyfully Attend'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttending('no')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-khmer font-semibold border text-center transition-all ${
                        attending === 'no'
                          ? 'bg-rose-600 text-white border-rose-500 font-bold shadow-md'
                          : isLight
                          ? 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-rose-400/50'
                          : 'bg-black/40 text-neutral-300 border-white/10 hover:border-rose-400/40'
                      }`}
                    >
                      {language === 'kh' ? 'មិនអាចចូលរួមបាន' : 'Regretfully Decline'}
                    </button>
                  </div>
                </div>

                {attending === 'yes' && (
                  <>
                    {/* Number of Attendees */}
                    <div>
                      <label className={`block text-xs font-semibold ${isLight ? 'text-amber-900' : 'text-amber-200/90'} font-khmer mb-1 flex items-center gap-1.5`}>
                        <Users className="w-3.5 h-3.5 text-amber-500" />
                        <span>{language === 'kh' ? 'ចំនួនអ្នកចូលរួម' : 'Number of Guests'}</span>
                      </label>
                      <select
                        value={guestCount}
                        onChange={e => setGuestCount(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-khmer focus:outline-none ${
                          isLight
                            ? 'bg-white border-amber-300 text-neutral-900 focus:border-amber-500'
                            : 'bg-black/60 border-amber-500/30 text-amber-100 focus:border-amber-400'
                        }`}
                      >
                        <option value="1">1 {language === 'kh' ? 'នាក់' : 'Guest'}</option>
                        <option value="2">2 {language === 'kh' ? 'នាក់ (ប្តីប្រពន្ធ/គូស្នេហ៍)' : 'Guests (Couple)'}</option>
                        <option value="3">3 {language === 'kh' ? 'នាក់' : 'Guests'}</option>
                        <option value="4">4 {language === 'kh' ? 'នាក់ (ក្រុមគ្រួសារ)' : 'Guests (Family)'}</option>
                        <option value="5">5+ {language === 'kh' ? 'នាក់' : 'Guests'}</option>
                      </select>
                    </div>

                    {/* Contact Phone / Telegram */}
                    <div>
                      <label className={`block text-xs font-semibold ${isLight ? 'text-amber-900' : 'text-amber-200/90'} font-khmer mb-1 flex items-center gap-1.5`}>
                        <Phone className="w-3.5 h-3.5 text-amber-500" />
                        <span>{language === 'kh' ? 'លេខទូរស័ព្ទ / Telegram' : 'Phone / Telegram'}</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="012 345 678"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${
                          isLight
                            ? 'bg-amber-50/40 border-amber-300 text-neutral-900 placeholder-neutral-400 focus:border-amber-500'
                            : 'bg-black/60 border-amber-500/30 text-amber-100 placeholder-neutral-500 focus:border-amber-400'
                        }`}
                      />
                    </div>
                  </>
                )}

                {/* Optional Note */}
                <div>
                  <label className={`block text-xs font-semibold ${isLight ? 'text-amber-900' : 'text-amber-200/90'} font-khmer mb-1 flex items-center gap-1.5`}>
                    <MessageSquareQuote className="w-3.5 h-3.5 text-amber-500" />
                    <span>{language === 'kh' ? 'ចំណាំបន្ថែម (ស្រេចចិត្ត)' : 'Note (Optional)'}</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder={language === 'kh' ? 'សារ ឬសំណូមពរផ្សេងៗ...' : 'Any dietary restrictions or message...'}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl border text-xs font-khmer focus:outline-none ${
                      isLight
                        ? 'bg-amber-50/40 border-amber-300 text-neutral-900 placeholder-neutral-400 focus:border-amber-500'
                        : 'bg-black/60 border-amber-500/30 text-amber-100 placeholder-neutral-500 focus:border-amber-400'
                    }`}
                  />
                </div>

                {/* Submit button */}
                <button
                  id="submit-rsvp-btn"
                  type="submit"
                  className="w-full py-3 px-5 rounded-xl font-moul text-xs sm:text-sm text-amber-950 font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 hover:from-amber-200 hover:to-amber-400 border border-amber-200 shadow-lg transition-all hover:scale-[1.01]"
                >
                  {language === 'kh' ? 'បញ្ជាក់ការចូលរួម' : 'Confirm RSVP'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
