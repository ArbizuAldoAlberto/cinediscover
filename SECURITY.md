# 🔐 Security Guide: Firebase Configuration

## ⚠️ IMPORTANT: Never commit your `.env` file to Git!

This project uses environment variables to protect sensitive Firebase credentials.

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Get your Firebase credentials:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (or create a new one)
   - Go to Project Settings > General
   - Scroll to "Your apps" and click on the web app icon
   - Copy the configuration values

3. **Fill in your `.env` file:**
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

4. **Restart your development server:**
   ```bash
   npx expo start --clear
   ```

## Security Checklist

- ✅ `.env` is listed in `.gitignore`
- ✅ Only `.env.example` (with placeholder values) is committed
- ✅ `firebaseConfig.ts` reads from environment variables
- ✅ No hardcoded credentials in source code

## For Contributors

If you're contributing to this project, you'll need to set up your own Firebase project and configure your local `.env` file. The app will not function without valid Firebase credentials.
