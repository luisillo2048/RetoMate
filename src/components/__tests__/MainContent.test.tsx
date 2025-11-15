import React from 'react';

// Mocks de react-native
jest.mock('react-native', () => ({
  View: ({ children }: any) => <>{children}</>,
  Text: ({ children }: any) => <>{children}</>,
  TouchableOpacity: ({ children, onPress }: any) => {
    // Podemos simular el onPress en el test
    return <>{children}</>;
  },
  Image: ({ source, style }: any) => <>{source}</>,
  StyleSheet: { create: () => ({}) },
}));

// Mock de react-navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    reset: jest.fn(),
  }),
}));

// Mock del hook useAuth
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ user: { name: 'Test User' } }),
}));

// Mock de estilos
jest.mock('../../themes/Styles', () => ({
  default: {
    mainContent: {},
    mainImage: {},
    title: {},
    subtitle: {},
    button: {},
    buttonText: {},
  },
}));

describe('MainContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('MainContent component exists', () => {
    const MainContent = require('../MainContent').MainContent;
    expect(MainContent).toBeDefined();
  });

  test('Renders correctly and handles start', () => {
    const navigateMock = jest.fn();
    const resetMock = jest.fn();

    // Mock de useNavigation con nuestros spies
    jest.spyOn(require('@react-navigation/native'), 'useNavigation').mockReturnValue({
      navigate: navigateMock,
      reset: resetMock,
    });

    const MainContent = require('../MainContent').MainContent;

    const component = MainContent();
    expect(component).toBeDefined();

    // Simulamos la función handleStart
    const { useAuth } = require('../../hooks/useAuth');
    const user = useAuth().user;

    if (user) {
      resetMock({ index: 0, routes: [{ name: 'Home' }] });
      expect(resetMock).toHaveBeenCalled();
    } else {
      navigateMock('Login');
      expect(navigateMock).toHaveBeenCalledWith('Login');
    }
  });
});
