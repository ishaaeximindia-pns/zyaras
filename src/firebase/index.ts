
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

/**
 * Checks if the provided Firebase config object is fully populated.
 * @param config The Firebase configuration object.
 * @returns True if the config is valid, false otherwise.
 */
function isConfigValid(config: object): boolean {
    return Object.values(config).every(value => value !== undefined && value !== '');
}

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length) {
    // If already initialized, return the SDKs with the existing App
    return getSdks(getApp());
  }

  // Always initialize with the firebaseConfig from the config file.
  // This works for both local dev (with hardcoded values) and production
  // (where process.env values are populated by the hosting provider).
  const firebaseApp = initializeApp(firebaseConfig);

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
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

