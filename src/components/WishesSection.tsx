import { ThemeMode } from "./ThemeToggle";
import { useState, useEffect, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { MessageSquareHeart, Heart, Send, Sparkles, Trash2 } from 'lucide-react';
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

  // Sync wishes in real-time from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToWishes((liveWishes) => {
      setWishes(liveWishes);
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

  const handleLike = async (id: string) => {
    if (likedIds[id]) return;

    setLikedIds(prev => ({ ...prev, [id]: true }));
    setWishes(prev =>
      prev.map(w => (w.id === id ? { ...w, likes: w.likes + 1 } : w))
    );

    // Sync like to Firestore
    await likeWishInFirebase(id);
  };

  const handleDelete = async (id: string) => {
    const confirmMessage = language === 'kh'
      ? 'តើអ្នកប្រាកដជាចង់លុបសារជូនពរនេះមែនទេ?'
      : 'Are you sure you want to delete this wish message?';
    if (window.confirm(confirmMessage)) {
      try {
        setWishes(prev => {
          const filtered = prev.filter(w => w.id !== id);
          try {
            localStorage.setItem('wedding_wishes_list', JSON.stringify(filtered));
          } catch {
            // ignore
          }
          return filtered;
        });
        await deleteWishInFirebase(id);
      } catch (err) {
        console.error('Error deleting wish:', err);
      }
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

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#f5b80f', '#f43f5e', '#fbbf24'],
        });
      } catch {
        // ignore
      }
    } catch (err) {
      console.error('Error adding wish:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="wishes-section" className="py-8 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme === 'light' ? 'bg-amber-100/60 border-amber-300/50' : 'bg-amber-950/40 border-amber-500/30'} border text-xs font-khmer mb-2`}>
          <MessageSquareHeart className="w-3.5 h-3.5" style={{ color: primaryColor }} />
          <span style={{ color: primaryColor }}>{language === 'kh' ? 'សៀវភៅជូនពរឌីជីថល (Firebase Live)' : 'Digital Guestbook (Firebase Live)'}</span>
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
            ? 'សូមផ្ញើសារជូនពរដ៏មានអត្ថន័យដល់គូស្វាមីភរិយាថ្មី'
            : 'Leave your warm blessings and best wishes for the newlyweds.'}
        </p>

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

          <button
            id="send-wish-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-amber-950 font-khmer font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-amber-950" />
            <span>{isSubmitting ? (language === 'kh' ? 'កំពុងផ្ញើ...' : 'Sending...') : (language === 'kh' ? 'ផ្ញើសារជូនពរ' : 'Send Wishes')}</span>
          </button>
        </form>

        {/* Wishes List */}
        <div className="space-y-3 text-left">
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
                  <button
                    type="button"
                    onClick={() => handleDelete(w.id)}
                    className="p-1.5 rounded-full hover:bg-rose-500/10 text-rose-500/80 hover:text-rose-500 transition-colors cursor-pointer"
                    title={language === 'kh' ? 'លុបសារជូនពរ' : 'Delete Wish'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
      </motion.div>
    </section>
  );
}
