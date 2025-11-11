import React from 'react';

// Mock de React
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (callback: any) => callback(),
}));

// Mock de react-native
jest.mock('react-native', () => ({
  View: ({ children, style }: any) => <>{children}</>,
  Animated: {
    Image: ({ style, source }: any) => <>{source}</>,
    Value: class {
      constructor(value: any) {}
      interpolate(config?: any) { return 0; } // Mock simple de interpolate
    },
  },
  StyleSheet: {
    absoluteFillObject: {},
    create: () => ({}),
  },
}));

// Mock del context
jest.mock('../../context/AppSettingsContext', () => ({
  useAppSettings: jest.fn(),
}));

// Mock del asset
jest.mock('../../../assets/images/numero.png', () => 'numero-image');

describe('LoginBubbles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('LoginBubbles component exists', () => {
    const LoginBubbles = require('../LoginBubbles').LoginBubbles;
    expect(LoginBubbles).toBeDefined();
  });

  test('Renders correctly with bubbles', () => {
    const useAppSettings = require('../../context/AppSettingsContext').useAppSettings;

    // Mock con 2 burbujas
    useAppSettings.mockReturnValue({
      loginBurbujas: [
        {
          animation: new (require('react-native').Animated.Value)(0),
          startY: 0,
          endY: 100,
          startX: 50,
          driftX: 20,
          size: 30,
          scale: 1,
        },
        {
          animation: new (require('react-native').Animated.Value)(0),
          startY: 10,
          endY: 120,
          startX: 80,
          driftX: 15,
          size: 25,
          scale: 0.8,
        },
      ],
    });

    const LoginBubbles = require('../LoginBubbles').LoginBubbles;

    const component = LoginBubbles({});
    expect(component).toBeDefined();
  });

  test('Renders null if no bubbles', () => {
    const useAppSettings = require('../../context/AppSettingsContext').useAppSettings;

    useAppSettings.mockReturnValue({
      loginBurbujas: [],
    });

    const LoginBubbles = require('../LoginBubbles').LoginBubbles;

    const component = LoginBubbles({});
    expect(component).toBeNull();
  });
});
