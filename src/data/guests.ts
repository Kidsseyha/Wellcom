export interface GuestPreset {
  id: string;
  name: string;
  category: 'family' | 'vip' | 'friends' | 'colleagues' | 'general';
  categoryLabelKh: string;
  categoryLabelEn: string;
  note?: string;
}

export const DEFAULT_GUEST_PRESETS: GuestPreset[] = [
  {
    id: 'guest-1',
    name: 'ឯកឧត្តម និងលោកជំទាវ',
    category: 'vip',
    categoryLabelKh: 'ភ្ញៀវកិត្តិយសជាន់ខ្ពស់ (VIP)',
    categoryLabelEn: 'VIP Guests',
    note: 'VIP Guest of Honor',
  },
  {
    id: 'guest-2',
    name: 'លោក និងអ្នកស្រី',
    category: 'general',
    categoryLabelKh: 'ភ្ញៀវកិត្តិយសទូទៅ',
    categoryLabelEn: 'General Honored Guests',
    note: 'General Guest',
  },
  {
    id: 'guest-3',
    name: 'លោក ស្រី មករា',
    category: 'friends',
    categoryLabelKh: 'មិត្តភក្តិ (Friends)',
    categoryLabelEn: 'Friends',
    note: 'Close Friend',
  },
  {
    id: 'guest-4',
    name: 'ក្រុមគ្រួសារ និងបងប្អូនសាច់ញាតិ',
    category: 'family',
    categoryLabelKh: 'សាច់ញាតិ (Family)',
    categoryLabelEn: 'Family & Relatives',
    note: 'Family',
  },
  {
    id: 'guest-5',
    name: 'សហការី និងមិត្តរួមការងារ',
    category: 'colleagues',
    categoryLabelKh: 'សហការី (Colleagues)',
    categoryLabelEn: 'Colleagues',
    note: 'Company / Team',
  },
];

const GUEST_STORAGE_KEY = 'wedding_saved_guest_list_v1';

export function getSavedGuests(): GuestPreset[] {
  if (typeof window === 'undefined') return DEFAULT_GUEST_PRESETS;
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) return DEFAULT_GUEST_PRESETS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load saved guests:', e);
  }
  return DEFAULT_GUEST_PRESETS;
}

export function updateGuestInList(id: string, updatedGuest: Partial<GuestPreset>): GuestPreset[] {
  const current = getSavedGuests();
  const updated = current.map(g => (g.id === id ? { ...g, ...updatedGuest } : g));
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update guest:', e);
  }
  return updated;
}

export function deleteGuestFromList(id: string): GuestPreset[] {
  const current = getSavedGuests();
  const updated = current.filter(g => g.id !== id);
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete guest:', e);
  }
  return updated;
}

export function resetGuestsToDefault(): GuestPreset[] {
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(DEFAULT_GUEST_PRESETS));
  } catch (e) {
    console.error('Failed to reset guests:', e);
  }
  return DEFAULT_GUEST_PRESETS;
}

export function saveGuestToList(newGuest: Omit<GuestPreset, 'id'>): GuestPreset[] {
  const current = getSavedGuests();
  const exists = current.find(g => g.name.toLowerCase() === newGuest.name.trim().toLowerCase());
  
  let updated: GuestPreset[];
  if (exists) {
    updated = current.map(g => (g.id === exists.id ? { ...g, ...newGuest } : g));
  } else {
    const newItem: GuestPreset = {
      ...newGuest,
      id: `guest-${Date.now()}`,
    };
    updated = [newItem, ...current];
  }
  
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to persist guest list:', e);
  }
  return updated;
}
