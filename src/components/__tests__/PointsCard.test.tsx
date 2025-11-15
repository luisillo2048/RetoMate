import React from 'react';
import { Animated } from 'react-native';

// Mocks básicos de react-native
jest.mock('react-native', () => ({
  View: ({ children }: any) => <>{children}</>,
  Text: ({ children }: any) => <>{children}</>,
  Animated: {
    View: ({ children }: any) => <>{children}</>,
    Value: class {
      constructor(value: any) {}
      interpolate() { return 0; }
    },
  },
  StyleSheet: { create: () => ({}) },
}));

// Mock de LinearGradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => <>{children}</>,
}));

// Mock de FontAwesome5
jest.mock('@expo/vector-icons', () => ({
  FontAwesome5: ({ name, size, color }: any) => <>{name}</>,
}));

// Mock de react-native-progress
jest.mock('react-native-progress', () => ({
  Bar: ({ progress }: any) => <>{progress}</>,
}));

// Mock de ThemeContext
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ colors: { primary: 'blue', accent: 'pink' } }),
}));

// Mock de estilos
jest.mock('../../themes/ProfileStyles', () => ({
  default: {
    pointsCard: {},
    pointsGradient: {},
    pointsHeader: {},
    pointsTitle: {},
    pointsGrid: {},
    pointItem: {},
    pointLabel: {},
    pointValue: {},
    progressContainer: {},
    progressLabels: {},
    progressText: {},
    progressBar: {},
    progressMarks: {},
    markText: {},
  },
}));

describe('PointsCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('PointsCard component exists', () => {
    const PointsCard = require('../PointsCard').PointsCard;
    expect(PointsCard).toBeDefined();
  });

  test('Renders correctly with animations and values', () => {
    const PointsCard = require('../PointsCard').PointsCard;

    const bounceAnim: any = new Animated.Value(1);
    const slideAnim: any = new Animated.Value(0);
    const fadeAnim: any = new Animated.Value(1);
    const rotateInterpolate: any = { __isMock: true };

    const component = PointsCard({
      bounceAnim,
      slideAnim,
      fadeAnim,
      rotateInterpolate,
      totalPuntaje: 50,
      spentPoints: 20,
      availablePoints: 30,
    });

    expect(component).toBeDefined();
  });
});
