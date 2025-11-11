import React from 'react';

// Mock de React PRIMERO
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (callback: any) => callback(),
}));

// Mocks BÁSICOS de react-native (Dimensions corregido)
jest.mock('react-native', () => ({
  View: ({ children, style }: any) => <>{children}</>,
  Text: ({ children, style }: any) => <>{children}</>,
  TouchableOpacity: ({ children, onPress, disabled }: any) => <>{children}</>,
  StyleSheet: { create: () => ({}) },
  Dimensions: { get: () => ({ width: 375, height: 667 }) },
  Platform: { OS: 'ios' },
}));

// Mock de Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, size, color }: any) => <></>,
}));

// Mock de librerías externas
jest.mock('react-native-collapsible', () => ({
  __esModule: true,
  default: ({ children }: any) => <>{children}</>,
}));

jest.mock('react-native-animatable', () => ({
  __esModule: true,
  View: ({ children }: any) => <>{children}</>,
}));

jest.mock('react-native-progress', () => ({
  __esModule: true,
  Bar: () => <></>,
}));

// Mock del context
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    colors: { primary: 'blue', secondary: 'green', accent: 'red' },
  }),
}));

// Mock de TareaCard
jest.mock('../TareaCard', () => ({
  __esModule: true,
  default: () => <></>,
}));

// Datos de prueba
const mockTareas = [
  { _id: '1', dificultad: 'facil', titulo: 'Tarea 1' },
  { _id: '2', dificultad: 'dificil', titulo: 'Tarea 2' },
];

const mockProgreso = [
  { id_tarea: { _id: '1' } },
];

describe('BloqueCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('BloqueCard component exists', () => {
    const BloqueCard = require('../BloqueCard').default;
    expect(BloqueCard).toBeDefined();
  });

  test('Renders correctly and calls callbacks', () => {
    const onToggleBloque = jest.fn();
    const onIniciarTarea = jest.fn();
    const onSelectTarea = jest.fn();

    const BloqueCard = require('../BloqueCard').default;

    const component = BloqueCard({
      bloque: 1,
      tareas: mockTareas,
      progreso: mockProgreso,
      desbloqueado: true,
      bloqueActivo: 1,
      onToggleBloque,
      onIniciarTarea,
      onSelectTarea,
      tareasRespondidasIds: new Set(),
    });

    expect(component).toBeDefined();

    onToggleBloque(1);
    onIniciarTarea(1);
    onSelectTarea(mockTareas[0]);

    expect(onToggleBloque).toHaveBeenCalledWith(1);
    expect(onIniciarTarea).toHaveBeenCalledWith(1);
    expect(onSelectTarea).toHaveBeenCalledWith(mockTareas[0]);
  });
});
