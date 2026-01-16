import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import favoritesReducer from '../Features/favorites/favoritesSlice';
import authReducer from '../Features/auth/authSlice';
import { movieApi } from '../Services/movieService';
import { securityMiddleware } from './middleware/securityMiddleware';

const rootReducer = combineReducers({
    [movieApi.reducerPath]: movieApi.reducer,
    favorites: favoritesReducer,
    auth: authReducer,
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['favorites'], // Only persist favorites for now
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
            .concat(movieApi.middleware)
            .concat(securityMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
