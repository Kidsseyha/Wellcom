import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import config from '../firebase-applet-config.json';
import { WEDDING_EVENT, INITIAL_WISHES } from '../src/data/weddingData';
import { DEFAULT_GUEST_PRESETS } from '../src/data/guests';
import { EVENT_PRESETS } from '../src/data/eventTemplates';
import fs from 'fs';
import path from 'path';

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function syncAllToFirestore() {
  console.log(`Starting Firestore synchronization to database: ${config.firestoreDatabaseId}...`);

  // 1. SYSTEM USERS & ADMINS
  console.log('--- 1. Syncing System Users & Admins ---');
  const systemUsers = [
    {
      id: 'user-yoeurn_seyha_diu_edu_kh',
      name: 'Seyha Yoeurn',
      email: 'yoeurn.seyha@diu.edu.kh',
      passcode: 'Admin@1111',
      role: 'admin',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'user-seyhayoeurn2017_gmail_com',
      name: 'yoeurn seyha',
      email: 'seyhayoeurn2017@gmail.com',
      passcode: 'User@1111',
      role: 'user',
      createdAt: '2026-09-30T08:42:38.729Z'
    }
  ];

  for (const user of systemUsers) {
    console.log(`Syncing user: ${user.name} (${user.email})...`);
    await setDoc(doc(db, 'system_users', user.id), user, { merge: true });
  }

  // 2. GUESTS (DEFAULT GUEST PRESETS & ATTENDEES)
  console.log('--- 2. Syncing Guests List ---');
  for (const guest of DEFAULT_GUEST_PRESETS) {
    console.log(`Syncing guest: ${guest.name} (${guest.id})...`);
    await setDoc(doc(db, 'guests', guest.id), {
      ...guest,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }

  // 3. WISHES (DIGITAL GUESTBOOK BLESSINGS)
  console.log('--- 3. Syncing Digital Wishes ---');
  let wishesToSync = [...INITIAL_WISHES];
  const savedWishesFile = path.join(process.cwd(), 'data', 'saved_wishes.json');
  if (fs.existsSync(savedWishesFile)) {
    try {
      const fileWishes = JSON.parse(fs.readFileSync(savedWishesFile, 'utf-8'));
      if (Array.isArray(fileWishes)) {
        for (const fw of fileWishes) {
          if (!wishesToSync.some(w => w.id === fw.id)) {
            wishesToSync.push(fw);
          }
        }
      }
    } catch (e) {
      console.warn('Could not read saved_wishes.json:', e);
    }
  }

  for (const wish of wishesToSync) {
    console.log(`Syncing wish from: ${wish.name} (${wish.id})...`);
    await setDoc(doc(db, 'wishes', wish.id), {
      ...wish,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }

  // 4. RSVPS (RESPONSES)
  console.log('--- 4. Syncing RSVPs ---');
  const sampleRsvps = [
    {
      id: 'rsvp-sample-1',
      name: 'សុខ វិបុល (Sok Vibul)',
      attending: 'yes',
      guestCount: 2,
      phone: '012345678',
      note: 'រីករាយនឹងចូលរួមពិធីមង្គលការ!',
      timestamp: '2026-01-02T08:30:00.000Z'
    },
    {
      id: 'rsvp-sample-2',
      name: 'ចាន់ ស្រីមុំ (Chan Sreymom)',
      attending: 'yes',
      guestCount: 1,
      phone: '098765432',
      note: 'សូមអបអរសាទរគូស្វាមីភរិយាថ្មី!',
      timestamp: '2026-01-03T11:15:00.000Z'
    }
  ];

  for (const rsvp of sampleRsvps) {
    console.log(`Syncing RSVP: ${rsvp.name} (${rsvp.id})...`);
    await setDoc(doc(db, 'rsvps', rsvp.id), rsvp, { merge: true });
  }

  // 5. EVENTS (WEDDING EVENT, TEMPLATE PRESETS & SAVED EVENTS)
  console.log('--- 5. Syncing Events & Templates ---');
  const eventsMap = new Map<string, any>();

  // Primary wedding event
  eventsMap.set(WEDDING_EVENT.id, {
    ...WEDDING_EVENT,
    ownerEmail: 'yoeurn.seyha@diu.edu.kh',
    updatedAt: new Date().toISOString()
  });

  // Presets
  for (const preset of EVENT_PRESETS) {
    if (preset.sampleEvent && preset.sampleEvent.id) {
      eventsMap.set(preset.sampleEvent.id, {
        ...preset.sampleEvent,
        ownerEmail: 'yoeurn.seyha@diu.edu.kh',
        updatedAt: new Date().toISOString()
      });
    }
  }

  // File events
  const savedEventsFile = path.join(process.cwd(), 'data', 'saved_events.json');
  if (fs.existsSync(savedEventsFile)) {
    try {
      const fileEvents = JSON.parse(fs.readFileSync(savedEventsFile, 'utf-8'));
      for (const [key, ev] of Object.entries(fileEvents)) {
        if (ev && typeof ev === 'object' && (ev as any).id) {
          eventsMap.set((ev as any).id, {
            ...ev,
            ownerEmail: 'yoeurn.seyha@diu.edu.kh',
            updatedAt: new Date().toISOString()
          });
        }
      }
    } catch (e) {
      console.warn('Could not read saved_events.json:', e);
    }
  }

  for (const [id, ev] of eventsMap.entries()) {
    console.log(`Syncing event: ${ev.name} (${id})...`);
    await setDoc(doc(db, 'events', id), ev, { merge: true });
  }

  // 6. NOTIFICATIONS
  console.log('--- 6. Syncing Notifications ---');
  const syncNotif = {
    id: 'notif-wellcom-sync',
    title: 'ការធ្វើសមកាលកម្មទិន្នន័យបានជោគជ័យ (Website Data Sync Completed)',
    message: 'រាល់ទិន្នន័យ Admins, Users, Events, Guests, Wishes និង RSVPs ពី https://wellcom-one.vercel.app/ ត្រូវបានរក្សាទុកក្នុង Firestore រួចរាល់។',
    type: 'system',
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'notifications', syncNotif.id), syncNotif, { merge: true });

  console.log('=== All records synchronized to Firestore successfully! ===');
  process.exit(0);
}

syncAllToFirestore().catch(err => {
  console.error('Error during synchronization:', err);
  process.exit(1);
});
