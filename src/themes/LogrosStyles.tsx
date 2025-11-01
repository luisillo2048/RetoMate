import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');
const isSmallPhone = width < 375;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContainer: {
  flexGrow: 1,
  justifyContent: 'center',
  paddingVertical: 20,
},

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: isSmallPhone ? 24 : 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: isSmallPhone ? 14 : 16,
    opacity: 0.8,
  },
  trophyContainer: {
    padding: 10,
  },

  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: isSmallPhone ? 40 : 50,
    height: isSmallPhone ? 40 : 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: isSmallPhone ? 16 : 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: isSmallPhone ? 12 : 14,
    fontWeight: '500',
  },

  // Achievement Cards
  achievementsList: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  achievementCard: {
    marginVertical: 8,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  textContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  achievementIcon: {
    fontSize: isSmallPhone ? 24 : 28,
    marginRight: 12,
    marginTop: 2,
  },
  textContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: isSmallPhone ? 16 : 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: isSmallPhone ? 13 : 14,
    lineHeight: 18,
  },
  iconContainer: {
    marginLeft: 10,
  },

  // Progress
  progressContainer: {
    marginVertical: 10,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: isSmallPhone ? 13 : 14,
    fontWeight: '500',
  },
  percentage: {
    fontSize: isSmallPhone ? 13 : 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 6,
  },

  // Unlocked State
  unlockedProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  unlockedText: {
    fontSize: isSmallPhone ? 14 : 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },

  // Points
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  pointsText: {
    fontSize: isSmallPhone ? 13 : 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  pointsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  pointsStatusText: {
    fontSize: isSmallPhone ? 12 : 13,
    marginLeft: 6,
    flex: 1,
  },

  // Unlock Date
  unlockDate: {
    fontSize: isSmallPhone ? 12 : 13,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Empty State
  emptyState: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: isSmallPhone ? 18 : 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: isSmallPhone ? 14 : 16,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  emptyHint: {
    fontSize: isSmallPhone ? 12 : 13,
    textAlign: 'center',
    opacity: 0.8,
  },

  // Info Card
  infoCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: isSmallPhone ? 16 : 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: isSmallPhone ? 13 : 14,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },

  // Bottom Spacer
  bottomSpacer: {
    height: 30,
  },

  // Theme Styles (se mantienen por compatibilidad)
  lightContainer: {
    backgroundColor: '#F5F5F5',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightCard: {
    backgroundColor: '#FFF',
  },
  darkCard: {
    backgroundColor: '#1E1E1E',
  },
  lightText: {
    color: '#333',
  },
  darkText: {
    color: '#FFF',
  },
  lightProgressBar: {
    backgroundColor: '#E0E0E0',
  },
  darkProgressBar: {
    backgroundColor: '#333',
  },
  unlockedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  lockedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#90A4AE',
  },
  unlockedIcon: {
    color: '#4CAF50',
  },
  lockedIcon: {
    color: '#90A4AE',
  },
  unlockedIconContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  lockedIconContainer: {
    backgroundColor: 'rgba(144, 164, 174, 0.1)',
  },
});