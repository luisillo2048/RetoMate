import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    backgroundColor: '#FFF8F0' 
  },
  titulo: { 
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 16, 
    color: '#4B3F2F', 
    textAlign: 'center' 
  },
  bloqueContainer: { 
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 12, 
    padding: 10,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3 
  },
  bloqueBoton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center' 
  },
  bloqueTitulo: { 
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#4B3F2F'
  },
  tareaContainer: {
    backgroundColor: '#F7E9D7',
    padding: 12, 
    borderRadius: 8,
    marginTop: 10 
  },
  tareaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tareaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  tareaPregunta: {
    fontSize: 16, 
    fontWeight: '600',
    color: '#4B3F2F',
    flex: 1
  },
  tareaPuntaje: { 
    fontSize: 14,
    color: '#4B3F2F'
  },
  tareaDificultad: {
    fontSize: 12,
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: 'bold'
  },
  progresoTexto: {
    marginTop: 4,
    fontSize: 14, 
    fontWeight: '600',
    color: '#4B3F2F',
    textAlign: 'center' 
  },
  tareaCompletada: { 
    opacity: 0.6 
  },
  imagen: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#8B5CF6',
  },
  difficultyBadge: {
    alignSelf: 'center',
    marginBottom: 10
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    textAlign: 'center'
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#D8B878',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  feedbackContainer: {
    alignItems: 'center',
    marginTop: 30,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  feedbackText: {
    fontSize: 20,
    marginTop: 10,
    color: '#555',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  correctAnswerText: {
    fontSize: 16,
    marginTop: 10,
    color: '#4B3F2F',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  nextButton: {
    backgroundColor: '#8B5CF6',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    minWidth: 120,
  },
  nextButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  finishedText: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20,
    color: '#4B3F2F',
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
    marginBottom: 30,
  },
  homeButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 25,
  },
  homeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B3F2F',
    marginTop: 10,
  },
  modalBody: {
    width: '100%',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  modalInfoLabel: {
    fontSize: 16,
    color: '#4B3F2F',
    fontWeight: '600',
  },
  modalInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: '#8B5CF6',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});