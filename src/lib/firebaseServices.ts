import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  increment,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { WishMessage, WeddingEvent } from '../types';
import { INITIAL_WISHES } from '../data/weddingData';

/* ----------------- DIGITAL WISHES (GUESTBOOK) ----------------- */
const WISHES_COLLECTION = 'wishes';
const WISHES_STORAGE_KEY = 'wedding_wishes_list';

export function subscribeToWishes(callback: (wishes: WishMessage[]) => void) {
  const q = query(collection(db, WISHES_COLLECTION), orderBy('createdAt', 'desc'), limit(100));
  
  return onSnapshot(
    q,
    snapshot => {
      if (!snapshot.empty) {
        const wishes: WishMessage[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data() as WishMessage;
          wishes.push({
            id: docSnap.id,
            name: data.name || '',
            relationship: data.relationship || '',
            message: data.message || '',
            createdAt: data.createdAt || new Date().toISOString(),
            likes: typeof data.likes === 'number' ? data.likes : 0,
          });
        });
        try {
          localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(wishes));
        } catch (e) {
          // ignore
        }
        callback(wishes);
      } else {
        // Fallback / seed
        callback(INITIAL_WISHES);
      }
    },
    error => {
      handleFirestoreError(error, OperationType.LIST, WISHES_COLLECTION);
    }
  );
}

export async function addWishToFirebase(wish: Omit<WishMessage, 'id'>): Promise<WishMessage> {
  const wishId = `wish-${Date.now()}`;
  const docRef = doc(db, WISHES_COLLECTION, wishId);
  const payload: WishMessage = {
    ...wish,
    id: wishId,
    createdAt: new Date().toISOString(),
    likes: wish.likes || 1,
  };

  try {
    await setDoc(docRef, payload);
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${WISHES_COLLECTION}/${wishId}`);
    throw error;
  }
}

export async function likeWishInFirebase(wishId: string) {
  try {
    const docRef = doc(db, WISHES_COLLECTION, wishId);
    await updateDoc(docRef, {
      likes: increment(1),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${WISHES_COLLECTION}/${wishId}`);
  }
}

/* ----------------- RSVPS ----------------- */
const RSVPS_COLLECTION = 'rsvps';

export interface RSVPRecord {
  id?: string;
  name: string;
  attending: 'yes' | 'no';
  guestCount: number;
  phone: string;
  note: string;
  timestamp: string;
}

export async function saveRSVPToFirebase(rsvp: RSVPRecord) {
  const rsvpId = `rsvp-${Date.now()}`;
  const docRef = doc(db, RSVPS_COLLECTION, rsvpId);
  const payload: any = {
    ...rsvp,
    note: rsvp.note !== undefined && rsvp.note !== null ? rsvp.note : '',
    id: rsvpId,
    timestamp: new Date().toISOString(),
  };

  Object.keys(payload).forEach(key => {
    if (payload[key] === undefined) {
      payload[key] = '';
    }
  });

  try {
    await setDoc(docRef, payload);
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${RSVPS_COLLECTION}/${rsvpId}`);
    throw error;
  }
}

/* ----------------- WEDDING EVENT SETTINGS ----------------- */
const EVENTS_COLLECTION = 'events';

export async function fetchEventFromFirebase(eventId: string): Promise<WeddingEvent | null> {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, eventId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as WeddingEvent;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${EVENTS_COLLECTION}/${eventId}`);
  }
  return null;
}

async function downsampleBase64Image(base64Str: string, maxWidth = 900, maxHeight = 900, quality = 0.65): Promise<string> {
  if (!base64Str || typeof base64Str !== 'string' || !base64Str.startsWith('data:image/')) return base64Str;
  if (base64Str.length < 350000) return base64Str; // already under safe size

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = () => resolve(base64Str);
    img.src = base64Str;
  });
}

export async function saveEventToFirebase(event: WeddingEvent) {
  const eventId = event.id || 'cmgrawhnk0003le0434762j7n';
  const docRef = doc(db, EVENTS_COLLECTION, eventId);
  const eventName = event.name || 'អាពាហ៍ពិពាហ៍';

  // Downsample large base64 images to prevent Firestore 1MB document limit error
  const optimizedEvent = { ...event };
  if (optimizedEvent.image) {
    optimizedEvent.image = await downsampleBase64Image(optimizedEvent.image, 800, 800, 0.6);
  }
  if (optimizedEvent.config) {
    const cfg = { ...optimizedEvent.config };
    if (cfg.main_background) cfg.main_background = await downsampleBase64Image(cfg.main_background, 800, 800, 0.6);
    if (cfg.cover_background) cfg.cover_background = await downsampleBase64Image(cfg.cover_background, 800, 800, 0.6);
    if (cfg.details_background) cfg.details_background = await downsampleBase64Image(cfg.details_background, 800, 800, 0.6);
    if (cfg.envelope_header_image && cfg.envelope_header_image !== 'none') {
      cfg.envelope_header_image = await downsampleBase64Image(cfg.envelope_header_image, 600, 600, 0.6);
    }
    if (cfg.event_location) cfg.event_location = await downsampleBase64Image(cfg.event_location, 800, 800, 0.6);
    if (cfg.qr_code) cfg.qr_code = await downsampleBase64Image(cfg.qr_code, 500, 500, 0.6);
    if (cfg.qr_code_riel) cfg.qr_code_riel = await downsampleBase64Image(cfg.qr_code_riel, 500, 500, 0.6);
    if (Array.isArray(cfg.galleryPhotos)) {
      cfg.galleryPhotos = await Promise.all(
        cfg.galleryPhotos.map(p => downsampleBase64Image(p, 800, 800, 0.6))
      );
    }
    optimizedEvent.config = cfg;
  }

  const payload = {
    ...optimizedEvent,
    id: eventId,
    name: eventName,
    title: eventName,
    groom: event.groom || '',
    groom_name: event.groom || '',
    bride: event.bride || '',
    bride_name: event.bride || '',
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(docRef, payload, { merge: true });
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${EVENTS_COLLECTION}/${eventId}`);
    throw error;
  }
}
