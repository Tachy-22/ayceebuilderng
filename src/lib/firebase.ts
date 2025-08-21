// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";
import { getFirebaseConfig } from "./env";

// Initialize Firebase with validation
let app: any = null;
let analytics: Analytics | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;

try {
  const firebaseConfig = getFirebaseConfig();
  
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firestore and Auth for both client and server
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);

  // Initialize analytics only on the client side
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization failed:', error);
  
  // In production, we want to fail gracefully
  if (process.env.NODE_ENV === 'production') {
    console.error('Firebase configuration error in production. Please check environment variables.');
  }
}

export { app, analytics, db, storage, auth };
