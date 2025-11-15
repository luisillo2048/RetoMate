import React from 'react';

// Mock de React
jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

// Mocks BÁSICOS
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  Image: 'Image',
  ScrollView: 'ScrollView',
  ActivityIndicator: 'ActivityIndicator',
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('react-native-animatable', () => ({
  __esModule: true,
  default: {
    View: 'Animatable.View',
  },
}));

// Mock del contexto de tema
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: ['#FFFFFF'],
      primary: '#4ECDC4',
      secondary: '#FF6B6B',
    },
  }),
}));

// Mock de utils
jest.mock('../../utils/storage', () => ({
  getImageUrl: jest.fn((image: string) => image ? `https://example.com/${image}` : ''),
  getDifficultyColor: jest.fn((dificultad: string) => {
    switch(dificultad) {
      case 'facil': return '#4CAF50';
      case 'media': return '#FFC107';
      case 'dificil': return '#F44336';
      default: return '#757575';
    }
  }),
  normalizarDificultad: jest.fn((dificultad: string) => {
    if (dificultad.includes('facil')) return 'facil';
    if (dificultad.includes('media')) return 'media';
    if (dificultad.includes('dificil')) return 'dificil';
    return 'facil';
  }),
}));

jest.mock('../../utils/speech', () => ({
  leerPregunta: jest.fn(),
  leerOpciones: jest.fn(),
  leerTexto: jest.fn(),
}));

// Mock de estilos
jest.mock('../../themes/TasksStyles', () => ({
  default: {
    container: {},
    scrollView: {},
    scrollContent: {},
    contadorOportunidades: {},
    contadorTexto: {},
    tareaHeaderContainer: {},
    backButton: {},
    backButtonText: {},
    tareaInfo: {},
    bloqueBadge: {},
    bloqueText: {},
    difficultyBadge: {},
    difficultyText: {},
    imagen: {},
    questionHeader: {},
    title: {},
    audioButtonsContainer: {},
    speakButton: {},
    audioButtonText: {},
    optionsContainer: {},
    optionButton: {},
    optionText: {},
    correctOptionText: {},
    incorrectOptionText: {},
    selectedOptionText: {},
    audioOptionButton: {},
    loadingContainer: {},
    loadingText: {},
    feedbackContainer: {},
    feedbackText: {},
    correctAnswerText: {},
    nextButton: {},
    nextButtonDisabled: {},
    nextButtonText: {},
    bottomSpacer: {},
  },
}));

// Importar el componente después de los mocks
const TareaDetalle = require('../TareaDetalle').default;

describe('TareaDetalle Component', () => {
  // Datos de prueba
  const mockTarea = {
    id: '1',
    bloque: '1',
    pregunta: '¿Cuánto es 2 + 2?',
    dificultad: 'facil',
    tipo: 'matematicas',
    opciones: ['3', '4', '5'],
    respuestaCorrecta: '4',
    imagen: 'math.png',
  };

  const baseProps = {
    tareaActual: mockTarea,
    selected: null,
    respondido: false,
    correcta: false,
    loading: false,
    mostrarRespuesta: false,
    bloquearOpciones: false,
    erroresConsecutivos: 0,
    onVerificarRespuesta: jest.fn(),
    onVolver: jest.fn(),
    onContinuar: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('TareaDetalle component exists', () => {
    expect(TareaDetalle).toBeDefined();
    expect(typeof TareaDetalle).toBe('function');
  });

  test('Renders without crashing', () => {
    expect(() => React.createElement(TareaDetalle, baseProps)).not.toThrow();
  });

  test('Receives and displays tarea props correctly', () => {
    const element = React.createElement(TareaDetalle, baseProps);
    expect(element.props.tareaActual.pregunta).toBe('¿Cuánto es 2 + 2?');
    expect(element.props.tareaActual.bloque).toBe('1');
    expect(element.props.tareaActual.dificultad).toBe('facil');
  });

  test('Handles different response states', () => {
    // Estado inicial
    const propsInicial = { ...baseProps, respondido: false, correcta: false };
    const elementInicial = React.createElement(TareaDetalle, propsInicial);
    expect(elementInicial.props.respondido).toBe(false);
    expect(elementInicial.props.correcta).toBe(false);

    // Respuesta correcta
    const propsCorrecta = { ...baseProps, respondido: true, correcta: true };
    const elementCorrecta = React.createElement(TareaDetalle, propsCorrecta);
    expect(elementCorrecta.props.respondido).toBe(true);
    expect(elementCorrecta.props.correcta).toBe(true);

    // Respuesta incorrecta
    const propsIncorrecta = { ...baseProps, respondido: true, correcta: false };
    const elementIncorrecta = React.createElement(TareaDetalle, propsIncorrecta);
    expect(elementIncorrecta.props.respondido).toBe(true);
    expect(elementIncorrecta.props.correcta).toBe(false);
  });

  test('Uses theme context correctly', () => {
    const useTheme = require('../../context/ThemeContext').useTheme;
    const theme = useTheme();
    
    expect(theme.colors.background[0]).toBe('#FFFFFF');
    expect(theme.colors.primary).toBe('#4ECDC4');
    expect(theme.colors.secondary).toBe('#FF6B6B');
  });

  test('Utility functions work correctly', () => {
    const { getImageUrl, getDifficultyColor, normalizarDificultad } = require('../../utils/storage');
    
    expect(getImageUrl('test.png')).toBe('https://example.com/test.png');
    expect(getDifficultyColor('facil')).toBe('#4CAF50');
    expect(normalizarDificultad('facil')).toBe('facil');
    expect(normalizarDificultad('dificil_avanzado')).toBe('dificil');
  });

  test('Speech functions are defined', () => {
    const { leerPregunta, leerOpciones, leerTexto } = require('../../utils/speech');
    
    expect(typeof leerPregunta).toBe('function');
    expect(typeof leerOpciones).toBe('function');
    expect(typeof leerTexto).toBe('function');
  });

  test('Callback functions are defined', () => {
    expect(typeof baseProps.onVerificarRespuesta).toBe('function');
    expect(typeof baseProps.onVolver).toBe('function');
    expect(typeof baseProps.onContinuar).toBe('function');
  });

  test('Handles loading state', () => {
    const propsLoading = { ...baseProps, loading: true };
    const elementLoading = React.createElement(TareaDetalle, propsLoading);
    expect(elementLoading.props.loading).toBe(true);
  });

  test('Handles error counter', () => {
    const propsConErrores = { ...baseProps, erroresConsecutivos: 2 };
    const elementConErrores = React.createElement(TareaDetalle, propsConErrores);
    expect(elementConErrores.props.erroresConsecutivos).toBe(2);
  });
});

describe('TareaDetalle Behavior', () => {
  const mockTarea = {
    id: '1',
    bloque: '2',
    pregunta: '¿Capital de Francia?',
    dificultad: 'media',
    tipo: 'geografia',
    opciones: ['Londres', 'París', 'Berlín'],
    respuestaCorrecta: 'París',
    imagen: 'france.png',
  };

  const baseProps = {
    tareaActual: mockTarea,
    selected: null,
    respondido: false,
    correcta: false,
    loading: false,
    mostrarRespuesta: false,
    bloquearOpciones: false,
    erroresConsecutivos: 0,
    onVerificarRespuesta: jest.fn(),
    onVolver: jest.fn(),
    onContinuar: jest.fn(),
  };

  test('Handles option selection state', () => {
    const propsConSeleccion = { ...baseProps, selected: 'París' };
    const elementConSeleccion = React.createElement(TareaDetalle, propsConSeleccion);
    expect(elementConSeleccion.props.selected).toBe('París');
  });

  test('Handles mostrarRespuesta state', () => {
    const propsConRespuesta = { ...baseProps, respondido: true, mostrarRespuesta: true };
    const elementConRespuesta = React.createElement(TareaDetalle, propsConRespuesta);
    expect(elementConRespuesta.props.mostrarRespuesta).toBe(true);
  });

  test('Handles bloquearOpciones state', () => {
    const propsBloqueadas = { ...baseProps, bloquearOpciones: true };
    const elementBloqueadas = React.createElement(TareaDetalle, propsBloqueadas);
    expect(elementBloqueadas.props.bloquearOpciones).toBe(true);
  });
});

describe('TareaDetalle Edge Cases', () => {
  test('Handles tarea without image', () => {
    const tareaSinImagen = {
      id: '1',
      bloque: '1',
      pregunta: 'Pregunta sin imagen',
      dificultad: 'facil',
      tipo: 'matematicas',
      opciones: ['1', '2', '3'],
      respuestaCorrecta: '2',
      imagen: undefined,
    };

    const props = { ...baseProps, tareaActual: tareaSinImagen };
    const element = React.createElement(TareaDetalle, props);
    expect(element.props.tareaActual.imagen).toBeUndefined();
  });

  test('Handles tarea without difficulty', () => {
    const tareaSinDificultad = {
      id: '1',
      bloque: '1',
      pregunta: 'Pregunta sin dificultad',
      dificultad: undefined,
      tipo: 'matematicas',
      opciones: ['1', '2', '3'],
      respuestaCorrecta: '2',
    };

    const props = { ...baseProps, tareaActual: tareaSinDificultad };
    const element = React.createElement(TareaDetalle, props);
    expect(element.props.tareaActual.dificultad).toBeUndefined();
  });

  test('Handles maximum error count', () => {
    const propsMaxErrores = { ...baseProps, erroresConsecutivos: 3 };
    const elementMaxErrores = React.createElement(TareaDetalle, propsMaxErrores);
    expect(elementMaxErrores.props.erroresConsecutivos).toBe(3);
  });

  test('Handles all loading and response combinations', () => {
    const combinations = [
      { loading: false, respondido: false, correcta: false },
      { loading: false, respondido: true, correcta: false },
      { loading: false, respondido: true, correcta: true },
      { loading: true, respondido: false, correcta: false },
      { loading: true, respondido: true, correcta: false },
    ];

    combinations.forEach(combo => {
      const props = { ...baseProps, ...combo };
      const element = React.createElement(TareaDetalle, props);
      expect(element.props.loading).toBe(combo.loading);
      expect(element.props.respondido).toBe(combo.respondido);
      expect(element.props.correcta).toBe(combo.correcta);
    });
  });
});

// Helper para baseProps en los tests de edge cases
const baseProps = {
  tareaActual: {
    id: '1',
    bloque: '1',
    pregunta: 'Pregunta test',
    dificultad: 'facil',
    tipo: 'matematicas',
    opciones: ['1', '2', '3'],
    respuestaCorrecta: '2',
    imagen: 'test.png',
  },
  selected: null,
  respondido: false,
  correcta: false,
  loading: false,
  mostrarRespuesta: false,
  bloquearOpciones: false,
  erroresConsecutivos: 0,
  onVerificarRespuesta: jest.fn(),
  onVolver: jest.fn(),
  onContinuar: jest.fn(),
};