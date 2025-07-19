import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: { 
    flex: 1, 
    padding: 16,
     backgroundColor: '#FFF8F0' 
    },
  titulo: 
  { fontSize: 24, 
    fontWeight: 'bold',
     marginBottom: 16, 
     color: '#4B3F2F', 
     textAlign: 'center' 
    },
  bloqueContainer: 
  { marginBottom: 16,
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
  tareaPregunta: {
     fontSize: 16, 
     fontWeight: '600',
      color: '#4B3F2F' 
    },
  tareaPuntaje: { 
    fontSize: 14,
     color: '#4B3F2F',
      marginTop: 4 
    },
  progresoTexto: {
     marginTop: 4,
      fontSize: 14, 
      fontWeight: '600',
       color: '#4B3F2F',
        textAlign: 'center' 
      },
  tareaCompletada: { 
    opacity: 0.4 },

    container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8E1',
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
  },
  feedbackText: {
    fontSize: 20,
    marginTop: 10,
    color: '#555',
    textAlign: 'center',
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
  loadingText: {
    fontSize: 18,
    marginTop: 15,
    color: '#8B5CF6',
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

});
