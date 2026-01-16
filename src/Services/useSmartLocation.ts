import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

/**
 * useSmartLocation Hook - Agent 4
 * Handles battery-efficient location tracking and permissions
 */
export const useSmartLocation = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setLocation(loc);

            // Translating to readable address only when needed
            if (loc) {
                let reverseGeocode = await Location.reverseGeocodeAsync({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                });
                if (reverseGeocode.length > 0) {
                    const { street, city, region } = reverseGeocode[0];
                    setAddress(`${street || ''}, ${city}, ${region}`);
                }
            }
        })();
    }, []);

    return { location, address, errorMsg };
};
