/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Calendar,
  MapPin,
  ChevronDown,
  Sparkles,
  Home,
  Cake,
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
  Play,
  Pause,
  ChevronsDown,
} from 'lucide-react';
import { WEDDING_EVENT } from './data/weddingData';
import { sanitizeWeddingEvent, VERIFIED_WEDDING_COVER } from './utils/sanitizeEvent';
import { findTemplatePreset, getCategoryCoverImage, VERIFIED_CATEGORY_COVERS } from './data/eventTemplates';
import { Language, WeddingEvent } from './types';
import { formatKhmerDate, formatEnDate } from './utils/khmerHelpers';
import { testFirestoreConnection, auth } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, User } from 'firebase/auth';
import { saveEventToFirebase, fetchEventFromFirebase, subscribeToEvent } from './lib/firebaseServices';
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
import EventTypeModal from './components/EventTypeModal';
import RoyalGoldRibbonBanner from './components/RoyalGoldRibbonBanner';
import RingIcon from './components/RingIcon';

export default function App() {
  const [language, setLanguage] = useState<Language>('kh');
  const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(false);
  const [showEnvelopeModal, setShowEnvelopeModal] = useState(true);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [showEventTypeModal, setShowEventTypeModal] = useState(false);
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

  // Helper to validate and guarantee template type
  const validateCurrentTemplateType = (eventData: Partial<WeddingEvent> | null | undefined): 'wedding' | 'engagement' | 'housewarming' | 'birthday' => {
    if (eventData?.eventType) return eventData.eventType;
    const id = eventData?.id || '';
    if (id.includes('housewarming')) return 'housewarming';
    if (id.includes('engagement')) return 'engagement';
    if (id.includes('birthday') || eventData?.singlePerson) return 'birthday';
    return 'wedding';
  };

  const [refreshValidationFeedback, setRefreshValidationFeedback] = useState<string | null>(null);

  const handleRefreshWithValidation = async () => {
    const validatedType = validateCurrentTemplateType(event);
    const currentId = event.id || localStorage.getItem('wedding_last_active_template_id') || 'cmgrawhnk0003le0434762j7n';

    const typeLabelKh = {
      wedding: 'មង្គលការ (Wedding)',
      engagement: 'ភ្ជាប់ពាក្យ (Engagement)',
      housewarming: 'ឡើងគេហដ្ឋាន (Housewarming)',
      birthday: 'ខួបកំណើត (Birthday)',
    }[validatedType];

    const validatedEvent: WeddingEvent = {
      ...event,
      eventType: validatedType,
      updatedAt: event.updatedAt || new Date().toISOString(),
    };

    try {
      localStorage.setItem('wedding_custom_event_data', JSON.stringify(validatedEvent));
      localStorage.setItem(`wedding_template_saved_${currentId}`, JSON.stringify(validatedEvent));
      localStorage.setItem(`wedding_template_type_${validatedType}`, JSON.stringify(validatedEvent));
      localStorage.setItem('wedding_last_active_template_id', currentId);
      localStorage.setItem('wedding_last_template_type', validatedType);

      // Persist to server API
      fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedEvent),
      }).catch(() => {});
    } catch (e) {
      console.warn('Error saving during refresh validation:', e);
    }

    setEvent(validatedEvent);
    setRefreshValidationFeedback(`បានផ្ទៀងផ្ទាត់ប្រភេទធៀប៖ ${typeLabelKh} - កំពុងផ្ទុកទំព័រឡើងវិញ...`);
    
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  // Load custom event data from URL params, localStorage, or preset
  const [event, setEvent] = useState<WeddingEvent>(() => {
    try {
      // 1. Check URL parameters FIRST so direct links and shared links load the correct template/category immediately
      let urlId: string | null = null;
      let urlType: string | null = null;
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        urlId = params.get('id');
        urlType = params.get('type');
      }

      if (urlId || urlType) {
        const targetId = urlId || urlType!;
        const storedTemplate = localStorage.getItem(`wedding_template_saved_${targetId}`);
        if (storedTemplate) {
          const parsed = sanitizeWeddingEvent(JSON.parse(storedTemplate));
          return parsed;
        }

        const preset = findTemplatePreset(targetId);
        if (preset) {
          return sanitizeWeddingEvent({
            ...preset.sampleEvent,
            eventType: preset.type,
          });
        }
      }

      // 2. Otherwise check active template ID and type from localStorage
      const activeTemplateId = localStorage.getItem('wedding_last_active_template_id');
      const activeTemplateType = localStorage.getItem('wedding_last_template_type');

      if (activeTemplateId) {
        const storedTemplate = localStorage.getItem(`wedding_template_saved_${activeTemplateId}`);
        if (storedTemplate) {
          const parsed = sanitizeWeddingEvent(JSON.parse(storedTemplate));
          parsed.eventType = parsed.eventType || (activeTemplateType as any) || validateCurrentTemplateType(parsed);
          return parsed;
        }
        const preset = findTemplatePreset(activeTemplateId);
        if (preset) {
          return sanitizeWeddingEvent({
            ...preset.sampleEvent,
            eventType: preset.type,
          });
        }
      }
      if (activeTemplateType) {
        const storedByType = localStorage.getItem(`wedding_template_type_${activeTemplateType}`);
        if (storedByType) {
          const parsed = sanitizeWeddingEvent(JSON.parse(storedByType));
          parsed.eventType = parsed.eventType || (activeTemplateType as any);
          return parsed;
        }
        const preset = findTemplatePreset(activeTemplateType);
        if (preset) {
          return sanitizeWeddingEvent({
            ...preset.sampleEvent,
            eventType: preset.type,
          });
        }
      }
      const stored = localStorage.getItem('wedding_custom_event_data');
      if (stored) {
        const parsed = sanitizeWeddingEvent(JSON.parse(stored));
        parsed.eventType = parsed.eventType || validateCurrentTemplateType(parsed);
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load stored event:', e);
    }
    const defaultEvent = sanitizeWeddingEvent(WEDDING_EVENT);
    defaultEvent.eventType = 'wedding';
    return defaultEvent;
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
      const urlIdParam = params.get('id');
      const urlTypeParam = params.get('type');

      const activeTemplateId = localStorage.getItem('wedding_last_active_template_id');
      let storedEventId: string | null = null;
      try {
        const stored = localStorage.getItem('wedding_custom_event_data');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.id) storedEventId = parsed.id;
        }
      } catch (e) {}

      // Preserve the user's chosen template type across refreshes
      const fetchId = urlIdParam || urlTypeParam || activeTemplateId || storedEventId || 'cmgrawhnk0003le0434762j7n';

      const foundGuest = iParam || guestParam || nameParam || toParam;
      if (foundGuest) {
        setGuestName(foundGuest);
        setIsFromShareLink(true);
        // Update document title for personalized browser tab and share
        document.title = `${event.name || 'លិខិតអញ្ជើញឌីជីថល'} - សូមគោរពអញ្ជើញ ${foundGuest}`;
      } else {
        setGuestName('Your Name');
        document.title = event.name || 'លិខិតអញ្ជើញឌីជីថល';
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

      // Subscribe to real-time event configuration changes from Firestore using the chosen template ID
      const unsubscribeEvent = subscribeToEvent(fetchId, (fbEvent) => {
        if (fbEvent) {
          const sanitized = sanitizeWeddingEvent(fbEvent);
          setEvent(sanitized);
          try {
            localStorage.setItem('wedding_custom_event_data', JSON.stringify(sanitized));
          } catch (e) {
            // ignore
          }
        }
      });

      // Fetch latest synced event data from Firebase Firestore & server API
      const fetchServerData = async () => {
        try {
          const fbEvent = await fetchEventFromFirebase(fetchId);
          if (fbEvent) {
            const sanitized = sanitizeWeddingEvent(fbEvent);
            setEvent(sanitized);
            try {
              localStorage.setItem('wedding_custom_event_data', JSON.stringify(sanitized));
            } catch (e) {}
            return;
          }
        } catch (e) {
          console.warn('Firebase event fetch fallback to server:', e);
        }

        try {
          const res = await fetch(`/api/event?id=${encodeURIComponent(fetchId)}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.success && data.event) {
              const sanitized = sanitizeWeddingEvent(data.event);
              setEvent(sanitized);
              try {
                localStorage.setItem('wedding_custom_event_data', JSON.stringify(sanitized));
              } catch (e) {}
              return;
            }
          }
        } catch (err) {
          console.warn('Could not fetch server event:', err);
        }

        // If neither Firestore nor server API had the event, load the template preset directly
        const preset = findTemplatePreset(fetchId);
        if (preset) {
          let templateEvent = preset.sampleEvent;
          const storedTemplate = localStorage.getItem(`wedding_template_saved_${fetchId}`);
          if (storedTemplate) {
            try {
              templateEvent = JSON.parse(storedTemplate);
            } catch {}
          }
          const sanitized = sanitizeWeddingEvent({
            ...templateEvent,
            eventType: preset.type,
          });
          setEvent(sanitized);
          try {
            localStorage.setItem('wedding_custom_event_data', JSON.stringify(sanitized));
            localStorage.setItem('wedding_last_active_template_id', fetchId);
            localStorage.setItem('wedding_last_template_type', preset.type);
          } catch {}
        }
      };

      fetchServerData();

      return () => {
        window.removeEventListener('hashchange', checkHash);
        if (unsubscribeEvent) unsubscribeEvent();
      };
    }
  }, []);

  useEffect(() => {
    const eventName =
      event.name ||
      (event.singlePerson
        ? event.groom
        : event.groom && event.bride
        ? `អាពាហ៍ពិពាហ៍ ${event.groom} & ${event.bride}`
        : 'លិខិតអញ្ជើញឌីជីថល') ||
      'លិខិតអញ្ជើញឌីជីថល';

    let displayTitle = eventName;
    if (guestName && guestName !== 'Your Name') {
      displayTitle = `${eventName} - សូមគោរពអញ្ជើញ ${guestName}`;
    }

    document.title = displayTitle;

    // Dynamically update document meta tags for shared preview & browser
    const updateMetaTag = (attr: string, key: string, content: string) => {
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const eventType = ((event as any).eventType || '').toLowerCase();
    const eventIdLower = (event.id || '').toLowerCase();
    const eventNameLower = (event.name || '').toLowerCase();

    const isBday = eventType === 'birthday' || eventIdLower.includes('birthday') || eventNameLower.includes('ខួប') || eventNameLower.includes('birthday');
    const isHouse = eventType === 'housewarming' || eventIdLower.includes('housewarming') || eventNameLower.includes('ឡើងផ្ទះ') || eventNameLower.includes('house');
    const isEngage = eventType === 'engagement' || eventIdLower.includes('engagement') || eventNameLower.includes('ភ្ជាប់ពាក្យ') || eventNameLower.includes('engage');

    const desc = `សូមគោរពអញ្ជើញ ${
      guestName && guestName !== 'Your Name' ? guestName : 'ភ្ញៀវកិត្តិយស'
    } ចូលរួមជាអធិបតី និងប្រសិទ្ធពរជ័យ ${
      isBday
        ? `ក្នុងពិធីខួបកំណើត ${event.groom || eventName}`
        : isHouse
        ? `ក្នុងពិធីឡើងគេហដ្ឋានថ្មី ${event.groom || eventName}`
        : isEngage
        ? `ក្នុងពិធីភ្ជាប់ពាក្យ ${event.groom} & ${event.bride}`
        : event.groom && event.bride && !event.singlePerson
        ? `ក្នុងពិធីមង្គលការរវាង ${event.groom} & ${event.bride}`
        : event.groom
        ? `ក្នុងកម្មវិធី ${event.groom}`
        : ''
    } នៅថ្ងៃទី ${event.date || ''}`;

    let coverImg =
      event.cover_image ||
      event.image ||
      event.config?.photo_gallary?.photo1;

    if (!coverImg || (isBday && coverImg.includes('491657278')) || (isHouse && coverImg.includes('491657278'))) {
      coverImg = getCategoryCoverImage(event.eventType || event.id);
    }

    updateMetaTag('name', 'description', desc);
    updateMetaTag('property', 'og:title', displayTitle);
    updateMetaTag('property', 'og:description', desc);
    updateMetaTag('property', 'og:image', coverImg);
    updateMetaTag('name', 'twitter:title', displayTitle);
    updateMetaTag('name', 'twitter:description', desc);
    updateMetaTag('name', 'twitter:image', coverImg);
  }, [event.name, event.groom, event.bride, event.singlePerson, event.date, event.image, event.cover_image, event.eventType, event.id, guestName, isFromShareLink]);

  const config = event.config;
  const textContent = language === 'kh' ? config.invitation_kh : config.invitation_en;

  const isBirthday = ((event as any).eventType || '').toLowerCase() === 'birthday' || event.id?.includes('birthday') || event.name?.includes('ខួបកំណើត') || event.name?.includes('Birthday');
  const isEngagement = ((event as any).eventType || '').toLowerCase() === 'engagement' || event.id?.includes('engagement') || event.name?.includes('ភ្ជាប់ពាក្យ') || event.name?.includes('Engagement');
  const isHousewarming = ((event as any).eventType || '').toLowerCase() === 'housewarming' || event.id?.includes('housewarming') || event.name?.includes('ឡើងផ្ទះ') || event.name?.includes('House');

  const badgeKh = isBirthday
    ? 'ខួបកំណើត'
    : isEngagement
    ? 'ភ្ជាប់ពាក្យ'
    : isHousewarming
    ? 'ឡើងផ្ទះថ្មី'
    : 'មង្គលការ';

  const badgeEn = isBirthday
    ? 'BIRTHDAY CELEBRATION'
    : isEngagement
    ? 'ENGAGEMENT CELEBRATION'
    : isHousewarming
    ? 'HOUSEWARMING CELEBRATION'
    : 'WEDDING CELEBRATION';

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'kh' ? 'en' : 'kh'));
  };

  // 1.5x Auto-Scroll Engine after opening envelope
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const autoScrollRafRef = useRef<number | null>(null);
  const autoScrollActiveRef = useRef<boolean>(false);
  const scrollPosRef = useRef<number>(0);

  // Auto-scroll loop when envelope is opened
  useEffect(() => {
    if (!hasOpenedEnvelope) {
      if (autoScrollRafRef.current) {
        cancelAnimationFrame(autoScrollRafRef.current);
        autoScrollRafRef.current = null;
      }
      autoScrollActiveRef.current = false;
      setIsAutoScrolling(false);
      return;
    }

    // 1.5x speed constant: ~120 px/sec
    const SPEED_1_5X = 120;
    let lastTimestamp: number | null = null;

    const startTimeout = setTimeout(() => {
      autoScrollActiveRef.current = true;
      setIsAutoScrolling(true);
      lastTimestamp = null;
      scrollPosRef.current = window.scrollY || document.documentElement.scrollTop || 0;

      const step = (timestamp: number) => {
        if (!autoScrollActiveRef.current) return;

        if (lastTimestamp === null) {
          lastTimestamp = timestamp;
        }
        const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
        lastTimestamp = timestamp;

        const maxScroll = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        ) - window.innerHeight;

        scrollPosRef.current += SPEED_1_5X * delta;

        if (scrollPosRef.current >= maxScroll - 6) {
          window.scrollTo(0, maxScroll);
          autoScrollActiveRef.current = false;
          setIsAutoScrolling(false);
          return;
        }

        window.scrollTo(0, scrollPosRef.current);
        autoScrollRafRef.current = requestAnimationFrame(step);
      };

      autoScrollRafRef.current = requestAnimationFrame(step);
    }, 700);

    const onUserScrollGesture = () => {
      scrollPosRef.current = window.scrollY || document.documentElement.scrollTop || 0;
      if (!autoScrollActiveRef.current) return;
      autoScrollActiveRef.current = false;
      setIsAutoScrolling(false);
      if (autoScrollRafRef.current) {
        cancelAnimationFrame(autoScrollRafRef.current);
        autoScrollRafRef.current = null;
      }
    };

    window.addEventListener('wheel', onUserScrollGesture, { passive: true });
    window.addEventListener('touchmove', onUserScrollGesture, { passive: true });

    return () => {
      clearTimeout(startTimeout);
      if (autoScrollRafRef.current) cancelAnimationFrame(autoScrollRafRef.current);
      window.removeEventListener('wheel', onUserScrollGesture);
      window.removeEventListener('touchmove', onUserScrollGesture);
    };
  }, [hasOpenedEnvelope]);

  const toggleManualAutoScroll = () => {
    if (isAutoScrolling) {
      autoScrollActiveRef.current = false;
      setIsAutoScrolling(false);
      if (autoScrollRafRef.current) {
        cancelAnimationFrame(autoScrollRafRef.current);
        autoScrollRafRef.current = null;
      }
    } else {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      ) - window.innerHeight;

      const currentY = window.scrollY || document.documentElement.scrollTop || 0;
      if (currentY >= maxScroll - 15) {
        window.scrollTo(0, 0);
        scrollPosRef.current = 0;
      } else {
        scrollPosRef.current = currentY;
      }

      autoScrollActiveRef.current = true;
      setIsAutoScrolling(true);
      let lastTimestamp: number | null = null;
      const SPEED_1_5X = 120;

      const step = (timestamp: number) => {
        if (!autoScrollActiveRef.current) return;
        if (lastTimestamp === null) lastTimestamp = timestamp;
        const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
        lastTimestamp = timestamp;

        const currentMax = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        ) - window.innerHeight;

        scrollPosRef.current += SPEED_1_5X * delta;

        if (scrollPosRef.current >= currentMax - 6) {
          window.scrollTo(0, currentMax);
          autoScrollActiveRef.current = false;
          setIsAutoScrolling(false);
          return;
        }

        window.scrollTo(0, scrollPosRef.current);
        autoScrollRafRef.current = requestAnimationFrame(step);
      };

      autoScrollRafRef.current = requestAnimationFrame(step);
    }
  };

  const handleEnvelopeOpen = () => {
    setHasOpenedEnvelope(true);
    setShowEnvelopeModal(false);
    window.scrollTo(0, 0);
    scrollPosRef.current = 0;
  };

  const handleSaveEvent = async (updatedEvent: WeddingEvent, refreshEnvelope: boolean = true) => {
    const validatedType = updatedEvent.eventType || validateCurrentTemplateType(updatedEvent);
    const preparedEvent: WeddingEvent = {
      ...updatedEvent,
      eventType: validatedType,
      updatedAt: updatedEvent.updatedAt || new Date().toISOString(),
    };

    setEvent(preparedEvent);
    if (refreshEnvelope) {
      setHasOpenedEnvelope(false);
      setShowEnvelopeModal(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // 1. Instant local cache save (active event, per-template cache, per-template-type cache, and active design settings)
    try {
      localStorage.setItem('wedding_custom_event_data', JSON.stringify(preparedEvent));
      if (preparedEvent.id) {
        localStorage.setItem(`wedding_template_saved_${preparedEvent.id}`, JSON.stringify(preparedEvent));
        localStorage.setItem('wedding_last_active_template_id', preparedEvent.id);
      }
      if (validatedType) {
        localStorage.setItem(`wedding_template_type_${validatedType}`, JSON.stringify(preparedEvent));
        localStorage.setItem('wedding_last_template_type', validatedType);
      }
      if (preparedEvent.config) {
        localStorage.setItem('wedding_last_custom_design_config', JSON.stringify(preparedEvent.config));
      }
    } catch (e) {
      console.warn('Failed to save local event data:', e);
    }

    // 2. Firebase Firestore Database Sync
    saveEventToFirebase(preparedEvent).catch(err => {
      console.warn('Firebase save fallback:', err);
    });

    // 3. Server API Sync so anyone who opens the shared URL sees all updates
    try {
      const response = await fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preparedEvent),
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
  const mainCardBgClass = theme === 'light' ? 'bg-[#faf8f5] text-neutral-900 border-amber-500/30' : theme === 'gray' ? 'bg-[#1b1e25] text-slate-100 border-slate-700/50' : 'bg-black text-[#e5e0d8] border-amber-500/20';

  const currentTemplateTypeInfo = (() => {
    const id = (event.id || '').toLowerCase();
    const type = ((event as any).eventType || '').toLowerCase();
    const name = (event.name || '').toLowerCase();

    if (type === 'housewarming' || id.includes('housewarming') || name.includes('ឡើងផ្ទះ') || name.includes('housewarming')) {
      return {
        type: 'housewarming',
        label: language === 'kh' ? 'ឡើងផ្ទះ' : 'Housewarming',
        icon: Home,
      };
    }
    if (type === 'engagement' || id.includes('engagement') || name.includes('ភ្ជាប់ពាក្យ') || name.includes('engagement')) {
      return {
        type: 'engagement',
        label: language === 'kh' ? 'ភ្ជាប់ពាក្យ' : 'Engagement',
        icon: Sparkles,
      };
    }
    if (type === 'birthday' || id.includes('birthday') || event.singlePerson || name.includes('ខួប') || name.includes('birthday')) {
      return {
        type: 'birthday',
        label: language === 'kh' ? 'ខួបកំណើត' : 'Birthday',
        icon: Cake,
      };
    }
    return {
      type: 'wedding',
      label: language === 'kh' ? 'មង្គលការ' : 'Wedding',
      icon: Heart,
    };
  })();

  const currentTemplateTypeLabel = currentTemplateTypeInfo.label;

  return (
    <div
      data-theme={theme}
      style={{
        backgroundColor: rootBgColor,
        backgroundImage: !config.hide_main_background && (config.main_background || config.cover_background || config.event_location)
          ? `url(${config.main_background || config.cover_background || config.event_location})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className={`min-h-screen w-full ${rootTextColor} flex justify-center selection:bg-amber-400 selection:text-amber-950 font-khmer relative`}
    >
      {/* Background backdrop blur / shade if main_background is set */}
      {!config.hide_main_background && (config.main_background || config.cover_background || config.event_location) && (
        <div className={`fixed inset-0 ${theme === 'light' ? 'bg-white/40' : theme === 'gray' ? 'bg-black/50' : 'bg-black/35'} backdrop-blur-[1px] pointer-events-none z-0`} />
      )}

      {/* Royal Opening Envelope Modal */}
      <EnvelopeModal
        isOpen={showEnvelopeModal}
        onOpen={handleEnvelopeOpen}
        guestName={guestName}
        onUpdateGuestName={newName => setGuestName(newName)}
        onOpenAddGuestModal={handleOpenAddGuest}
        id={event.id}
        eventType={event.eventType}
        name={event.name}
        groom={event.groom}
        bride={event.bride}
        groomEn={event.groomEn}
        brideEn={event.brideEn}
        singlePerson={event.singlePerson}
        language={language}
        isAdmin={!isViewer}
        coverBackground={config.hide_cover_background ? '' : (config.cover_background || 'https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/free-background.jpg')}
        primaryColor={config.primaryColor || '#f5b80f'}
        textColor={config.textColor || '#f5b80f'}
        envelopeFrame={config.envelope_frame}
        envelopeHeaderImage={config.envelope_header_image}
        onUpdateEnvelopeHeaderImage={handleUpdateEnvelopeHeaderImage}
        mainTitleKh={config.invitation_kh?.main_title}
        mainTitleEn={config.invitation_en?.main_title || config.invitation_en?.subtitle}
        coverSubtitleKh={config.cover_subtitle_kh || config.invitation_kh?.main_title || (currentTemplateTypeInfo.type === 'birthday' ? 'រីករាយពិធីខួបកំណើត' : 'សិរីសួស្តី អាពាហ៍ពិពាហ៍')}
        coverSubtitleEn={config.cover_subtitle_en || config.invitation_en?.subtitle}
        coverEnNameColor={config.cover_en_name_color}
        coverEnFontFamily={config.cover_en_font_family}
        guestNameColor={config.guestNameColor || '#364153'}
        guestNameFontFamily={config.guest_name_font_family}
        guestNameFontSize={config.guest_name_font_size}
        theme={theme}
      />

      {/* Floating Top Left Controls: Language & Theme */}
      <div className="fixed top-4 left-4 z-50 flex flex-wrap items-center gap-2">
        <LanguageToggle currentLanguage={language} onToggle={toggleLanguage} theme={theme} />
        <ThemeToggle currentTheme={theme} onChangeTheme={setTheme} language={language} />
      </div>

      {/* Floating Top Right Controls: Music Player, Share & Edit Button */}
      <AudioPlayer
        audioUrl={config.background_music}
        hasOpenedEnvelope={hasOpenedEnvelope}
        language={language}
        theme={theme}
      />

      <div className="fixed top-16 right-4 z-40 flex flex-col gap-2">
        {/* Admin and Auth Controls */}
        {isAdmin ? (
          <>
            {/* Edit Event / Template Button */}
            <motion.button
              id="open-editor-btn"
              onClick={handleOpenEditor}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              className="group relative flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 rounded-full border border-amber-300/90 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 font-bold shadow-[0_4px_22px_rgba(245,158,11,0.4)] backdrop-blur-md hover:from-amber-300 hover:to-amber-100 transition-all ring-2 ring-amber-400/60 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer select-none"
              title={language === 'kh' ? 'គម្រូធៀប / កែសម្រួលព័ត៌មាន & រូបភាព' : 'Template Editor / Edit Info & Images'}
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-950/20 group-hover:bg-amber-950/30 transition-colors shadow-xs">
                <LayoutTemplate className="w-3.5 h-3.5 text-amber-950 shrink-0" />
              </div>
              <span className={`hidden sm:inline text-[13.5px] font-bold whitespace-nowrap tracking-tight ${language === 'kh' ? 'font-khmer' : 'font-sans'}`}>
                {language === 'kh' ? 'គម្រូធៀប' : 'Template'}
              </span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3" title="Server Synced">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#141210]"></span>
              </span>
            </motion.button>

            {/* PlanEssential Event Template Manager & Creator Button */}
            <motion.button
              id="planessential-template-btn"
              type="button"
              onClick={() => setShowEventTypeModal(true)}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              className="group relative flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 rounded-full border border-amber-300/90 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 font-bold shadow-[0_4px_22px_rgba(245,158,11,0.4)] backdrop-blur-md hover:from-amber-300 hover:to-amber-100 transition-all ring-2 ring-amber-400/60 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer select-none"
              title={language === 'kh' ? `ប្រភេទធៀបដែលបានជ្រើសរើស៖ ${currentTemplateTypeLabel}` : `Selected Event Type: ${currentTemplateTypeLabel}`}
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-950/20 group-hover:bg-amber-950/30 transition-colors shadow-xs">
                <currentTemplateTypeInfo.icon className="w-3.5 h-3.5 text-amber-950 shrink-0" />
              </div>
              <span className={`hidden sm:inline text-[13.5px] font-bold whitespace-nowrap tracking-tight ${language === 'kh' ? 'font-khmer' : 'font-sans'}`}>
                {language === 'kh' ? 'ប្រភេទធៀប' : 'Type'}
              </span>
              <span
                id="active-template-type-badge"
                className="inline-flex items-center gap-1.5 text-[11.5px] font-khmer px-2.5 py-0.5 rounded-full bg-amber-950/25 text-amber-950 font-bold border border-amber-950/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all tracking-wide"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse inline-block ring-2 ring-emerald-700/30" />
                {currentTemplateTypeLabel}
              </span>
            </motion.button>

            {/* Add Guest Button */}
            <motion.button
              id="add-guest-btn"
              onClick={handleOpenAddGuest}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="group relative flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 rounded-full border border-amber-400/60 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 font-bold shadow-xl backdrop-blur-md hover:from-amber-300 hover:to-amber-200 transition-all ring-2 ring-amber-400/30 whitespace-nowrap"
              title={language === 'kh' ? 'បន្ថែមឈ្មោះភ្ញៀវលើលិខិតអញ្ជើញ' : 'Add Guest'}
            >
              <UserPlus className="w-4 h-4 text-amber-950 shrink-0" />
              <span className={`hidden sm:inline font-bold text-[14px] whitespace-nowrap ${language === 'kh' ? 'font-khmer' : 'font-sans'}`}>
                {language === 'kh' ? 'បន្ថែមភ្ញៀវ' : 'Add Guest'}
              </span>
            </motion.button>

            {/* Share Button - Only visible for logged-in Admin */}
            <motion.button
              id="share-btn"
              onClick={() => {
                handleSaveEvent(event, false);
                setShowShareModal(true);
              }}
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

        {/* Replay & Validate Template Type */}
        <motion.button
          id="replay-envelope-btn"
          onClick={handleRefreshWithValidation}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          className="group relative flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 rounded-full border border-amber-500/60 bg-gradient-to-br from-black/95 via-neutral-900 to-black text-amber-200 shadow-[0_4px_18px_rgba(0,0,0,0.5)] backdrop-blur-md hover:border-amber-400 hover:text-amber-100 hover:shadow-[0_4px_22px_rgba(245,158,11,0.4)] transition-all ring-1 ring-amber-500/30 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          title={language === 'kh' ? `ធ្វើឡើងវិញ & ផ្ទៀងផ្ទាត់ប្រភេទធៀប (${currentTemplateTypeLabel})` : `Replay & Validate Template Type (${currentTemplateTypeLabel})`}
        >
          <div className="p-1 rounded-full bg-amber-500/20 group-hover:bg-amber-400/30 transition-colors">
            <RotateCcw className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-[-45deg] group-hover:text-amber-200 transition-all duration-300" />
          </div>
          <span className="hidden sm:inline text-[14px] font-khmer font-medium text-neutral-200 group-hover:text-amber-100 transition-colors">
            {language === 'kh' ? 'ធ្វើឡើងវិញ' : 'Replay'}
          </span>
        </motion.button>

        {/* Validation Feedback Toast when Refresh Button is Clicked */}
        <AnimatePresence>
          {refreshValidationFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="fixed top-20 right-4 z-50 p-3 rounded-2xl border border-amber-400/80 bg-black/95 text-amber-200 shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-khmer"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{refreshValidationFeedback}</span>
            </motion.div>
          )}
        </AnimatePresence>

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
          backgroundImage: !config.hide_main_background && (config.details_background || config.main_background)
            ? `url(${config.details_background || config.main_background})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
        className={`w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl ${mainCardBgClass} shadow-2xl relative border-x overflow-hidden pb-24 transition-all duration-300`}
      >
        {/* Full-height subtle darkening & texture overlay for crisp legibility */}
        {!config.hide_main_background && (config.details_background || config.main_background) && (
          <div className={`absolute inset-0 bg-gradient-to-b ${theme === 'light' ? 'from-white/70 via-white/50 to-white/70' : theme === 'gray' ? 'from-[#1b1e25]/60 via-[#1b1e25]/50 to-[#1b1e25]/70' : 'from-black/50 via-black/40 to-black/60'} pointer-events-none z-0`} />
        )}



        {/* HERO SECTION WITH AUTHENTIC PLANESSENTIAL BACKGROUND & GRADIENT MASK */}
        <header className="relative w-full overflow-hidden text-center z-10">
          {/* Middle Card Header Background Wallpaper */}
          {!config.hide_main_background && (
            <div
              className="absolute inset-0 bg-cover bg-top opacity-65"
              style={{ backgroundImage: `url(${config.details_background || config.main_background || config.cover_background})` }}
            />
          )}

          {/* Golden Pattern Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-b ${theme === 'light' ? 'from-white/20 via-transparent to-white/80' : theme === 'gray' ? 'from-[#1b1e25]/20 via-transparent to-[#1b1e25]/80' : 'from-black/10 via-transparent to-black/60'}`} />

          {/* Couple Main Pre-Wedding Photo with Artistic Frame & Shape */}
          <div className="relative pt-6 pb-4 px-4 sm:px-8 flex flex-col items-center">
            {(() => {
              const portraitShape = config.portrait_shape || 'circle';
              return (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className={`relative mb-5 group ${
                    portraitShape === 'heart'
                      ? 'w-[250px] sm:w-[310px] md:w-[360px] aspect-square filter drop-shadow-[0_12px_35px_rgba(245,158,11,0.45)]'
                      : `overflow-hidden ${
                          portraitShape === 'circle'
                            ? 'w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] aspect-square rounded-full border-[6px] border-amber-400 shadow-[0_14px_50px_rgba(245,158,11,0.4)]'
                            : portraitShape === 'arch'
                            ? 'w-[270px] sm:w-[330px] md:w-[380px] aspect-[3/4] rounded-t-full rounded-b-3xl border-[6px] border-amber-400 shadow-[0_14px_45px_rgba(245,158,11,0.35)]'
                            : portraitShape === 'oval'
                            ? 'w-[240px] sm:w-[300px] md:w-[350px] aspect-[3/4] rounded-[50%] border-[6px] border-amber-400 shadow-[0_14px_45px_rgba(245,158,11,0.4)]'
                            : portraitShape === 'capsule'
                            ? 'w-[230px] sm:w-[280px] md:w-[330px] aspect-[3/4] rounded-full border-[6px] border-amber-400 shadow-[0_14px_45px_rgba(245,158,11,0.4)]'
                            : portraitShape === 'leaf'
                            ? 'w-[260px] sm:w-[320px] md:w-[370px] aspect-[3/4] rounded-tl-[90px] rounded-br-[90px] rounded-tr-3xl rounded-bl-3xl sm:rounded-tl-[120px] sm:rounded-br-[120px] border-[6px] border-amber-400 shadow-[0_14px_45px_rgba(245,158,11,0.35)]'
                            : portraitShape === 'square'
                            ? 'w-[260px] sm:w-[320px] md:w-[370px] aspect-square rounded-3xl border-[6px] border-amber-400 shadow-[0_14px_50px_rgba(245,158,11,0.4)] ring-4 ring-amber-300/30'
                            : 'w-[300px] sm:w-[360px] md:w-[420px] aspect-[4/3] rounded-3xl border-[6px] border-amber-400 shadow-[0_14px_45px_rgba(245,158,11,0.35)]'
                        }`
                  } ${!isViewer ? 'cursor-pointer' : ''}`}
                  onClick={() => {
                    if (!isViewer) handleOpenEditor();
                  }}
                  title={!isViewer ? "ចុចដើម្បីប្តូររូបថតគូស្នេហ៍ / Click to change photo" : undefined}
                >
                  {portraitShape === 'heart' ? (
                    <div className="w-full h-full relative">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <defs>
                          <clipPath id="wedding-heart-clip-direct">
                            <path d="M 50,86 C 24,65 7,47 7,30 C 7,16 17,7 31,7 C 39,7 46,11 50,18 C 54,11 61,7 69,7 C 83,7 93,16 93,30 C 93,47 76,65 50,86 Z" />
                          </clipPath>
                        </defs>
                        <image
                          href={event.image || getCategoryCoverImage(event.eventType || event.id)}
                          xlinkHref={event.image || getCategoryCoverImage(event.eventType || event.id)}
                          width="100"
                          height="100"
                          preserveAspectRatio="xMidYMid slice"
                          clipPath="url(#wedding-heart-clip-direct)"
                        />
                        <path
                          d="M 50,86 C 24,65 7,47 7,30 C 7,16 17,7 31,7 C 39,7 46,11 50,18 C 54,11 61,7 69,7 C 83,7 93,16 93,30 C 93,47 76,65 50,86 Z"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="5"
                          strokeLinejoin="round"
                          className="filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-full h-full relative overflow-hidden rounded-[inherit] bg-neutral-900">
                      <img
                        src={event.image || getCategoryCoverImage(event.eventType || event.id)}
                        alt={event.singlePerson ? event.groom : `${event.groom} & ${event.bride}`}
                        referrerPolicy="no-referrer"
                        loading="eager"
                        onError={(e) => {
                          const fallback = getCategoryCoverImage(event.eventType || event.id);
                          if (e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          }
                        }}
                        className={`w-full h-full object-cover object-center ${!isViewer ? 'group-hover:scale-105' : ''} transition-transform duration-500`}
                      />
                      {/* Soft bottom edge glow */}
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                    </div>
                  )}

                  {/* Hover overlay hint */}
                  {!isViewer && (
                    <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30 ${portraitShape === 'heart' ? 'rounded-full' : 'rounded-[inherit]'}`}>
                      <div className="px-3 py-1.5 rounded-full bg-amber-400 text-amber-950 font-khmer text-xs font-bold flex items-center gap-1.5 shadow-lg">
                        <ImagePlus className="w-3.5 h-3.5" />
                        <span>ប្តូររូបភាព</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })()}

            {/* Title: សិរីមង្គលអាពាហ៍ពិពាហ៍ */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 mb-2"
            >
              <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-amber-300/90 font-bold block mb-2">
                {language === 'kh' ? badgeKh : badgeEn}
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
              className="mt-6 mb-4 flex flex-col items-center cursor-pointer group px-2 text-center"
              onClick={handleOpenEditor}
              title="ចុចដើម្បីកែឈ្មោះ / Click to edit names"
            >
              {language === 'en' ? (
                <>
                  <div
                    style={{
                      color: config.primaryColor || '#f5b80f',
                      fontFamily: config.cover_en_font_family || undefined,
                    }}
                    className={`flex flex-wrap justify-center items-center gap-x-2 gap-y-1 sm:gap-4 text-3xl sm:text-4xl md:text-5xl ${!config.cover_en_font_family ? 'font-norican' : ''} group-hover:brightness-110 transition-all tracking-wide drop-shadow-md`}
                  >
                    <span className="[-webkit-text-stroke:0.5px_white] capitalize">{event.groomEn || 'Ro Malay'}</span>
                    {!event.singlePerson && (
                      <>
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400 animate-pulse-gold inline-block mx-1" />
                        <span className="[-webkit-text-stroke:0.5px_white] capitalize">{event.brideEn || 'Uom Volak'}</span>
                      </>
                    )}
                  </div>
                  <p
                    style={{ color: config.textColor || '#f5b80f' }}
                    className="text-sm sm:text-base md:text-lg font-moul mt-2 tracking-wider drop-shadow-sm flex flex-wrap items-center justify-center gap-x-2 gap-y-1"
                  >
                    <span>{event.groom}</span>
                    {!event.singlePerson && (
                      <>
                        <span className="text-amber-400/90 font-serif italic text-sm">&</span>
                        <span>{event.bride}</span>
                      </>
                    )}
                  </p>
                </>
              ) : (
                <>
                  <div
                    style={{ color: config.primaryColor || '#f5b80f' }}
                    className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 sm:gap-4 text-xl sm:text-2xl md:text-3xl font-moul group-hover:brightness-110 transition-all tracking-wide drop-shadow-md"
                  >
                    <span className="[-webkit-text-stroke:0.5px_white]">{event.groom}</span>
                    {!event.singlePerson && (
                      <>
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400 animate-pulse-gold inline-block mx-1" />
                        <span className="[-webkit-text-stroke:0.5px_white]">{event.bride}</span>
                      </>
                    )}
                  </div>
                  <p
                    style={{
                      color: config.textColor || '#f5b80f',
                      fontFamily: config.cover_en_font_family || undefined,
                    }}
                    className={`text-xl sm:text-2xl md:text-3xl ${!config.cover_en_font_family ? 'font-norican' : ''} mt-2 tracking-wider drop-shadow-sm flex flex-wrap items-center justify-center gap-x-2 gap-y-1`}
                  >
                    <span className="capitalize">{event.groomEn || 'Ro Malay'}</span>
                    {!event.singlePerson && (
                      <>
                        <span className="text-amber-400/90 font-serif italic text-sm">&</span>
                        <span className="capitalize">{event.brideEn || 'Uom Volak'}</span>
                      </>
                    )}
                  </p>
                </>
              )}
            </motion.div>

            {/* Personalized Guest Badge / Royal Gold Ribbon Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative my-8 sm:my-10 w-full max-w-md sm:max-w-lg md:max-w-xl cursor-pointer group px-2"
              onClick={() => {
                handleSaveEvent(event, false);
                setShowShareModal(true);
              }}
              title="ចុចដើម្បីប្តូរឈ្មោះភ្ញៀវ / Tap to personalize"
            >
              <RoyalGoldRibbonBanner className="group-hover:scale-[1.02] transition-transform duration-300">
                <span className="block text-xs sm:text-sm font-khmer font-semibold text-[#78350f] mb-1.5 tracking-wide drop-shadow-sm">
                  {language === 'kh'
                    ? 'សូមគោរពអញ្ជើញ'
                    : (textContent.subtitle && textContent.subtitle.trim() ? textContent.subtitle : 'Cordially Invites')}
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
                className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full ${theme === 'light' ? 'bg-white/90 shadow-[0_6px_25px_rgba(0,0,0,0.1)]' : 'bg-gradient-to-r from-black/90 via-[#1c1608]/95 to-black/90 shadow-[0_6px_25px_rgba(245,184,15,0.3)]'} border border-amber-400/60 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-amber-300 ring-1 ring-amber-400/25 group`}
              >
                <div className={`p-1.5 rounded-full ${theme === 'light' ? 'bg-amber-100/50 text-amber-600 border-amber-300' : 'bg-amber-400/20 border-amber-400/40 text-amber-300'} border shadow-inner group-hover:scale-110 transition-transform`}>
                  <Calendar className={`w-4 h-4 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <span className={`tracking-wide font-medium ${theme === 'light' ? 'text-amber-950' : 'text-amber-100'} drop-shadow-sm text-xs sm:text-sm`}>
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
            className={`p-8 sm:p-10 rounded-3xl ${theme === 'light' ? 'bg-amber-50/70 border-amber-200/60' : 'bg-amber-950/30 border-amber-500/30'} border backdrop-blur-sm shadow-2xl relative`}
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
                src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/underline-kbach-2.png"
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
            theme={theme}
          />
        </div>

        {/* SECTION: WEDDING AGENDA / SCHEDULE */}
        <div className="relative z-10">
          <ScheduleSection
            shifts={event.schedules?.[0]?.shifts || []}
            language={language}
            primaryColor={config.primaryColor || '#f5b80f'}
            textColor={config.textColor || '#f5b80f'}
            theme={theme}
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
            theme={theme}
          />
        </div>

        {/* SECTION: PHOTO GALLERY & LIGHTBOX */}
        <div className="relative z-10">
          <GallerySection
            photos={photosList}
            language={language}
            primaryColor={config.primaryColor || '#f5b80f'}
            textColor={config.textColor || '#f5b80f'}
            theme={theme}
            eventType={event.eventType}
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
            singlePerson={event.singlePerson}
            language={language}
            primaryColor={config.primaryColor || '#f5b80f'}
            textColor={config.textColor || '#f5b80f'}
            theme={theme}
          />
        </div>

        {/* SECTION: GRATITUDE & SINCERE APOLOGY */}
        <section id="gratitude-section" className="relative z-10 py-8 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`p-6 rounded-2xl ${theme === 'light' ? 'bg-amber-50/50 border-amber-200/50' : 'bg-amber-950/20 border-amber-500/20'} border shadow-lg relative`}
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
            theme={theme}
            isAdmin={isAdmin}
          />
        </div>

        {/* FOOTER: BRAND & REFERENCE */}
        <footer className="relative z-10 pt-8 pb-16 px-6 text-center text-xs text-neutral-500 border-t border-amber-500/10">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span
              style={{ color: config.primaryColor || '#f5b80f' }}
              className="font-moul text-xs"
            >
              {event.singlePerson ? event.groom : `${event.groom} & ${event.bride}`}
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
        theme={theme}
      />

      {/* RSVP MODAL */}
      <RSVPModal
        isOpen={showRSVPModal}
        onClose={() => setShowRSVPModal(false)}
        defaultGuestName={guestName}
        language={language}
        theme={theme}
      />

      {/* SHARE / PERSONALIZE MODAL */}
      <ShareInvitationModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        guestName={guestName}
        onUpdateGuestName={newName => setGuestName(newName)}
        language={language}
        eventId={event.id}
        eventType={event.eventType}
        eventName={event.name}
        singlePerson={event.singlePerson}
        groom={event.groom}
        bride={event.bride}
        weddingDate={event.date}
        locationName={event.location?.name}
        coverImage={event.cover_image || event.image || getCategoryCoverImage(event.eventType || event.id)}
        theme={theme}
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
        theme={theme}
      />

      {/* EVENT TYPE & TEMPLATE CREATOR / MANAGER MODAL */}
      <EventTypeModal
        isOpen={showEventTypeModal}
        onClose={() => setShowEventTypeModal(false)}
        language={language}
        currentEvent={event}
        onApplyTemplate={handleSaveEvent}
        onEditTemplate={eventData => {
          handleSaveEvent(eventData);
          setShowEventTypeModal(false);
          setShowEditorModal(true);
        }}
        theme={theme}
      />

      {/* ADMIN LOGIN MODAL (NETLIFY / GOOGLE AUTH & PASSCODE) */}
      <AnimatePresence>
        {showAdminLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowAdminLoginModal(false)}
          >
            {/* Animated Background Glowing Orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-md ${
                theme === 'light'
                  ? 'bg-[#e0e5ec] text-neutral-800 shadow-[9px_9px_16px_#a3b1c6,-9px_-9px_16px_#ffffff]'
                  : 'bg-[#12161f] text-white shadow-[10px_10px_20px_#07090d,-10px_-10px_20px_#1d2331]'
              } rounded-[2rem] p-8 text-left overflow-hidden border ${
                theme === 'light' ? 'border-white/80' : 'border-white/5'
              }`}
            >
              {/* Decorative Header Ribbon Glow */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 animate-gradient" />

              <button
                type="button"
                onClick={() => setShowAdminLoginModal(false)}
                className={`absolute top-5 right-5 p-2 rounded-full ${
                  theme === 'light'
                    ? 'text-neutral-500 hover:text-neutral-900 bg-amber-100/60 hover:bg-amber-200'
                    : 'text-neutral-400 hover:text-white bg-amber-500/10 hover:bg-amber-500/20'
                } transition-all duration-300 transform hover:rotate-90`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`text-center pb-5 border-b ${theme === 'light' ? 'border-amber-500/30' : 'border-amber-500/20'} mb-6`}>
                <motion.div
                  initial={{ rotate: -15, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/30 to-amber-600/30 border border-amber-400/60 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-[0_0_25px_rgba(245,158,11,0.3)]"
                >
                  <KeyRound className="w-7 h-7 animate-bounce" style={{ animationDuration: '3s' }} />
                </motion.div>
                <h3 className={`text-xl font-moul ${theme === 'light' ? 'text-amber-950' : 'text-amber-200'} tracking-wide`}>
                  {language === 'kh' ? 'ចូលប្រព័ន្ធគ្រប់គ្រង' : 'Admin Portal'}
                </h3>
                <p className={`text-xs ${theme === 'light' ? 'text-amber-800' : 'text-amber-300/80'} font-khmer mt-1.5 leading-relaxed`}>
                  {language === 'kh'
                    ? 'សូមបញ្ចូលលេខសម្ងាត់ម្ចាស់កម្មវិធី ឬចូលតាមគណនី Google ដើម្បីគ្រប់គ្រងធៀបរបស់អ្នក។'
                    : 'Enter your owner passcode or sign in with Google to manage your wedding invitation.'}
                </p>
              </div>

              {/* Tab Switcher */}
              <div className={`flex ${theme === 'light' ? 'bg-amber-50/60 border-amber-300' : 'bg-black/50 border-amber-500/20'} p-1 rounded-2xl border mb-5`}>
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all font-khmer flex items-center justify-center gap-1.5 ${
                    authTab === 'login'
                      ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                      : theme === 'light'
                      ? 'text-neutral-600 hover:text-neutral-900'
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
                      : theme === 'light'
                      ? 'text-neutral-600 hover:text-neutral-900'
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
                    <label className={`block text-xs font-semibold ${theme === 'light' ? 'text-amber-900' : 'text-amber-300'} font-khmer`}>
                      {language === 'kh' ? 'ឈ្មោះពេញ (Full Name):' : 'Full Name:'}
                    </label>
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-khmer focus:outline-none focus:ring-2 focus:ring-amber-400/20 ${
                        theme === 'light'
                          ? 'bg-amber-50/40 border-amber-300 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500'
                          : 'bg-black/60 border-amber-500/40 text-amber-100 placeholder:text-neutral-600 focus:border-amber-400'
                      }`}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`block text-xs font-semibold ${theme === 'light' ? 'text-amber-900' : 'text-amber-300'} font-khmer`}>
                      {language === 'kh' ? 'អ៊ីមែល (Email):' : 'Email Address:'}
                    </label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/20 ${
                        theme === 'light'
                          ? 'bg-amber-50/40 border-amber-300 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500'
                          : 'bg-black/60 border-amber-500/40 text-amber-100 placeholder:text-neutral-600 focus:border-amber-400'
                      }`}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`block text-xs font-semibold ${theme === 'light' ? 'text-amber-900' : 'text-amber-300'} font-khmer`}>
                      {language === 'kh' ? 'បង្កើតលេខសម្ងាត់ថ្មី (Create Passcode):' : 'Create Passcode:'}
                    </label>
                    <input
                      type="password"
                      value={signupPasscode}
                      onChange={(e) => setSignupPasscode(e.target.value)}
                      placeholder="បញ្ចូលលេខសម្ងាត់ (ឧ. love2222)"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/20 ${
                        theme === 'light'
                          ? 'bg-amber-50/40 border-amber-300 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500'
                          : 'bg-black/60 border-amber-500/40 text-amber-100 placeholder:text-neutral-600 focus:border-amber-400'
                      }`}
                      required
                    />
                    {signupMessage && (
                      <p className="text-[11px] text-rose-500 font-khmer">{signupMessage}</p>
                    )}
                    <p className={`text-[11px] ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'} font-khmer`}>
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
                      <label className={`block text-xs font-semibold ${theme === 'light' ? 'text-amber-900' : 'text-amber-300'} font-khmer`}>
                        {language === 'kh' ? 'លេខសម្ងាត់ម្ចាស់កម្មវិធី (Owner Passcode):' : 'Owner Passcode:'}
                      </label>
                      <input
                        type="password"
                        value={adminPasscode}
                        onChange={(e) => setAdminPasscode(e.target.value)}
                        placeholder="បញ្ចូលលេខសម្ងាត់ (ឧ. love2222)"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/20 ${
                          theme === 'light'
                            ? 'bg-amber-50/40 border-amber-300 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500'
                            : 'bg-black/60 border-amber-500/40 text-amber-100 placeholder:text-neutral-600 focus:border-amber-400'
                        }`}
                        autoFocus
                      />
                      {passcodeError && (
                        <p className="text-[11px] text-rose-500 font-khmer">{passcodeError}</p>
                      )}
                      <p className={`text-[11px] ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'} font-khmer`}>
                        {language === 'kh' ? '💡 លេខសម្ងាត់លំនាំដើម៖ love2222' : '💡 Default passcode: love2222'}
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-khmer font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{language === 'kh' ? 'បញ្ជូល' : 'Enter'}</span>
                    </button>
                  </form>

                  <div className="relative my-5 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${theme === 'light' ? 'border-neutral-200' : 'border-white/10'}`} /></div>
                    <span className={`relative px-3 ${theme === 'light' ? 'bg-white text-neutral-500' : 'bg-black text-neutral-400'} text-[11px] font-khmer`}>
                      {language === 'kh' ? 'ឬ ចូលតាម Google' : 'OR Google Sign-In'}
                    </span>
                  </div>

                  {/* Google Sign In Option */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className={`w-full py-2.5 px-4 rounded-xl ${
                      theme === 'light'
                        ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300'
                        : 'bg-white hover:bg-neutral-100 text-neutral-800'
                    } font-khmer font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2.5 disabled:opacity-60`}
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
                    <p className="text-[11px] text-rose-500 font-khmer text-center mt-2 leading-relaxed">
                      {googleAuthError}
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Auto-Scroll 1.5x Indicator */}
      {hasOpenedEnvelope && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-5 right-5 z-40"
        >
          <motion.button
            onClick={toggleManualAutoScroll}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3.5 py-2 rounded-full border shadow-lg backdrop-blur-md flex items-center gap-2 text-xs font-khmer transition-all cursor-pointer select-none ${
              isAutoScrolling
                ? 'bg-amber-400 text-amber-950 font-bold border-amber-300 shadow-amber-500/25 ring-2 ring-amber-400/40'
                : 'bg-black/80 text-amber-300 border-amber-500/40 hover:bg-black/95 hover:text-white'
            }`}
            title={
              isAutoScrolling
                ? language === 'kh'
                  ? 'កំពុងរំកិលស្វ័យប្រវត្ត (1.5x) - ចុចដើម្បីផ្អាក'
                  : 'Auto-Scrolling (1.5x) - Tap to pause'
                : language === 'kh'
                ? 'ចុចដើម្បីរំកិលស្វ័យប្រវត្តិ (1.5x)'
                : 'Tap to Auto-Scroll (1.5x)'
            }
          >
            {isAutoScrolling ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-950 fill-amber-950" />
                <span>{language === 'kh' ? 'រំកិលស្វ័យប្រវត្ត 1.5x' : 'Auto Scroll 1.5x'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-950 animate-ping" />
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{language === 'kh' ? 'រំកិល 1.5x' : 'Scroll 1.5x'}</span>
              </>
            )}
          </motion.button>
        </motion.div>
      )}

    </div>
  );
}
