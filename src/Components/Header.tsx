import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { theme } from '../Global/theme';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.text}>{title}</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: theme.colors.surface,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        width: "100%",
        height: 60,
        backgroundColor: theme.colors.surface,
        justifyContent: "center",
        alignItems: "center",
        borderBottomColor: theme.colors.background,
        borderBottomWidth: 1,
        ...theme.shadows.light,
    },
    text: {
        ...theme.typography.h2,
        color: theme.colors.primary,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
    },
});

export default Header;
