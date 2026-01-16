import { Middleware } from '@reduxjs/toolkit';

/**
 * Security Middleware - Agent 2
 * Sanitizes input and validates patterns before they reach the store.
 */
export const securityMiddleware: Middleware = (store) => (next) => (action: any) => {
    // Simple sanitization for string payloads
    if (action.payload && typeof action.payload === 'object') {
        Object.keys(action.payload).forEach(key => {
            if (typeof action.payload[key] === 'string') {
                // Basic XSS prevention: remove script tags
                action.payload[key] = action.payload[key].replace(/<script.*?>.*?<\/script>/gi, '');
            }
        });
    }

    // Example: Validate if the action is allowed (e.g., checking tokens in state)
    // const state = store.getState();
    // if (action.type.startsWith('favorites/') && !state.auth.isAuthenticated) {
    //   console.warn('Unauthorized favorite action');
    //   return;
    // }

    return next(action);
};
