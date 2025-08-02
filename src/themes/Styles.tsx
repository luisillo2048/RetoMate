import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Un color cálido para niños
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mainContent: {
    alignItems: 'center',
    padding: 20,
    zIndex: 1,
  },
  cornerImageContainer: {
    position: 'absolute',
    zIndex: 2,
  },
  cornerImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  mainImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: '#4E7AC7',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 25,
  },
  button: {
    backgroundColor: '#FF9F1C',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});