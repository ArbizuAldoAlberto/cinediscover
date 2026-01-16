/**
 * @file firebaseConfig.ts
 * @description Firebase configuration and initialization
 * @security All sensitive credentials are stored in .env (not committed to Git)
 */

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Read from environment variables (Expo uses EXPO_PUBLIC_ prefix for client-side vars)
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || "",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || ""
};

// Validation: Warn if environment variables are not set
if (!firebaseConfig.apiKey) {
    console.warn(
        '⚠️ Firebase API Key not found. Please create a .env file based on .env.example'
    );
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize services
export const database = getDatabase(app);
export const auth = getAuth(app);

// Export config for reference
export { firebaseConfig };
