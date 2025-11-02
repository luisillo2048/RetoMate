// themes/MenuStyles.js
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

const MenuStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
  },
  overlayTouchable: {
    flex: 1,
  },
  drawerContainer: {
    width: 300,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  drawerGradient: {
    flex: 1,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  drawerTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "System",
  },
  closeButton: {
    padding: 5,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  drawerIconContainer: {
    width: 40,
    alignItems: "center",
  },
  drawerTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  drawerText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  drawerSubtext: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  drawerSeparator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 10,
  },
  drawerFooter: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  footerText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  menuButton: {
    marginRight: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 12,
  },
  titleContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
    fontFamily: "System",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "System",
  },
  contentContainer: {
    padding: 20,
    paddingTop: 0,
  },
  welcomeCard: {
    marginBottom: 25,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  welcomeCardGradient: {
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: '100%',
  },
  welcomeCardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: 'center',
    fontFamily: "System",
  },
  welcomeCardText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: "System",
  },
  welcomeEmojis: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  emojiLarge: {
    fontSize: 30,
  },
  descriptionCard: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  descriptionTouchable: {
    borderRadius: 20,
  },
  descriptionGradient: {
    borderRadius: 20,
    padding: 20,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  descriptionIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    flex: 1,
    fontFamily: "System",
  },
  descriptionText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 20,
    fontFamily: "System",
  },
  chatbotSection: {
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  chatbotGradient: {
    borderRadius: 20,
    padding: 20,
  },
  chatbotContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatbotTextContainer: {
    flex: 1,
    marginRight: 15,
  },
  chatbotTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
    fontFamily: "System",
  },
  chatbotDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 20,
    fontFamily: "System",
  },
  chatbotIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatbotEmoji: {
    fontSize: 40,
  },
  navbarSpacer: {
    height: 120,
    width: '100%',
  },
  chatBotButton: {
    position: "absolute",
    bottom: 130, 
    right: 20,
    alignItems: "center",
    zIndex: 1000,
  },
  chatButton: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  chatButtonGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
  },
  chatBotImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  notificationDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFD700",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  chatBubble: {
    position: "absolute",
    top: -45,
    right: 80,
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  chatBubbleText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "System",
  },
});

export default MenuStyles;