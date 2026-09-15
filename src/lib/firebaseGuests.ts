import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, IS_FIRESTORE_WRITE_DISABLED } from '../lib/firebase';
import { DEFAULT_GUEST_PRESETS, GuestPreset } from '../data/guests';

const GUESTS_COLLECTION = 'guests';
const LOCAL_STORAGE_KEY = 'wedding_saved_guest_list_v1';

/**
 * Fetch all guests from Firestore with fallback to server API / localStorage / presets
 */
export async function fetchGuestsFromFirebase(): Promise<GuestPreset[]> {
  // Check server API first if Firestore writes are disabled
  try {
    const res = await fetch('/api/guests');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.guests) && data.guests.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.guests));
        return data.guests;
      }
    }
  } catch {
    // ignore
  }

  try {
    const querySnapshot = await getDocs(collection(db, GUESTS_COLLECTION));
    if (!querySnapshot.empty) {
      const guests: GuestPreset[] = [];
      querySnapshot.forEach(docSnap => {
        const data = docSnap.data() as GuestPreset;
        guests.push({
          id: docSnap.id,
          name: data.name || '',
          category: data.category || 'general',
          categoryLabelKh: data.categoryLabelKh || 'ទូទៅ',
          categoryLabelEn: data.categoryLabelEn || 'General',
          note: data.note || '',
        });
      });
      // Sync to localStorage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(guests));
      } catch (e) {
        // ignore
      }
      return guests;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, GUESTS_COLLECTION);
  }

  // Fallback to local storage or defaults without burning Firestore write quotas
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      return JSON.parse(local);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_GUEST_PRESETS));
  } catch (e) {
    // ignore
  }

  return DEFAULT_GUEST_PRESETS;
}

/**
 * Seed initial presets to Firebase if collection is empty
 */
export async function seedDefaultGuestsToFirebase() {
  if (IS_FIRESTORE_WRITE_DISABLED || (typeof window !== 'undefined' && localStorage.getItem('firestore_quota_exceeded') === 'true')) {
    return;
  }
  try {
    for (const preset of DEFAULT_GUEST_PRESETS) {
      const docRef = doc(db, GUESTS_COLLECTION, preset.id);
      await setDoc(
        docRef,
        {
          ...preset,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, GUESTS_COLLECTION);
  }
}

/**
 * Real-time listener for guests from Firebase
 */
export function subscribeToGuests(callback: (guests: GuestPreset[]) => void) {
  const fallbackGuests = () => {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (local) {
        callback(JSON.parse(local));
        return;
      }
    } catch {
      // ignore
    }
    fetch('/api/guests')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.guests) && data.guests.length > 0) {
          callback(data.guests);
        } else {
          callback(DEFAULT_GUEST_PRESETS);
        }
      })
      .catch(() => callback(DEFAULT_GUEST_PRESETS));
  };

  try {
    return onSnapshot(
      collection(db, GUESTS_COLLECTION),
      snapshot => {
        if (!snapshot.empty) {
          const guests: GuestPreset[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data() as GuestPreset;
            guests.push({
              id: docSnap.id,
              name: data.name || '',
              category: data.category || 'general',
              categoryLabelKh: data.categoryLabelKh || 'ទូទៅ',
              categoryLabelEn: data.categoryLabelEn || 'General',
              note: data.note || '',
            });
          });

          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(guests));
          } catch (e) {
            // ignore
          }
          callback(guests);
        } else {
          fallbackGuests();
        }
      },
      error => {
        fallbackGuests();
      }
    );
  } catch {
    fallbackGuests();
    return () => {};
  }
}

/**
 * Save or update guest in Firebase Firestore
 */
export async function saveGuestToFirebase(guest: GuestPreset | Omit<GuestPreset, 'id'>) {
  const guestId = 'id' in guest && guest.id ? guest.id : `guest-${Date.now()}`;
  const payload: any = {
    ...guest,
    note: guest.note !== undefined && guest.note !== null ? guest.note : '',
    id: guestId,
    updatedAt: new Date().toISOString(),
  };

  // Ensure no undefined properties exist
  Object.keys(payload).forEach(key => {
    if (payload[key] === undefined) {
      payload[key] = '';
    }
  });

  // Always update local storage
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    let list: GuestPreset[] = local ? JSON.parse(local) : [...DEFAULT_GUEST_PRESETS];
    const idx = list.findIndex(g => g.id === guestId);
    if (idx >= 0) {
      list[idx] = payload;
    } else {
      list.push(payload);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }

  // Always sync with server API
  try {
    await fetch('/api/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // ignore
  }

  if (IS_FIRESTORE_WRITE_DISABLED || (typeof window !== 'undefined' && localStorage.getItem('firestore_quota_exceeded') === 'true')) {
    return payload as GuestPreset;
  }

  const docRef = doc(db, GUESTS_COLLECTION, guestId);

  try {
    await setDoc(docRef, payload, { merge: true });
    return payload as GuestPreset;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${GUESTS_COLLECTION}/${guestId}`);
    return payload as GuestPreset;
  }
}

/**
 * Delete a guest from Firebase Firestore
 */
export async function deleteGuestFromFirebase(id: string) {
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      const list = JSON.parse(local).filter((g: any) => g.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    }
  } catch {
    // ignore
  }

  try {
    await fetch(`/api/guests?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch {
    // ignore
  }

  if (IS_FIRESTORE_WRITE_DISABLED || (typeof window !== 'undefined' && localStorage.getItem('firestore_quota_exceeded') === 'true')) {
    return;
  }

  try {
    const docRef = doc(db, GUESTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${GUESTS_COLLECTION}/${id}`);
  }
}

/**
 * Clear all guests from Firebase Firestore
 */
export async function clearAllGuestsFromFirebase(guestIds?: string[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
  } catch (e) {
    // ignore
  }

  if (IS_FIRESTORE_WRITE_DISABLED || (typeof window !== 'undefined' && localStorage.getItem('firestore_quota_exceeded') === 'true')) {
    return;
  }

  try {
    const querySnapshot = await getDocs(collection(db, GUESTS_COLLECTION));
    const deletePromises = querySnapshot.docs.map(docSnap => 
      deleteDoc(doc(db, GUESTS_COLLECTION, docSnap.id))
    );
    await Promise.all(deletePromises);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, GUESTS_COLLECTION);
  }
}
