import React, { useState } from 'react';
import {
    View, Text, Image, StyleSheet, TouchableOpacity,
    ScrollView, StatusBar, useWindowDimensions, ActivityIndicator,
    TextInput, Share, Alert
} from "react-native";
import {
    useAddFavoritesMutation,
    useDeleteFavoritesMutation,
    useGetFavoritesQuery,
    useGetReviewsQuery,
    useAddReviewMutation,
    useGetWatchedQuery,
    useAddWatchedMutation,
    Movie
} from '../Services/movieService';
import { theme } from "../Global/theme";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';

export default function MovieDetail({ route, navigation }: any) {
    const { movie } = route.params as { movie: Movie };
    const { width } = useWindowDimensions();

    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?.uid;
    const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

    const { data: favorites = [] } = useGetFavoritesQuery(userId, { skip: !userId });
    const { data: watched = [] } = useGetWatchedQuery(userId, { skip: !userId });
    const { data: reviews = [] } = useGetReviewsQuery(movie.id);

    const [addFavorite] = useAddFavoritesMutation();
    const [removeFavorite] = useDeleteFavoritesMutation();
    const [addReview] = useAddReviewMutation();
    const [addWatched] = useAddWatchedMutation();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFavorite = favorites.some(item => item.id === movie.id);
    const favoriteId = favorites.find(item => item.id === movie.id)?.id;
    const isWatched = watched.some(item => item.id === movie.id);

    const handleBack = () => navigation.goBack();

    const handleToggleFavorite = async () => {
        if (!userId) {
            Alert.alert("Auth Required", "Please login to save favorites");
            return;
        }
        if (isFavorite && favoriteId) {
            await removeFavorite({ id: favoriteId, userId });
        } else {
            await addFavorite({ movie, userId });
        }
    };

    const handleWatched = async () => {
        if (!userId) {
            Alert.alert("Auth Required", "Please login to mark as watched");
            return;
        }
        if (!isWatched) {
            try {
                await addWatched({ movie, userId });
                // Requirement: Add to Saved (Favorites) automatically
                if (!isFavorite) {
                    await addFavorite({ movie, userId });
                }
                Alert.alert("Success", "Added to Watched and Saved list!");
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out ${movie.title} on CineDiscover! ${movie.poster}`,
                title: movie.title,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            Alert.alert("Rating Required", "Please select a star rating");
            return;
        }
        if (comment.trim().length === 0) {
            Alert.alert("Comment Required", "Rating only affects policy if you add a comment.");
            return;
        }

        setIsSubmitting(true);
        try {
            await addReview({
                movieId: movie.id,
                review: {
                    user: userName,
                    rating,
                    comment: comment.trim(),
                    date: new Date().toISOString()
                }
            });
            setRating(0);
            setComment('');
            Alert.alert("Thank you", "Your review has been posted!");
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Could not post review");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cast mock data (customized from design)
    const cast = [
        { id: '1', name: 'Oscar Isaac', role: 'Kaelen', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100' },
        { id: '2', name: 'Rebecca F.', role: 'Elora', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100' },
        { id: '3', name: 'John Boyega', role: 'Commander', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100' },
        { id: '4', name: 'Cillian M.', role: 'Architect', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100' },
    ];

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "4.5"; // Default if no reviews

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Top Bar Overlay */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.backBtn} onPress={handleShare}>
                    <Ionicons name="share-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Hero Section */}
                <View style={[styles.heroContainer, { height: width * 1.3 }]}>
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
                                <Text style={styles.scoreText}>{avgRating}</Text>
                                <Ionicons name="star" size={20} color={theme.colors.primary} />
                            </View>
                            <Text style={styles.statsLabel}>{reviews.length || '12K'} REVIEWS</Text>
                        </View>
                        <View style={styles.divider} />
                        <View>
                            <Text style={styles.scoreText}>92%</Text>
                            <Text style={styles.statsLabel}>CRITIC SCORE</Text>
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

                        <TouchableOpacity
                            style={[styles.actionBtn, isWatched ? styles.activeBtn : styles.secondaryBtn]}
                            onPress={handleWatched}
                            disabled={isWatched}
                        >
                            <Ionicons name={isWatched ? "checkmark-circle" : "eye-outline"} size={20} color={isWatched ? "black" : "white"} />
                            <Text style={[styles.secondaryBtnText, isWatched && { color: 'black' }]}>
                                {isWatched ? "Watched" : "Watched"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Synopsis */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Synopsis</Text>
                        <Text style={styles.description}>{movie.description}</Text>
                    </View>

                    {/* Rate & Comment Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Rate & Review</Text>
                        <View style={styles.reviewInputBox}>
                            <View style={styles.starRatingRow}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                        <Ionicons
                                            name={star <= rating ? "star" : "star-outline"}
                                            size={32}
                                            color={theme.colors.primary}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TextInput
                                style={styles.commentInput}
                                placeholder="Write your thoughts..."
                                placeholderTextColor="#64748B"
                                value={comment}
                                onChangeText={setComment}
                                multiline
                                numberOfLines={3}
                            />
                            <TouchableOpacity
                                style={[styles.submitBtn, (!comment.trim() || rating === 0) && styles.submitBtnDisabled]}
                                onPress={handleSubmitReview}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator size="small" color="black" />
                                ) : (
                                    <View style={styles.rowCentered}>
                                        <Ionicons name="send" size={16} color="black" />
                                        <Text style={styles.submitBtnText}>Submit</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Recent Reviews List */}
                        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Community Reviews</Text>
                        {reviews.length === 0 ? (
                            <Text style={styles.emptyText}>Be the first to review this movie!</Text>
                        ) : (
                            reviews.map((rev, index) => (
                                <View key={index} style={styles.reviewCard}>
                                    <View style={styles.reviewHeader}>
                                        <Text style={styles.reviewUser}>{rev.user}</Text>
                                        <View style={styles.reviewRatingBadge}>
                                            <Ionicons name="star" size={10} color="black" />
                                            <Text style={styles.reviewRatingText}>{rev.rating}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.reviewComment}>{rev.comment}</Text>
                                    <Text style={styles.reviewDate}>
                                        {new Date(rev.date).toLocaleDateString()}
                                    </Text>
                                </View>
                            ))
                        )}
                    </View>

                    {/* Cast Section */}
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
                            <Text style={styles.footerValue}>Christopher Nolan</Text>
                        </View>
                        <View>
                            <Text style={styles.footerLabel}>STUDIO</Text>
                            <Text style={styles.footerValue}>Warner Bros.</Text>
                        </View>
                    </View>

                    <View style={{ height: 60 }} />
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
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        lineHeight: 38,
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
    activeBtn: {
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
    // Review Styles
    reviewInputBox: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
    },
    starRatingRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 16,
    },
    commentInput: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
        color: 'white',
        padding: 12,
        fontSize: 14,
        height: 80,
        textAlignVertical: 'top',
        marginBottom: 12,
    },
    submitBtn: {
        backgroundColor: theme.colors.primary,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitBtnDisabled: {
        opacity: 0.5,
    },
    submitBtnText: {
        color: 'black',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    emptyText: {
        color: '#64748B',
        fontStyle: 'italic',
        marginTop: 4,
    },
    reviewCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.primary,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewUser: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    reviewRatingBadge: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 2,
    },
    reviewRatingText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 10,
    },
    reviewComment: {
        color: '#94A3B8',
        fontSize: 13,
        lineHeight: 18,
    },
    reviewDate: {
        color: '#475569',
        fontSize: 10,
        marginTop: 8,
        textAlign: 'right',
    },
    // Cast Section (kept from original inspiration)
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
