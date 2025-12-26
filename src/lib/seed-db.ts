'use server';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch } from 'firebase/firestore';
import { products as staticProducts } from '@/data';
import { firebaseConfig } from '@/firebase/config';

// Initialize a temporary Firebase app for the server-side script
const app = initializeApp(firebaseConfig, 'firestore-seeder');
const db = getFirestore(app);

export async function seedDatabase() {
  const productsCollection = collection(db, 'products');
  const batch = writeBatch(db);

  staticProducts.forEach((product) => {
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
