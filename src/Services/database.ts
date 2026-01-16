import * as SQLite from 'expo-sqlite';

/**
 * SQLite Database Service - Agent 2
 * Handles massive/complex local storage (Offline-first)
 */

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
    try {
        db = await SQLite.openDatabaseAsync('movie_app.db');
        await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS watched_movies (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        watched_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed', error);
    }
};

export const addWatchedMovie = async (id: string, title: string) => {
    if (!db) return;
    try {
        await db.runAsync('INSERT OR REPLACE INTO watched_movies (id, title) VALUES (?, ?)', [id, title]);
    } catch (error) {
        console.error('Error adding watched movie', error);
    }
};

export const getWatchedMovies = async () => {
    if (!db) return [];
    try {
        const allRows = await db.getAllAsync('SELECT * FROM watched_movies');
        return allRows;
    } catch (error) {
        console.error('Error getting watched movies', error);
        return [];
    }
};
