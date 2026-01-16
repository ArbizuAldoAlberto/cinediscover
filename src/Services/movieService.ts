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
        getFavorites: build.query<Movie[], void>({
            query: () => 'favorites.json',
            providesTags: ['Favorites'],
            transformResponse: (response: any) => {
                if (!response) return [];
                return Object.keys(response).map(key => ({ id: key, ...response[key] }));
            }
        }),
        addFavorites: build.mutation<void, Movie>({
            query: (newMovie) => ({
                url: 'favorites.json',
                method: 'POST',
                body: newMovie,
            }),
            // AGENT 2: Optimistic Update
            async onQueryStarted(movie, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    movieApi.util.updateQueryData('getFavorites', undefined, (draft) => {
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
        deleteFavorites: build.mutation<void, string>({
            query: (id) => ({
                url: `favorites/${id}.json`,
                method: 'DELETE',
            }),
            // AGENT 2: Optimistic Update
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    movieApi.util.updateQueryData('getFavorites', undefined, (draft) => {
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
