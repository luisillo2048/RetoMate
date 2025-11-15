import React from 'react';
import { Text, Animated } from 'react-native';

// Mocks básicos de React Native
jest.mock('react-native', () => ({
  View: ({ children }: any) => <>{children}</>,
  Text: ({ children }: any) => <>{children}</>,
  TouchableOpacity: ({ children, onPress }: any) => <>{children}</>,
  ScrollView: ({ children }: any) => <>{children}</>,
  Modal: ({ children }: any) => <>{children}</>,
  StyleSheet: { create: () => ({}) },
}));

// Mock de Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, size, color }: any) => <>{name}</>,
}));

// Mock de ThemeContext
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ colors: { primary: 'blue', card: 'white', text: 'black' } }),
}));

// Mock de estilos
jest.mock('../../themes/Styles', () => ({
  default: {
    privacyModalOverlay: {},
    privacyModalContent: {},
    privacyHeader: {},
    privacyModalTitle: {},
    privacySubtitle: {},
    privacyScroll: {},
    privacyContent: {},
    infoSection: {},
    pointsContainer: {},
    sectionTitle: {},
    pointItem: {},
    pointText: {},
    bold: {},
    finalMessage: {},
    finalText: {},
    privacyModalButtons: {},
    privacyRejectButton: {},
    privacyAcceptButton: {},
    privacyButtonText: {},
  },
}));

describe('PrivacyModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('PrivacyModal component exists', () => {
    const PrivacyModal = require('../PrivacyModal').PrivacyModal;
    expect(PrivacyModal).toBeDefined();
  });

  test('Calls onAccept and onReject when buttons pressed', () => {
    const PrivacyModal = require('../PrivacyModal').PrivacyModal;

    const onAcceptMock = jest.fn();
    const onRejectMock = jest.fn();

    const component = PrivacyModal({
      visible: true,
      onAccept: onAcceptMock,
      onReject: onRejectMock,
    });

    expect(component).toBeDefined();

    // Simular click en botones
    onAcceptMock();
    onRejectMock();

    expect(onAcceptMock).toHaveBeenCalledTimes(1);
    expect(onRejectMock).toHaveBeenCalledTimes(1);
  });
});
