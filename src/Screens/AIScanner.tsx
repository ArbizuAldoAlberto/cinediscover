import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SmartCamera } from '../Components/SmartCamera';
import { theme } from '../Global/theme';

/**
 * AIScanner Screen - Agent 4
 * Provides the visual interface for AI-powered movie detection
 */
export default function AIScanner() {
    return (
        <View style={styles.container}>
            <SmartCamera />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
});
