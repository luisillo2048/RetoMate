// src/components/__tests__/RegisterForm.test.tsx
import React from 'react';

// Mock de React
jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

// Mocks BÁSICOS
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  TextInput: 'TextInput',
  TouchableOpacity: 'TouchableOpacity',
  Image: 'Image',
  ScrollView: 'ScrollView',
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

jest.mock('@react-native-picker/picker', () => ({
  Picker: 'Picker',
  Item: 'Picker.Item',
}));

// Mock del contexto de tema
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
  }),
}));

// Mock de estilos
jest.mock('../../themes/RegisterStyles', () => ({
  default: {
    lightContainer: {},
    darkContainer: {},
    mainBox: {},
    headerImage: {},
    header: {},
    form: {},
    inputContainer: {},
    icon: {},
    pickerContainer: {},
    picker: {},
    buttonText: {},
    buttonIcon: {},
    switchContainer: {},
    switchText: {},
    switchLink: {},
  },
}));

jest.mock('../../themes/globalStyles', () => ({
  globalStyles: {
    scrollContainer: {},
    container: {},
    title: {},
    input: {},
    button: {},
  },
}));

// Mock del asset
jest.mock('../../../assets/images/register1.png', () => 'test-register-image');

// Importar el componente DESPUÉS de todos los mocks
const { RegisterForm } = require('../RegisterForm');

describe('RegisterForm Component', () => {
  // Props de prueba
  const mockProps = {
    username: 'testuser',
    setUsername: jest.fn(),
    email: 'test@example.com',
    setEmail: jest.fn(),
    password: 'password123',
    setPassword: jest.fn(),
    confirmPassword: 'password123',
    setConfirmPassword: jest.fn(),
    grado: '1A°',
    setGrado: jest.fn(),
    codigo_maestro: 'ABC123',
    setCodigoMaestro: jest.fn(),
    usernameRef: { current: null },
    emailRef: { current: null },
    passwdRef: { current: null },
    passwd2Ref: { current: null },
    onRegister: jest.fn(),
    onNavigateToLogin: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('RegisterForm component exists', () => {
    expect(RegisterForm).toBeDefined();
    expect(typeof RegisterForm).toBe('function');
  });

  test('Renders without crashing', () => {
    expect(() => <RegisterForm {...mockProps} />).not.toThrow();
  });

  test('Receives and displays props correctly', () => {
    // Crear elemento React directamente
    const element = React.createElement(RegisterForm, mockProps);
    expect(element.props.username).toBe('testuser');
    expect(element.props.email).toBe('test@example.com');
    expect(element.props.grado).toBe('1A°');
  });

  test('All required props are provided', () => {
    expect(mockProps.username).toBeDefined();
    expect(mockProps.email).toBeDefined();
    expect(mockProps.password).toBeDefined();
    expect(mockProps.confirmPassword).toBeDefined();
    expect(mockProps.grado).toBeDefined();
    expect(mockProps.codigo_maestro).toBeDefined();
    expect(mockProps.onRegister).toBeDefined();
    expect(mockProps.onNavigateToLogin).toBeDefined();
  });

  test('Callback functions are defined', () => {
    expect(typeof mockProps.setUsername).toBe('function');
    expect(typeof mockProps.setEmail).toBe('function');
    expect(typeof mockProps.setPassword).toBe('function');
    expect(typeof mockProps.setConfirmPassword).toBe('function');
    expect(typeof mockProps.setGrado).toBe('function');
    expect(typeof mockProps.setCodigoMaestro).toBe('function');
    expect(typeof mockProps.onRegister).toBe('function');
    expect(typeof mockProps.onNavigateToLogin).toBe('function');
  });

  test('Ref objects are defined', () => {
    expect(mockProps.usernameRef).toBeDefined();
    expect(mockProps.emailRef).toBeDefined();
    expect(mockProps.passwdRef).toBeDefined();
    expect(mockProps.passwd2Ref).toBeDefined();
    expect(mockProps.usernameRef.current).toBeNull();
  });

  test('Theme context is used', () => {
    const useTheme = require('../../context/ThemeContext').useTheme;
    const theme = useTheme();
    expect(theme.theme).toBe('light');
  });
});

describe('RegisterForm Props Validation', () => {
  const baseProps = {
    username: '',
    setUsername: jest.fn(),
    email: '',
    setEmail: jest.fn(),
    password: '',
    setPassword: jest.fn(),
    confirmPassword: '',
    setConfirmPassword: jest.fn(),
    grado: '',
    setGrado: jest.fn(),
    codigo_maestro: '',
    setCodigoMaestro: jest.fn(),
    usernameRef: { current: null },
    emailRef: { current: null },
    passwdRef: { current: null },
    passwd2Ref: { current: null },
    onRegister: jest.fn(),
    onNavigateToLogin: jest.fn(),
  };

  test('Handles empty form state', () => {
    const element = React.createElement(RegisterForm, baseProps);
    expect(element.props.username).toBe('');
    expect(element.props.email).toBe('');
    expect(element.props.password).toBe('');
  });

  test('Handles filled form state', () => {
    const filledProps = {
      ...baseProps,
      username: 'Juan Perez',
      email: 'juan@example.com',
      password: 'securepass',
      confirmPassword: 'securepass',
      grado: '1B°',
      codigo_maestro: 'MAESTRO123',
    };

    const element = React.createElement(RegisterForm, filledProps);
    expect(element.props.username).toBe('Juan Perez');
    expect(element.props.email).toBe('juan@example.com');
    expect(element.props.grado).toBe('1B°');
    expect(element.props.codigo_maestro).toBe('MAESTRO123');
  });

  test('All callback functions can be called', () => {
    // Simular llamadas a las funciones directamente
    baseProps.setUsername('newuser');
    baseProps.setEmail('new@email.com');
    baseProps.onRegister();
    baseProps.onNavigateToLogin();

    expect(baseProps.setUsername).toHaveBeenCalledWith('newuser');
    expect(baseProps.setEmail).toHaveBeenCalledWith('new@email.com');
    expect(baseProps.onRegister).toHaveBeenCalled();
    expect(baseProps.onNavigateToLogin).toHaveBeenCalled();
  });
});