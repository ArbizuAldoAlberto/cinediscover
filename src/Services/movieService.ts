import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { auth } from './firebaseConfig';

export interface Movie {
    id: string;
    title: string;
    poster: string;
    category: string;
    description: string;
}

export interface Category {
    id: string;
    name: string;
}

export const movieApi = createApi({
    reducerPath: 'movieApi',
    baseQuery: async (args, api, extraOptions) => {
        const rawBaseQuery = fetchBaseQuery({
            baseUrl: 'https://coder-app-c2f17-default-rtdb.firebaseio.com/'
        });

        // Get the token securely
        let token = null;
        try {
            if (auth.currentUser) {
                token = await auth.currentUser.getIdToken();
            }
        } catch (e) {
            console.error("Error fetching token", e);
        }

        let adjustedArgs = args;
        if (token) {
            if (typeof args === 'string') {
                const separator = args.includes('?') ? '&' : '?';
                adjustedArgs = `${args}${separator}auth=${token}`;
            } else {
                const separator = args.url.includes('?') ? '&' : '?';
                adjustedArgs = { ...args, url: `${args.url}${separator}auth=${token}` };
            }
        }

        return rawBaseQuery(adjustedArgs, api, extraOptions);
    },
    tagTypes: ['Movies', 'Categories', 'Favorites', 'Reviews', 'Watched'],
    endpoints: (build) => ({
        getCategories: build.query<Category[], void>({
            query: () => 'categories.json',
            providesTags: ['Categories'],
            transformResponse: (response: any) => {
                if (!response) return [];
                return Object.keys(response).map(key => ({ id: key, ...response[key] }));
            }
        }),
        getMovies: build.query<Movie[], void>({
            query: () => 'movies.json',
            providesTags: ['Movies'],
            transformResponse: (response: any) => {
                if (!response) return [];
                return Object.keys(response).map(key => ({ id: key, ...response[key] }));
            }
        }),
        getFavorites: build.query<Movie[], string | undefined>({
            query: (userId) => userId ? `users/${userId}/favorites.json` : 'favorites.json',
            providesTags: ['Favorites'],
            transformResponse: (response: any) => {
                if (!response) return [];
                return Object.keys(response).map(key => ({ id: key, ...response[key] }));
            }
        }),
        addFavorites: build.mutation<void, { movie: Movie; userId?: string }>({
            query: ({ movie, userId }) => ({
                url: userId ? `users/${userId}/favorites.json` : 'favorites.json',
                method: 'POST',
                body: movie,
            }),
            async onQueryStarted({ movie, userId }, { dispatch, queryFulfilled }) {
                // Optimistic update
                const patchResult = dispatch(
                    movieApi.util.updateQueryData('getFavorites', userId, (draft) => {
                        if (draft) {
                            draft.push(movie);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Favorites'],
        }),
        deleteFavorites: build.mutation<void, { id: string; userId?: string }>({
            query: ({ id, userId }) => ({
                url: userId ? `users/${userId}/favorites.json` : `favorites.json`,
                // Note: For deletion in Firebase array-like lists, it's tricky if we don't know the exact key.
                // But wait, getFavorites transforms {key: val} to [{id: key, ...}].
                // The 'id' passed here IS the key (firebase ID).
                // So url should be users/userId/favorites/ID.json
                url: userId ? `users/${userId}/favorites/${id}.json` : `favorites/${id}.json`,
                method: 'DELETE',
            }),
            async onQueryStarted({ id, userId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    movieApi.util.updateQueryData('getFavorites', userId, (draft) => {
                        if (draft) {
                            return draft.filter((m) => m.id !== id);
                        }
                        return draft;
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Favorites'],
        }),
        // Reviews Endpoints
        getReviews: build.query<{ user: string, rating: number, comment: string, date: string }[], string>({
            query: (movieId) => `reviews/${movieId}.json`,
            transformResponse: (response: any) => {
                if (!response) return [];
                return Object.keys(response).map(key => response[key]);
            },
            providesTags: (result, error, movieId) => [{ type: 'Reviews', id: movieId }],
        }),
        addReview: build.mutation<void, { movieId: string, review: { user: string, rating: number, comment: string, date: string } }>({
            query: ({ movieId, review }) => ({
                url: `reviews/${movieId}.json`,
                method: 'POST',
                body: review,
            }),
            invalidatesTags: (result, error, { movieId }) => [{ type: 'Reviews', id: movieId }],
        }),
        // Watched Endpoints
        getWatched: build.query<Movie[], string | undefined>({
            query: (userId) => userId ? `users/${userId}/watched.json` : 'watched.json',
            transformResponse: (response: any) => {
                if (!response) return [];
                return Object.keys(response).map(key => ({ id: key, ...response[key] }));
            },
            providesTags: ['Watched'],
        }),
        addWatched: build.mutation<void, { movie: Movie; userId?: string }>({
            query: ({ movie, userId }) => ({
                url: userId ? `users/${userId}/watched.json` : 'watched.json',
                method: 'POST',
                body: movie,
            }),
            invalidatesTags: ['Watched'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetMoviesQuery,
    useGetFavoritesQuery,
    useAddFavoritesMutation,
    useDeleteFavoritesMutation,
    useGetReviewsQuery,
    useAddReviewMutation,
    useGetWatchedQuery,
    useAddWatchedMutation,
} = movieApi;
