import React from 'react';
import { Animated } from 'react-native';

// Mock básico de React Native
jest.mock('react-native', () => ({
  View: ({ children }: any) => <>{children}</>,
  Text: ({ children }: any) => <>{children}</>,
  Image: ({ source }: any) => <>{source?.testUri || 'image'}</>,
  Animated: {
    View: ({ children }: any) => <>{children}</>,
    Value: class {
      constructor(value: any) {}
      interpolate() { return 0; }
    },
  },
  StyleSheet: { create: () => ({}) },
}));

// Mock de LinearGradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => <>{children}</>,
}));

// Mock de vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name }: any) => <>{name}</>,
  FontAwesome5: ({ name }: any) => <>{name}</>,
}));

//Mock de ThemeContext (useTheme)
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ colors: { primary: 'blue', secondary: 'red', text: 'black' } }),
}));

// Mock de AuthContext y useContext
jest.mock('react', () => {
  const actualReact = jest.requireActual('react');
  return {
    ...actualReact,
    useContext: (context: any) => {
      if (context && context._contextName === 'AuthContext') {
        return { user: { username: 'testuser', email: 'test@test.com', grado: '1A°' } };
      }
      return actualReact.useContext(context);
    },
  };
});

// Mock de AuthContext
jest.mock('../../context/AuthContext', () => {
  const fakeAuthContext = { _contextName: 'AuthContext' };
  return { AuthContext: fakeAuthContext };
});

// Mock de estilos
jest.mock('../../themes/ProfileStyles', () => ({
  default: {
    container: {},
    profileSection: {},
    profileGradient: {},
    balloonsContainer: {},
    balloon: {},
    avatarContainer: {},
    avatar: {},
    avatarGlow: {},
    title: {},
    userInfo: {},
    infoItem: {},
    userText: {},
    noUserContainer: {},
    errorText: {},
    subText: {},
  },
}));

describe('ProfileHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('ProfileHeader component exists', () => {
    const ProfileHeader = require('../ProfileHeader').ProfileHeader;
    expect(ProfileHeader).toBeDefined();
  });

  test('Renders correctly with user info', () => {
    const ProfileHeader = require('../ProfileHeader').ProfileHeader;

    const bounceAnim: any = new Animated.Value(1);
    const slideAnim: any = new Animated.Value(0);
    const fadeAnim: any = new Animated.Value(1);
    const logoSpinInterpolate: any = { __getValue: () => '0deg' };
    const balloonTranslateY: any = { __getValue: () => 0 };

    const component = ProfileHeader({
      bounceAnim,
      slideAnim,
      fadeAnim,
      logoSpinInterpolate,
      balloonTranslateY,
    });

    expect(component).toBeDefined();
  });
});
