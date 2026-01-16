import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
    baseQuery: fetchBaseQuery({
        // AGENT 1: Centralized URL.
        baseUrl: 'https://coder-app-c2f17-default-rtdb.firebaseio.com/'
    }),
    tagTypes: ['Movies', 'Categories', 'Favorites'],
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
                const patchResult = dispatch(
                    movieApi.util.updateQueryData('getFavorites', userId, (draft) => {
                        draft.push(movie);
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
                url: userId ? `users/${userId}/favorites/${id}.json` : `favorites/${id}.json`,
                method: 'DELETE',
            }),
            async onQueryStarted({ id, userId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    movieApi.util.updateQueryData('getFavorites', userId, (draft) => {
                        return draft.filter((m) => m.id !== id);
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
    }),
});

export const {
    useGetCategoriesQuery,
    useGetMoviesQuery,
    useGetFavoritesQuery,
    useAddFavoritesMutation,
    useDeleteFavoritesMutation,
} = movieApi;
