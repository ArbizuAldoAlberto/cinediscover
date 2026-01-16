/**
 * @file authService.ts
 * @description Firebase Authentication service with email/password and social login
 */

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { auth } from './firebaseConfig';

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
}

/**
 * Register a new user with email and password
 */
export const registerUser = async (email: string, password: string): Promise<AuthUser> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName
        };
    } catch (error: any) {
        throw new Error(error.message || 'Registration failed');
    }
};

/**
 * Sign in existing user with email and password
 */
export const loginUser = async (email: string, password: string): Promise<AuthUser> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName
        };
    } catch (error: any) {
        throw new Error(error.message || 'Login failed');
    }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);
    } catch (error: any) {
        throw new Error(error.message || 'Sign out failed');
    }
};

/**
 * Subscribe to auth state changes
 */
export const onAuthChange = (callback: (user: AuthUser | null) => void) => {
    return onAuthStateChanged(auth, (firebaseUser: User | null) => {
        if (firebaseUser) {
            callback({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName
            });
        } else {
            callback(null);
        }
    });
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): AuthUser | null => {
    const user = auth.currentUser;
    if (user) {
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
        };
    }
    return null;
};
