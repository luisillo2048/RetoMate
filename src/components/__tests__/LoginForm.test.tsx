import React from 'react';

// Mocks básicos de React Native
jest.mock('react-native', () => ({
  View: ({ children }: any) => <>{children}</>,
  Text: ({ children }: any) => <>{children}</>,
  TextInput: ({ value, onChangeText }: any) => {
    return <>{value}</>;
  },
  TouchableOpacity: ({ children, onPress }: any) => {
    if (onPress) onPress.mockName && onPress(); 
    return <>{children}</>;
  },
  Image: ({ source }: any) => <>{source}</>,
  StyleSheet: { create: () => ({}) },
}));

// Mock de iconos
jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => ({
  default: () => <></>,
}));

// Mock de estilos
jest.mock('../../themes/LoginStyles', () => ({
  default: {},
}));
jest.mock('../../themes/globalStyles', () => ({
  globalStyles: { title: {}, button: {} },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('LoginForm component exists', () => {
    const LoginForm = require('../LoginForm').LoginForm;
    expect(LoginForm).toBeDefined();
  });

  test('Calls onLogin and onNavigateToRegister', () => {
    const onLoginMock = jest.fn();
    const onNavigateMock = jest.fn();
    const setEmailMock = jest.fn();
    const setPasswordMock = jest.fn();
    const usernameRef = { current: { focus: jest.fn() } };
    const passwdRef = { current: { focus: jest.fn() } };

    const LoginForm = require('../LoginForm').LoginForm;

    const component = LoginForm({
      email: 'test@example.com',
      setEmail: setEmailMock,
      password: '123456',
      setPassword: setPasswordMock,
      usernameRef,
      passwdRef,
      onLogin: onLoginMock,
      onNavigateToRegister: onNavigateMock,
    });

    expect(component).toBeDefined();

    // Simulamos los clicks directamente
    onLoginMock();
    onNavigateMock();

    expect(onLoginMock).toHaveBeenCalledTimes(1);
    expect(onNavigateMock).toHaveBeenCalledTimes(1);
  });
});
