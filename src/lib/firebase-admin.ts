// Use proper Firebase Admin SDK for server-side operations
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
let adminApp;
if (getApps().length === 0) {
  // In production, use service account key, in development use client config
  if (process.env.NODE_ENV === 'production' && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Production: Use service account
    adminApp = initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } else {
    // Development: Use client config (fallback)
    adminApp = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
} else {
  adminApp = getApps()[0];
}

const adminDb = getFirestore(adminApp);

export { adminDb };