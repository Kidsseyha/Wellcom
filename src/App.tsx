/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Calendar,
  MapPin,
  ChevronDown,
  Sparkles,
  Share2,
  MailCheck,
  RotateCcw,
  ExternalLink,
  Edit3,
  ImagePlus,
  UserPlus,
  LayoutTemplate,
  LogOut,
  LogIn,
  KeyRound,
  X,
} from 'lucide-react';
import { WEDDING_EVENT } from './data/weddingData';
import { Language, WeddingEvent } from './types';
import { formatKhmerDate, formatEnDate } from './utils/khmerHelpers';
import { testFirestoreConnection, auth } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, User } from 'firebase/auth';
import { saveEventToFirebase, fetchEventFromFirebase } from './lib/firebaseServices';
import AudioPlayer from './components/AudioPlayer';
import LanguageToggle from './components/LanguageToggle';
import ThemeToggle, { ThemeMode } from './components/ThemeToggle';
import EnvelopeModal from './components/EnvelopeModal';
import CountdownSection from './components/CountdownSection';
import ScheduleSection from './components/ScheduleSection';
import LocationSection from './components/LocationSection';
import GallerySection from './components/GallerySection';
import GiftKHQRSection from './components/GiftKHQRSection';
import WishesSection from './components/WishesSection';
import RSVPModal from './components/RSVPModal';
import ShareInvitationModal from './components/ShareInvitationModal';
import EventEditorModal from './components/EventEditorModal';
import AddGuestModal from './components/AddGuestModal';
import RoyalGoldRibbonBanner from './components/RoyalGoldRibbonBanner';
export default function App() {
  const [language, setLanguage] = useState<Language>('kh');
  const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(false);
  const [showEnvelopeModal, setShowEnvelopeModal] = useState(true);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('wedding_theme') as ThemeMode) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('wedding_theme', theme);
  }, [theme]);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [localAdminOverride, setLocalAdminOverride] = useState<boolean>(() => {
    return localStorage.getItem('wedding_admin_override') === 'true';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          if (result.user.email === 'yoeurn.seyha@diu.edu.kh') {
            setLocalAdminOverride(true);
            localStorage.setItem('wedding_admin_override', 'true');
          } else {
            alert('មានតែម្ចាស់កម្មវិធីទើបអាចកែប្រែបាន។ / Only the owner can edit.');
            auth.signOut();
          }
        }
      })
      .catch((err) => {
        console.warn('Redirect result check:', err);
      });
    return () => unsubscribe();
  }, []);

  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  const handleAdminLogin = (onSuccess?: () => void) => {
    if (onSuccess) setPendingCallback(() => onSuccess);
    setShowAdminLoginModal(true);
  };

  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPasscode, setSignupPasscode] = useState('');
  const [signupMessage, setSignupMessage] = useState('');

  const handleSignupSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPasscode.trim()) {
      setSignupMessage(language === 'kh' ? 'សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់' : 'Please fill in all fields');
      return;
    }
    const newUser = { name: signupName, email: signupEmail, passcode: signupPasscode, createdAt: new Date().toISOString() };
    const existingUsers = JSON.parse(localStorage.getItem('wedding_registered_users') || '[]');
    existingUsers.push(newUser);
    localStorage.setItem('wedding_registered_users', JSON.stringify(existingUsers));

    setLocalAdminOverride(true);
    localStorage.setItem('wedding_admin_override', 'true');
    setShowAdminLoginModal(false);
    setSignupName('');
    setSignupEmail('');
    setSignupPasscode('');
    setSignupMessage('');
    alert(language === 'kh' ? 'ចុះឈ្មោះគណនីថ្មីបានជោគជ័យ! Account Created Successfully!' : 'Sign up successful! Welcome to the app.');
    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }
  };

  const handlePasscodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      adminPasscode === 'love2222' ||
      adminPasscode === 'seyha2025' ||
      adminPasscode === 'seyha' ||
      adminPasscode === '2025' ||
      adminPasscode === '1234'
    ) {
      setLocalAdminOverride(true);
      localStorage.setItem('wedding_admin_override', 'true');
      setShowAdminLoginModal(false);
      setAdminPasscode('');
      setPasscodeError('');
      alert('Admin login successful!');
      if (pendingCallback) {
        pendingCallback();
        setPendingCallback(null);
      }
    } else {
      setPasscodeError('Incorrect passcode. Try love2222');
    }
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleAuthError, setGoogleAuthError] = useState('');

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setGoogleAuthError('');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        setLocalAdminOverride(true);
        localStorage.setItem('wedding_admin_override', 'true');
        setShowAdminLoginModal(false);
        if (pendingCallback) {
          pendingCallback();
          setPendingCallback(null);
        }
      }
    } catch (popupErr: any) {
      console.warn('Popup login notice, trying fallback / error:', popupErr);
      if (popupErr.code === 'auth/popup-closed-by-user') {
        setGoogleAuthError('ការចូលត្រូវបានបោះបង់ (Sign-in popup closed).');
      } else if (popupErr.code === 'auth/unauthorized-domain') {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectErr: any) {
          setGoogleAuthError('Domain នេះមិនទាន់បាន add ក្នុង Firebase Console ទេ។ សូមប្រើលេខសម្ងាត់ love2222 ខាងលើ។');
        }
      } else {
        setGoogleAuthError(popupErr.message || 'មានបញ្ហាក្នុងការចូលតាម Google');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const [isFromShareLink, setIsFromShareLink] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return Boolean(params.get('name') || params.get('guest') || params.get('share'));
    }
    return false;
  });

  const isAdmin = (authUser?.email === 'yoeurn.seyha@diu.edu.kh') || localAdminOverride;
  const isViewer = !isAdmin || isFromShareLink;

  const handleOpenEditor = () => {
    if (isAdmin) {
      setShowEditorModal(true);
    } else {
      handleAdminLogin(() => setShowEditorModal(true));
    }
  };

  const handleOpenAddGuest = () => {
    if (isAdmin) {
      setShowAddGuestModal(true);
    } else {
      handleAdminLogin(() => setShowAddGuestModal(true));
    }
  };

  // Load custom event data from localStorage or default
  const [event, setEvent] = useState<WeddingEvent>(() => {
    try {
      const stored = localStorage.getItem('wedding_custom_event_data');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load stored event:', e);
    }
    return WEDDING_EVENT;
  });

  // Read guest name and event ID from URL query parameters, and fetch latest event from server
  const [guestName, setGuestName] = useState('Your Name');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const iParam = params.get('i');
      const nameParam = params.get('name');
      const guestParam = params.get('guest');
      const toParam = params.get('to');
      const idParam = params.get('id') || 'cmgrawhnk0003le0434762j7n';

      const foundGuest = iParam || guestParam || nameParam || toParam;
      if (foundGuest) {
        setGuestName(foundGuest);
        setIsFromShareLink(true);
        // Update document title for personalized browser tab and share
        document.title = `អាពាហ៍ពិពាហ៍ ម៉ាឡេ & វល្ខ័ក - សូមគោរពអញ្ជើញ ${foundGuest}`;
      } else {
        setGuestName('Your Name');
        document.title = 'អាពាហ៍ពិពាហ៍ ម៉ាឡេ & វល្ខ័ក';
      }

      // Check if URL contains #template hash
      const checkHash = () => {
        if (window.location.hash === '#template') {
          setShowEnvelopeModal(false);
          setHasOpenedEnvelope(true);
          setShowEditorModal(true);
        }
      };
      checkHash();
      window.addEventListener('hashchange', checkHash);

      // Test Firestore connection on boot
      testFirestoreConnection();

      // Fetch latest synced event data from Firebase Firestore & server
      const fetchServerData = async () => {
        try {
          const fbEvent = await fetchEventFromFirebase(idParam);
          if (fbEvent) {
            setEvent(fbEvent);
            try {
              localStorage.setItem('wedding_custom_event_data', JSON.stringify(fbEvent));
            } catch (e) {
              // ignore
            }
            return;
          }
        } catch (e) {
          console.warn('Firebase event fetch fallback to server:', e);
        }

        try {
          const res = await fetch(`/api/event?id=${encodeURIComponent(idParam)}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.success && data.event) {
              setEvent(data.event);
              try {
                localStorage.setItem('wedding_custom_event_data', JSON.stringify(data.event));
              } catch (e) {
                // Ignore storage quota error if full
              }
            }
          }
        } catch (err) {
          console.warn('Could not fetch server event, using client cached data:', err);
        }
      };

      fetchServerData();

      return () => {
        window.removeEventListener('hashchange', checkHash);
      };
    }
  }, []);

  const config = event.config;
  const textContent = language === 'kh' ? config.invitation_kh : config.invitation_en;

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'kh' ? 'en' : 'kh'));
  };

  const handleEnvelopeOpen = () => {
    setHasOpenedEnvelope(true);
    setShowEnvelopeModal(false);

    // Automatic smooth scroll up & down through the wedding invitation sections
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Start gentle upward/downward reading scroll animation
      let currentPosition = 0;
      const targetPosition = Math.min(
        document.documentElement.scrollHeight - window.innerHeight,
        document.body.scrollHeight
      );

      if (targetPosition > 200) {
        let isUserInteracting = false;
        const stopAutoScroll = () => {
          isUserInteracting = true;
          window.removeEventListener('wheel', stopAutoScroll);
          window.removeEventListener('touchstart', stopAutoScroll);
          window.removeEventListener('keydown', stopAutoScroll);
        };

        window.addEventListener('wheel', stopAutoScroll, { passive: true });
        window.addEventListener('touchstart', stopAutoScroll, { passive: true });
        window.addEventListener('keydown', stopAutoScroll, { passive: true });

        let lastTimestamp = 0;
        const pixelsPerSecond = 38; // Ultra smooth, relaxed slow reading pace (approx 0.6px per frame at 60fps)

        const step = (timestamp: number) => {
          if (isUserInteracting) return;
          if (!lastTimestamp) lastTimestamp = timestamp;
          const delta = (timestamp - lastTimestamp) / 1000;
          lastTimestamp = timestamp;

          currentPosition += pixelsPerSecond * delta;
          window.scrollTo(0, currentPosition);
          if (currentPosition < targetPosition) {
            requestAnimationFrame(step);
          } else {
            stopAutoScroll();
          }
        };

        // Delay slightly for initial hero rendering
        setTimeout(() => {
          requestAnimationFrame(step);
        }, 1500);
      }
    }, 100);
  };

  const handleSaveEvent = async (updatedEvent: WeddingEvent) => {
    setEvent(updatedEvent);
    // 1. Instant local cache save
    try {
      localStorage.setItem('wedding_custom_event_data', JSON.stringify(updatedEvent));
    } catch (e) {
      console.warn('Failed to save local event data:', e);
    }

    // 2. Firebase Firestore Database Sync
    saveEventToFirebase(updatedEvent).catch(err => {
      console.warn('Firebase save fallback:', err);
    });

    // 3. Server API Sync so anyone who opens the shared URL sees all updates
    try {
      const response = await fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });
      if (!response.ok) {
        console.error('Server responded with error:', response.status);
      }
    } catch (err) {
      console.error('Failed to sync event with server:', err);
    }
  };

  const handleResetEvent = async () => {
    setEvent(WEDDING_EVENT);
    try {
      localStorage.removeItem('wedding_custom_event_data');
      await fetch('/api/event/reset', { method: 'POST' });
    } catch (e) {
      console.error('Failed to reset event data:', e);
    }
  };

  const handleUpdateEnvelopeHeaderImage = (url: string) => {
    const updatedEvent = {
      ...event,
      config: {
        ...event.config,
        envelope_header_image: url,
      },
    };
    handleSaveEvent(updatedEvent);
  };

  // Gallery Photos
  const photosList =
    config.galleryPhotos && config.galleryPhotos.length > 0
      ? config.galleryPhotos
      : [
          config.photo_gallary.photo1,
          config.photo_gallary.photo2,
          config.photo_gallary.photo3,
          config.photo_gallary.photo4,
        ].filter(Boolean);

  const rootBgColor = theme === 'light' ? '#f4f1ea' : theme === 'gray' ? '#1b1e25' : '#141210';
  const rootTextColor = theme === 'light' ? 'text-neutral-900' : theme === 'gray' ? 'text-slate-100' : 'text-[#e5e0d8]';
  const mainCardBgClass = theme === 'light' ? 'bg-[#faf8f5] text-neutral-900 border-amber-500/30' : theme === 'gray' ? 'bg-black text-slate-100 border-slate-700/50' : 'bg-black text-[#e5e0d8] border-amber-500/20';

  return (
    <div
      data-theme={theme}
      style={{
        backgroundColor: rootBgColor,
        backgroundImage: (config.main_background || config.cover_background || config.event_location)
          ? `url(${config.main_background || config.cover_background || config.event_location})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
      className={`min-h-screen ${rootTextColor} flex justify-center selection:bg-amber-400 selection:text-amber-950 font-khmer relative`}
    >
      {/* Background backdrop blur / shade if main_background is set */}
      {(config.main_background || config.cover_background || config.event_location) && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-[1px] pointer-events-none z-0" />
      )}

      {/* Royal Opening Envelope Modal */}
      <EnvelopeModal
        isOpen={showEnvelopeModal}
        onOpen={handleEnvelopeOpen}
        guestName={guestName}
        onUpdateGuestName={newName => setGuestName(newName)}
        onOpenAddGuestModal={handleOpenAddGuest}
        groom={event.groom}
        bride={event.bride}
        language={language}
        isAdmin={!isViewer}
        coverBackground={config.cover_background || config.main_background || config.event_location}
        primaryColor={config.primaryColor || '#f5b80f'}
        textColor={config.textColor || '#f5b80f'}
        envelopeFrame={config.envelope_frame}
        envelopeHeaderImage={config.envelope_header_image}
        onUpdateEnvelopeHeaderImage={handleUpdateEnvelopeHeaderImage}
      />

      {/* Floating Top Left Controls: Language & Theme */}
      <div className="fixed top-4 left-4 z-50 flex flex-wrap items-center gap-2">
        <LanguageToggle currentLanguage={language} onToggle={toggleLanguage} />
        <ThemeToggle currentTheme={theme} onChangeTheme={setTheme} language={language} />
      </div>

      {/* Floating Top Right Controls: Music Player, Share & Edit Button */}
      <AudioPlayer
        audioUrl={config.background_music}
        hasOpenedEnvelope={hasOpenedEnvelope}
        language={language}
      />

      <div className="fixed top-16 right-4 z-40 flex flex-col gap-2">
        {/* Admin and Auth Controls */}
        {isAdmin ? (
          <>
            {/* Edit Event / Template Button */}
            <motion.button
              id="open-editor-btn"
              onClick={handleOpenEditor}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="group relative flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 rounded-full border border-amber-400/60 bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-amber-950 font-bold shadow-xl backdrop-blur-md hover:from-amber-400 hover:to-amber-500 transition-all ring-2 ring-amber-400/30"
              title={language === 'kh' ? 'គម្រូធៀប / កែសម្រួលព័ត៌មាន & រូបភាព' : 'Template Editor / Edit Info & Images'}
            >
              <LayoutTemplate className="w-4 h-4 text-amber-950" />
              <span className="hidden sm:inline text-[14px] font-khmer font-bold">
                {language === 'kh' ? 'គម្រូធៀប' : 'Template'}
              </span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5" title="Server Synced">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-[#141210]"></span>
              </span>
            </motion.button>

            {/* Add Guest Button */}
            <motion.button
              id="add-guest-btn"
              onClick={handleOpenAddGuest}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="group relative flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 rounded-full border border-amber-400/60 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 font-bold shadow-xl backdrop-blur-md hover:from-amber-300 hover:to-amber-200 transition-all ring-2 ring-amber-400/30"
              title={language === 'kh' ? 'បន្ថែមឈ្មោះភ្ញៀវលើលិខិតអញ្ជើញ' : 'Add Guest'}
            >
              <UserPlus className="w-4 h-4 text-amber-950" />
              <span className="hidden sm:inline font-khmer font-bold text-[14px]">
                {language === 'kh' ? 'បន្ថែមភ្ញៀវ' : 'Add Guest'}
              </span>
            </motion.button>

            {/* Share Button - Only visible for logged-in Admin */}
            <motion.button
              id="share-btn"
              onClick={() => setShowShareModal(true)}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.94 }}
              className="group relative flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 rounded-full border border-amber-400/70 bg-gradient-to-br from-black/95 via-black/95 to-black/95 text-amber-300 shadow-[0_4px_20px_rgba(245,158,11,0.25)] backdrop-blur-md hover:border-amber-300 hover:text-amber-100 hover:shadow-[0_4px_25px_rgba(245,158,11,0.45)] transition-all ring-1 ring-amber-400/40"
              title={language === 'kh' ? 'ចែករំលែកលិខិតអញ្ជើញ / Share Invitation' : 'Share Invitation'}
            >
              <div className="p-1 rounded-full bg-amber-400/15 group-hover:bg-amber-400/30 transition-colors">
                <Share2 className="w-3.5 h-3.5 text-amber-300 group-hover:text-amber-200 transition-colors" />
              </div>
              <span className="hidden sm:inline text-[14px] font-khmer font-bold text-amber-200 group-hover:text-white transition-colors">
                {language === 'kh' ? 'ចែករំលែក' : 'Share'}
              </span>
            </motion.button>

            {/* Logout Button */}
            <motion.button
              onClick={() => {
                setLocalAdminOverride(false);
                localStorage.removeItem('wedding_admin_override');
                auth.signOut();
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="group relative flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 rounded-full border border-red-500/50 bg-gradient-to-br from-black/95 via-black/95 to-black/95 text-red-400 shadow-[0_4px_18px_rgba(0,0,0,0.5)] backdrop-blur-md hover:border-red-400 hover:text-red-300 transition-all ring-1 ring-red-500/20"
              title={language === 'kh' ? 'ចាកចេញ / Logout' : 'Logout'}
            >
              <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300" />
              <span className="hidden sm:inline text-[14px] font-khmer font-bold transition-colors">
                {language === 'kh' ? 'ចាកចេញ' : 'Logout'}
              </span>
            </motion.button>
          </>
        ) : !isFromShareLink ? (
          /* Login Button - Only visible if not admin and not a guest viewing a shared link */
          <motion.button
            type="button"
            onClick={() => handleAdminLogin()}
            onTap={() => handleAdminLogin()}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            style={{ cursor: 'pointer', pointerEvents: 'auto' }}
            className="group relative z-50 flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 rounded-full border border-emerald-500/50 bg-gradient-to-br from-black/95 via-[#0e1611]/95 to-[#0d1c14]/95 text-emerald-400 shadow-[0_4px_18px_rgba(0,0,0,0.5)] backdrop-blur-md hover:border-emerald-400 hover:text-emerald-300 transition-all ring-1 ring-emerald-500/20"
            title={language === 'kh' ? 'ចូលគណនី / Login' : 'Login'}
          >
            <LogIn className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
            <span className="hidden sm:inline text-[14px] font-khmer font-bold transition-colors">
              {language === 'kh' ? 'ចូលគណនី' : 'Login'}
            </span>
          </motion.button>
        ) : null}

        {/* Replay Envelope */}
        <motion.button
          id="replay-envelope-btn"
          onClick={() => {
            window.location.reload();
          }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          className="group relative flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 rounded-full border border-amber-500/50 bg-gradient-to-br from-black/95 via-black/95 to-black/95 text-amber-200 shadow-[0_4px_18px_rgba(0,0,0,0.5)] backdrop-blur-md hover:border-amber-400 hover:text-amber-100 hover:shadow-[0_4px_22px_rgba(245,158,11,0.35)] transition-all ring-1 ring-amber-500/20"
          title={language === 'kh' ? 'មើលសំបុត្រសារជាថ្មី / View Royal Envelope' : 'View Royal Envelope'}
        >
          <div className="p-1 rounded-full bg-amber-500/15 group-hover:bg-amber-400/25 transition-colors">
            <RotateCcw className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-[-45deg] group-hover:text-amber-200 transition-all duration-300" />
          </div>
          <span className="hidden sm:inline text-[14px] font-khmer font-medium text-neutral-300 group-hover:text-amber-100 transition-colors">
            {language === 'kh' ? 'ធ្វើឡើងវិញ' : 'Replay'}
          </span>
        </motion.button>

        {/* Admin Quick Return Toggle when testing shared link */}
        {isAdmin && isFromShareLink && (
          <motion.button
            onClick={() => {
              if (typeof window !== 'undefined') {
                const url = new URL(window.location.origin + window.location.pathname);
                window.history.replaceState({}, '', url.toString());
                setIsFromShareLink(false);
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full border border-amber-400/40 bg-black/85 text-amber-300 text-xs font-khmer shadow-lg backdrop-blur-md flex items-center gap-1.5"
            title={language === 'kh' ? 'ត្រឡប់ទៅផ្ទាំង Admin / Return to Admin Mode' : 'Return to Admin Mode'}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs">{language === 'kh' ? 'ត្រឡប់ទៅ Admin' : 'Back to Admin'}</span>
          </motion.button>
        )}
      </div>

      {/* Main Single Mobile-Optimized Invitation Card Container */}
      <main
        style={{
          backgroundImage: config.main_background ? `url(${config.main_background})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
        className={`w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl ${mainCardBgClass} shadow-2xl relative border-x overflow-hidden pb-24 transition-all duration-300`}
      >
        {/* Full-height subtle darkening & texture overlay for crisp legibility */}
        {config.main_background && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 pointer-events-none z-0" />
        )}



        {/* HERO SECTION WITH AUTHENTIC PLANESSENTIAL BACKGROUND & GRADIENT MASK */}
        <header className="relative w-full overflow-hidden text-center z-10">
          {/* Cover Background Wallpaper */}
          <div
            className="absolute inset-0 bg-cover bg-top opacity-65"
            style={{ backgroundImage: `url(${config.cover_background || config.main_background})` }}
          />

          {/* Golden Pattern Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />

          {/* Couple Main Pre-Wedding Photo with Artistic Arch & Gradient Mask */}
          <div className="relative pt-6 pb-4 px-4 sm:px-8 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className={`relative w-[280px] sm:w-[340px] md:w-[400px] aspect-[4/3] rounded-3xl overflow-hidden border-[5px] border-amber-400 shadow-[0_12px_40px_rgba(245,158,11,0.3)] mb-5 bg-neutral-900 group ${!isViewer ? 'cursor-pointer' : ''}`}
              onClick={() => {
                if (!isViewer) handleOpenEditor();
              }}
              title={!isViewer ? "ចុចដើម្បីប្តូររូបថតគូស្នេហ៍ / Click to change photo" : undefined}
            >
              <img
                src={event.image || config.main_background}
                alt={`${event.groom} & ${event.bride}`}
                className={`w-full h-full object-cover object-center ${!isViewer ? 'group-hover:scale-105' : ''} transition-transform duration-500`}
              />
              {/* Soft bottom edge glow */}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 to-transparent" />

              {/* Hover overlay hint */}
              {!isViewer && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="px-3 py-1.5 rounded-full bg-amber-400 text-amber-950 font-khmer text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <ImagePlus className="w-3.5 h-3.5" />
                    <span>ប្តូររូបភាព</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Title: សិរីមង្គលអាពាហ៍ពិពាហ៍ */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 mb-2"
            >
              <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-amber-300/90 font-bold block mb-2">
                {language === 'kh' ? 'មង្គលការ' : 'WEDDING CELEBRATION'}
              </span>
              <h1
                style={{ color: config.primaryColor || '#f5b80f' }}
                className="text-2xl sm:text-3xl md:text-4xl font-moul drop-shadow-md py-1.5 leading-normal [-webkit-text-stroke:0.5px_white]"
              >
                {textContent.main_title}
              </h1>
            </motion.div>

            {/* Couple Names */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 mb-4 flex flex-col items-center cursor-pointer group"
              onClick={handleOpenEditor}
              title="ចុចដើម្បីកែឈ្មោះ / Click to edit names"
            >
              <div
                style={{ color: config.primaryColor || '#f5b80f' }}
                className="flex items-center gap-3 sm:gap-4 text-xl sm:text-2xl md:text-3xl font-moul group-hover:brightness-110 transition-all tracking-wide"
              >
                <span className="[-webkit-text-stroke:0.5px_white]">{event.groom}</span>
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400 animate-pulse-gold inline-block mx-1.5" />
                <span className="[-webkit-text-stroke:0.5px_white]">{event.bride}</span>
              </div>
              {language === 'en' && (
                <p
                  style={{ color: config.textColor || '#f5b80f' }}
                  className="text-sm sm:text-base font-norican mt-2 tracking-wider"
                >
                  {event.groomEn} & {event.brideEn}
                </p>
              )}
            </motion.div>

            {/* Personalized Guest Badge / Royal Gold Ribbon Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative my-8 sm:my-10 w-full max-w-md sm:max-w-lg md:max-w-xl cursor-pointer group px-2"
              onClick={() => setShowShareModal(true)}
              title="ចុចដើម្បីប្តូរឈ្មោះភ្ញៀវ / Tap to personalize"
            >
              <RoyalGoldRibbonBanner className="group-hover:scale-[1.02] transition-transform duration-300">
                <span className="block text-xs sm:text-sm font-khmer font-medium text-[#78350f] mb-1.5 tracking-wide">
                  {textContent.subtitle}
                </span>
                <div className="text-xl sm:text-2xl font-moul tracking-wide text-[#582607] flex items-center justify-center gap-2 drop-shadow-sm">
                  <span>
                    {guestName && guestName !== 'Your Name'
                      ? guestName
                      : language === 'kh'
                        ? 'ភ្ញៀវកិត្តិយស'
                        : 'Honored Guest'}
                  </span>
                  <Sparkles className="w-4 h-4 text-[#b38118] opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </div>
              </RoyalGoldRibbonBanner>
            </motion.div>

            {/* Date & Location Summary Chips */}
            <div
              style={{ color: config.textColor || '#f5b80f' }}
              className="space-y-3.5 text-xs sm:text-sm font-khmer my-4"
            >
              <div
                id="header-date-chip"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-black/90 via-[#1c1608]/95 to-black/90 border border-amber-400/60 shadow-[0_6px_25px_rgba(245,184,15,0.3)] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-amber-300 ring-1 ring-amber-400/25 group"
              >
                <div className="p-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 shadow-inner group-hover:scale-110 transition-transform">
                  <Calendar className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <span className="tracking-wide font-medium text-amber-100 drop-shadow-sm text-xs sm:text-sm">
                    {(() => {
                      const day2Shift = event.schedules?.[0]?.shifts?.[1];
                      if (day2Shift?.date) {
                        return language === 'kh'
                          ? formatKhmerDate(day2Shift.date)
                          : formatEnDate(day2Shift.date);
                      }
                      return textContent.date_time;
                    })()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 px-4 py-1.5 max-w-md mx-auto text-center opacity-90 leading-relaxed">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === 'kh' ? event.location : (event.locationEn || event.location)}</span>
              </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="mt-10 mb-2 flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
              <span className="text-xs font-khmer text-amber-300 tracking-wider">
                {language === 'kh' ? 'សូមអូសចុះក្រោម' : 'Scroll down'}
              </span>
              <ChevronDown className="w-4 h-4 text-amber-400 animate-bounce" />
            </div>
          </div>
        </header>

        {/* SECTION: FORMAL INVITATION MESSAGE */}
        <section id="invitation-text-section" className="relative z-10 py-12 px-6 sm:px-10 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-10 rounded-3xl bg-amber-950/30 border border-amber-500/30 backdrop-blur-sm shadow-2xl relative"
          >
            {/* Heart Crest */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center mx-auto mb-5 shadow-lg text-amber-950">
              <Heart className="w-7 h-7 fill-amber-950" />
            </div>

            <h2
              style={{ color: config.primaryColor || '#f5b80f' }}
              className="text-lg sm:text-xl md:text-2xl font-moul mb-4 tracking-wide"
            >
              {textContent.invitation_title}
            </h2>

            <p
              style={{ color: config.textColor || '#f5b80f' }}
              className="text-sm sm:text-base font-khmer leading-loose mb-6 max-w-2xl mx-auto opacity-95"
            >
              {textContent.invitation_message}
            </p>

            <div className="flex items-center justify-center">
              <img
                src="https://focuz-staging-space.sgp1.digitaloceanspaces.com/plan-essential/template/free/template-1/underline-kbach-2.png"
                alt=""
                className="w-44 opacity-80"
              />
            </div>
          </motion.div>
        </section>

        {/* SECTION: LIVE COUNTDOWN TIMER & CALENDAR */}
        <div className="relative z-10">
          <CountdownSection
            event={event}
            language={language}
            primaryColor={config.primaryColor || '#f5b80f'}
            textColor={config.textColor || '#f5b80f'}
          />
        </div>

        {/* SECTION: WEDDING AGENDA / SCHEDULE */}
        <div className="relative z-10">
          <ScheduleSection
            shifts={event.schedules?.[0]?.shifts || []}
            language={language}
            primaryColor={config.primaryColor || '#f5b80f'}
            textColor={config.textColor || '#f5b80f'}
          />
        </div>

        {/* SECTION: VENUE LOCATION & GOOGLE MAPS */}
        <div className="relative z-10">
          <LocationSection
            locationNameKh={event.location}
            locationNameEn={event.locationEn || event.location}
            mapImageUrl={config.event_location}
            mapUrl={config.map_url}
            language={language}
            primaryColor={config.primaryColor || '#f5b80f'}
            textColor={config.textColor || '#f5b80f'}
          />
        </div>

        {/* SECTION: PHOTO GALLERY & LIGHTBOX */}
        <div className="relative z-10">
          <GallerySection
            photos={photosList}
            language={language}
            primaryColor={config.primaryColor || '#f5b80f'}
            textColor={config.textColor || '#f5b80f'}
          />
        </div>

        {/* SECTION: GIFT VIA BAKONG / KHQR */}
        <div className="relative z-10">
          <GiftKHQRSection
            qrCodeUrl={config.qr_code}
            qrCodeRielUrl={config.qr_code_riel}
            bankInfo={config.bankInfo}
            groom={event.groom}
            bride={event.bride}
            language={language}
            primaryColor={config.primaryColor || '#f5b80f'}
            textColor={config.textColor || '#f5b80f'}
          />
        </div>

        {/* SECTION: GRATITUDE & SINCERE APOLOGY */}
        <section id="gratitude-section" className="relative z-10 py-8 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/20 shadow-lg relative"
          >
            <h3
              style={{ color: config.primaryColor || '#f5b80f' }}
              className="text-base font-moul mb-2"
            >
              {textContent.gratitude_title || (language === 'kh' ? 'សូមអរគុណ និងសូមអភ័យទោស' : 'Gratitude & Sincere Apology')}
            </h3>
            <p
              style={{ color: config.textColor || '#f5b80f' }}
              className="text-xs sm:text-sm font-khmer leading-relaxed opacity-90"
            >
              {textContent.gratitude_message}
            </p>
          </motion.div>
        </section>

        {/* SECTION: DIGITAL GUESTBOOK / WISHES */}
        <div className="relative z-10">
          <WishesSection
            defaultGuestName={guestName}
            language={language}
            primaryColor={config.primaryColor || '#f5b80f'}
            textColor={config.textColor || '#f5b80f'}
          />
        </div>

        {/* FOOTER: BRAND & REFERENCE */}
        <footer className="relative z-10 pt-8 pb-16 px-6 text-center text-xs text-neutral-500 border-t border-amber-500/10">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span
              style={{ color: config.primaryColor || '#f5b80f' }}
              className="font-moul text-xs"
            >
              {event.groom} & {event.bride}
            </span>
          </div>
          <p
            style={{ color: config.textColor || '#f5b80f' }}
            className="text-[11px] font-khmer opacity-70"
          >
            {language === 'kh'
              ? 'រៀបចំឡើងដោយក្តីស្រឡាញ់តាមរយៈ ប្រុសស្អាត យឿន សីហា'
              : 'Crafted with love via ប្រុសស្អាត យឿន សីហា'}
          </p>
        </footer>
      </main>

      {/* EVENT DASHBOARD / EDITOR MODAL (CAN ADD PICTURE & EDIT ALL INFORMATIONS) */}
      <EventEditorModal
        isOpen={showEditorModal}
        onClose={() => setShowEditorModal(false)}
        event={event}
        onSave={handleSaveEvent}
        onReset={handleResetEvent}
      />

      {/* RSVP MODAL */}
      <RSVPModal
        isOpen={showRSVPModal}
        onClose={() => setShowRSVPModal(false)}
        defaultGuestName={guestName}
        language={language}
      />

      {/* SHARE / PERSONALIZE MODAL */}
      <ShareInvitationModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        guestName={guestName}
        onUpdateGuestName={newName => setGuestName(newName)}
        language={language}
        eventId={event.id}
        groom={event.groom}
        bride={event.bride}
        weddingDate={event.date}
        locationName={event.location?.name}
        coverImage={event.cover_image || event.image}
      />

      {/* ADD / PERSONALIZE GUEST MODAL */}
      <AddGuestModal
        isOpen={showAddGuestModal}
        onClose={() => setShowAddGuestModal(false)}
        currentGuestName={guestName}
        onSaveGuestName={name => setGuestName(name)}
        onOpenEnvelopeWithName={name => {
          setGuestName(name);
          setShowEnvelopeModal(true);
        }}
        language={language}
        eventId={event.id}
        groom={event.groom}
        bride={event.bride}
      />

      {/* ADMIN LOGIN MODAL (NETLIFY / GOOGLE AUTH & PASSCODE) */}
      <AnimatePresence>
        {showAdminLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowAdminLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-gradient-to-b from-black via-black to-black border border-amber-500/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] text-left"
            >
              <button
                onClick={() => setShowAdminLoginModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center pb-4 border-b border-amber-500/20 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-400/50 text-amber-300 flex items-center justify-center mx-auto mb-2 shadow-inner">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-moul text-amber-200">
                  {language === 'kh' ? 'ចូលប្រព័ន្ធគ្រប់គ្រង (Admin Login)' : 'Admin Login'}
                </h3>
                <p className="text-xs text-amber-300/80 font-khmer mt-1 leading-relaxed">
                  {language === 'kh'
                    ? 'សម្រាប់ Netlify Hosting: បើ Google Sign-In ជាប់បញ្ហា Authorized Domains សូមប្រើលេខសម្ងាត់ម្ចាស់កម្មវិធីដើម្បីចូលភ្លាមៗ។'
                    : 'For Netlify Hosting: If Google Sign-In requires Authorized Domains, use Owner Passcode for instant access.'}
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="flex bg-black/50 p-1 rounded-2xl border border-amber-500/20 mb-5">
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all font-khmer flex items-center justify-center gap-1.5 ${
                    authTab === 'login'
                      ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{language === 'kh' ? 'ចូលប្រព័ន្ធ (Login)' : 'Login'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('signup')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all font-khmer flex items-center justify-center gap-1.5 ${
                    authTab === 'signup'
                      ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{language === 'kh' ? 'ចុះឈ្មោះថ្មី (Sign Up)' : 'Sign Up'}</span>
                </button>
              </div>

              {authTab === 'signup' ? (
                /* Sign Up Form for New User */
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-amber-300 font-khmer">
                      {language === 'kh' ? 'ឈ្មោះពេញ (Full Name):' : 'Full Name:'}
                    </label>
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/40 text-amber-100 font-khmer text-sm placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-amber-300 font-khmer">
                      {language === 'kh' ? 'អ៊ីមែល (Email):' : 'Email Address:'}
                    </label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/40 text-amber-100 font-mono text-sm placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-amber-300 font-khmer">
                      {language === 'kh' ? 'បង្កើតលេខសម្ងាត់ថ្មី (Create Passcode):' : 'Create Passcode:'}
                    </label>
                    <input
                      type="password"
                      value={signupPasscode}
                      onChange={(e) => setSignupPasscode(e.target.value)}
                      placeholder="បញ្ចូលលេខសម្ងាត់ (ឧ. love2222)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/40 text-amber-100 font-mono text-sm placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                      required
                    />
                    {signupMessage && (
                      <p className="text-[11px] text-rose-400 font-khmer">{signupMessage}</p>
                    )}
                    <p className="text-[11px] text-neutral-400 font-khmer">
                      {language === 'kh' ? '💡 ចុះឈ្មោះគណនីថ្មីដើម្បីចូលប្រើប្រាស់ និងគ្រប់គ្រងកម្មវិធីនេះ' : '💡 Sign up to create a new user profile and manage this app.'}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-khmer font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{language === 'kh' ? 'ចុះឈ្មោះគណនីថ្មី (Register New User)' : 'Register New User'}</span>
                  </button>
                </form>
              ) : (
                <>
                  {/* Passcode Login Form */}
                  <form onSubmit={handlePasscodeSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-amber-300 font-khmer">
                        {language === 'kh' ? 'លេខសម្ងាត់ម្ចាស់កម្មវិធី (Owner Passcode):' : 'Owner Passcode:'}
                      </label>
                      <input
                        type="password"
                        value={adminPasscode}
                        onChange={(e) => setAdminPasscode(e.target.value)}
                        placeholder="បញ្ចូលលេខសម្ងាត់ (ឧ. love2222)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/40 text-amber-100 font-mono text-sm placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                        autoFocus
                      />
                      {passcodeError && (
                        <p className="text-[11px] text-rose-400 font-khmer">{passcodeError}</p>
                      )}
                      <p className="text-[11px] text-neutral-400 font-khmer">
                        {language === 'kh' ? '💡 លេខសម្ងាត់លំនាំដើម៖ love2222' : '💡 Default passcode: love2222'}
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-khmer font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{language === 'kh' ? 'ចូលដោយលេខសម្ងាត់ (Instant Login)' : 'Login with Passcode'}</span>
                    </button>
                  </form>

                  <div className="relative my-5 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                    <span className="relative px-3 bg-black text-[11px] text-neutral-400 font-khmer">
                      {language === 'kh' ? 'ឬ ចូលតាម Google' : 'OR Google Sign-In'}
                    </span>
                  </div>

                  {/* Google Sign In Option */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 font-khmer font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2.5 disabled:opacity-60"
                  >
                    {isGoogleLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-neutral-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    )}
                    <span>{isGoogleLoading ? (language === 'kh' ? 'កំពុងភ្ជាប់ Google...' : 'Connecting...') : (language === 'kh' ? 'ចូលជាមួយគណនី Google (Sign in with Google)' : 'Sign in with Google')}</span>
                  </button>

                  {googleAuthError && (
                    <p className="text-[11px] text-rose-400 font-khmer text-center mt-2 leading-relaxed">
                      {googleAuthError}
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
