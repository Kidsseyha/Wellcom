import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, IS_FIRESTORE_WRITE_DISABLED, handleFirestoreError, OperationType } from './firebase';
import type { WeddingEvent } from '../types';
import { compressBase64String } from '../utils/imageCompressor';

export interface RSVPRecord {
  id?: string;
  name: string;
  attending: 'yes' | 'no';
  guestCount: number;
  phone: string;
  note: string;
  timestamp: string;
}

/**
 * Helper to compress/downsample large base64 images so they fit securely in Firestore 1MB limits
 */
async function downsampleBase64Image(base64Str: string, maxWidth = 650, maxHeight = 650, quality = 0.6): Promise<string> {
  if (!base64Str || typeof base64Str !== 'string') return base64Str;
  if (!base64Str.startsWith('data:image/')) return base64Str;
  try {
    return await compressBase64String(base64Str, { maxWidth, maxHeight, quality });
  } catch {
    return base64Str;
  }
}

/**
 * Prepares a safe, compact payload specifically bounded for Firestore's 1MB document limit
 */
async function prepareFirestorePayload(event: WeddingEvent): Promise<WeddingEvent> {
  const safeEvent: WeddingEvent = JSON.parse(JSON.stringify(event));

  // Downsample main image
  if (safeEvent.image) {
    safeEvent.image = await downsampleBase64Image(safeEvent.image, 600, 600, 0.58);
  }

  if (safeEvent.config) {
    const cfg = safeEvent.config;
    if (cfg.main_background) cfg.main_background = await downsampleBase64Image(cfg.main_background, 600, 600, 0.55);
    if (cfg.cover_background) cfg.cover_background = await downsampleBase64Image(cfg.cover_background, 600, 600, 0.55);
    if (cfg.details_background) cfg.details_background = await downsampleBase64Image(cfg.details_background, 600, 600, 0.55);
    if (cfg.envelope_header_image && cfg.envelope_header_image !== 'none') {
      cfg.envelope_header_image = await downsampleBase64Image(cfg.envelope_header_image, 450, 450, 0.55);
    }
    if (cfg.event_location) cfg.event_location = await downsampleBase64Image(cfg.event_location, 600, 600, 0.55);
    if (cfg.qr_code) cfg.qr_code = await downsampleBase64Image(cfg.qr_code, 400, 400, 0.55);
    if (cfg.qr_code_riel) cfg.qr_code_riel = await downsampleBase64Image(cfg.qr_code_riel, 400, 400, 0.55);

    // Gallery photos downsampling & video handling
    if (Array.isArray(cfg.galleryPhotos)) {
      const processedGallery: string[] = [];
      for (const p of cfg.galleryPhotos) {
        if (!p) continue;
        if (typeof p === 'string' && p.startsWith('data:video/')) {
          // If video data URL is > 200KB, avoid putting full video data in Firestore document
          if (p.length > 200_000) {
            // Keep first part or omit from Firestore single doc if oversized
            continue;
          } else {
            processedGallery.push(p);
          }
        } else if (typeof p === 'string' && p.startsWith('data:image/')) {
          const downsampled = await downsampleBase64Image(p, 550, 550, 0.55);
          processedGallery.push(downsampled);
        } else {
          processedGallery.push(p);
        }
      }
      cfg.galleryPhotos = processedGallery;
    }
  }

  // Calculate payload size
  let jsonStr = JSON.stringify(safeEvent);
  if (jsonStr.length > 650_000 && safeEvent.config) {
    // Pass 2: High compression to guarantee < 600KB
    const cfg = safeEvent.config;
    if (cfg.main_background) cfg.main_background = await downsampleBase64Image(cfg.main_background, 400, 400, 0.45);
    if (cfg.cover_background) cfg.cover_background = await downsampleBase64Image(cfg.cover_background, 400, 400, 0.45);
    if (cfg.details_background) cfg.details_background = await downsampleBase64Image(cfg.details_background, 400, 400, 0.45);
    if (cfg.event_location) cfg.event_location = await downsampleBase64Image(cfg.event_location, 400, 400, 0.45);
    if (safeEvent.image) safeEvent.image = await downsampleBase64Image(safeEvent.image, 400, 400, 0.45);
    if (Array.isArray(cfg.galleryPhotos)) {
      cfg.galleryPhotos = await Promise.all(
        cfg.galleryPhotos.slice(0, 10).map((p) =>
          typeof p === 'string' && p.startsWith('data:image/')
            ? downsampleBase64Image(p, 380, 380, 0.45)
            : p
        )
      );
    }
  }

  return safeEvent;
}

/**
 * Submit wedding wish/blessing to Firestore and full-stack REST API
 */
export async function submitWishToFirebase(wish: { name: string; message: string; relation: string; timestamp: string }) {
  const wishId = 'wish-' + Date.now();
  const payload = {
    id: wishId,
    name: wish.name || '',
    relationship: wish.relation || '',
    message: wish.message || '',
    likes: 0,
    createdAt: wish.timestamp || new Date().toISOString()
  };

  // 1. Sync with server API
  try {
    await fetch('/api/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.warn('REST API save wish error:', e);
  }

  // 2. Direct Firestore write
  if (!IS_FIRESTORE_WRITE_DISABLED) {
    try {
      const docRef = doc(db, 'wishes', wishId);
      await setDoc(docRef, payload, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `wishes/${wishId}`);
    }
  }

  return payload;
}

/**
 * Add wish alias (same as submitWishToFirebase)
 */
export async function addWishToFirebase(wish: any) {
  return submitWishToFirebase({
    name: wish.name || '',
    message: wish.message || '',
    relation: wish.relation || wish.relationship || '',
    timestamp: wish.createdAt || wish.timestamp || new Date().toISOString()
  });
}

/**
 * Increment heart likes on a wish
 */
export async function likeWishInFirebase(wishId: string) {
  let updatedWish: any = null;

  // 1. Local/Server API update
  try {
    const res = await fetch('/api/wishes');
    const data = await res.json();
    const wishes = data.wishes || [];
    const wish = wishes.find((w: any) => w.id === wishId);
    if (wish) {
      wish.likes = (wish.likes || 0) + 1;
      updatedWish = wish;
      await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wish),
      });
    }
  } catch (e) {
    console.warn('REST API like wish error:', e);
  }

  // 2. Sync directly to Firestore
  if (!IS_FIRESTORE_WRITE_DISABLED) {
    try {
      const docRef = doc(db, 'wishes', wishId);
      if (updatedWish) {
        await setDoc(docRef, updatedWish, { merge: true });
      } else {
        // Fallback fetch from Firestore and increment
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const currentData = snap.data();
          const newLikes = (currentData.likes || 0) + 1;
          await setDoc(docRef, { ...currentData, likes: newLikes }, { merge: true });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `wishes/${wishId}`);
    }
  }
}

/**
 * Delete a wish from both server and Firestore
 */
export async function deleteWishInFirebase(wishId: string): Promise<void> {
  // 1. Delete from REST API
  try {
    await fetch(`/api/wishes/${encodeURIComponent(wishId)}`, {
      method: 'DELETE',
    });
  } catch (e) {
    console.warn('REST API delete wish error:', e);
  }

  // 2. Delete from Firestore
  if (!IS_FIRESTORE_WRITE_DISABLED) {
    try {
      const docRef = doc(db, 'wishes', wishId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `wishes/${wishId}`);
    }
  }
}

/**
 * Submit RSVP response
 */
export async function saveRSVPToFirebase(rsvp: RSVPRecord) {
  const rsvpId = rsvp.id || 'rsvp-' + Date.now();
  const payload = {
    ...rsvp,
    id: rsvpId,
    note: rsvp.note || '',
    timestamp: rsvp.timestamp || new Date().toISOString()
  };

  // 1. Sync with server API
  try {
    await fetch('/api/rsvps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.warn('REST API save RSVP error:', e);
  }

  // 2. Sync with Firestore
  if (!IS_FIRESTORE_WRITE_DISABLED) {
    try {
      const docRef = doc(db, 'rsvps', rsvpId);
      await setDoc(docRef, payload, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `rsvps/${rsvpId}`);
    }
  }

  return payload;
}

/**
 * Sync user profile to Firestore `/users/{userId}` database collection
 */
export async function syncUserProfile(
  user: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null },
  activeEventId?: string
) {
  if (!user || !user.uid) return null;
  const userProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    activeEventId: activeEventId || `event_${user.uid}`,
    role: user.email === 'yoeurn.seyha@diu.edu.kh' ? 'admin' : 'editor',
    lastLoginAt: new Date().toISOString(),
  };

  if (!IS_FIRESTORE_WRITE_DISABLED) {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, userProfile, { merge: true });
    } catch (error) {
      console.warn('Error saving user profile to Firestore:', error);
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  }

  return userProfile;
}

/**
 * Fetch dedicated user wedding event from Firestore or fallback to REST API
 */
export async function fetchUserEvent(userId: string): Promise<WeddingEvent | null> {
  const userEventId = `event_${userId}`;
  return fetchEventFromFirebase(userEventId);
}

/**
 * Fetch wedding event from Firestore or fallback to REST API
 */
export async function fetchEventFromFirebase(eventId: string): Promise<WeddingEvent | null> {
  const targetId = eventId || 'cmgrawhnk0003le0434762j7n';

  // Try fetching from Firestore first
  if (!IS_FIRESTORE_WRITE_DISABLED) {
    try {
      const docRef = doc(db, 'events', targetId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as WeddingEvent;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `events/${targetId}`);
    }
  }

  // Fallback to server REST API
  try {
    const res = await fetch(`/api/event?id=${targetId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.event) return json.event;
    }
  } catch (error) {
    console.warn('REST API fetch event error:', error);
  }
  return null;
}

/**
 * Save wedding event config to both Server and Firestore with defensive size enforcement
 */
export async function saveEventToFirebase(event: WeddingEvent) {
  const eventId = event.id || 'cmgrawhnk0003le0434762j7n';

  // 1. Sync full rich data with server API (supports up to 50MB payload)
  const serverPayload: WeddingEvent = {
    ...event,
    id: eventId,
    name: event.name || 'អាពាហ៍ពិពាហ៍',
    slug: event.slug || 'wedding',
    groom: event.groom || '',
    bride: event.bride || '',
    updatedAt: new Date().toISOString(),
  };

  try {
    await fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serverPayload),
    });
  } catch (e) {
    console.warn('REST API save event error:', e);
  }

  // 2. Sync with Firestore safely with guaranteed lightweight payload (< 600KB)
  if (!IS_FIRESTORE_WRITE_DISABLED) {
    try {
      const firestorePayload = await prepareFirestorePayload(serverPayload);
      const docRef = doc(db, 'events', eventId);
      await setDoc(docRef, firestorePayload, { merge: true });
    } catch (error) {
      console.warn('Firestore write event error (handled defensively):', error);
      handleFirestoreError(error, OperationType.WRITE, `events/${eventId}`);
    }
  }

  return serverPayload;
}

/**
 * Real-time listener for events (prefers Firestore, falls back to polling API)
 */
export function subscribeToEvent(eventId: string, callback: (event: WeddingEvent) => void) {
  const targetId = eventId || 'cmgrawhnk0003le0434762j7n';

  // If writes/reads are enabled, subscribe to Firestore real-time updates
  if (!IS_FIRESTORE_WRITE_DISABLED) {
    try {
      const docRef = doc(db, 'events', targetId);
      return onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          callback(snap.data() as WeddingEvent);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `events/${targetId}`);
      });
    } catch (e) {
      console.warn('Firestore subscription failed, falling back to REST polling:', e);
    }
  }

  // Fallback server REST polling (highly resilient)
  const intervalId = setInterval(async () => {
    try {
      const res = await fetch(`/api/event?id=${targetId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.event) callback(json.event);
      }
    } catch (e) {
      // ignore
    }
  }, 10000);

  return () => clearInterval(intervalId);
}

/**
 * Real-time listener for wishes/blessings
 */
export function subscribeToWishes(callback: (wishes: any[]) => void) {
  if (!IS_FIRESTORE_WRITE_DISABLED) {
    try {
      const wishesCol = collection(db, 'wishes');
      return onSnapshot(wishesCol, (snap) => {
        const wishes: any[] = [];
        snap.forEach((docSnap) => {
          wishes.push(docSnap.data());
        });
        // Sort wishes descending by creation timestamp
        wishes.sort((a, b) => new Date(b.createdAt || b.timestamp || 0).getTime() - new Date(a.createdAt || a.timestamp || 0).getTime());
        callback(wishes);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'wishes');
      });
    } catch (e) {
      console.warn('Firestore subscription for wishes failed, falling back to REST polling:', e);
    }
  }

  // Fallback polling
  const intervalId = setInterval(async () => {
    try {
      const res = await fetch('/api/wishes');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.wishes) callback(json.wishes);
      }
    } catch (e) {
      // ignore
    }
  }, 10000);

  return () => clearInterval(intervalId);
}
