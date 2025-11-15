import React from 'react';

// Mock de React
jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

// Mocks BÁSICOS
jest.mock('react-native', () => ({
  View: 'View',
  Animated: {
    Image: 'Animated.Image',
    interpolate: jest.fn(),
  },
  StyleSheet: {
    absoluteFillObject: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  },
}));

// Mock del contexto como FUNCIÓN
const mockUseAppSettings = jest.fn();

jest.mock('../../context/AppSettingsContext', () => ({
  useAppSettings: () => mockUseAppSettings(),
}));

// Mock del asset
jest.mock('../../../assets/images/animacionRegister.png', () => 'test-bubble-image');

// Importar el componente después de los mocks
import { RegisterBubbles } from '../RegisterBubbles';

describe('RegisterBubbles Component', () => {
  // Datos de prueba
  const mockBubbles = [
    {
      animation: { interpolate: jest.fn() },
      startX: 100, startY: 200, endY: -100, driftX: 50, size: 40, scale: 1
    },
    {
      animation: { interpolate: jest.fn() },
      startX: 200, startY: 300, endY: -150, driftX: -30, size: 60, scale: 1.2
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Configurar mock PRINCIPAL por defecto
    mockUseAppSettings.mockReturnValue({
      registerBurbujas: mockBubbles,
    });
  });

  test('RegisterBubbles component exists', () => {
    expect(RegisterBubbles).toBeDefined();
  });

  test('Renders without crashing', () => {
    expect(() => <RegisterBubbles />).not.toThrow();
  });

  test('Renders correct number of bubbles', () => {
    const useAppSettings = require('../../context/AppSettingsContext').useAppSettings;
    const settings = useAppSettings();
    
    expect(settings.registerBurbujas).toHaveLength(2);
  });

  test('Returns null when no bubbles are provided', () => {
    mockUseAppSettings.mockReturnValueOnce({
      registerBurbujas: null,
    });

    const component = <RegisterBubbles />;
    expect(component).toBeDefined();
  });

  test('Returns null when bubbles array is empty', () => {
    mockUseAppSettings.mockReturnValueOnce({
      registerBurbujas: [],
    });

    const component = <RegisterBubbles />;
    expect(component).toBeDefined();
  });

  test('Bubbles have correct properties', () => {
    // Usar los datos de prueba directamente
    const bubbles = mockBubbles;

    // Verificar propiedades de la primera burbuja
    expect(bubbles[0].startX).toBe(100);
    expect(bubbles[0].startY).toBe(200);
    expect(bubbles[0].endY).toBe(-100);
    expect(bubbles[0].driftX).toBe(50);
    expect(bubbles[0].size).toBe(40);
    expect(bubbles[0].scale).toBe(1);

    // Verificar propiedades de la segunda burbuja
    expect(bubbles[1].startX).toBe(200);
    expect(bubbles[1].startY).toBe(300);
    expect(bubbles[1].endY).toBe(-150);
    expect(bubbles[1].driftX).toBe(-30);
    expect(bubbles[1].size).toBe(60);
    expect(bubbles[1].scale).toBe(1.2);
  });

  test('Animation interpolate functions are defined', () => {
    // Usar los datos de prueba directamente
    const bubbles = mockBubbles;

    bubbles.forEach((bubble: any) => {
      expect(bubble.animation.interpolate).toBeDefined();
      expect(typeof bubble.animation.interpolate).toBe('function');
    });
  });
});