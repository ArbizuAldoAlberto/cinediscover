import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, SafeAreaView, Platform, StatusBar } from 'react-native';
import { theme } from '../Global/theme';

/**
 * BaseComponent - POC for Agent 1
 * Demonstrates:
 * 1. Responsive layout using useWindowDimensions
 * 2. Safe area handling
 * 3. Use of centralized Design System (theme)
 */
export const BaseComponent: React.FC = () => {
    const { width, height } = useWindowDimensions();
    const isTablet = width > 768;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.container, isTablet && styles.containerTablet]}>
                <Text style={styles.title}>Blueprint POC</Text>
                <View style={styles.infoCard}>
                    <Text style={styles.label}>Screen Dimensions:</Text>
                    <Text style={styles.value}>{Math.round(width)} x {Math.round(height)}</Text>
                    <Text style={styles.label}>Device Type:</Text>
                    <Text style={styles.value}>{isTablet ? 'Tablet / Large Screen' : 'Mobile'}</Text>
                </View>
                <View style={styles.grid}>
                    <View style={styles.box} />
                    <View style={styles.box} />
                    <View style={styles.box} />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        padding: theme.spacing.m,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    containerTablet: {
        padding: theme.spacing.xl,
        maxWidth: 800,
        alignSelf: 'center',
    },
    title: {
        ...theme.typography.h1,
        color: theme.colors.primary,
        marginBottom: theme.spacing.l,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    infoCard: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.l,
        borderRadius: theme.roundness.medium,
        width: '100%',
        ...theme.shadows.light,
    },
    label: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    value: {
        ...theme.typography.body,
        color: theme.colors.text,
        marginBottom: theme.spacing.m,
        fontWeight: 'bold',
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: theme.spacing.xl,
    },
    box: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.roundness.small,
        opacity: 0.8,
    },
});
