import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StackNavigator from "./StackNavigator";
import Movies from "../Screens/Movies";
import Favorites from "../Screens/Favorites";
import AIScanner from "../Screens/AIScanner";
import Profile from "../Screens/Profile";
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../Global/theme';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const Tab = createBottomTabNavigator();

const CustomScannerButton = ({ children, onPress }: any) => (
    <TouchableOpacity
        style={styles.scannerButtonContainer}
        onPress={onPress}
        activeOpacity={0.9}
    >
        <View style={styles.scannerButton}>
            {children}
        </View>
    </TouchableOpacity>
);

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(12, 12, 12, 0.98)',
                    borderTopWidth: 0,
                    height: 90,
                    paddingBottom: 20,
                    elevation: 0,
                    borderTopColor: 'rgba(255,255,255,0.05)',
                    borderTopWidth: 1,
                },
                tabBarIcon: ({ focused, color }) => {
                    let iconName: any;
                    switch (route.name) {
                        case "Home": iconName = focused ? "home" : "home-outline"; break;
                        case "Movies": iconName = focused ? "search" : "search-outline"; break;
                        case "Favorites": iconName = focused ? "bookmark" : "bookmark-outline"; break;
                        case "Profile": iconName = focused ? "person" : "person-outline"; break;
                        case "Scanner": iconName = "film"; break;
                        default: iconName = "square";
                    }

                    return (
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name={iconName}
                                size={24}
                                color={color}
                            />
                            {focused && route.name !== "Scanner" && <View style={styles.activeDot} />}
                        </View>
                    );
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: '#64748B',
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: 'bold',
                    marginTop: -5,
                    marginBottom: 5,
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={StackNavigator}
                options={{ tabBarLabel: "HOME" }}
            />
            <Tab.Screen
                name="Movies"
                component={Movies}
                options={{ tabBarLabel: "SEARCH" }}
            />
            <Tab.Screen
                name="Scanner"
                component={AIScanner}
                options={{
                    tabBarLabel: "",
                    tabBarButton: (props) => (
                        <CustomScannerButton {...props}>
                            <Ionicons name="film" size={26} color="black" />
                        </CustomScannerButton>
                    )
                }}
            />
            <Tab.Screen
                name="Favorites"
                component={Favorites}
                options={{ tabBarLabel: "SAVED" }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarLabel: "PROFILE",
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    scannerButtonContainer: {
        top: -24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scannerButton: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 8,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.primary,
        marginTop: 4,
        position: 'absolute',
        bottom: -8,
    }
});
