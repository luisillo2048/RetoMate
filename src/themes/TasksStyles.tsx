// themes/TasksStyles.js
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;

const TasksStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 40, 
  },
  mainScrollContent: {
    flexGrow: 1,
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 40,
  },
  bottomSpacer: {
    height: 100, 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: isSmallScreen ? 24 : 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    padding: isSmallScreen ? 16 : 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressLabel: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressPercentage: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 8,
  },
  bloqueContainer: {
    marginBottom: 16,
  },
  bloqueBoton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: isSmallScreen ? 14 : 16,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    borderRadius: 12,
  },
  bloqueTitulo: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  progresoTexto: {
    fontSize: isSmallScreen ? 12 : 14,
    marginTop: 8,
  },
  iniciarBloqueButton: {
    paddingVertical: isSmallScreen ? 10 : 12,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  iniciarBloqueButtonText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
    color: '#FFF',
  },
  tareaContainer: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tareaCompletada: {
    opacity: 0.9,
  },
  tareaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 13,
  },
  tareaPregunta: {
    flex: 1,
    fontSize: isSmallScreen ? 14 : 16,
    marginRight: 8,
  },
  tareaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  puntajeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tareaPuntaje: {
    fontSize: isSmallScreen ? 12 : 14,
    marginLeft: 4,
  },
  tareaDificultad: {
    paddingHorizontal: isSmallScreen ? 8 : 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dificultadText: {
    fontSize: isSmallScreen ? 10 : 12,
    color: '#FFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  contadorOportunidades: {
    padding: isSmallScreen ? 10 : 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  contadorTexto: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  tareaHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    fontSize: isSmallScreen ? 14 : 16,
    marginLeft: 4,
  },
  tareaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bloqueBadge: {
    paddingHorizontal: isSmallScreen ? 10 : 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  bloqueText: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: isSmallScreen ? 10 : 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: '600',
    color: '#FFF',
    textTransform: 'capitalize',
  },
  mensajeEspecialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isSmallScreen ? 12 : 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  mensajeEspecialText: {
    fontSize: isSmallScreen ? 14 : 16,
    marginLeft: 8,
    flex: 1,
  },
  imagen: {
    width: '100%',
    height: isSmallScreen ? 150 : 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: '600',
    marginRight: 12,
  },
  audioButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speakButton: {
    padding: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  audioButtonText: {
    fontSize: 10,
    marginTop: 4,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isSmallScreen ? 14 : 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    flex: 1,
    fontSize: isSmallScreen ? 14 : 16,
  },
  selectedOptionText: {
    color: '#FFF',
    fontWeight: '600',
  },
  correctOptionText: {
    color: '#FFF',
    fontWeight: '600',
  },
  incorrectOptionText: {
    color: '#FFF',
    fontWeight: '600',
  },
  audioOptionButton: {
    padding: 4,
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: isSmallScreen ? 14 : 16,
    marginTop: 8,
  },
  feedbackContainer: {
    alignItems: 'center',
    padding: isSmallScreen ? 20 : 24,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  feedbackText: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: 'bold',
    marginVertical: 12,
    textAlign: 'center',
  },
  correctAnswerText: {
    fontSize: isSmallScreen ? 14 : 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  nextButton: {
    paddingVertical: isSmallScreen ? 12 : 14,
    paddingHorizontal: isSmallScreen ? 24 : 32,
    borderRadius: 10,
    minWidth: isSmallScreen ? 140 : 160,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
    color: '#FFF',
  },
  finishedText: {
    fontSize: isSmallScreen ? 22 : 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  subText: {
    fontSize: isSmallScreen ? 16 : 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  homeButton: {
    paddingVertical: isSmallScreen ? 14 : 16,
    paddingHorizontal: isSmallScreen ? 24 : 32,
    borderRadius: 10,
    minWidth: isSmallScreen ? 160 : 180,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
    color: '#FFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 16 : 20,
  },
  modalContainer: {
    borderRadius: 16,
    padding: isSmallScreen ? 20 : 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
  },
  modalBody: {
    marginBottom: 24,
  },
  modalText: {
    fontSize: isSmallScreen ? 16 : 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  modalInfoLabel: {
    fontSize: isSmallScreen ? 14 : 16,
  },
  modalInfoValue: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitsContainer: {
    marginTop: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
  },
  benefitText: {
    fontSize: isSmallScreen ? 14 : 16,
    marginLeft: 12,
    flex: 1,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallScreen ? 12 : 14,
    borderRadius: 10,
  },
  modalButtonText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
  },
  tareaEstado: {
    marginTop: 8,
  },
  estadoText: {
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'italic',
  },

  confettiContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  position: 'absolute',
  top: -30,
  left: 0,
  right: 0,
},

confetti: {
  fontSize: 24,
  marginHorizontal: 5,
},

logroContent: {
  alignItems: 'center',
  marginBottom: 20,
},
logroIcon: {
  marginBottom: 10,
},

logroName: {
  fontSize: 20,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 8,
},
logroDescription: {
  fontSize: 16,
  textAlign: 'center',
  lineHeight: 22,
},
progressBarContainer: {
  marginTop: 20,
},
progressBar: {
  height: 8,
  borderRadius: 4,
  marginBottom: 8,
  overflow: 'hidden',
},
progressFill: {
  height: '100%',
  width: '100%',
  borderRadius: 4,
},
progressText: {
  fontSize: 14,
  textAlign: 'center',
  fontWeight: '500',
},
celebrateButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 6,
  gap: 8,
},
celebrateButtonText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#FFF',
}, 
});

export default TasksStyles;