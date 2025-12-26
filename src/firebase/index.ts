
'use client';

// This file is the entry point for all client-side Firebase functionality.
// It re-exports modules that are safe to use in client components.

export * from './provider';
export * from './client-provider';
export * from './client'; // Exporting the new client-safe firebaseApp
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
