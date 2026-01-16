import React, { useEffect } from 'react';
import { Provider } from "react-redux";
import { store, persistor } from "./src/Store/store";
import { NavigationContainer } from "@react-navigation/native";
import { PersistGate } from 'redux-persist/integration/react';
import TabNavigator from "./src/Navigation/TabNavigator";
import { theme } from './src/Global/theme';
import { StatusBar } from 'expo-status-bar';
import { initDatabase } from './src/Services/database';
import { navigationRef } from './src/Navigation/navigationService';

/**
 * App - Entry Point
 * 
 * Provides:
 * 1. Redux Store (State management)
 * 2. Navigation Container (Routing)
 * 3. Centralized Theme System (Visual consistency)
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
                <NavigationContainer ref={navigationRef}>
                    <StatusBar style="light" backgroundColor={theme.colors.background} />
                    <TabNavigator />
                </NavigationContainer>
            </PersistGate>
        </Provider>
    );
}
