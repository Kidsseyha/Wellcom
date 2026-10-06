import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import rawConfig from '../firebase-applet-config.json';
import { WEDDING_EVENT } from '../src/data/weddingData';
import { EVENT_PRESETS } from '../src/data/eventTemplates';
import { DEFAULT_GUEST_PRESETS } from '../src/data/guests';

const firebaseConfig = {
  projectId: rawConfig.projectId,
  appId: rawConfig.appId,
  apiKey: rawConfig.apiKey,
  authDomain: rawConfig.authDomain,
  firestoreDatabaseId: (rawConfig as any).firestoreDatabaseId || '(default)',
  storageBucket: rawConfig.storageBucket,
  messagingSenderId: rawConfig.messagingSenderId,
  oAuthClientId: rawConfig.oAuthClientId,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function seedAll() {
  console.log('--- Starting Firestore Seeding for wellcom-one.vercel.app ---');
  console.log('Project ID:', firebaseConfig.projectId);
  console.log('Database ID:', firebaseConfig.firestoreDatabaseId);

  // 1. Seed Main Event: cmgrawhnk0003le0434762j7n
  console.log('\n[1/5] Seeding Main Wedding Event: cmgrawhnk0003le0434762j7n...');
  await setDoc(doc(db, 'events', 'cmgrawhnk0003le0434762j7n'), {
    ...WEDDING_EVENT,
    id: 'cmgrawhnk0003le0434762j7n',
    updatedAt: new Date().toISOString(),
  }, { merge: true });
  console.log('✓ Main event seeded successfully.');

  // 2. Seed All Preset Templates
  console.log('\n[2/5] Seeding Template Preset Events...');
  for (const preset of EVENT_PRESETS) {
    const eventId = preset.sampleEvent.id;
    console.log(` - Seeding preset: ${preset.titleKh} (${eventId})`);
    await setDoc(doc(db, 'events', eventId), {
      ...preset.sampleEvent,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  }
  console.log('✓ All template presets seeded successfully.');

  // 3. Seed Guest List Records
  console.log('\n[3/5] Seeding Guest List Records...');
  for (const guest of DEFAULT_GUEST_PRESETS) {
    console.log(` - Seeding guest: ${guest.name} (${guest.id})`);
    await setDoc(doc(db, 'guests', guest.id), {
      id: guest.id,
      name: guest.name,
      category: guest.category,
      categoryLabelKh: guest.categoryLabelKh,
      categoryLabelEn: guest.categoryLabelEn,
      note: guest.note || '',
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  }
  console.log('✓ All guest records seeded successfully.');

  // 4. Seed Sample Wedding Wishes / Guestbook
  console.log('\n[4/5] Seeding Wedding Wishes & Blessings...');
  const sampleWishes = [
    {
      id: 'wish-1',
      name: 'ឯកឧត្តម និងលោកជំទាវ',
      relationship: 'ភ្ញៀវកិត្តិយសជាន់ខ្ពស់',
      message: 'សូមប្រសិទ្ធពរជ័យ សិរីសួស្តី ជ័យមង្គល វិបុលសុខ គ្រប់ប្រការ ជូនដល់គូស្វាមីភរិយាថ្មី ស្រឡាញ់គ្នារហូតដល់ចាស់កោងខ្នង!',
      likes: 12,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'wish-2',
      name: 'ក្រុមគ្រួសារ និងបងប្អូន',
      relationship: 'ក្រុមគ្រួសារ',
      message: 'រីករាយថ្ងៃមង្គលការកូនទាំងពីរ! សូមឱ្យមានសុភមង្គល ជោគជ័យ និងរកស៊ីមានបានត្រជាក់ត្រជុំដូចទឹកអម្រឹត។',
      likes: 8,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'wish-3',
      name: 'សហការី និងមិត្តភក្តិ',
      relationship: 'មិត្តភក្តិ',
      message: 'Congratulations Ro Malay & Uom Volak on your wedding day! Wishing you a lifetime of love, joy, and prosperity!',
      likes: 15,
      createdAt: new Date().toISOString(),
    },
  ];

  for (const wish of sampleWishes) {
    console.log(` - Seeding wish: ${wish.id} from ${wish.name}`);
    await setDoc(doc(db, 'wishes', wish.id), wish, { merge: true });
  }
  console.log('✓ All sample wishes seeded successfully.');

  // 5. Seed System User & Admin Profile
  console.log('\n[5/5] Seeding System User & Admin Profile...');
  await setDoc(doc(db, 'system_users', 'yoeurn-seyha'), {
    id: 'yoeurn-seyha',
    email: 'yoeurn.seyha@diu.edu.kh',
    displayName: 'ប្រុសស្អាត យឿន សីហា',
    role: 'super_admin',
    isAdmin: true,
    canEdit: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }, { merge: true });
  console.log('✓ System user seeded successfully.');

  console.log('\n=============================================');
  console.log('🎉 ALL RECORDS SEEDED TO FIRESTORE SUCCESSFULLY!');
  console.log('=============================================');
  process.exit(0);
}

seedAll().catch(err => {
  console.error('Error seeding to Firestore:', err);
  process.exit(1);
});
