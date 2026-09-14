import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { DEFAULT_GUEST_PRESETS, GuestPreset } from '../data/guests';

const GUESTS_COLLECTION = 'guests';
const LOCAL_STORAGE_KEY = 'wedding_saved_guest_list_v1';

/**
 * Fetch all guests from Firestore with fallback to localStorage / presets
 */
export async function fetchGuestsFromFirebase(): Promise<GuestPreset[]> {
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
  if (typeof window !== 'undefined' && localStorage.getItem('firestore_quota_exceeded') === 'true') {
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
  return onSnapshot(
    collection(db, GUESTS_COLLECTION),
    snapshot => {
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
    },
    error => {
      handleFirestoreError(error, OperationType.LIST, GUESTS_COLLECTION);
    }
  );
}

/**
 * Save or update guest in Firebase Firestore
 */
export async function saveGuestToFirebase(guest: GuestPreset | Omit<GuestPreset, 'id'>) {
  const guestId = 'id' in guest && guest.id ? guest.id : `guest-${Date.now()}`;
  if (typeof window !== 'undefined' && localStorage.getItem('firestore_quota_exceeded') === 'true') {
    return { ...guest, id: guestId, note: guest.note || '' } as GuestPreset;
  }
  const docRef = doc(db, GUESTS_COLLECTION, guestId);
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

  try {
    await setDoc(docRef, payload, { merge: true });
    return payload as GuestPreset;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${GUESTS_COLLECTION}/${guestId}`);
    throw error;
  }
}

/**
 * Delete a guest from Firebase Firestore
 */
export async function deleteGuestFromFirebase(id: string) {
  try {
    const docRef = doc(db, GUESTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${GUESTS_COLLECTION}/${id}`);
    throw error;
  }
}

/**
 * Clear all guests from Firebase Firestore
 */
export async function clearAllGuestsFromFirebase(guestIds?: string[]) {
  try {
    const querySnapshot = await getDocs(collection(db, GUESTS_COLLECTION));
    const deletePromises = querySnapshot.docs.map(docSnap => 
      deleteDoc(doc(db, GUESTS_COLLECTION, docSnap.id))
    );
    await Promise.all(deletePromises);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    } catch (e) {
      // ignore
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, GUESTS_COLLECTION);
    throw error;
  }
}
