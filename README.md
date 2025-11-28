# RetoMate – App de aritmética para primaria

**RetoMate** es una app educativa móvil enfocada en el **aprendizaje de aritmética para estudiantes de educación básica**, combinando claridad, ludificación y accesibilidad.

---

## 📋 Funcionalidades principales

- Ejercicios de suma, resta, multiplicación y división
- Interfaz amigable para público infantil
- Progresión por niveles o misiones
- Obtención de logros
- **Integración con IA/AA para personalización de ejercicios**
- **Estadísticas de aprendizaje para docentes y padres**

---

## 🛠️ Tecnologías utilizadas

| Área        	| Tecnología		            	|
|---------------|-----------------------------------|
| Frontend    	| React Native (Expo), TypeScript	|
| Backend     	| Node.js, Express          		|
| Base de datos | MongoDB + Mongoose    			|
| Estilos     	| StyleSheet 						|
| DevOps      	| VS Code, Git, GitHub    			|

---

## 🚀 Instalación y Configuración

### Prerequisitos

- Node.js (v16 o superior)
- npm o yarn
- Expo CLI
- Cuenta de Expo (para desarrollo)

### 1. Clonar el repositorio

```bash
git clone https://github.com/luisillo2048/RetoMate.git
cd RetoMate/App/RetoMate
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
# URL del backend API
EXPO_PUBLIC_API_URL=http://localhost:5000
```

> **⚠️ Importante:** Para desarrollo en dispositivo físico, usa la IP de tu computadora en lugar de `localhost`:
> ```
> EXPO_PUBLIC_API_URL=http://192.168.1.XXX:5000
> ```

### 4. Ejecutar la aplicación

```bash
# Iniciar Expo
npm start
# o
yarn start

# Para ejecutar en Android
npm run android

# Para ejecutar en iOS
npm run ios
```

---

## 🔧 Configuración del Backend

El backend de RetoMate se encuentra en `/DB/MongoAPI`. Consulta el README en esa carpeta para instrucciones detalladas.

### Configuración rápida:

```bash
cd ../../../DB/MongoAPI
cp .env.example .env
# Editar .env con tus credenciales de MongoDB
npm install
npm start
```

---

## 📱 Estructura del Proyecto

```
src/
├── api/          # Servicios de API
├── auth/         # Pantallas de autenticación
├── components/   # Componentes reutilizables
├── context/      # Context API (estados globales)
├── hooks/        # Custom hooks
├── navigator/    # Navegación de la app
├── screens/      # Pantallas principales
├── themes/       # Estilos globales y temas
├── types/        # Tipos de TypeScript
└── utils/        # Utilidades y helpers
```

---

## 🧪 Testing

```bash
npm test
# o
yarn test
```

---

## 📱 Compatibilidad con Android 16KB Page Size

A partir de 2024, Google Play requiere que las aplicaciones soporten dispositivos con páginas de memoria de 16 KB. RetoMate está configurada para cumplir con este requisito.

### Configuración implementada

- **NDK 27.0.12077973**: Configurado en `eas.json` y `app.config.js` para generar builds compatibles
- **Expo SDK 53**: Compatible con la nueva arquitectura de Android

### Requisitos para builds

Los builds de Android se generan automáticamente con soporte para 16 KB cuando se usa EAS Build:

```bash
# Build de producción
eas build --platform android --profile production

# Build de desarrollo
eas build --platform android --profile development

# Build de preview
eas build --platform android --profile preview
```

### Verificación de compatibilidad

Para verificar que el APK/AAB es compatible con 16 KB:

1. Sube el archivo a Google Play Console
2. Revisa la pestaña "App bundle explorer"
3. Verifica que no aparezcan advertencias sobre tamaño de página de memoria

### Referencias

- [Android - Prácticas de tamaños de página](https://developer.android.com/guide/practices/page-sizes?hl=es-419)
- [Blog Android Developers - 16KB page size](https://android-developers.googleblog.com/2025/05/prepare-play-apps-for-devices-with-16kb-page-size.html)
- [Expo EAS Build Configuration](https://docs.expo.dev/build-reference/android-builds/)

---

## 🎨 Diseño Inclusivo

RetoMate está diseñada con principios de accesibilidad y neurodiversidad en mente:

- ✅ Colores con contraste WCAG 2.1 AA
- ✅ Tipografía optimizada para dislexia
- ✅ Espaciado generoso para reducir sobrecarga cognitiva
- ✅ Áreas táctiles amplias (min 54px)
- ✅ Retroalimentación visual y auditiva

---

## 📄 Licencia

Este proyecto es parte de un proyecto universitario.
