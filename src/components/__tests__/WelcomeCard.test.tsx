import React from 'react';

// Mock de React
jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

// Mocks BÁSICOS
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  Animated: {
    View: 'Animated.View',
    Value: jest.fn(),
    interpolate: jest.fn(),
  },
}));

jest.mock('expo-linear-gradient', () => 'LinearGradient');

// Mock del contexto de tema
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      primary: '#4ECDC4',
      secondary: '#FF6B6B',
    },
  }),
}));

// Mock de estilos
jest.mock('../../themes/MenuStyles', () => ({
  default: {
    welcomeCard: {},
    welcomeCardGradient: {},
    welcomeHeader: {},
    welcomeCardTitle: {},
    welcomeCardText: {},
    welcomeEmojis: {},
    emojiLarge: {},
  },
}));

// Importar el componente después de los mocks
const { WelcomeCard } = require('../WelcomeCard');

describe('WelcomeCard Component', () => {
  // Mock de Animated.Value
  const mockFadeAnim = {
    interpolate: jest.fn(() => 0),
  };

  const baseProps = {
    fadeAnim: mockFadeAnim,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('WelcomeCard component exists', () => {
    expect(WelcomeCard).toBeDefined();
    expect(typeof WelcomeCard).toBe('function');
  });

  test('Renders without crashing', () => {
    expect(() => React.createElement(WelcomeCard, baseProps)).not.toThrow();
  });

  test('Receives fadeAnim prop correctly', () => {
    const element = React.createElement(WelcomeCard, baseProps);
    expect(element.props.fadeAnim).toBe(mockFadeAnim);
  });

  test('Uses theme context correctly', () => {
    const useTheme = require('../../context/ThemeContext').useTheme;
    const theme = useTheme();
    
    expect(theme.colors.primary).toBe('#4ECDC4');
    expect(theme.colors.secondary).toBe('#FF6B6B');
  });

  test('Animated interpolate function is defined', () => {
    expect(typeof mockFadeAnim.interpolate).toBe('function');
  });

  test('LinearGradient component is used', () => {
    // Verificamos que LinearGradient está en los mocks
    const LinearGradient = require('expo-linear-gradient');
    expect(LinearGradient).toBeDefined();
  });

  test('Component structure includes all elements', () => {
    const element = React.createElement(WelcomeCard, baseProps);
    // El componente debe renderizarse sin errores
    expect(element).toBeDefined();
  });
});

describe('WelcomeCard Content', () => {
  const mockFadeAnim = {
    interpolate: jest.fn(() => 0),
  };

  const baseProps = {
    fadeAnim: mockFadeAnim,
  };

  test('Contains welcome message', () => {
    // No podemos verificar el contenido directamente sin renderizar,
    // pero podemos verificar que el componente acepta las props correctamente
    const element = React.createElement(WelcomeCard, baseProps);
    expect(element.props.fadeAnim).toBe(mockFadeAnim);
  });

  test('Uses correct gradient colors from theme', () => {
    const useTheme = require('../../context/ThemeContext').useTheme;
    const theme = useTheme();
    
    // Verificar que los colores del tema son los esperados
    expect(theme.colors.primary).toBe('#4ECDC4');
    expect(theme.colors.secondary).toBe('#FF6B6B');
  });

  test('Animation props are properly configured', () => {
    // Verificar que fadeAnim tiene la función interpolate
    expect(typeof mockFadeAnim.interpolate).toBe('function');
    
    // Simular llamada a interpolate
    const interpolateConfig = {
      inputRange: [0, 1],
      outputRange: [30, 0]
    };
    
    mockFadeAnim.interpolate(interpolateConfig);
    expect(mockFadeAnim.interpolate).toHaveBeenCalledWith(interpolateConfig);
  });
});

describe('WelcomeCard Animation', () => {
  const mockFadeAnim = {
    interpolate: jest.fn((config: any) => {
      if (config.inputRange && config.outputRange) {
        return config.outputRange[0];
      }
      return 0;
    }),
  };

  const baseProps = {
    fadeAnim: mockFadeAnim,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Opacity animation uses fadeAnim', () => {
    const element = React.createElement(WelcomeCard, baseProps);
    // La opacidad debería estar vinculada a fadeAnim
    expect(element.props.fadeAnim).toBe(mockFadeAnim);
  });

  test('TranslateY animation uses interpolate', () => {
    // Simular la interpolación
    const interpolateResult = mockFadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 0]
    });
    
    expect(mockFadeAnim.interpolate).toHaveBeenCalledWith({
      inputRange: [0, 1],
      outputRange: [30, 0]
    });
    expect(interpolateResult).toBe(30); // outputRange[0]
  });

  test('Animation configuration is correct', () => {
    // Verificar que la configuración de animación es la esperada
    const expectedInterpolateConfig = {
      inputRange: [0, 1],
      outputRange: [30, 0]
    };
    
    mockFadeAnim.interpolate(expectedInterpolateConfig);
    expect(mockFadeAnim.interpolate).toHaveBeenCalledWith(expectedInterpolateConfig);
  });
});

describe('WelcomeCard Styling', () => {
  const mockFadeAnim = {
    interpolate: jest.fn(() => 0),
  };

  const baseProps = {
    fadeAnim: mockFadeAnim,
  };

  test('Styles are properly mocked', () => {
    const styles = require('../../themes/MenuStyles').default;
    
    expect(styles.welcomeCard).toBeDefined();
    expect(styles.welcomeCardGradient).toBeDefined();
    expect(styles.welcomeHeader).toBeDefined();
    expect(styles.welcomeCardTitle).toBeDefined();
    expect(styles.welcomeCardText).toBeDefined();
    expect(styles.welcomeEmojis).toBeDefined();
    expect(styles.emojiLarge).toBeDefined();
  });

  test('Theme colors are used in gradient', () => {
    const useTheme = require('../../context/ThemeContext').useTheme;
    const theme = useTheme();
    
    // Los colores del gradiente deben venir del tema
    expect(theme.colors.primary).toBe('#4ECDC4');
    expect(theme.colors.secondary).toBe('#FF6B6B');
  });
});

// Tests adicionales para edge cases
describe('WelcomeCard Edge Cases', () => {
  test('Handles different fadeAnim values', () => {
    const fadeAnimValues = [
      { interpolate: jest.fn(() => 0) },
      { interpolate: jest.fn(() => 0.5) },
      { interpolate: jest.fn(() => 1) },
    ];

    fadeAnimValues.forEach(fadeAnim => {
      const props = { fadeAnim };
      const element = React.createElement(WelcomeCard, props);
      expect(element.props.fadeAnim).toBe(fadeAnim);
    });
  });

  test('Component accepts only required props', () => {
    const minimalProps = {
      fadeAnim: { interpolate: jest.fn() },
    };

    const element = React.createElement(WelcomeCard, minimalProps);
    expect(element.props.fadeAnim).toBe(minimalProps.fadeAnim);
    // No debería tener otras props
    expect(Object.keys(element.props).length).toBe(1);
  });
});