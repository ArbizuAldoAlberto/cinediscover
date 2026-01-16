import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import { Alert, Linking } from 'react-native';

/**
 * usePermissions Hook - Agent 4
 * Centralized permission management for Hardware access (Camera, Location)
 * Includes defensive logic to guide users if they deny access.
 */
export const usePermissions = () => {
    const [status, setStatus] = useState<{
        camera: boolean | null;
        location: boolean | null;
    }>({
        camera: null,
        location: null,
    });

    const requestCamera = useCallback(async () => {
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        const granted = cameraStatus === 'granted';

        setStatus(prev => ({ ...prev, camera: granted }));

        if (!granted) {
            Alert.alert(
                'Permiso de Cámara',
                'Antigravity necesita acceso a tu cámara para escanear películas. Por favor, habilítalo en configuración.',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Abrir Configuración', onPress: () => Linking.openSettings() }
                ]
            );
        }
        return granted;
    }, []);

    const requestLocation = useCallback(async () => {
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        const granted = locationStatus === 'granted';

        setStatus(prev => ({ ...prev, location: granted }));

        if (!granted) {
            Alert.alert(
                'Permiso de Ubicación',
                'La ubicación nos ayuda a recomendarte cines cercanos. Por favor, habilítala en configuración.',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Abrir Configuración', onPress: () => Linking.openSettings() }
                ]
            );
        }
        return granted;
    }, []);

    return {
        status,
        requestCamera,
        requestLocation
    };
};
