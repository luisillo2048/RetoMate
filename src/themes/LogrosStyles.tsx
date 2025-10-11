import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallPhone = width < 375;
const isSmallScreen = width < 375;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
     flexGrow: 1,
        paddingHorizontal: isSmallScreen ? 12 : 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: 40, 
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#F8F9FA',
  },
  darkContainer: {
    backgroundColor: '#1E3A5F',
  },

  // Textos
  lightText: {
    color: '#2C3E50',
    fontFamily: 'System',
    fontWeight: '600',
  },
  darkText: {
    color: '#E3F2FD',
    fontFamily: 'System',
    fontWeight: '600',
  },

  // Encabezado
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: isSmallPhone ? 15 : 20,
    paddingTop: isSmallPhone ? 5 : 10,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: isSmallPhone ? 8 : 12,
  },
  title: {
    fontSize: isSmallPhone ? 24 : 28,
    fontWeight: 'bold',
    marginBottom: isSmallPhone ? 6 : 8,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: isSmallPhone ? 14 : 16,
    opacity: 0.8,
    fontFamily: 'System',
    lineHeight: isSmallPhone ? 18 : 20,
  },
  trophyContainer: {
    padding: isSmallPhone ? 12 : 16,
    borderRadius: isSmallPhone ? 16 : 20,
    backgroundColor: 'rgba(79, 195, 247, 0.2)',
    borderWidth: 2,
    borderColor: '#4FC3F7',
  },

  // Estadísticas
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: isSmallPhone ? 15 : 20,
    borderRadius: isSmallPhone ? 16 : 20,
    marginBottom: isSmallPhone ? 15 : 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#E3F2FD',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    padding: isSmallPhone ? 6 : 8,
    borderRadius: isSmallPhone ? 10 : 12,
    marginBottom: isSmallPhone ? 6 : 8,
  },
  statNumber: {
    fontSize: isSmallPhone ? 18 : 20,
    fontWeight: 'bold',
    marginBottom: isSmallPhone ? 3 : 4,
  },
  statLabel: {
    fontSize: isSmallPhone ? 10 : 12,
    opacity: 0.8,
    textAlign: 'center',
  },

  // Lista de logros
  achievementsList: {
    marginBottom: isSmallPhone ? 10 : 15,
  },

  // Tarjetas de logros
  achievementCard: {
    padding: isSmallPhone ? 15 : 20,
    borderRadius: isSmallPhone ? 16 : 20,
    marginBottom: isSmallPhone ? 12 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 3,
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
  },
  darkCard: {
    backgroundColor: '#283593',
  },
  unlockedCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  lockedCard: {
    borderColor: '#B0BEC5',
    backgroundColor: '#FAFAFA',
  },

  // Encabezado de tarjeta
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: isSmallPhone ? 12 : 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  achievementIcon: {
    fontSize: isSmallPhone ? 28 : 32,
    marginRight: isSmallPhone ? 10 : 12,
    marginTop: 2,
  },
  unlockedIcon: {
    opacity: 1,
  },
  lockedIcon: {
    opacity: 0.6,
  },
  textContainer: {
    flex: 1,
    marginRight: isSmallPhone ? 10 : 12,
  },
  textContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: isSmallPhone ? 18 : 20,
    fontWeight: 'bold',
    fontFamily: 'System',
    marginBottom: isSmallPhone ? 3 : 4,
  },
  achievementDescription: {
    fontSize: isSmallPhone ? 12 : 14,
    opacity: 0.8,
    fontFamily: 'System',
    lineHeight: isSmallPhone ? 16 : 18,
  },
  iconContainer: {
    padding: isSmallPhone ? 6 : 8,
    borderRadius: isSmallPhone ? 10 : 12,
  },
  unlockedIconContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  lockedIconContainer: {
    backgroundColor: 'rgba(176, 190, 197, 0.1)',
  },

  unlockedProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: isSmallPhone ? 10 : 12,
    borderRadius: isSmallPhone ? 12 : 15,
    marginBottom: isSmallPhone ? 10 : 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  unlockedText: {
    fontSize: isSmallPhone ? 14 : 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: isSmallPhone ? 6 : 8,
    fontFamily: 'System',
  },

  // Progreso bloqueado
  progressContainer: {
    marginBottom: isSmallPhone ? 10 : 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isSmallPhone ? 6 : 8,
  },
  progressLabel: {
    fontSize: isSmallPhone ? 12 : 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  percentage: {
    fontSize: isSmallPhone ? 12 : 14,
    fontWeight: 'bold',
    fontFamily: 'System',
    color: '#4FC3F7',
  },
  progressBar: {
    height: isSmallPhone ? 10 : 12,
    borderRadius: isSmallPhone ? 5 : 6,
    overflow: 'hidden',
    borderWidth: 1,
  },
  lightProgressBar: {
    backgroundColor: '#E0E0E0',
    borderColor: '#BDBDBD',
  },
  darkProgressBar: {
    backgroundColor: '#37474F',
    borderColor: '#546E7A',
  },
  progressFill: {
    height: '100%',
    borderRadius: isSmallPhone ? 4 : 5,
    backgroundColor: '#4FC3F7',
  },

  // Puntos
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(79, 195, 247, 0.1)',
    padding: isSmallPhone ? 6 : 8,
    borderRadius: isSmallPhone ? 8 : 10,
    marginBottom: isSmallPhone ? 6 : 8,
  },
  pointsText: {
    fontSize: isSmallPhone ? 12 : 14,
    fontWeight: '600',
    marginLeft: isSmallPhone ? 4 : 6,
    fontFamily: 'System',
  },

  // Fecha de desbloqueo
  unlockDate: {
    fontSize: isSmallPhone ? 10 : 12,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'System',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: isSmallPhone ? 4 : 6,
    borderRadius: isSmallPhone ? 6 : 8,
  },

  // Estados vacíos
  emptyState: {
    alignItems: 'center',
    padding: isSmallPhone ? 25 : 40,
    borderRadius: isSmallPhone ? 16 : 20,
    borderWidth: 3,
    borderColor: '#4FC3F7',
    marginTop: isSmallPhone ? 15 : 20,
    marginBottom: isSmallPhone ? 20 : 30,
  },
  emptyIcon: {
    fontSize: isSmallPhone ? 40 : 50,
    marginBottom: isSmallPhone ? 12 : 16,
  },
  emptyTitle: {
    fontSize: isSmallPhone ? 18 : 22,
    fontWeight: 'bold',
    marginBottom: isSmallPhone ? 8 : 12,
    textAlign: 'center',
    fontFamily: 'System',
  },
  emptyDescription: {
    fontSize: isSmallPhone ? 14 : 16,
    textAlign: 'center',
    opacity: 0.8,
    fontFamily: 'System',
    lineHeight: isSmallPhone ? 18 : 22,
    marginBottom: isSmallPhone ? 8 : 12,
  },
  emptyHint: {
    fontSize: isSmallPhone ? 12 : 14,
    textAlign: 'center',
    opacity: 0.6,
    fontFamily: 'System',
    fontStyle: 'italic',
  },

  bottomSpacer: {
    height: isSmallPhone ? 30 : 50,
  },
});