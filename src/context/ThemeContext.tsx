// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

const childFriendlyColors = {
  light: {
    primary: '#4A90E2', 
    secondary: '#9B6BCC', 
    accent: '#FF8C42', 
    background: ['#6DD5FA', '#4A90E2', '#9B6BCC'], 
    text: '#2D3748',
    card: '#FFFFFF',
    border: '#E2E8F0',
    shadow: '#2D3748',
    
  },
  dark: {
    primary: '#5FA8FF', 
    secondary: '#B18CFF', 
    accent: '#FF9E5F', 
    background: ['#1E3A8A', '#6D28D9', '#9B6BCC'], 
    text: '#F7FAFC',
    card: '#2D3748',
    border: '#4A5568',
    shadow: '#000000',
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