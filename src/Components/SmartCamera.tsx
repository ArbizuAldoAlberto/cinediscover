import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, StatusBar, useWindowDimensions } from 'react-native';
import { CameraView } from 'expo-camera';
import { theme } from '../Global/theme';
import { aiService } from '../Services/ai';
import { usePermissions } from '../Hooks/usePermissions';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const SmartCamera: React.FC = () => {
    const { status, requestCamera } = usePermissions();
    const { width, height } = useWindowDimensions();
    const [photo, setPhoto] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [aiResult, setAiResult] = useState<any>(null);
    const cameraRef = useRef<any>(null);

    React.useEffect(() => {
        requestCamera();
    }, [requestCamera]);

    const takePicture = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true, skipProcessing: false };
            const data = await cameraRef.current.takePictureAsync(options);
            setPhoto(data.uri);

            setIsProcessing(true);
            const result = await aiService.classifyImage(data.base64);
            setAiResult(result);
            setIsProcessing(false);
        }
    };

    if (status.camera === null) return <View style={styles.container} />;
    if (status.camera === false) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="camera-off-outline" size={64} color={theme.colors.textSecondary} />
                <Text style={styles.errorText}>No access to camera</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={requestCamera}>
                    <Text style={styles.retryBtnText}>Grand Permissions</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {!photo ? (
                <CameraView style={styles.camera} ref={cameraRef}>
                    <View style={styles.overlay}>
                        <View style={styles.camHeader}>
                            <Text style={styles.camTitle}>Stitch Scanner</Text>
                            <Text style={styles.camSubtitle}>Point at a movie poster</Text>
                        </View>

                        {/* Viewfinder square */}
                        <View style={[styles.viewfinder, { width: width * 0.7, height: width * 0.7 * 1.5 }]}>
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />
                        </View>

                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.flashBtn}>
                                <Ionicons name="flash-outline" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                                <View style={styles.captureInner}>
                                    <View style={styles.captureDot} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.galleryBtn}>
                                <Ionicons name="images-outline" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </CameraView>
            ) : (
                <View style={styles.preview}>
                    <Image source={{ uri: photo }} style={styles.image} />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.9)']}
                        style={StyleSheet.absoluteFill}
                    />

                    <View style={styles.aiResultPanel}>
                        {isProcessing ? (
                            <View style={styles.processingRow}>
                                <ActivityIndicator color={theme.colors.primary} />
                                <Text style={styles.processingText}>Analyzing metadata...</Text>
                            </View>
                        ) : (
                            <View style={styles.resultContent}>
                                <View style={styles.resultBadge}>
                                    <Text style={styles.resultBadgeText}>MATCH FOUND</Text>
                                </View>
                                <Text style={styles.aiLabel}>{aiResult?.label}</Text>
                                <Text style={styles.aiConfidence}>{(aiResult?.confidence * 100).toFixed(1)}% match confidence</Text>

                                <TouchableOpacity style={styles.viewDetailBtn}>
                                    <Text style={styles.viewDetailText}>View Movie Details</Text>
                                    <Ionicons name="arrow-forward" size={18} color="black" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.retakeButton}
                        onPress={() => { setPhoto(null); setAiResult(null); }}
                    >
                        <Ionicons name="refresh" size={20} color="white" style={{ marginRight: 8 }} />
                        <Text style={styles.retakeText}>RESCAN</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    errorContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    retryBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    retryBtnText: {
        color: 'black',
        fontWeight: 'bold',
    },
    camera: { flex: 1 },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 60,
    },
    camHeader: {
        alignItems: 'center',
    },
    camTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    camSubtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        marginTop: 4,
    },
    viewfinder: {
        borderWidth: 0,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: theme.colors.primary,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderTopLeftRadius: 12,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderTopRightRadius: 12,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderBottomLeftRadius: 12,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderBottomRightRadius: 12,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-evenly',
        paddingHorizontal: 40,
    },
    captureButton: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: 'rgba(0, 214, 164, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 214, 164, 0.5)',
    },
    captureInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.glow,
    },
    captureDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    flashBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    galleryBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    preview: { flex: 1, backgroundColor: 'black' },
    image: { flex: 1 },
    aiResultPanel: {
        position: 'absolute',
        bottom: 120,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(18, 18, 18, 0.85)',
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        ...theme.shadows.glow,
        shadowOpacity: 0.1,
    },
    processingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        justifyContent: 'center',
    },
    processingText: {
        color: '#94A3B8',
        fontSize: 16,
        fontWeight: '500',
    },
    resultContent: {
        alignItems: 'center',
    },
    resultBadge: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 12,
    },
    resultBadgeText: {
        color: 'black',
        fontSize: 10,
        fontWeight: 'bold',
    },
    aiLabel: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 4,
    },
    aiConfidence: {
        color: '#64748B',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    viewDetailBtn: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
        gap: 8,
    },
    viewDetailText: {
        color: 'black',
        fontSize: 15,
        fontWeight: 'bold',
    },
    retakeButton: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    retakeText: { color: 'white', fontWeight: 'bold', fontSize: 13, letterSpacing: 1 },
});
