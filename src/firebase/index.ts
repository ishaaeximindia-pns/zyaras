
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const isConfigValid = firebaseConfig && firebaseConfig.apiKey;
  
  // Check if running in a Firebase App Hosting environment
  // @ts-ignore
  if (typeof __FIREBASE_DEFAULTS__ !== 'undefined') {
    const app = getApps().length > 0 ? getApp() : initializeApp();
    return getSdks(app);
  }

  // Fallback for local development or other environments
  if (!isConfigValid) {
     console.error('Firebase config is not valid. Please check your environment variables.');
     // In a real app, you might want to throw an error or handle this more gracefully.
     // For now, we return a mock or empty SDK object to prevent further crashes.
     // This part should ideally not be reached if .env.local is set up correctly.
      return { firebaseApp: null, auth: null, firestore: null };
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getSdks(app);
}

export function getSdks(firebaseApp: FirebaseApp) {
  if (!firebaseApp) {
    throw new Error('Could not initialize Firebase. Please check your configuration.');
  }
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
