import React, { useEffect } from 'react';
import { Provider, useDispatch } from "react-redux";
import { store, persistor } from "./src/Store/store";
import { NavigationContainer } from "@react-navigation/native";
import { PersistGate } from 'redux-persist/integration/react';
import TabNavigator from "./src/Navigation/TabNavigator";
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
                    <TabNavigator />
                </NavigationContainer>
            </PersistGate>
        </Provider>
    );
}
