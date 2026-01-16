import React from 'react';
import {
    View, Text, Image, StyleSheet, TouchableOpacity,
    ScrollView, StatusBar, useWindowDimensions, ActivityIndicator
} from "react-native";
import {
    useAddFavoritesMutation,
    useDeleteFavoritesMutation,
    useGetFavoritesQuery,
    Movie
} from '../Services/movieService';
import { theme } from "../Global/theme";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function MovieDetail({ route, navigation }: any) {
    const { movie } = route.params as { movie: Movie };
    const { height, width } = useWindowDimensions();

    // Mutation and Query for Favorites
    const { data: favorites = [] } = useGetFavoritesQuery();
    const [addFavorite] = useAddFavoritesMutation();
    const [removeFavorite] = useDeleteFavoritesMutation();

    const isFavorite = favorites.some(item => item.id === movie.id);
    const favoriteId = favorites.find(item => item.id === movie.id)?.id;

    const handleBack = () => navigation.goBack();
    const handleToggleFavorite = async () => {
        if (isFavorite && favoriteId) {
            await removeFavorite(favoriteId);
        } else {
            await addFavorite(movie);
        }
    };

    // Cast mock data based on design
    const cast = [
        { id: '1', name: 'Oscar Isaac', role: 'Kaelen', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000' },
        { id: '2', name: 'Rebecca F.', role: 'Elora', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000' },
        { id: '3', name: 'John Boyega', role: 'Commander', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000' },
        { id: '4', name: 'Cillian M.', role: 'The Architect', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000' },
    ];

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Top Bar Overlay */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.backBtn}>
                    <Ionicons name="share-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Hero Section */}
                <View style={styles.heroContainer}>
                    <Image source={{ uri: movie.poster }} style={styles.heroImage} />
                    <LinearGradient
                        colors={['rgba(18,18,18,0.4)', 'rgba(18,18,18,0)', '#121212']}
                        style={styles.heroGradient}
                    />

                    {/* Play Button Overlay */}
                    <View style={styles.playOverlay}>
                        <TouchableOpacity style={styles.playBadge}>
                            <View style={styles.playIconCircle}>
                                <Ionicons name="play" size={40} color="black" />
                            </View>
                            <Text style={styles.playLabel}>PLAY TRAILER</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content Sheet */}
                <View style={styles.contentSheet}>
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>{movie.title}</Text>
                        <View style={styles.rowCentered}>
                            <Text style={styles.metaText}>2024</Text>
                            <View style={styles.dot} />
                            <Text style={styles.metaText}>2h 14m</Text>
                            <View style={styles.dot} />
                            <View style={styles.pgBadge}>
                                <Text style={styles.pgText}>PG-13</Text>
                            </View>
                        </View>
                    </View>

                    {/* Rating Stats */}
                    <View style={styles.statsRow}>
                        <View>
                            <View style={styles.rowCentered}>
                                <Text style={styles.scoreText}>4.8</Text>
                                <Ionicons name="star" size={20} color={theme.colors.primary} />
                            </View>
                            <Text style={styles.statsLabel}>12K REVIEWS</Text>
                        </View>
                        <View style={styles.divider} />
                        <View>
                            <Text style={styles.scoreText}>92%</Text>
                            <Text style={styles.statsLabel}>ROTTEN SCORE</Text>
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.primaryBtn]}
                            onPress={handleToggleFavorite}
                        >
                            <Ionicons name={isFavorite ? "bookmark" : "bookmark-outline"} size={20} color="black" />
                            <Text style={styles.primaryBtnText}>
                                {isFavorite ? "Saved" : "Add to My List"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]}>
                            <Ionicons name="download-outline" size={20} color="white" />
                            <Text style={styles.secondaryBtnText}>Download</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Synopsis */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Synopsis</Text>
                        <Text style={styles.description}>{movie.description}</Text>
                    </View>

                    {/* Cast */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Cast</Text>
                            <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.castScroll}>
                            {cast.map(person => (
                                <View key={person.id} style={styles.castItem}>
                                    <View style={styles.castAvatarBorder}>
                                        <Image source={{ uri: person.image }} style={styles.castAvatar} />
                                    </View>
                                    <Text style={styles.castName}>{person.name}</Text>
                                    <Text style={styles.castRole}>{person.role}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Footer Meta */}
                    <View style={styles.footerMeta}>
                        <View>
                            <Text style={styles.footerLabel}>DIRECTOR</Text>
                            <Text style={styles.footerValue}>Denis Villeneuve</Text>
                        </View>
                        <View>
                            <Text style={styles.footerLabel}>STUDIO</Text>
                            <Text style={styles.footerValue}>Neon Pictures</Text>
                        </View>
                    </View>

                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    topBar: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        zIndex: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.m,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        flexGrow: 1,
    },
    heroContainer: {
        width: '100%',
        height: 450,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playBadge: {
        alignItems: 'center',
        gap: 12,
    },
    playIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.glow,
    },
    playLabel: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    contentSheet: {
        paddingHorizontal: theme.spacing.m,
        marginTop: -60,
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    titleSection: {
        marginTop: 30,
        gap: 8,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        lineHeight: 40,
        letterSpacing: -1,
    },
    rowCentered: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metaText: {
        color: 'rgba(0, 214, 164, 0.8)',
        fontSize: 14,
        fontWeight: '500',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(0, 214, 164, 0.4)',
    },
    pgBadge: {
        borderWidth: 1,
        borderColor: 'rgba(0, 214, 164, 0.4)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    pgText: {
        color: theme.colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        marginVertical: 24,
    },
    scoreText: {
        color: 'white',
        fontSize: 24,
        fontWeight: '800',
    },
    statsLabel: {
        color: '#64748B',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    divider: {
        width: 1,
        height: 32,
        backgroundColor: '#334155',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    actionBtn: {
        flex: 1,
        height: 56,
        borderRadius: theme.roundness.large,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    primaryBtn: {
        backgroundColor: theme.colors.primary,
    },
    primaryBtnText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 14,
    },
    secondaryBtn: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    secondaryBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 12,
    },
    description: {
        color: '#94A3B8',
        fontSize: 14,
        lineHeight: 22,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    seeAll: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    castScroll: {
        gap: 24,
    },
    castItem: {
        alignItems: 'center',
        width: 80,
    },
    castAvatarBorder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: 'rgba(0, 214, 164, 0.2)',
        padding: 2,
        marginBottom: 8,
    },
    castAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    castName: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    castRole: {
        color: '#64748B',
        fontSize: 10,
        textAlign: 'center',
    },
    footerMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 32,
        borderTopWidth: 1,
        borderTopColor: '#334155',
        paddingTop: 24,
    },
    footerLabel: {
        color: '#64748B',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 4,
    },
    footerValue: {
        color: 'white',
        fontSize: 14,
    }
});
