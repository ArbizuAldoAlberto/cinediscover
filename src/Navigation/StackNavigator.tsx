import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../Screens/Login";
import TabNavigator from "./TabNavigator"; // Import TabNavigator
import MovieDetail from "../Screens/MovieDetail";
import { theme } from '../Global/theme';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.colors.background },
            }}
        >
            <Stack.Screen
                name="Login"
                component={Login}
            />
            {/* Main Application with Tabs */}
            <Stack.Screen
                name="MainTabs"
                component={TabNavigator}
            />
            {/* Global screens accessible from anywhere */}
            <Stack.Screen
                name="Detail"
                component={MovieDetail}
                options={{
                    presentation: 'card', // Or 'modal' for a cool effect
                    animation: 'slide_from_right'
                }}
            />
        </Stack.Navigator>
    );
}
