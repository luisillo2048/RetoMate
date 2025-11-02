import { StyleSheet, Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    flexGrow: 1,
  },
  
  loadingLogo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  subText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },

  // Sección de perfil
  profileSection: {
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  profileGradient: {
    padding: 20,
    alignItems: "center",
  },
  balloonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  balloon: {
    fontSize: 24,
    marginHorizontal: 5,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#FFF",
  },
  avatarGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#FFD700',
    opacity: 0.6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  userInfo: {
    width: '100%',
    marginTop: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  userText: {
    fontSize: 16,
    color: "#FFF",
    marginLeft: 10,
    fontWeight: '600',
  },
  noUserContainer: {
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },

  // Tarjeta de puntos
  pointsCard: {
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  pointsGradient: {
    padding: 20,
  },
  pointsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  pointsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginLeft: 10,
    textAlign: 'center',
  },
  pointsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pointItem: {
    alignItems: "center",
    flex: 1,
  },
  pointLabel: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: '600',
    marginBottom: 5,
  },
  pointValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
  },
  progressContainer: {
    marginTop: 10,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: '600',
  },
  progressBar: {
    marginBottom: 8,
  },
  progressMarks: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  markText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: '500',
  },

  // Botón de comenzar aventura
  startAdventureContainer: {
    margin: 16,
  },
  startButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonGradient: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
});