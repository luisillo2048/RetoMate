import React from 'react';

// Mock de React PRIMERO
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (callback: any) => callback(),
}));

// Mocks BÁSICOS
jest.mock('react-native', () => ({
  Dimensions: { get: () => ({ width: 375, height: 667 }) },
  View: 'View',
  ScrollView: 'ScrollView',
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  Platform: { OS: 'ios' },
  StyleSheet: { create: () => ({}) }
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0 }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));


jest.mock('../../context/AppSettingsContext', () => ({
  useAppSettings: () => ({
    animationsPaused: false,
    playAudio: jest.fn(),
    startLoginBurbujas: jest.fn(),
    stopLoginBurbujas: jest.fn(),
  }),
}));

jest.mock('../../hooks/useLoginForm', () => ({
  useLoginForm: () => ({
    email: '',
    setEmail: jest.fn(),
    password: '',
    setPassword: jest.fn(),
    usernameRef: { current: null },
    passwdRef: { current: null },
    handleLogin: jest.fn(),
    navigateToRegister: jest.fn(),
  }),
}));

// Mock de estilos
jest.mock('../../themes/globalStyles', () => ({ globalStyles: { container: {} } }));
jest.mock('../../themes/Styles', () => ({ default: { topControlsRow: {} } }));

// Mock de componentes
jest.mock('../../components/LoginBubbles', () => 'LoginBubbles');
jest.mock('../../components/LoginForm', () => 'LoginForm');
jest.mock('../../components/SettingsMenu', () => 'SettingsMenu');

// Mock de asset
jest.mock('../../../assets/audios/welcome.mp3', () => 'test-audio');

describe('Login Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Login component exists', () => {
    const Login = require('../Login').default;
    expect(Login).toBeDefined();
  });

  test('Mocks are working', () => {
    const useAppSettings = require('../../context/AppSettingsContext').useAppSettings;
    const settings = useAppSettings();
    expect(settings.animationsPaused).toBe(false);
  });

  test('Hook mock works', () => {
    const useLoginForm = require('../../hooks/useLoginForm').useLoginForm;
    const form = useLoginForm();
    expect(form.email).toBe('');
    expect(typeof form.handleLogin).toBe('function');
  });

  test('Audio function is called on mount', () => {
    const mockPlayAudio = jest.fn();
    const mockStartBurbujas = jest.fn();
    
    jest.spyOn(require('../../context/AppSettingsContext'), 'useAppSettings')
      .mockReturnValue({
        animationsPaused: false,
        playAudio: mockPlayAudio,
        startLoginBurbujas: mockStartBurbujas,
        stopLoginBurbujas: jest.fn(),
      });

    const Login = require('../Login').default;
    
    // El useEffect se ejecuta automáticamente por nuestro mock
    const component = Login({});
    
    expect(mockPlayAudio).toHaveBeenCalledTimes(1);
    expect(mockStartBurbujas).toHaveBeenCalledTimes(1);
  });

  test('Animations start when not paused', () => {
    const mockStartBurbujas = jest.fn();
    
    jest.spyOn(require('../../context/AppSettingsContext'), 'useAppSettings')
      .mockReturnValue({
        animationsPaused: false,
        playAudio: jest.fn(),
        startLoginBurbujas: mockStartBurbujas,
        stopLoginBurbujas: jest.fn(),
      });

    const Login = require('../Login').default;
    const component = Login({});
    
    expect(mockStartBurbujas).toHaveBeenCalledTimes(1);
  });

  test('Animations do NOT start when paused', () => {
    const mockStartBurbujas = jest.fn();
    
    jest.spyOn(require('../../context/AppSettingsContext'), 'useAppSettings')
      .mockReturnValue({
        animationsPaused: true,
        playAudio: jest.fn(),
        startLoginBurbujas: mockStartBurbujas,
        stopLoginBurbujas: jest.fn(),
      });

    const Login = require('../Login').default;
    const component = Login({});
    
    expect(mockStartBurbujas).not.toHaveBeenCalled();
  });
});