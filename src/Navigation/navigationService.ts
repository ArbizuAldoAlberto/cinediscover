import { createNavigationContainerRef } from '@react-navigation/native';

/**
 * Navigation Service - Agent 3 & 5
 * Allows navigating without props (decoupled)
 */
export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: any) {
    if (navigationRef.isReady()) {
        (navigationRef as any).navigate(name, params);
    }
}

export function goBack() {
    if (navigationRef.isReady()) {
        navigationRef.goBack();
    }
}
