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

  settingsMenuButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  settingsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
  },

  settingsMenuContainer: {
    width: 300,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },

  settingsMenuContent: {
    padding: 20,
  },

  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },

  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },

  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  settingsItemText: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 12,
    flex: 1,
  },

  settingsIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },

  settingsIndicatorText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  volumeContainer: {
    marginTop: 10,
    paddingVertical: 15,
  },

  volumeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },

  volumeLevels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  volumeButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 60,
  },

  volumeButtonSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ scale: 1.1 }],
  },

  volumeButtonText: {
    fontSize: 20,
    marginBottom: 5,
  },

  volumeLabel: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },

  settingsFooter: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },

  settingsFooterText: {
    color: '#FFF',
    fontSize: 14,
    fontStyle: 'italic',
  },

  // Estilos para el modal de privacidad
  privacyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  privacyModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
    width: '100%'
  },

  privacyModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },

  privacyModalText: {
    fontSize: 16,
    lineHeight: 22
  },

  privacyModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },

  privacyRejectButton: {
    backgroundColor: 'gray',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center'
  },

  privacyAcceptButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center'
  },

  privacyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }, 

sectionIcon: {
  marginRight: 12,
  marginTop: 2,
},
infoTextContainer: {
  flex: 1,
},

privacyHeader: {
  alignItems: 'center',
  marginBottom: 20,
},

privacySubtitle: {
  fontSize: 16,
  textAlign: 'center',
  opacity: 0.8,
},
privacyScroll: {
  flex: 1,
},
privacyContent: {
  paddingVertical: 10,
},
infoSection: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginBottom: 20,
  padding: 16,
  borderRadius: 12,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
},
highlight: {
  fontWeight: 'bold',
  color: '#4ECDC4',
},
pointsContainer: {
  marginBottom: 20,
},
sectionTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 15,
  textAlign: 'center',
},
pointItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
  padding: 12,
  borderRadius: 10,
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
},
pointText: {
  flex: 1,
  fontSize: 14,
  marginLeft: 12,
  lineHeight: 20,
},
bold: {
  fontWeight: 'bold',
},
finalMessage: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 16,
  borderRadius: 12,
  backgroundColor: 'rgba(255, 215, 0, 0.1)',
  borderLeftWidth: 4,
  borderLeftColor: '#FFD700',
},
finalText: {
  flex: 1,
  fontSize: 14,
  fontWeight: '500',
  marginLeft: 12,
  lineHeight: 20,
},

});