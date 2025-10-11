// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

// Colores aptos para niños de primer grado
const childFriendlyColors = {
  light: {
    primary: '#4A90E2', // Azul suave
    secondary: '#9B6BCC', // Morado suave
    accent: '#FF8C42', // Naranja suave
    background: ['#6DD5FA', '#4A90E2', '#9B6BCC'], // Gradiente azul-morado
    text: '#2D3748',
    card: '#FFFFFF',
  },
  dark: {
    primary: '#5FA8FF', // Azul más claro para contraste
    secondary: '#B18CFF', // Morado más claro
    accent: '#FF9E5F', // Naranja más claro
    background: ['#1E3A8A', '#6D28D9', '#9B6BCC'], // Gradiente azul oscuro-morado
    text: '#F7FAFC',
    card: '#2D3748',
  }
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  colors: typeof childFriendlyColors.light;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // Cargar el tema guardado al iniciar
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    };
    loadTheme();
  }, []);

  // Guardar el tema cuando cambie
  useEffect(() => {
    AsyncStorage.setItem('theme', theme);
  }, [theme]);

  // Función para alternar entre light y dark
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Colores según el tema actual
  const colors = childFriendlyColors[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};