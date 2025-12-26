'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-in. */
export async function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
  if (!authInstance) {
    throw new Error('Auth instance is not available');
  }
  await signInWithEmailAndPassword(authInstance, email, password);
  // Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate Google sign-in (non-blocking). */
export async function initiateGoogleSignIn(authInstance: Auth | null): Promise<any> {
  if (!authInstance) {
    throw new Error('Auth instance is not available');
  }
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  // This needs to be awaited as it opens a popup
  return await signInWithPopup(authInstance, provider);
}

/** Initiate phone number sign-in. */
export async function initiatePhoneSignIn(
  authInstance: Auth | null,
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  if (!authInstance) {
    throw new Error('Auth instance is not available');
  }
  if (!recaptchaVerifier) {
    throw new Error('reCAPTCHA verifier is not available');
  }
  return await signInWithPhoneNumber(authInstance, phoneNumber, recaptchaVerifier);
}
