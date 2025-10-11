import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Cache para imágenes
const imageCache = new Map();

export const verificarYDesbloquearLogros = async (): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) return null;

    const response = await fetch(`${apiUrl}/logro/verificar-logros`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.logros_desbloqueados && data.logros_desbloqueados.length > 0) {
      const primerLogro = data.logros_desbloqueados[0];
      return primerLogro;
    }
  } catch (error) {
    console.error("Error al verificar logros:", error);
  }
  return null;
};

export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return null;
  
  // Si ya está en cache, retornar inmediatamente
  if (imageCache.has(imagePath)) {
    return imageCache.get(imagePath);
  }
  
  if (/^https?:\/\//i.test(imagePath)) {
    imageCache.set(imagePath, imagePath);
    return imagePath;
  }
  
  const baseUrl = apiUrl?.startsWith('http') ? apiUrl : `https://${apiUrl}`;
  const fullUrl = `${baseUrl}/${imagePath.replace(/^\//, '')}`;
  
  // Pre-cargar imagen en cache
  const img = new Image();
  img.src = fullUrl;
  
  imageCache.set(imagePath, fullUrl);
  return fullUrl;
};

export const normalizarDificultad = (dificultad: string): string => {
  if (!dificultad) return 'facil';
  
  const dificultadLower = dificultad.toLowerCase().trim();
  
  if (dificultadLower === 'fácil') return 'facil';
  if (dificultadLower === 'difícil') return 'dificil';
  
  return dificultadLower;
};

export const getDifficultyColor = (dificultad?: string) => {
  const dificultadNormalizada = normalizarDificultad(dificultad || '');
  
  switch (dificultadNormalizada) {
    case 'facil':
      return '#4CAF50';
    case 'media':
      return '#FFC107';
    case 'dificil':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};

// Limpiar cache periódicamente
export const clearImageCache = () => {
  imageCache.clear();
};