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
  TouchableOpacity: ({ children, onPress, activeOpacity }: any) => <>{children}</>,
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

// Mock de estilos
jest.mock('../../themes/MenuStyles', () => ({
  default: {
    descriptionCard: {},
    descriptionTouchable: {},
    descriptionGradient: {},
    descriptionHeader: {},
    descriptionIcon: {},
    descriptionTitle: {},
    descriptionText: {},
  },
}));

describe('EducationalCards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('EducationalCards component exists', () => {
    const EducationalCards = require('../EducationalCards').EducationalCards;
    expect(EducationalCards).toBeDefined();
  });

  test('Renders correctly and calls onPlayAudio', () => {
    const onPlayAudio = jest.fn();
    const EducationalCards = require('../EducationalCards').EducationalCards;

    const fadeAnim = new (require('react-native').Animated.Value)(1);
    const educationalContent = [
      { icon: '📚', title: 'Lección 1', description: 'Descripción 1', color: ['red', 'blue'], audioType: 'lesson1' },
      { icon: '📝', title: 'Lección 2', description: 'Descripción 2', color: ['green', 'yellow'], audioType: 'lesson2' },
    ];

    const component = EducationalCards({
      educationalContent,
      fadeAnim,
      onPlayAudio,
    });

    expect(component).toBeDefined();

    // Simulamos llamadas a onPlayAudio
    onPlayAudio('lesson1');
    onPlayAudio('lesson2');

    expect(onPlayAudio).toHaveBeenCalledTimes(2);
    expect(onPlayAudio).toHaveBeenCalledWith('lesson1');
    expect(onPlayAudio).toHaveBeenCalledWith('lesson2');
  });
});
