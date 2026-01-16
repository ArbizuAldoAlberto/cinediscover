import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Movie } from '../Services/movieService';
import { theme } from '../Global/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface MovieItemProps {
    movie: Movie;
    onPress: (movie: Movie) => void;
}

const MovieItemComponent: React.FC<MovieItemProps> = ({ movie, onPress }) => {
    const { width } = useWindowDimensions();
    const numColumns = width > 768 ? 4 : 2;
    const itemWidth = (width - theme.spacing.m * 2 - theme.spacing.m) / numColumns;
    const itemHeight = itemWidth * 1.5;

    return (
        <TouchableOpacity
            style={[styles.container, { width: itemWidth }]}
            onPress={() => onPress(movie)}
            activeOpacity={0.9}
        >
            <View style={[styles.posterWrapper, { height: itemHeight }]}>
                <Image
                    source={{ uri: movie.poster || 'https://via.placeholder.com/300x450' }}
                    style={styles.poster}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(18, 18, 18, 0.8)']}
                    style={styles.gradient}
                />
                <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={10} color={theme.colors.primary} />
                    <Text style={styles.ratingText}>8.8</Text>
                </View>
            </View>
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
                <Text style={styles.subtitle}>{movie.category} • 2024</Text>
            </View>
        </TouchableOpacity>
    );
};

export const MovieItem = React.memo(MovieItemComponent);

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.m,
    },
    posterWrapper: {
        borderRadius: theme.roundness.large,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        ...theme.shadows.light,
    },
    poster: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    ratingBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backdropFilter: 'blur(4px)',
    },
    ratingText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    content: {
        marginTop: 10,
        paddingHorizontal: 4,
    },
    title: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: -0.2,
    },
    subtitle: {
        color: '#64748B',
        fontSize: 12,
        marginTop: 2,
    }
});
