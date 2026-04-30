import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Handle potential nested default from JSON import (Vite can sometimes nest it)
const rawConfig: any = firebaseConfig;
const firebaseOptions = rawConfig.default || rawConfig;

console.log('Firebase: Initializing...');

let app;
let db: any;
let auth: any;

try {
  if (!firebaseOptions || !firebaseOptions.apiKey || firebaseOptions.apiKey === 'ISI_API_KEY_VALID') {
    console.warn('Firebase: API Key is invalid or placeholder. Authentication features may not work.');
  }
  app = initializeApp(firebaseOptions);
  db = getFirestore(app, firebaseOptions.firestoreDatabaseId || '(default)');
  auth = getAuth(app);

  // Validate Connection to Firestore
  const testConnection = async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
    }
  };
  testConnection();
} catch (error) {
  console.error('Firebase: Critical initialization error:', error);
  // Provide mock objects to prevent top-level import crashes, 
  // though real auth features will fail gracefully later.
  app = {} as any;
  db = {} as any;
  auth = { 
    onAuthStateChanged: (cb: any) => {
      // Immediately call with null to prevent app from hanging in "loading" state
      setTimeout(() => cb(null), 0);
      return () => {};
    },
    currentUser: null
  } as any;
}

export { db, auth };

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
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  const errorJson = JSON.stringify(errInfo);
  console.error('Firestore Error: ', errorJson);
  throw new Error(errorJson);
}
