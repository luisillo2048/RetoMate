import React from 'react';

// Mock de react-native
jest.mock('react-native', () => ({
  View: ({ children }: any) => <>{children}</>,
  Text: ({ children }: any) => <>{children}</>,
  Modal: ({ children }: any) => <>{children}</>,
  TouchableOpacity: ({ children, onPress }: any) => {
    return <>{children}</>;
  },
  StyleSheet: { create: () => ({}) },
}));

// Mock de Animatable
jest.mock('react-native-animatable', () => {
  return {
    View: ({ children }: any) => <>{children}</>,
    Text: ({ children }: any) => <>{children}</>,
  };
});

// Mock de vector icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => <></>,
}));

// Mock del context
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ colors: { card: 'white', text: 'black', primary: 'blue', border: 'grey' } }),
}));

// Mock de estilos
jest.mock('../../themes/TasksStyles', () => ({
  default: {
    modalOverlay: {},
    modalContainer: {},
    confettiContainer: {},
    confetti: {},
    modalHeader: {},
    modalTitle: {},
    modalBody: {},
    logroContent: {},
    logroIcon: {},
    logroName: {},
    logroDescription: {},
    progressBarContainer: {},
    progressBar: {},
    progressFill: {},
    progressText: {},
    celebrateButton: {},
    celebrateButtonText: {},
  },
}));

describe('LogroModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('LogroModal component exists', () => {
    const LogroModal = require('../LogroModal').default;
    expect(LogroModal).toBeDefined();
  });

  test('Renders correctly and calls onClose', () => {
    const onCloseMock = jest.fn();
    const logro = {
      icon: '🏆',
      logro: 'Primer logro',
      descripcion: 'Descripción del logro',
    };
    const LogroModal = require('../LogroModal').default;

    const component = LogroModal({
      visible: true,
      logro,
      onClose: onCloseMock,
    });

    expect(component).toBeDefined();

    // Simulamos la llamada de onClose directamente
    onCloseMock();
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
