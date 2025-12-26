
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate that all required Firebase config values are present
const isFirebaseConfigValid = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
};

// Initialize Firebase only if config is valid
let firebaseApp: FirebaseApp | null = null;

if (isFirebaseConfigValid()) {
  try {
    firebaseApp = getApps().length === 0 
      ? initializeApp(firebaseConfig as any) 
      : getApp();
  } catch (error) {
    console.error('Firebase initialization error:', error);
    firebaseApp = null;
  }
} else {
  console.warn('Firebase configuration is incomplete. Please set all NEXT_PUBLIC_FIREBASE_* environment variables.');
}

export { firebaseApp };
