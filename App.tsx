import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, persistor, RootState } from "./src/Store/store";
import { NavigationContainer } from "@react-navigation/native";
import { PersistGate } from 'redux-persist/integration/react';
import StackNavigator from "./src/Navigation/StackNavigator"; // Use the Root Stack
import { theme } from './src/Global/theme';
import { StatusBar } from 'expo-status-bar';
import { initDatabase } from './src/Services/database';
import { navigationRef } from './src/Navigation/navigationService';
import { onAuthChange } from './src/Services/authService';
import { setUser } from './src/Features/auth/authSlice';

/**
 * AuthListener - Monitors Firebase auth state changes
 */
function AuthListener() {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthChange((user) => {
            dispatch(setUser(user));
            // Navigation logic could go here, but usually handled in Login/Profile
        });
        return () => unsubscribe();
    }, [dispatch]);

    return null;
}

/**
 * App - Entry Point
 * 
 * Provides:
 * 1. Redux Store (State management)
 * 2. Navigation Container (Routing)
 * 3. Centralized Theme System (Visual consistency)
 * 4. Firebase Auth State Listener
 * 
 * @returns {JSX.Element} The root component of the application.
 */
export default function App(): JSX.Element {
    useEffect(() => {
        initDatabase();
    }, []);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AuthListener />
                <NavigationContainer ref={navigationRef}>
                    <StatusBar style="light" backgroundColor={theme.colors.background} />
                    <StackNavigator />
                </NavigationContainer>
            </PersistGate>
        </Provider>
    );
}
