import React, { useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, TextInput, ScrollView,
    TouchableOpacity, Image, FlatList, useWindowDimensions, ActivityIndicator, StatusBar
} from "react-native";
import { useGetMoviesQuery, useGetCategoriesQuery, Movie } from '../Services/movieService';
import { theme } from "../Global/theme";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Movies({ navigation, route }: any) {
    const { width } = useWindowDimensions();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(route.params?.category || "Trending");

    const { data: movies, isLoading: moviesLoading } = useGetMoviesQuery();
    const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();

    const filteredMovies = useMemo(() => {
        if (!movies) return [];
        let result = movies;
        if (selectedCategory !== "Trending") {
            result = result.filter(m => m.category === selectedCategory);
        }
        if (search) {
            result = result.filter(m =>
                m.title.toLowerCase().includes(search.toLowerCase()) ||
                m.category.toLowerCase().includes(search.toLowerCase())
            );
        }
        return result;
    }, [movies, selectedCategory, search]);

    if (moviesLoading || categoriesLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const featuredMovie = filteredMovies[0];
    const gridMovies = filteredMovies.slice(1);

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.topRow}>
                <View style={styles.titleRow}>
                    <Ionicons name="film-outline" size={32} color={theme.colors.primary} style={{ marginRight: 10 }} />
                    <Text style={styles.title}>Discover</Text>
                </View>
                <TouchableOpacity style={styles.filterBtn}>
                    <Ionicons name="options-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color={theme.colors.primary} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Movies, actors, directors..."
                    placeholderTextColor="#64748B"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <View style={styles.genresSection}>
                <Text style={styles.genresLabel}>BY GENRE</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
                    <TouchableOpacity
                        style={[styles.chip, selectedCategory === "Trending" && styles.activeChip]}
                        onPress={() => setSelectedCategory("Trending")}
                    >
                        <Text style={[styles.chipText, selectedCategory === "Trending" && styles.activeChipText]}>Trending</Text>
                    </TouchableOpacity>
                    {categories?.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.chip, selectedCategory === cat.name && styles.activeChip]}
                            onPress={() => setSelectedCategory(cat.name)}
                        >
                            <Text style={[styles.chipText, selectedCategory === cat.name && styles.activeChipText]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );

    const renderItem = ({ item }: { item: Movie }) => (
        <TouchableOpacity
            style={[styles.gridItem, { width: (width - 48) / 2 }]}
            onPress={() => navigation.navigate("Detail", { movie: item })}
        >
            <Image source={{ uri: item.poster }} style={styles.gridPoster} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gridOverlay}>
                <Text style={styles.gridTitle} numberOfLines={1}>{item.title}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color={theme.colors.primary} />
                    <Text style={styles.gridRating}>8.8</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" />

            <FlatList
                data={gridMovies}
                keyExtractor={(item) => item.id}
                numColumns={2}
                ListHeaderComponent={
                    <>
                        {renderHeader()}
                        {featuredMovie && (
                            <TouchableOpacity
                                style={styles.featuredCard}
                                onPress={() => navigation.navigate("Detail", { movie: featuredMovie })}
                            >
                                <Image source={{ uri: featuredMovie.poster }} style={styles.featuredImage} />
                                <LinearGradient colors={['transparent', 'rgba(18,18,18,0.9)']} style={styles.featuredOverlay}>
                                    <View style={styles.mustWatchBadge}>
                                        <Text style={styles.mustWatchText}>MUST WATCH</Text>
                                    </View>
                                    <View style={styles.featuredContent}>
                                        <Text style={styles.featuredTitle}>{featuredMovie.title}</Text>
                                        <Text style={styles.featuredSubtitle}>{featuredMovie.category} • 2024</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    </>
                }
                renderItem={renderItem}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
            />

            {/* Background Glow */}
            <View style={styles.glow} pointerEvents="none" />
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
        paddingTop: 60,
        paddingHorizontal: theme.spacing.m,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: -0.5,
    },
    filterBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: theme.roundness.large,
        height: 56,
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    genresSection: {
        marginBottom: 24,
    },
    genresLabel: {
        color: '#64748B',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 12,
        marginLeft: 4,
    },
    chipsScroll: {
        gap: 12,
    },
    chip: {
        height: 40,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeChip: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        ...theme.shadows.glow,
    },
    chipText: {
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '500',
    },
    activeChipText: {
        color: 'black',
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 110,
    },
    featuredCard: {
        marginHorizontal: theme.spacing.m,
        height: 220,
        borderRadius: theme.roundness.large,
        overflow: 'hidden',
        marginBottom: 24,
    },
    featuredImage: {
        width: '100%',
        height: '100%',
    },
    featuredOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 20,
    },
    mustWatchBadge: {
        backgroundColor: theme.colors.primary,
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 8,
    },
    mustWatchText: {
        color: 'black',
        fontSize: 10,
        fontWeight: 'bold',
    },
    featuredContent: {
        gap: 4,
    },
    featuredTitle: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },
    featuredSubtitle: {
        color: '#CBD5E1',
        fontSize: 14,
        fontWeight: '500',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.m,
        gap: 16,
        marginBottom: 16,
    },
    gridItem: {
        aspectRatio: 3 / 4,
        borderRadius: theme.roundness.large,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
    },
    gridPoster: {
        width: '100%',
        height: '100%',
    },
    gridOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 12,
    },
    gridTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    gridRating: {
        color: '#CBD5E1',
        fontSize: 10,
    },
    glow: {
        position: 'absolute',
        top: -100,
        left: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(0, 214, 164, 0.05)',
        zIndex: -1,
    }
});
