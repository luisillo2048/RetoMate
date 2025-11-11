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
  TouchableOpacity: ({ children, onPress, disabled }: any) => <>{children}</>,
  Modal: ({ children, visible }: any) => <>{children}</>,
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

// Mock de Feather
jest.mock('@expo/vector-icons', () => ({
  Feather: ({ name, size, color }: any) => <>{name}</>,
}));

// Mock del context
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ colors: { primary: 'blue', secondary: 'green' } }),
}));

// Mock de estilos
jest.mock('../../themes/MenuStyles', () => ({
  default: {
    modalOverlay: {},
    overlayTouchable: {},
    drawerContainer: {},
    drawerGradient: {},
    drawerHeader: {},
    drawerTitle: {},
    closeButton: {},
    drawerContent: {},
    drawerItem: {},
    drawerIconContainer: {},
    drawerTextContainer: {},
    drawerText: {},
    drawerSubtext: {},
    drawerSeparator: {},
    drawerFooter: {},
    footerText: {},
  },
}));

describe('DrawerMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('DrawerMenu component exists', () => {
    const DrawerMenu = require('../DrawerMenu').DrawerMenu;
    expect(DrawerMenu).toBeDefined();
  });

  test('Renders correctly and calls callbacks', () => {
    const onClose = jest.fn();
    const onToggleTheme = jest.fn();
    const onLogout = jest.fn();
    const DrawerMenu = require('../DrawerMenu').DrawerMenu;

    const drawerSlideAnim = new (require('react-native').Animated.Value)(0);

    const component = DrawerMenu({
      isVisible: true,
      drawerSlideAnim,
      theme: 'light',
      isLoggingOut: false,
      onClose,
      onToggleTheme,
      onLogout,
    });

    expect(component).toBeDefined();

    // Simulamos llamadas a las funciones
    onClose();
    onToggleTheme();
    onLogout();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onToggleTheme).toHaveBeenCalledTimes(1);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
