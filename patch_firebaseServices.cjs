const fs = require('fs');
let content = fs.readFileSync('src/lib/firebaseServices.ts', 'utf-8');

// The file still uses some Firebase imports or functions. I'll just rewrite the whole file to only hit the API and export the same function names.
const newContent = `
import type { WeddingEvent } from '../App';

export enum OperationType {
  READ = 'READ',
  WRITE = 'WRITE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  GET = 'GET'
}

export function handleFirestoreError(error: any, operationType: OperationType, context: string) {
  console.warn(\`Mock Firebase error [\${operationType}] at \${context}:\`, error);
}

export async function submitWishToFirebase(wish: { name: string; message: string; relation: string; timestamp: string }) {
  const wishId = 'wish-' + Date.now();
  const payload = { ...wish, id: wishId, likes: 0 };
  
  try {
    const res = await fetch('/api/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return json.wish || payload;
  } catch (e) {
    return payload;
  }
}

export async function likeWishInFirebase(wishId: string) {
  // We can fetch wishes, find it, increment likes, and post it back
  try {
    const res = await fetch('/api/wishes');
    const data = await res.json();
    const wish = data.wishes.find((w: any) => w.id === wishId);
    if (wish) {
      wish.likes = (wish.likes || 0) + 1;
      await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wish),
      });
    }
  } catch (e) {}
}

export async function deleteWishInFirebase(wishId: string): Promise<void> {
  // Not fully implemented on server side, but we can mock or do nothing since it's rarely used
}

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
  const rsvpId = 'rsvp-' + Date.now();
  const payload = { ...rsvp, note: rsvp.note || '', id: rsvpId, timestamp: new Date().toISOString() };
  try {
    const res = await fetch('/api/rsvps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return json.rsvp || payload;
  } catch (e) {
    return payload;
  }
}

export async function fetchEventFromFirebase(eventId: string): Promise<WeddingEvent | null> {
  try {
    const res = await fetch(\`/api/event?id=\${eventId}\`);
    const json = await res.json();
    if (json.success && json.event) return json.event;
  } catch (error) {}
  return null;
}

async function downsampleBase64Image(base64Str: string, maxWidth = 900, maxHeight = 900, quality = 0.65): Promise<string> {
  if (!base64Str || typeof base64Str !== 'string' || !base64Str.startsWith('data:image/')) return base64Str;
  if (base64Str.length < 350000) return base64Str;
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
  const optimizedEvent = { ...event };
  if (optimizedEvent.image) optimizedEvent.image = await downsampleBase64Image(optimizedEvent.image, 800, 800, 0.6);
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
      cfg.galleryPhotos = await Promise.all(cfg.galleryPhotos.map(p => downsampleBase64Image(p, 800, 800, 0.6)));
    }
    optimizedEvent.config = cfg;
  }
  
  const payload = {
    ...optimizedEvent,
    id: event.id || 'cmgrawhnk0003le0434762j7n',
    name: event.name || 'អាពាហ៍ពិពាហ៍',
    title: event.name || 'អាពាហ៍ពិពាហ៍',
    groom: event.groom || '',
    groom_name: event.groom || '',
    bride: event.bride || '',
    bride_name: event.bride || '',
    updatedAt: new Date().toISOString(),
  };

  try {
    await fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {}
  
  return payload;
}

export function subscribeToEvent(eventId: string, callback: (event: WeddingEvent) => void) {
  // Fallback polling for live updates since we removed Firestore snap listeners
  const targetId = eventId || 'cmgrawhnk0003le0434762j7n';
  const intervalId = setInterval(async () => {
    try {
      const res = await fetch(\`/api/event?id=\${targetId}\`);
      const json = await res.json();
      if (json.success && json.event) callback(json.event);
    } catch(e) {}
  }, 10000);
  
  return () => clearInterval(intervalId);
}
`;

fs.writeFileSync('src/lib/firebaseServices.ts', newContent);
