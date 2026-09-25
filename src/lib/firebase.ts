import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDocFromServer, disableNetwork, setLogLevel } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import rawConfig from '../../firebase-applet-config.json';

// Use environment variables if set (e.g. in Vercel project settings), otherwise fallback to bundled config
export const firebaseConfig = {
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || rawConfig.projectId,
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || rawConfig.appId,
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || rawConfig.apiKey,
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || rawConfig.authDomain,
  firestoreDatabaseId: (import.meta.env.VITE_FIREBASE_DATABASE_ID as string) || (rawConfig as any).firestoreDatabaseId || '(default)',
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || rawConfig.storageBucket,
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || rawConfig.messagingSenderId,
  oAuthClientId: (import.meta.env.VITE_FIREBASE_OAUTH_CLIENT_ID as string) || rawConfig.oAuthClientId,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Silence internal Firestore SDK retry and warning logs
try {
  setLogLevel('silent');
} catch {
  // ignore
}

// Initialize Firestore with the database ID specified in config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Enable direct Firestore writes
export const IS_FIRESTORE_WRITE_DISABLED = false;

if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('firestore_quota_exceeded');
  } catch {
    // ignore
  }
}

let isNetworkDisabled = false;

// Test connection on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

// Error handling helper as required by Firebase specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorObj = error as any;
  const code = errorObj?.code || '';
  const message = error instanceof Error ? error.message : String(error);

  if (
    code === 'resource-exhausted' ||
    code.includes('resource-exhausted') ||
    message.includes('resource-exhausted') ||
    message.includes('Quota limit exceeded') ||
    message.includes('Quota exceeded')
  ) {
    try {
      localStorage.setItem('firestore_quota_exceeded', 'true');
    } catch (e) {}

    if (!isNetworkDisabled) {
      isNetworkDisabled = true;
      disableNetwork(db).catch(() => {});
      console.warn('Firestore write quota exceeded. Disabled Firestore network to stop backoff retry loops.');
    }
    return { error: message, operationType, path, authInfo: {} };
  }

  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}
