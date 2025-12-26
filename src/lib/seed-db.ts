'use server';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, writeBatch } from 'firebase/firestore';
import { products as staticProducts } from '@/data';

// This config is now only used for the server-side seeding script.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};


// Initialize a temporary Firebase app for the server-side script
const app = getApps().find(a => a.name === 'firestore-seeder') || initializeApp(firebaseConfig, 'firestore-seeder');
const db = getFirestore(app);

export async function seedDatabase() {
  const productsCollection = collection(db, 'products');
  const batch = writeBatch(db);

  staticProducts.forEach((product) => {
    // Use the product's own ID for the document ID
    const docRef = collection(productsCollection).doc(product.id);
    batch.set(docRef, product);
  });

  try {
    await batch.commit();
    return { success: true, message: `${staticProducts.length} products have been successfully seeded.` };
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return { success: false, message: `Error seeding database: ${error.message}` };
  }
}
