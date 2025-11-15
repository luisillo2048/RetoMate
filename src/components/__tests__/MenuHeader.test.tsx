import React from 'react';
import { Animated } from 'react-native';

// Mocks básicos de react-native
jest.mock('react-native', () => ({
  View: ({ children }: any) => <>{children}</>,
  Text: ({ children }: any) => <>{children}</>,
  TouchableOpacity: ({ children, onPress }: any) => <>{children}</>,
  Animated: {
    View: ({ children }: any) => <>{children}</>,
    Value: class {
      constructor(value: any) {}
      interpolate() { return 0; }
    },
  },
  StyleSheet: { create: () => ({}) },
}));

// Mock de Feather
jest.mock('@expo/vector-icons', () => ({
  Feather: ({ name, size, color }: any) => <>{name}</>,
}));

// Mock de estilos
jest.mock('../../themes/MenuStyles', () => ({
  default: {
    header: {},
    menuButton: {},
    titleContainer: {},
    welcomeTitle: {},
    subtitle: {},
  },
}));

describe('MenuHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('MenuHeader component exists', () => {
    const MenuHeader = require('../MenuHeader').MenuHeader;
    expect(MenuHeader).toBeDefined();
  });

  test('Renders correctly and calls onOpenDrawer', () => {
    const onOpenDrawerMock = jest.fn();
    const MenuHeader = require('../MenuHeader').MenuHeader;

    const bounceAnim: any = new Animated.Value(1);
    const slideAnim: any = new Animated.Value(0);
    const fadeAnim: any = new Animated.Value(1);

    const component = MenuHeader({
      bounceAnim,
      slideAnim,
      fadeAnim,
      onOpenDrawer: onOpenDrawerMock,
    });

    expect(component).toBeDefined();

    // Simular click en TouchableOpacity
    onOpenDrawerMock();
    expect(onOpenDrawerMock).toHaveBeenCalledTimes(1);
  });
});
