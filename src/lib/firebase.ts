import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDocFromServer, disableNetwork } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with the database ID specified in config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

let isNetworkDisabled = false;

// If previously detected quota exceeded, immediately disable network to prevent background backoff retries
if (typeof window !== 'undefined' && localStorage.getItem('firestore_quota_exceeded') === 'true') {
  isNetworkDisabled = true;
  disableNetwork(db).catch(() => {});
}

// Test connection on boot
export async function testFirestoreConnection() {
  if (typeof window !== 'undefined' && localStorage.getItem('firestore_quota_exceeded') === 'true') {
    return;
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('the client is offline')) {
      console.warn('Firestore client is currently offline or connecting...');
    } else if (msg.includes('resource-exhausted') || msg.includes('Quota limit exceeded')) {
      handleFirestoreError(error, OperationType.GET, 'test/connection');
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
