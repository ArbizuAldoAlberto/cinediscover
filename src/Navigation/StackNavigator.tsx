import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../Screens/Home";
import Movies from "../Screens/Movies";
import MovieDetail from "../Screens/MovieDetail";
import Favorites from "../Screens/Favorites";
import Login from "../Screens/Login";
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
            <Stack.Screen
                name="HomeScreen"
                component={Home}
            />
            <Stack.Screen
                name="MoviesScreen"
                component={Movies}
            />
            <Stack.Screen
                name="Detail"
                component={MovieDetail}
            />
            <Stack.Screen
                name="Favorites"
                component={Favorites}
            />
        </Stack.Navigator>
    );
}
