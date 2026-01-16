# 🎬 CineDiscover - Guía de Configuración Completa

## 📋 Estado Actual del Proyecto

Tu aplicación ahora tiene:
- ✅ Sistema de autenticación con Firebase Auth
- ✅ Base de datos en tiempo real con Firebase Realtime Database
- ✅ Favoritos por usuario (cada usuario tiene su propia lista)
- ✅ Estructura de datos lista para importar

## 🔥 Paso 1: Importar Datos a Firebase

1. **Abre Firebase Console**: https://console.firebase.google.com/
2. **Ve a Realtime Database** (menú lateral → Build → Realtime Database)
3. **Importa los datos**:
   - Haz clic en los 3 puntos (⋮) arriba a la derecha
   - Selecciona "Import JSON"
   - Sube el archivo `firebase-seed-data.json` que creé en la raíz del proyecto
   - Confirma la importación

Esto creará automáticamente:
- 6 categorías de películas (Action, Sci-Fi, Drama, etc.)
- 12 películas con posters, descripciones y categorías

## 🔐 Paso 2: Habilitar Autenticación de Email

1. **En Firebase Console**, ve a **Authentication** (menú lateral)
2. Haz clic en **"Get Started"**
3. En la pestaña **"Sign-in method"**:
   - Haz clic en **"Email/Password"**
   - **Activa** el primer toggle (Email/Password)
   - Guarda los cambios

## 🔒 Paso 3: Configurar Reglas de Seguridad

### Para Realtime Database:
1. Ve a **Realtime Database** → pestaña **"Rules"**
2. Reemplaza las reglas con esto:

```json
{
  "rules": {
    "categories": {
      ".read": true,
      ".write": false
    },
    "movies": {
      ".read": true,
      ".write": false
    },
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

3. Haz clic en **"Publish"**

**Explicación de las reglas**:
- `categories` y `movies`: Todos pueden leer, nadie puede escribir (solo tú desde la consola)
- `users/$uid`: Cada usuario solo puede leer/escribir sus propios datos

## 📱 Paso 4: Actualizar el Código

### 4.1 Actualizar MovieDetail.tsx

Busca la línea donde se llama a `addFavorite` y `removeFavorite`, y actualízala así:

```typescript
// Importa useSelector al inicio
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';

// Dentro del componente, obtén el userId
const userId = useSelector((state: RootState) => state.auth.user?.uid);

// Actualiza las llamadas a las mutaciones
const handleToggleFavorite = async () => {
    if (isFavorite && favoriteId) {
        await removeFavorite({ id: favoriteId, userId });
    } else {
        await addFavorite({ movie, userId });
    }
};
```

### 4.2 Actualizar Favorites.tsx

```typescript
// Importa useSelector
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';

// Dentro del componente
const userId = useSelector((state: RootState) => state.auth.user?.uid);
const { data: favorites = [], isLoading } = useGetFavoritesQuery(userId);
const [removeFavorite] = useDeleteFavoritesMutation();

// En el botón de eliminar
onPress={() => removeFavorite({ id: item.id, userId })}
```

### 4.3 Actualizar App.tsx para Manejar Auth State

```typescript
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthChange } from './src/Services/authService';
import { setUser } from './src/Features/auth/authSlice';

// Dentro del componente App
const dispatch = useDispatch();

useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
        dispatch(setUser(user));
    });
    return () => unsubscribe();
}, []);
```

## 🧪 Paso 5: Probar la Aplicación

1. **Reinicia el servidor de Expo**:
   ```bash
   npx expo start --clear
   ```

2. **Flujo de prueba**:
   - Abre la app → Verás la pantalla de Login
   - Haz clic en "Sign Up" para crear una cuenta
   - Ingresa: `test@cinediscover.com` / `password123`
   - Deberías entrar a la pantalla Home con las películas cargadas
   - Navega a una película y agrégala a favoritos
   - Ve a la pestaña "SAVED" para ver tus favoritos

3. **Verifica en Firebase Console**:
   - Ve a Realtime Database
   - Deberías ver una nueva rama `users/[tu-user-id]/favorites`

## 🎨 Funcionalidades Implementadas

### ✅ Autenticación
- Registro de nuevos usuarios
- Login con email/password
- Persistencia de sesión
- Logout (agregar botón en Profile screen)

### ✅ Favoritos por Usuario
- Cada usuario tiene su propia lista
- Sincronización en tiempo real con Firebase
- Actualizaciones optimistas (UI instantánea)

### ✅ Catálogo de Películas
- 12 películas pre-cargadas
- 6 categorías
- Búsqueda y filtrado funcional

## 🚀 Próximos Pasos Opcionales

1. **Agregar botón de Logout en Profile**:
   ```typescript
   import { signOut } from '../Services/authService';
   import { logout } from '../Features/auth/authSlice';
   
   const handleLogout = async () => {
       await signOut();
       dispatch(logout());
       navigation.navigate('Login');
   };
   ```

2. **Proteger rutas** (evitar acceso sin login):
   - Crear un componente `AuthGuard`
   - Verificar `isAuthenticated` antes de mostrar contenido

3. **Agregar más películas**:
   - Usa la consola de Firebase para agregar más datos
   - O crea un panel de administración

## 📞 Soporte

Si encuentras algún error:
1. Verifica que el archivo `.env` tenga todas las credenciales
2. Revisa la consola de Expo para mensajes de error
3. Verifica que las reglas de Firebase estén publicadas

¡Tu app ahora es completamente funcional con autenticación real y base de datos en la nube! 🎉
