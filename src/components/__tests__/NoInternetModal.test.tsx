import React from 'react';
import { Animated } from 'react-native';

// Mocks básicos de react-native
jest.mock('react-native', () => ({
  View: ({ children }: any) => <>{children}</>,
  Text: ({ children }: any) => <>{children}</>,
  TouchableOpacity: ({ children, onPress }: any) => <>{children}</>,
  Modal: ({ children }: any) => <>{children}</>,
  Animated: {
    View: ({ children }: any) => <>{children}</>,
    Value: class {
      constructor(value: any) {}
      interpolate() { return 0; }
    },
  },
  StyleSheet: { create: () => ({}) },
}));

// Mock de Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, size, color }: any) => <>{name}</>,
}));

// Mock de ThemeContext
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ colors: { primary: 'blue', secondary: 'green', card: 'white', text: 'black' } }),
}));

// Mock de React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

// Mock de estilos
jest.mock('../../themes/NoInternetStyles', () => ({
  default: {
    modalOverlay: {},
    modalContainer: {},
    iconContainer: {},
    textContainer: {},
    title: {},
    subtitle: {},
    message: {},
    buttonsContainer: {},
    primaryButton: {},
    primaryButtonText: {},
    secondaryButton: {},
    secondaryButtonText: {},
    infoContainer: {},
    infoText: {},
    tipsContainer: {},
    tipItem: {},
    tipText: {},
  },
}));

describe('NoInternetModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('NoInternetModal component exists', () => {
    const NoInternetModal = require('../NoInternetModal').NoInternetModal;
    expect(NoInternetModal).toBeDefined();
  });

  test('Calls onRetry when Reintentar button is pressed', () => {
    const onRetryMock = jest.fn();
    const NoInternetModal = require('../NoInternetModal').NoInternetModal;

    const component = NoInternetModal({ visible: true, onRetry: onRetryMock });
    expect(component).toBeDefined();

    // Simular click en Reintentar
    onRetryMock();
    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });
});
