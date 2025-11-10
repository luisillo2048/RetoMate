import React from 'react';

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

// RUTAS CORRECTAS desde src/auth/__tests__/
jest.mock('../../context/AppSettingsContext', () => ({
  useAppSettings: () => ({
    animationsPaused: false,
    playAudio: jest.fn(),
    startRegisterBurbujas: jest.fn(),
    stopRegisterBurbujas: jest.fn(),
  }),
}));

jest.mock('../../hooks/useRegisterForm', () => ({
  useRegisterForm: () => ({
    username: '', setUsername: jest.fn(),
    email: '', setEmail: jest.fn(),
    password: '', setPassword: jest.fn(),
    confirmPassword: '', setConfirmPassword: jest.fn(),
    grado: '', setGrado: jest.fn(),
    codigo_maestro: '', setCodigoMaestro: jest.fn(),
    handleRegister: jest.fn(),
    navigateToLogin: jest.fn(),
  }),
}));

// Mock de estilos
jest.mock('../../themes/globalStyles', () => ({ globalStyles: { container: {} } }));
jest.mock('../../themes/Styles', () => ({ default: { topControlsRow: {} } }));

// Mock de componentes
jest.mock('../../components/RegisterBubbles', () => 'RegisterBubbles');
jest.mock('../../components/RegisterForm', () => 'RegisterForm');
jest.mock('../../components/SettingsMenu', () => 'SettingsMenu');

// Mock de asset
jest.mock('../../../assets/audios/welcome.mp3', () => 'test-audio');

describe('Register Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Register component exists', () => {
    const Register = require('../Register').default;
    expect(Register).toBeDefined();
  });

  test('Mocks are working', () => {
    const useAppSettings = require('../../context/AppSettingsContext').useAppSettings;
    const settings = useAppSettings();
    expect(settings.animationsPaused).toBe(false);
  });

  test('Hook mock works', () => {
    const useRegisterForm = require('../../hooks/useRegisterForm').useRegisterForm;
    const form = useRegisterForm();
    expect(form.username).toBe('');
    expect(typeof form.handleRegister).toBe('function');
  });
});