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
async function downsampleBase64Image(base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.65): Promise<string> {
  if (!base64Str || typeof base64Str !== 'string' || !base64Str.startsWith('data:image/')) return base64Str;
  return compressBase64String(base64Str, { maxWidth, maxHeight, quality });
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
  const optimizedEvent = { ...event };
  
  // Pass 1: Standard downsampling of base64 images
  if (optimizedEvent.image) {
    optimizedEvent.image = await downsampleBase64Image(optimizedEvent.image, 750, 750, 0.65);
  }
  if (optimizedEvent.config) {
    const cfg = { ...optimizedEvent.config };
    if (cfg.main_background) cfg.main_background = await downsampleBase64Image(cfg.main_background, 750, 750, 0.62);
    if (cfg.cover_background) cfg.cover_background = await downsampleBase64Image(cfg.cover_background, 750, 750, 0.62);
    if (cfg.details_background) cfg.details_background = await downsampleBase64Image(cfg.details_background, 750, 750, 0.62);
    if (cfg.envelope_header_image && cfg.envelope_header_image !== 'none') {
      cfg.envelope_header_image = await downsampleBase64Image(cfg.envelope_header_image, 500, 500, 0.6);
    }
    if (cfg.event_location) cfg.event_location = await downsampleBase64Image(cfg.event_location, 750, 750, 0.62);
    if (cfg.qr_code) cfg.qr_code = await downsampleBase64Image(cfg.qr_code, 450, 450, 0.6);
    if (cfg.qr_code_riel) cfg.qr_code_riel = await downsampleBase64Image(cfg.qr_code_riel, 450, 450, 0.6);
    if (Array.isArray(cfg.galleryPhotos)) {
      cfg.galleryPhotos = await Promise.all(cfg.galleryPhotos.map(p => downsampleBase64Image(p, 700, 700, 0.6)));
    }
    optimizedEvent.config = cfg;
  }

  const eventId = event.id || 'cmgrawhnk0003le0434762j7n';
  let payload: WeddingEvent = {
    ...optimizedEvent,
    id: eventId,
    name: event.name || 'អាពាហ៍ពិពាហ៍',
    slug: event.slug || 'wedding',
    groom: event.groom || '',
    bride: event.bride || '',
    updatedAt: new Date().toISOString(),
  };

  // Check approximate payload size. If > 550KB, perform Pass 2 aggressive compression
  const initialPayloadSize = JSON.stringify(payload).length;
  if (initialPayloadSize > 550000 && payload.config) {
    const cfg = { ...payload.config };
    if (cfg.main_background) cfg.main_background = await downsampleBase64Image(cfg.main_background, 500, 500, 0.5);
    if (cfg.cover_background) cfg.cover_background = await downsampleBase64Image(cfg.cover_background, 500, 500, 0.5);
    if (cfg.details_background) cfg.details_background = await downsampleBase64Image(cfg.details_background, 500, 500, 0.5);
    if (cfg.event_location) cfg.event_location = await downsampleBase64Image(cfg.event_location, 500, 500, 0.5);
    if (payload.image) payload.image = await downsampleBase64Image(payload.image, 500, 500, 0.5);
    if (Array.isArray(cfg.galleryPhotos)) {
      cfg.galleryPhotos = await Promise.all(cfg.galleryPhotos.slice(0, 12).map(p => downsampleBase64Image(p, 450, 450, 0.5)));
    }
    payload.config = cfg;
  }

  // 1. Sync with server API
  try {
    await fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.warn('REST API save event error:', e);
  }

  // 2. Sync with Firestore safely
  if (!IS_FIRESTORE_WRITE_DISABLED) {
    try {
      const docRef = doc(db, 'events', eventId);
      await setDoc(docRef, payload, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `events/${eventId}`);
    }
  }

  return payload;
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
