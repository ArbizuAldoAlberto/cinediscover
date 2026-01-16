# 🎬 cInediscober 

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Expo](https://img.shields.io/badge/Expo-54.0.25-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat&logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**cInediscober** is a premium movie exploration application built with React Native and Expo. Featuring a high-fidelity cinematic UI based on the "Stitch Explorer" design system, it delivers a flagship-level user experience for modern movie enthusiasts.

![Home Screen](https://raw.githubusercontent.com/ArbizuAldoAlberto/cInediscober/fase-1/screenshots/home_preview.png)

## ✨ Features

- **💎 Premium Cinematic UI**: Deep charcoal aesthetics with vibrant neon-green accents and "Stitch Explorer" design patterns.
- **🎥 Movie Discovery**: Explore trending movies, new releases, and popular genres with a high-fidelity bento grid layout.
- **🔍 Smart Search**: Advanced filtering by category and real-time search capabilities.
- **📱 On-Device AI Scanner**: Integrated TensorFlow.js movie poster detection for instant metadata retrieval.
- **💾 Offline First**: Local persistence using SQLite for watched movies and Redux Persist for library favorites.
- **⚡ High Performance**: Optimized image caching, specialized FlatList implementations, and optimistic UI updates via RTK Query.
- **👤 Personalized Profiles**: Detailed user statistics, "Pro Member" badges, and comprehensive app settings.

## 🛠️ Tech Stack

- **Framework**: Expo SDK 54 / React Native
- **Language**: TypeScript
- **State Management**: Redux Toolkit (RTK Query)
- **Database**: SQLite (expo-sqlite) & Redux Persist
- **Animations & Effects**: Expo Linear Gradient & Backdrop Blurs
- **AI/ML**: TensorFlow.js (@tensorflow/tfjs-react-native)
- **Forms**: Formik & Yup Validation

## 📦 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS)
- [Expo Go](https://expo.dev/expo-go) app on your device or an emulator
- [Git](https://git-scm.com/)

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/ArbizuAldoAlberto/cInediscober.git
   cd cInediscober
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables**
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   # Add your API keys and configuration
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

## 📂 Project Structure

```text
├── src/
│   ├── Components/     # Reusable UI components (SmartCamera, MovieItem, etc.)
│   ├── Features/       # Redux slices and features
│   ├── Global/         # Design system tokens and global theme
│   ├── Hooks/          # Custom React hooks (usePermissions, etc.)
│   ├── Navigation/     # Stack and Tab navigators
│   ├── Screens/        # Application screens (Home, Detail, Discover, etc.)
│   ├── Services/       # API layer (RTK Query), AI services, and Database
│   └── Store/          # Redux Store configuration
├── assets/             # Images and local resources
└── App.tsx             # Main entry point
```

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

## 🤝 Contact

**Aldo Alberto Arbizu**  
Email: [your-email@example.com]  
GitHub: [@ArbizuAldoAlberto](https://github.com/ArbizuAldoAlberto)

---
*Created as part of the Advanced Mobile Development Blueprint 2026.*