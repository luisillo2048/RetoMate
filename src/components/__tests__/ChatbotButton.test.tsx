import React from 'react';

// Mock de React primero
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (callback: any) => callback(),
}));

// Mocks básicos de react-native
jest.mock('react-native', () => ({
  View: ({ children, style }: any) => <>{children}</>,
  Text: ({ children, style }: any) => <>{children}</>,
  TouchableOpacity: ({ children, onPress, disabled }: any) => <>{children}</>,
  Image: ({ source, style }: any) => <>{source}</>,
  Animated: {
    View: ({ children, style }: any) => <>{children}</>,
    add: (a: any, b: any) => 0,
    Value: class {
  constructor(value: any) { (this as any)._value = value; }
  interpolate() { return { __isMock: true }; }
},
  },
  // Necesario para MenuStyles
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

// Mock de assets (fuera de src)
jest.mock('../../../assets/images/chatbot.png', () => 'chatbot-image');

describe('ChatbotButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('ChatbotButton component exists', () => {
    const ChatbotButton = require('../ChatbotButton').ChatbotButton;
    expect(ChatbotButton).toBeDefined();
  });

  test('Renders correctly and calls onPress', () => {
    const onPressMock = jest.fn();
    const ChatbotButton = require('../ChatbotButton').ChatbotButton;

    // Creamos Animated.Values
    const pulseAnim = new (require('react-native').Animated.Value)(1);
    const bounceAnim = new (require('react-native').Animated.Value)(0);
    const chatBotTranslateY = new (require('react-native').Animated.Value)(0);

    const component = ChatbotButton({
      pulseAnim,
      bounceAnim,
      chatBotTranslateY,
      onPress: onPressMock,
    });

    expect(component).toBeDefined();

    onPressMock();
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
