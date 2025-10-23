import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', 
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
  pauseButton: {
    // Removed absolute positioning so buttons laid out by topControlsRow
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    minHeight: 44,
    // allow buttons to size horizontally; add a small left margin to separate
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Para Android
  },
  pauseButtonSelected: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  pauseButtonText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  topControlsRow: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 3,
  },
});