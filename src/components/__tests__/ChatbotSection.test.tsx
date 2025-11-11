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
  LinearGradient: ({ children, style, colors }: any) => <>{children}</>,
}));

// Mock del context
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ colors: { primary: 'blue', accent: 'red' } }),
}));

// Mock de estilos
jest.mock('../../themes/MenuStyles', () => ({
  default: {
    chatbotSection: {},
    chatbotGradient: {},
    chatbotContent: {},
    chatbotTextContainer: {},
    chatbotTitle: {},
    chatbotDescription: {},
    chatbotIconContainer: {},
    chatbotEmoji: {},
  },
}));

describe('ChatbotSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('ChatbotSection component exists', () => {
    const ChatbotSection = require('../ChatbotSection').ChatbotSection;
    expect(ChatbotSection).toBeDefined();
  });

  test('Renders correctly with fadeAnim', () => {
    const fadeAnim = new (require('react-native').Animated.Value)(1);
    const ChatbotSection = require('../ChatbotSection').ChatbotSection;

    const component = ChatbotSection({ fadeAnim });
    expect(component).toBeDefined();
  });
});
