import { useGetFavoritesQuery, useDeleteFavoritesMutation, useGetWatchedQuery, Movie } from '../Services/movieService';
import {
    View, Text, FlatList, StyleSheet, useWindowDimensions,
    ActivityIndicator, TouchableOpacity, Image, StatusBar
} from "react-native";
import { theme } from "../Global/theme";
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';

export default function Favorites({ navigation }: any) {
    const { width } = useWindowDimensions();
    const userId = useSelector((state: RootState) => state.auth.user?.uid);
    const { data: favorites = [], isLoading: favLoading } = useGetFavoritesQuery(userId, { skip: !userId });
    const { data: watchedList = [], isLoading: watchedLoading } = useGetWatchedQuery(userId, { skip: !userId });

    const [removeFavorite] = useDeleteFavoritesMutation();
    const [activeTab, setActiveTab] = useState('To Watch');

    const isLoading = favLoading || watchedLoading;

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.topRow}>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="settings-outline" size={22} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My List</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="search-outline" size={22} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.segmentedControl}>
                <TouchableOpacity
                    style={[styles.segment, activeTab === 'To Watch' && styles.activeSegment]}
                    onPress={() => setActiveTab('To Watch')}
                >
                    <Text style={[styles.segmentText, activeTab === 'To Watch' && styles.activeSegmentText]}>To Watch</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.segment, activeTab === 'Watched' && styles.activeSegment]}
                    onPress={() => setActiveTab('Watched')}
                >
                    <Text style={[styles.segmentText, activeTab === 'Watched' && styles.activeSegmentText]}>Watched</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderItem = ({ item }: { item: Movie }) => (
        <TouchableOpacity
            style={styles.movieRow}
            onPress={() => navigation.navigate("Detail", { movie: item })}
        >
            <View style={styles.posterWrapper}>
                <Image source={{ uri: item.poster }} style={styles.poster} />
            </View>
            <View style={styles.movieInfo}>
                <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.movieMeta}>{item.category} • 2h 46m</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#EAB308" />
                    <Text style={styles.ratingText}>8.9</Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeFavorite({ id: item.id, userId })}
            >
                <Ionicons name="close-outline" size={22} color="#94A3B8" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                <Ionicons
                    name={activeTab === 'To Watch' ? "bookmarks-outline" : "checkmark-circle-outline"}
                    size={40}
                    color={theme.colors.primary}
                />
            </View>
            <Text style={styles.emptyTitle}>{activeTab === 'To Watch' ? 'To Watch List Empty' : 'No Watched Movies'}</Text>
            <Text style={styles.emptySubtitle}>
                {activeTab === 'To Watch'
                    ? "Start saving movies you want to watch later and they'll show up here."
                    : "Movies you mark as watched will appear in this section."}
            </Text>
            <TouchableOpacity style={styles.discoverBtn} onPress={() => navigation.navigate("Home")}>
                <Text style={styles.discoverBtnText}>Explore Movies</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" />

            {renderHeader()}

            <FlatList
                data={activeTab === 'To Watch' ? favorites : watchedList}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={[styles.listContent, (activeTab === 'To Watch' ? favorites : watchedList).length === 0 && { flex: 1 }]}
                showsVerticalScrollIndicator={false}
            />

            {/* Floating Action Button */}
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("Movies")}>
                <Ionicons name="add" size={32} color="black" />
            </TouchableOpacity>
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
        backgroundColor: theme.colors.background,
        zIndex: 10,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: -0.5,
    },
    segmentedControl: {
        flexDirection: 'row',
        marginHorizontal: 24,
        backgroundColor: theme.colors.surface,
        borderRadius: 14,
        padding: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginBottom: 20,
    },
    segment: {
        flex: 1,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    activeSegment: {
        backgroundColor: '#121212',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    activeSegmentText: {
        color: theme.colors.primary,
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 120,
    },
    movieRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginBottom: 16,
    },
    posterWrapper: {
        width: 64,
        height: 96,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000',
        ...theme.shadows.glow,
        shadowOpacity: 0.2,
    },
    poster: {
        width: '100%',
        height: '100%',
    },
    movieInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    movieTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    movieMeta: {
        color: 'rgba(0, 214, 164, 0.7)',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
    },
    ratingText: {
        color: '#94A3B8',
        fontSize: 11,
        fontWeight: 'bold',
    },
    removeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 214, 164, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    emptySubtitle: {
        color: '#64748B',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
    discoverBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 24,
        ...theme.shadows.glow,
    },
    discoverBtnText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        bottom: 110,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    }
});
