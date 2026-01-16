import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image,
    TouchableOpacity, StatusBar, useWindowDimensions, ImageBackground, ActivityIndicator
} from 'react-native';
import { useGetMoviesQuery, useGetCategoriesQuery, Movie } from '../Services/movieService';
import { theme } from '../Global/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home({ navigation }: any) {
    const { width } = useWindowDimensions();
    const { data: movies, isLoading: moviesLoading } = useGetMoviesQuery();
    const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();

    if (moviesLoading || categoriesLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const featuredMovie = movies?.[0];
    const trendingMovies = movies?.slice(1, 5) || [];
    const newReleases = movies?.slice(5, 8) || [];

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Top Navigation Bar */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarBorder}>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8aFzf9PgD04VONRCpKqyQeDfOCt0Gy88XCpX9vXPA9mgJK-P0oSLsw3vHJdrusMmzqKRcbG0s1Eci0ZPMxBJjEwXdSElYBgCNnm9xo-xjPpcPPXl_JOgySWFW4tFMWZxkT-uoJBsZReVSjISGkTcp23kSkkNecGXGPPt5Ta8DoTECnjFMG4TF_cP1L8hm9O_n42J8qqP9whkhvzMZ-5-cCBU-TbfR5sNrR4iqE_Wu-uQaseQEv9K53GJAPiloOpaVxh9pUPMr_RY' }}
                            style={styles.avatar}
                        />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>Home Explorer</Text>
                        <Text style={styles.headerSubtitle}>PREMIUM MEMBER</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.notificationBtn}>
                    <Ionicons name="notifications-outline" size={24} color="white" />
                    <View style={styles.notificationDot} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Hero Featured Movie (4/5 Aspect Ratio) */}
                <View style={styles.heroSection}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => featuredMovie && navigation.navigate("Detail", { movie: featuredMovie })}
                    >
                        <ImageBackground
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDoEo-rxis1b4OHCHtt1K9AEn5VRlNwM68A9-_VCPh98a-VF67Ddp2tf5WYjm9a0YBc7d-Boo9M9J4UCgFwrCDTSwtgdmLTUQU5ByyOmv9jeHH6s84odkpXrVHVk-dktXQvX4Un_ctxQ_4KC_hkHDsslo-7fc-nfOscPZeFA3sEwDmZ6icFBGqL59HW7PHBGWpOp2pWLKfcNKTtMfnNecGIZkeI9UFgXPTHOVISULIHdzl5lIRNdT-p8KEnto2H3qnVSVmmGgQqoU' }}
                            style={[styles.heroImage, { height: width * 1.25 }]}
                        >
                            <LinearGradient
                                colors={['transparent', 'rgba(18, 18, 18, 0.4)', 'rgba(18, 18, 18, 0.8)', '#121212']}
                                style={styles.heroGradient}
                            >
                                <View style={styles.heroBadgeRow}>
                                    <View style={styles.featuredBadge}>
                                        <Text style={styles.featuredBadgeText}>FEATURED</Text>
                                    </View>
                                    <View style={styles.metaBadge}>
                                        <Text style={styles.metaBadgeText}>Sci-Fi • 2h 46m</Text>
                                    </View>
                                </View>
                                <Text style={styles.heroTitle}>Dune:{'\n'}Part Two</Text>

                                <View style={styles.heroActions}>
                                    <TouchableOpacity style={styles.playBtn}>
                                        <Ionicons name="play" size={20} color="black" />
                                        <Text style={styles.playBtnText}>Watch Now</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.addHeroBtn}>
                                        <Ionicons name="add" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>

                {/* Trending Now */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Trending Now</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Movies")}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingScroll}>
                    {trendingMovies.map((movie: Movie, idx: number) => (
                        <TouchableOpacity
                            key={movie.id}
                            style={styles.trendingCard}
                            onPress={() => navigation.navigate("Detail", { movie })}
                        >
                            <View style={styles.trendingPosterWrapper}>
                                <Image source={{ uri: movie.poster }} style={styles.trendingPoster} />
                                <View style={styles.ratingBadge}>
                                    <Text style={styles.ratingText}>{8.4 - (idx * 0.2)}</Text>
                                </View>
                            </View>
                            <Text style={styles.cardTitle} numberOfLines={1}>{movie.title}</Text>
                            <Text style={styles.cardSubtitle}>2023 • {movie.category}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Popular Genres Bento Grid */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Popular Genres</Text>
                </View>
                <View style={styles.bentoGrid}>
                    <TouchableOpacity style={[styles.bentoItem, { width: (width - 44) / 2 }]}>
                        <ImageBackground source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWvAF3q-M37VJC6I2VZQQ4bvqf_Dhzpxupc5zS0gWHewNaMzwEf9WHMGDGxfX3lKSEzOAibvYm8hBfWSa2GSv9uNd-d-SVL9ikcMXDI8nystycNvR4uAAo-jmBn20jUuh6poZ9v5XXbzzKSrnpA7a-QGw4DJSxVh_mKM24OGeDAN8I7pPjw2OSH7Gtrq5_OeJgZTjyuR8KMejUD0K_ztSN0zAiI66FCX8z5yHQF2C2zMSrXxkn9UAxcy3K9euw0TVfFmbxSV723Co' }} style={styles.bentoImage}>
                            <View style={styles.bentoOverlay}>
                                <Text style={styles.bentoText}>SCI-FI</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.bentoItem, { width: (width - 44) / 2 }]}>
                        <ImageBackground source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFzABMKGxUlp-tGjdGkey-xCz7vKaj3fq4E4MiGGHLAyEKP-SVXmDyDKYuBeiJgs83hxFAumvqK9sMKrbQE2aINMrxLh8irUjlnf8zKHc2VffANMsu08OCCEtNaH0hnOqf4uIKOfdEZRu86ddiP0b0Rym4ewPTcpvEWypS-mk6ZFmWYb8eK34EXxwkjiG_5_zPrNg1eWaaxKEYm3MGvPJLEi8nkzSVkA4dlw2CwjcTyrTwJb7RvMb-6HsdHB_MpohuVeFCXNUlgTo' }} style={styles.bentoImage}>
                            <View style={styles.bentoOverlay}>
                                <Text style={styles.bentoText}>NOIR</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.bentoItem, { width: (width - 44) / 2 }]}>
                        <ImageBackground source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVc3R1Efe-6tdbuOU80mgTZLDjjGcmjE0mTOcwrfUEKTCNRNxKSsn4kA1IygcDJuckZWH6fMByY93VxiAohUBQHIE5tzLmtZj3bSxq2UfueiztNp0o_Vt5IL08u1v9yVqYMU_vRe3NXCjI5bxAtv21i0eMMksFpHdApJNC300UpdVOMYCLCCtIrtZXrWZdtccGAQNWJCli1bnrsJxvY77xU993VDxFNq_VNRU5aowA3QhYUs_nxyuPeQHIkN7zI0FsYhHX6zR8ApU' }} style={styles.bentoImage}>
                            <View style={styles.bentoOverlay}>
                                <Text style={styles.bentoText}>ACTION</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.bentoItem, { width: (width - 44) / 2 }]}>
                        <ImageBackground source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtduHo4HelrEGT53Xa6Hf16DFdYinFtj-E2BhFOIN7zxiKnb89RPG-aEyHSJ1cdz5Ids0PFQafkXpniiT9w7TvL1XRNA3HRJNAyPR72WSiaZH5kpFdYO2gVRrFsnamGe4mgrZ1nc1G6GEP30u87q9MiXqqGiuXJdMRkkAd2tAqF_2SfT87CKpwjlbcWCyPkdrB-8U-g1K7joNq0w4uOKR2JQbqYjU8XACvO7zuf_Mf-DnXN1yuZ9T7t7h6JEnxM6OHrrh1-eykEYw' }} style={styles.bentoImage}>
                            <View style={styles.bentoOverlay}>
                                <Text style={styles.bentoText}>DRAMA</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>

                {/* New Releases */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>New Releases</Text>
                    <View style={styles.justAddedBadge}>
                        <Text style={styles.justAddedText}>JUST ADDED</Text>
                    </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.newReleasesScroll}>
                    {newReleases.map((movie: Movie) => (
                        <TouchableOpacity key={movie.id} style={styles.newReleaseCard} onPress={() => navigation.navigate("Detail", { movie })}>
                            <ImageBackground source={{ uri: movie.poster }} style={styles.newReleaseImage}>
                                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.newReleaseGradient}>
                                    <View style={styles.nrBadgeRow}>
                                        <View style={styles.nrBadge}>
                                            <Text style={styles.nrBadgeText}>4K ULTRA HD</Text>
                                        </View>
                                        <Text style={styles.nrTitle} numberOfLines={1}>{movie.title}</Text>
                                    </View>
                                </LinearGradient>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Padding for bottom nav */}
                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.l,
        paddingTop: 50,
        paddingBottom: theme.spacing.m,
        backgroundColor: 'rgba(18, 18, 18, 0.85)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 214, 164, 0.1)',
        zIndex: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarBorder: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        padding: 2,
        marginRight: 12,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        color: theme.colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 214, 164, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationDot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.primary,
        borderWidth: 1.5,
        borderColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    heroSection: {
        width: '100%',
    },
    heroImage: {
        width: '100%',
        justifyContent: 'flex-end',
    },
    heroGradient: {
        padding: theme.spacing.l,
        paddingTop: 60,
    },
    heroBadgeRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    featuredBadge: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    featuredBadgeText: {
        color: 'black',
        fontSize: 10,
        fontWeight: 'bold',
    },
    metaBadge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    metaBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '500',
    },
    heroTitle: {
        color: 'white',
        fontSize: 48,
        fontWeight: 'bold',
        lineHeight: 44,
        letterSpacing: -1.5,
        marginBottom: 20,
    },
    heroActions: {
        flexDirection: 'row',
        gap: 12,
    },
    playBtn: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        height: 56,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        ...theme.shadows.glow,
    },
    playBtnText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    addHeroBtn: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.l,
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.m,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    seeAll: {
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: '500',
    },
    trendingScroll: {
        paddingLeft: theme.spacing.l,
        gap: 16,
    },
    trendingCard: {
        width: 160,
    },
    trendingPosterWrapper: {
        width: 160,
        height: 240,
        borderRadius: theme.roundness.large,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
        marginBottom: 8,
    },
    trendingPoster: {
        width: '100%',
        height: '100%',
    },
    ratingBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    ratingText: {
        color: theme.colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    cardSubtitle: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    },
    bentoGrid: {
        paddingHorizontal: theme.spacing.l,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    bentoItem: {
        height: 120,
        borderRadius: theme.roundness.large,
        overflow: 'hidden',
    },
    bentoImage: {
        width: '100%',
        height: '100%',
    },
    bentoOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bentoText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    justAddedBadge: {
        backgroundColor: 'rgba(0, 214, 164, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    justAddedText: {
        color: theme.colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
    },
    newReleasesScroll: {
        paddingLeft: theme.spacing.l,
        gap: 16,
        paddingRight: theme.spacing.l,
    },
    newReleaseCard: {
        width: 280,
        height: 160,
        borderRadius: theme.roundness.large,
        overflow: 'hidden',
    },
    newReleaseImage: {
        width: '100%',
        height: '100%',
    },
    newReleaseGradient: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 12,
    },
    nrBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    nrBadge: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 2,
    },
    nrBadgeText: {
        color: 'black',
        fontSize: 8,
        fontWeight: 'bold',
    },
    nrTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        flex: 1,
    }
});
