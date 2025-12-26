'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { firebaseApp } from '@/firebase/client';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    if (!firebaseApp) {
      console.warn('Firebase is not initialized. Please set all NEXT_PUBLIC_FIREBASE_* environment variables.');
      return { firebaseApp: null, auth: null, firestore: null };
    }
    try {
      const auth = getAuth(firebaseApp);
      const firestore = getFirestore(firebaseApp);
      return { firebaseApp, auth, firestore };
    } catch (error) {
      console.error('Error initializing Firebase services:', error);
      return { firebaseApp: null, auth: null, firestore: null };
    }
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
