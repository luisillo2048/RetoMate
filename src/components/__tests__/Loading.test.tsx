import React from 'react';

// Mock de React
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (callback: any) => callback(),
}));

// Mock de react-native
jest.mock('react-native', () => ({
  View: ({ children }: any) => <>{children}</>,
  Text: ({ children }: any) => <>{children}</>,
  Image: ({ source, style }: any) => <>{source}</>,
  Animated: {
    View: ({ children, style }: any) => <>{children}</>,
    Value: class {
      constructor(value: any) {}
      interpolate() { return { __isMock: true }; }
    },
  },
  StyleSheet: { create: () => ({}) },
  Dimensions: { get: () => ({ width: 375, height: 667 }) },
  Platform: { OS: 'ios' },
}));

// Mock de LinearGradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, colors, style }: any) => <>{children}</>,
}));

// Mock del context
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ colors: { text: 'black' } }),
}));

// Mock de estilos
jest.mock('../../themes/ProfileStyles', () => ({
  default: {
    container: {},
    loadingLogo: {},
    loadingText: {},
    subText: {},
  },
}));

// Mock del asset
jest.mock('../../../assets/images/Logo.png', () => 'logo-image');

describe('Loading component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Loading component exists', () => {
    const Loading = require('../Loading').Loading; // <- nombre actualizado
    expect(Loading).toBeDefined();
  });

  test('Renders correctly with animations', () => {
    const Loading = require('../Loading').Loading;

    const bounceAnim = new (require('react-native').Animated.Value)(1);
    const logoSpinInterpolate = { __isMock: true }; // Mock simple de AnimatedInterpolation

    const component = Loading({
      bounceAnim,
      logoSpinInterpolate,
    });

    expect(component).toBeDefined();
  });
});
