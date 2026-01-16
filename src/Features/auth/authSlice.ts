/**
 * @file authSlice.ts
 * @description Redux slice for authentication state management
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '../../Services/authService';

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<AuthUser | null>) => {
            state.user = action.payload;
            state.isAuthenticated = action.payload !== null;
            state.isLoading = false;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        }
    }
});

export const { setUser, setLoading, setError, clearError, logout } = authSlice.actions;
export default authSlice.reducer;
