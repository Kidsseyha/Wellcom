import { ThemeMode } from "./ThemeToggle";
import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquareHeart, Heart, Send, Sparkles, Trash2, ShieldCheck, Lock, X, Check, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_WISHES } from '../data/weddingData';
import { Language, WishMessage } from '../types';
import { getSavedGuests } from '../data/guests';
import {
  subscribeToWishes,
  addWishToFirebase,
  likeWishInFirebase,
  deleteWishInFirebase,
} from '../lib/firebaseServices';

interface WishesSectionProps {
  defaultGuestName: string;
  language: Language;
  primaryColor?: string;
  textColor?: string;
  theme?: ThemeMode;
  isAdmin?: boolean;
}

export default function WishesSection({
  defaultGuestName,
  language,
  primaryColor = '#f5b80f',
  textColor = '#f5b80f',
  theme = 'dark',
  isAdmin = false,
}: WishesSectionProps) {
  const [wishes, setWishes] = useState<WishMessage[]>(() => {
    try {
      const saved = localStorage.getItem('wedding_wishes_list');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_WISHES;
  });

  const [name, setName] = useState(defaultGuestName || '');
  const [relationship, setRelationship] = useState('មិត្តភក្តិ (Friend)');
  const [message, setMessage] = useState('');
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedGuestNames, setSavedGuestNames] = useState<string[]>([]);

  const [isPasscodeUnlocked, setIsPasscodeUnlocked] = useState(false);
  // Admin state & verification - strictly based on authenticated admin or admin passcode unlock
  const isLocalAdmin = Boolean(isAdmin) || isPasscodeUnlocked;

  const [confirmingWishId, setConfirmingWishId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [deleteToast, setDeleteToast] = useState<string | null>(null);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);
  const [floatingHearts, setFloatingHearts] = useState<
    Array<{
      id: number;
      left: number;
      size: number;
      delay: number;
      duration: number;
      color: string;
      sway: number;
      rotate: number;
    }>
  >([]);

  // Admin passcode modal
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Sync wishes in real-time from Firestore & REST
  useEffect(() => {
    const unsubscribe = subscribeToWishes((liveWishes) => {
      if (liveWishes && liveWishes.length > 0) {
        setWishes(liveWishes);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (defaultGuestName) {
      setName(defaultGuestName);
    }
  }, [defaultGuestName]);

  // Fetch list of honored guests for auto-suggestion
  useEffect(() => {
    try {
      const list = getSavedGuests();
      if (list && list.length > 0) {
        setSavedGuestNames(list.map(g => g.name).filter(Boolean));
      }
    } catch {
      // ignore
    }
  }, []);

  const triggerHeartCelebration = () => {
    // 1. Generate floating rising heart particles
    const colors = ['#f43f5e', '#ec4899', '#f59e0b', '#fb7185', '#e11d48', '#fda4af', '#f5b80f'];
    const hearts = Array.from({ length: 18 }, (_, idx) => ({
      id: Date.now() + idx,
      left: 10 + Math.random() * 80,
      size: 16 + Math.random() * 24,
      delay: Math.random() * 0.35,
      duration: 1.8 + Math.random() * 1.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      sway: (Math.random() - 0.5) * 60,
      rotate: (Math.random() - 0.5) * 50,
    }));
    setFloatingHearts(hearts);

    // 2. Set celebration feedback message
    setCelebrationMessage(
      language === 'kh'
        ? '❤️ អរគុណសម្រាប់សារជូនពរដ៏មានអត្ថន័យ!'
        : '❤️ Thank you for your warm wishes & love!'
    );

    // 3. Multi-stage celebratory confetti explosion
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.75 },
        colors: ['#f5b80f', '#f43f5e', '#ec4899', '#fbbf24', '#ff758f'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0.1, y: 0.8 },
          colors: ['#f5b80f', '#f43f5e', '#ec4899', '#fbbf24'],
        });
      }, 150);

      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 0.9, y: 0.8 },
          colors: ['#f5b80f', '#f43f5e', '#ec4899', '#fbbf24'],
        });
      }, 250);
    } catch {
      // ignore
    }

    // Cleanup after animation completes
    setTimeout(() => {
      setCelebrationMessage(null);
      setFloatingHearts([]);
    }, 4000);
  };

  const handleLike = async (id: string) => {
    if (likedIds[id]) return;

    setLikedIds(prev => ({ ...prev, [id]: true }));
    setWishes(prev =>
      prev.map(w => (w.id === id ? { ...w, likes: w.likes + 1 } : w))
    );

    // Sync like to Firestore & REST
    await likeWishInFirebase(id);
  };

  const handleClickDelete = (id: string) => {
    // If not verified as admin, open admin passcode modal
    if (!isLocalAdmin) {
      setPendingDeleteId(id);
      setPasscodeError('');
      setAdminPasscode('');
      setShowAdminModal(true);
      return;
    }

    // Toggle inline confirmation (safe in iframe, no window.confirm blockage)
    setConfirmingWishId(prev => (prev === id ? null : id));
  };

  const handleAdminVerify = (e: FormEvent) => {
    e.preventDefault();
    const clean = adminPasscode.trim().toLowerCase();
    if (
      clean === 'love2222' ||
      clean === 'seyha' ||
      clean === 'seyha2025' ||
      clean === '2025' ||
      clean === '1234'
    ) {
      setIsPasscodeUnlocked(true);
      try {
        localStorage.setItem('wedding_admin_override', 'true');
      } catch {
        // ignore
      }
      setShowAdminModal(false);
      setAdminPasscode('');
      setPasscodeError('');
      if (pendingDeleteId) {
        setConfirmingWishId(pendingDeleteId);
        setPendingDeleteId(null);
      }
    } else {
      setPasscodeError(
        language === 'kh'
          ? 'លេខសម្ងាត់មិនត្រឹមត្រូវ (Hint: love2222)'
          : 'Incorrect passcode. Hint: love2222'
      );
    }
  };

  const executeDelete = async (id: string) => {
    setIsDeletingId(id);
    try {
      // 1. Optimistic UI update
      setWishes(prev => {
        const filtered = prev.filter(w => w.id !== id);
        try {
          localStorage.setItem('wedding_wishes_list', JSON.stringify(filtered));
        } catch {
          // ignore
        }
        return filtered;
      });

      // 2. Server & Firestore sync
      await deleteWishInFirebase(id);

      setDeleteToast(
        language === 'kh'
          ? 'បានលុបសារជូនពរដោយជោគជ័យ'
          : 'Wish deleted successfully'
      );
      setTimeout(() => setDeleteToast(null), 3000);
    } catch (err) {
      console.error('Error deleting wish:', err);
    } finally {
      setIsDeletingId(null);
      setConfirmingWishId(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !name.trim()) return;

    setIsSubmitting(true);
    try {
      const newWish: Omit<WishMessage, 'id'> = {
        name: name.trim(),
        relationship: relationship.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
        likes: 1,
      };

      const savedWish = await addWishToFirebase(newWish);
      setWishes(prev => [savedWish, ...prev.filter(w => w.id !== savedWish.id)]);
      setMessage('');

      // Trigger heart animation and celebratory confetti
      triggerHeartCelebration();
    } catch (err) {
      console.error('Error adding wish:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="wishes-section" className="py-8 px-4 text-center relative">
      {/* Floating Heart Particles Animation Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        <AnimatePresence>
          {floatingHearts.map(heart => (
            <motion.div
              key={heart.id}
              initial={{
                opacity: 0,
                y: '80vh',
                x: `${heart.left}vw`,
                scale: 0.2,
                rotate: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: '-15vh',
                x: `calc(${heart.left}vw + ${heart.sway}px)`,
                scale: [0.2, 1.2, 1, 0.8],
                rotate: heart.rotate,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: heart.duration,
                delay: heart.delay,
                ease: 'easeOut',
              }}
              className="absolute"
            >
              <Heart
                className="fill-current drop-shadow-[0_2px_8px_rgba(244,63,94,0.5)]"
                style={{
                  color: heart.color,
                  width: `${heart.size}px`,
                  height: `${heart.size}px`,
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme === 'light' ? 'bg-amber-100/60 border-amber-300/50' : 'bg-amber-950/40 border-amber-500/30'} border text-xs font-khmer`}>
            <MessageSquareHeart className="w-3.5 h-3.5" style={{ color: primaryColor }} />
            <span style={{ color: primaryColor }}>{language === 'kh' ? 'ផ្ញើសារជូនពរឯកជន (Private)' : 'Private Blessings & Wishes'}</span>
          </div>

          {isLocalAdmin && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-khmer font-medium">
              <ShieldCheck className="w-3 h-3" />
              {language === 'kh' ? 'សិទ្ធិ Admin' : 'Admin Privileges Active'}
            </span>
          )}
        </div>

        <h2
          style={{ color: primaryColor }}
          className="text-xl font-moul mb-2"
        >
          {language === 'kh' ? 'សារជូនពរ' : 'SEND YOUR WISHES'}
        </h2>
        <p
          style={{ color: textColor }}
          className={`text-xs font-khmer mb-6 leading-relaxed ${theme === 'light' ? 'opacity-75' : 'opacity-85'}`}
        >
          {language === 'kh'
            ? 'សូមផ្ញើសារជូនពរដ៏មានអត្ថន័យដោយសម្ងាត់ជូនដល់គូស្វាមីភរិយាថ្មី'
            : 'Send your heartfelt blessing privately to the newlyweds.'}
        </p>

        {/* Wish Submission Success / Heart Celebration Toast */}
        <AnimatePresence>
          {celebrationMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className={`mb-4 inline-flex items-center gap-2.5 px-4 py-2 rounded-full border shadow-lg ${
                theme === 'light'
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-rose-950/80 border-rose-500/50 text-rose-200 ring-2 ring-rose-500/30'
              } text-xs font-khmer font-bold backdrop-blur-md`}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="text-rose-500"
              >
                <Heart className="w-4 h-4 fill-rose-500" />
              </motion.div>
              <span>{celebrationMessage}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Toast Notification */}
        <AnimatePresence>
          {deleteToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-khmer shadow-sm"
            >
              <Check className="w-3.5 h-3.5 text-rose-400" />
              <span>{deleteToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className={`p-4 rounded-2xl ${theme === 'light' ? 'bg-amber-50 border-amber-300 shadow-[0_4px_15px_rgba(0,0,0,0.05)]' : 'bg-black border-amber-500/30 shadow-lg'} border text-left mb-8 space-y-3`}>
          <div>
            <input
              type="text"
              required
              list="guest-names-list"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={language === 'kh' ? 'ឈ្មោះភ្ញៀវកិត្តិយស (Honored Guest Name)' : 'Honored Guest Name'}
              className={`w-full px-3 py-2.5 rounded-xl ${theme === 'light' ? 'bg-white border-amber-200 text-amber-950 placeholder:text-neutral-400 focus:border-amber-400 focus:ring-amber-400' : 'bg-black/60 border-amber-500/30 text-amber-100 placeholder:text-neutral-500 focus:border-amber-400 focus:ring-amber-400'} border text-xs font-khmer focus:outline-none focus:ring-1`}
            />
            {savedGuestNames.length > 0 && (
              <datalist id="guest-names-list">
                {savedGuestNames.map((gName, idx) => (
                  <option key={idx} value={gName} />
                ))}
              </datalist>
            )}
          </div>

          <div>
            <label className={`block text-xs font-khmer ${theme === 'light' ? 'text-amber-800' : 'text-amber-300'} mb-1`}>
              {language === 'kh' ? 'ត្រូវជា / Relationship:' : 'Relationship:'}
            </label>
            <select
              value={relationship}
              onChange={e => setRelationship(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl ${theme === 'light' ? 'bg-white border-amber-200 text-amber-950 focus:border-amber-400 focus:ring-amber-400' : 'bg-black/60 border-amber-500/30 text-amber-200 focus:border-amber-400 focus:ring-amber-400'} border text-xs font-khmer focus:outline-none focus:ring-1`}
            >
              <option value="មិត្តភក្តិ (Friend)">{language === 'kh' ? 'មិត្តភក្តិ (Friend)' : 'Friend'}</option>
              <option value="ក្រុមគ្រួសារ & សាច់ញាតិ (Family)">{language === 'kh' ? 'ក្រុមគ្រួសារ & សាច់ញាតិ (Family)' : 'Family'}</option>
              <option value="មិត្តរួមការងារ (Colleague)">{language === 'kh' ? 'មិត្តរួមការងារ (Colleague)' : 'Colleague'}</option>
              <option value="ភ្ញៀវកិត្តិយស (Guest)">{language === 'kh' ? 'ភ្ញៀវកិត្តិយស (Honored Guest)' : 'Honored Guest'}</option>
            </select>
          </div>

          <div>
            <label className={`block text-xs font-khmer ${theme === 'light' ? 'text-amber-800' : 'text-amber-300'} mb-1`}>
              {language === 'kh' ? 'សារជូនពរ / Blessing Message:' : 'Your Wishes:'}
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={language === 'kh' ? 'សូមជូនពរឱ្យអ្នកទាំងពីរមានសុភមង្គល...' : 'May your love grow stronger each and every day...'}
              className={`w-full px-3 py-2 rounded-xl ${theme === 'light' ? 'bg-white border-amber-200 text-amber-950 focus:border-amber-400 focus:ring-amber-400' : 'bg-black/60 border-amber-500/30 text-amber-100 focus:border-amber-400 focus:ring-amber-400'} border text-xs font-khmer focus:outline-none focus:ring-1 resize-none`}
            />
          </div>

          <motion.button
            id="send-wish-btn"
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-rose-300 to-amber-400 hover:from-amber-300 hover:via-rose-200 hover:to-amber-300 text-amber-950 font-khmer font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-950" />
                <span>{language === 'kh' ? 'កំពុងផ្ញើ...' : 'Sending...'}</span>
              </>
            ) : (
              <>
                <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600 animate-pulse" />
                <span>{language === 'kh' ? 'ផ្ញើសារជូនពរ' : 'Send Wishes'}</span>
                <Send className="w-3.5 h-3.5 text-amber-950" />
              </>
            )}
          </motion.button>
        </form>

        {/* Wishes List - Visible only to Admin as per user request */}
        {isLocalAdmin && (
          <div className="space-y-3 text-left animate-fadeIn">
            <div className={`flex items-center gap-2 mb-4 px-3 py-1.5 rounded-xl border ${theme === 'light' ? 'bg-amber-100/40 border-amber-300/50 text-amber-900' : 'bg-amber-950/20 border-amber-500/30 text-amber-300'} text-[10px] font-khmer font-bold`}>
              <Lock className="w-3 h-3" />
              <span>{language === 'kh' ? 'បញ្ជីសារជូនពរ (បង្ហាញតែ Admin ប៉ុណ្ណោះ)' : 'Guest Wishes List (Admin Only View)'}</span>
            </div>
            {wishes.map((w, idx) => (
              <motion.div
                key={w.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`p-4 rounded-xl ${theme === 'light' ? 'bg-amber-50/50 border-amber-200/60 shadow-sm' : 'bg-black border-amber-500/20 shadow'} border`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h4 className={`text-xs font-moul ${theme === 'light' ? 'text-amber-900' : 'text-amber-200'}`}>{w.name}</h4>
                    <span className={`text-[10px] ${theme === 'light' ? 'text-amber-700/80' : 'text-amber-400/80'} font-khmer block`}>{w.relationship}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {confirmingWishId === w.id ? (
                      <div className="flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/40 px-2 py-0.5 rounded-full animate-fadeIn shadow-xs">
                        <span className="text-[10px] font-khmer text-rose-500 dark:text-rose-300 font-semibold whitespace-nowrap">
                          {language === 'kh' ? 'លុបសារ?' : 'Delete?'}
                        </span>
                        <button
                          type="button"
                          onClick={() => executeDelete(w.id)}
                          disabled={isDeletingId === w.id}
                          className="px-2 py-0.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold cursor-pointer transition-colors shadow-xs flex items-center gap-1"
                        >
                          {isDeletingId === w.id ? (
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          ) : (
                            <Check className="w-2.5 h-2.5" />
                          )}
                          <span>{language === 'kh' ? 'លុប' : 'Yes'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingWishId(null)}
                          className="p-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors"
                          title={language === 'kh' ? 'បោះបង់' : 'Cancel'}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`delete-wish-btn-${w.id || idx}`}
                        type="button"
                        onClick={() => handleClickDelete(w.id)}
                        className={`group relative p-1.5 rounded-lg border transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-95 ${
                          theme === 'light'
                            ? 'bg-rose-50/90 border-rose-200 text-rose-600 hover:bg-rose-100 hover:border-rose-300 hover:shadow-xs'
                            : 'bg-rose-950/40 border-rose-500/30 text-rose-400 hover:bg-rose-900/60 hover:border-rose-400 hover:text-rose-200 hover:shadow-[0_0_10px_rgba(244,63,94,0.35)]'
                        }`}
                        title={language === 'kh' ? 'Admin: លុបសារជូនពរនេះ' : 'Admin: Delete this wish message'}
                        aria-label={language === 'kh' ? 'Admin: លុបសារជូនពរ' : 'Admin: Delete wish'}
                      >
                        <Trash2 className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6 text-rose-500 dark:text-rose-400" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleLike(w.id)}
                      className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border transition-all ${
                        likedIds[w.id]
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-500'
                          : theme === 'light' ? 'bg-black/5 border-black/10 text-neutral-500 hover:text-rose-500 hover:border-rose-500/30' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-rose-400 hover:border-rose-500/30'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${likedIds[w.id] ? (theme === 'light' ? 'fill-rose-500 text-rose-500' : 'fill-rose-400 text-rose-400') : ''}`} />
                      <span>{w.likes || 0}</span>
                    </button>
                  </div>
                </div>
                <p className={`text-xs ${theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'} font-khmer leading-relaxed`}>
                  {w.message}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Viewer Empty State - Placeholder if list is hidden */}
        {!isLocalAdmin && (
          <div className={`p-8 rounded-2xl border border-dashed flex flex-col items-center justify-center gap-3 ${theme === 'light' ? 'bg-amber-50/30 border-amber-200/50 text-amber-900/40' : 'bg-black/20 border-amber-500/20 text-amber-500/30'}`}>
            <Lock className="w-6 h-6 opacity-40" />
            <p className="text-[11px] font-khmer italic">
              {language === 'kh' ? 'សារជូនពរទាំងអស់ត្រូវបានរក្សាទុកជាឯកជនសម្រាប់តែម្ចាស់ដើមការប៉ុណ្ណោះ' : 'All messages are kept private for the host only.'}
            </p>
          </div>
        )}

        {/* Admin Verification Modal (if non-logged in admin clicks delete) */}
        <AnimatePresence>
          {showAdminModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`w-full max-w-sm p-5 rounded-2xl ${
                  theme === 'light' ? 'bg-white border-amber-300 shadow-xl' : 'bg-neutral-900 border-amber-500/30 shadow-2xl'
                } border text-left`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <h3 className={`text-sm font-moul ${theme === 'light' ? 'text-amber-950' : 'text-amber-300'}`}>
                      {language === 'kh' ? 'សិទ្ធិអ្នកគ្រប់គ្រង (Admin)' : 'Admin Verification'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(false)}
                    className="p-1 rounded-full text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className={`text-xs font-khmer mb-4 ${theme === 'light' ? 'text-neutral-600' : 'text-neutral-300'}`}>
                  {language === 'kh'
                    ? 'មានតែអ្នកគ្រប់គ្រង (Admin) ទើបអាចលុបសារជូនពរបាន។ សូមបញ្ចូលលេខកូដសម្ងាត់ Admin (love2222)៖'
                    : 'Only Admins can delete guest wishes. Please enter Admin Passcode (love2222):'}
                </p>

                <form onSubmit={handleAdminVerify} className="space-y-3">
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="password"
                      autoFocus
                      required
                      value={adminPasscode}
                      onChange={e => setAdminPasscode(e.target.value)}
                      placeholder="Admin passcode (e.g. love2222)"
                      className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono ${
                        theme === 'light'
                          ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-amber-500 focus:ring-amber-500'
                          : 'bg-black/60 border-neutral-700 text-neutral-100 focus:border-amber-400 focus:ring-amber-400'
                      } border focus:outline-none focus:ring-1`}
                    />
                  </div>

                  {passcodeError && (
                    <p className="text-[11px] text-rose-500 font-khmer">
                      {passcodeError}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 font-khmer font-bold text-xs shadow-sm hover:brightness-105 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{language === 'kh' ? 'ផ្ទៀងផ្ទាត់ និងបន្ត' : 'Verify & Proceed'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAdminModal(false)}
                      className="py-2 px-3 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-khmer hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer"
                    >
                      {language === 'kh' ? 'បោះបង់' : 'Cancel'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
