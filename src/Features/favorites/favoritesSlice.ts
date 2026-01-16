import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '../../Services/movieService';

interface FavoritesState {
    list: Movie[];
}

const initialState: FavoritesState = {
    list: [],
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        clearFavorites: (state) => {
            state.list = [];
        },
        toggleFavorite: (state, action: PayloadAction<Movie>) => {
            const movie = action.payload;
            const exists = state.list.some((m) => m.id === movie.id);

            if (exists) {
                state.list = state.list.filter((m) => m.id !== movie.id);
            } else {
                state.list.push(movie);
            }
        },
    },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
